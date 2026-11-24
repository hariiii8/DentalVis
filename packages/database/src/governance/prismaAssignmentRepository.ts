// packages/database/src/governance/prismaAssignmentRepository.ts
// DentalVis — Server-Only Prisma-Backed Reviewer Assignment Repository (M6.1.5-A)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-A

import 'server-only';
import type { PrismaClient, Prisma } from '@prisma/client';
import type {
  AssignmentLifecycleStatus,
  AuthoritativeAssignmentRecord,
  IAssignmentRepository,
} from './interfaces';

/**
 * Concrete PostgreSQL/Prisma implementation of the authoritative IAssignmentRepository.
 * Enforces:
 * - Revision-specific reviewer assignment binding.
 * - Single active assignment per (revisionId, reviewerId) backed by PostgreSQL partial unique index.
 * - Valid state transitions.
 * - Strict fail-closed concurrency handling.
 */
export class PrismaAssignmentRepository implements IAssignmentRepository {
  private readonly prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient }) {
    if (!options.prisma) {
      throw new Error('PrismaAssignmentRepository requires an initialized PrismaClient instance.');
    }
    this.prisma = options.prisma;
  }

  /**
   * Health check to ensure persistent database connection is active.
   */
  public async isPersistenceHealthy(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1;`;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieves an assignment by its primary key UUID.
   */
  public async getAssignment(
    assignmentId: string,
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord | null> {
    const client = tx ?? this.prisma;

    if (!assignmentId || assignmentId.trim() === '') {
      return null;
    }

    const assignment = await client.reviewerAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return null;
    }

    return this.mapToAuthoritativeRecord(assignment);
  }

  /**
   * Retrieves an active accepted assignment for an exact revision and reviewer pair.
   * Asserts that the assignment is in 'ACCEPTED' status and not expired as of the provided date.
   */
  public async getActiveAcceptedAssignment(
    revisionId: string,
    reviewerId: string,
    asOf: Date = new Date(),
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord | null> {
    const client = tx ?? this.prisma;

    if (!revisionId || !reviewerId) {
      return null;
    }

    const assignment = await client.reviewerAssignment.findFirst({
      where: {
        revisionId,
        reviewerId,
        status: 'ACCEPTED',
        expiresAt: { gt: asOf },
      },
    });

    if (!assignment) {
      return null;
    }

    return this.mapToAuthoritativeRecord(assignment);
  }

  /**
   * Creates a new reviewer assignment in 'ASSIGNED' status.
   * Backed by PostgreSQL partial unique index idx_unique_active_reviewer_assignment
   * which rejects multiple active assignments for the same revision/reviewer.
   */
  public async createAssignment(
    input: {
      revisionId: string;
      reviewerId: string;
      assignedByAdminId: string;
      expiresAt: Date;
    },
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord> {
    const client = tx ?? this.prisma;
    const now = new Date();

    const record = await client.reviewerAssignment.create({
      data: {
        revisionId: input.revisionId,
        reviewerId: input.reviewerId,
        assignedByAdminId: input.assignedByAdminId,
        status: 'ASSIGNED',
        assignedAt: now,
        expiresAt: input.expiresAt,
      },
    });

    return this.mapToAuthoritativeRecord(record);
  }

  /**
   * Transition: Reviewer accepts an assignment (ASSIGNED -> ACCEPTED).
   */
  public async acceptAssignment(
    assignmentId: string,
    reviewerId: string,
    asOf: Date = new Date(),
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord> {
    const client = tx ?? this.prisma;

    const assignment = await client.reviewerAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error(`PrismaAssignmentRepository: Assignment '${assignmentId}' not found.`);
    }

    if (assignment.reviewerId !== reviewerId) {
      throw new Error('SECURITY VIOLATION: Reviewer cannot accept assignment assigned to another reviewer.');
    }

    if (assignment.status !== 'ASSIGNED') {
      throw new Error(
        `INVALID_TRANSITION: Cannot accept assignment with status '${assignment.status}'. Expected 'ASSIGNED'.`
      );
    }

    if (assignment.expiresAt.getTime() <= asOf.getTime()) {
      throw new Error('ASSIGNMENT_EXPIRED: Cannot accept an expired reviewer assignment.');
    }

    const updated = await client.reviewerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: asOf,
      },
    });

    return this.mapToAuthoritativeRecord(updated);
  }

  /**
   * Transition: Reviewer declines an assignment (ASSIGNED -> DECLINED).
   */
  public async declineAssignment(
    assignmentId: string,
    reviewerId: string,
    reason: string,
    asOf: Date = new Date(),
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord> {
    const client = tx ?? this.prisma;

    const assignment = await client.reviewerAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error(`PrismaAssignmentRepository: Assignment '${assignmentId}' not found.`);
    }

    if (assignment.reviewerId !== reviewerId) {
      throw new Error('SECURITY VIOLATION: Reviewer cannot decline assignment assigned to another reviewer.');
    }

    if (assignment.status !== 'ASSIGNED') {
      throw new Error(
        `INVALID_TRANSITION: Cannot decline assignment with status '${assignment.status}'. Expected 'ASSIGNED'.`
      );
    }

    const updated = await client.reviewerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'DECLINED',
        declinedAt: asOf,
        declineReason: reason,
      },
    });

    return this.mapToAuthoritativeRecord(updated);
  }

  /**
   * Transition: Administrator revokes an assignment (ASSIGNED | ACCEPTED -> REVOKED).
   */
  public async revokeAssignment(
    assignmentId: string,
    _adminId: string,
    reason: string,
    asOf: Date = new Date(),
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord> {
    const client = tx ?? this.prisma;

    const assignment = await client.reviewerAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error(`PrismaAssignmentRepository: Assignment '${assignmentId}' not found.`);
    }

    if (assignment.status !== 'ASSIGNED' && assignment.status !== 'ACCEPTED') {
      throw new Error(
        `INVALID_TRANSITION: Cannot revoke assignment with status '${assignment.status}'. Only active assignments can be revoked.`
      );
    }

    const updated = await client.reviewerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'REVOKED',
        revokedAt: asOf,
        revocationReason: reason,
      },
    });

    return this.mapToAuthoritativeRecord(updated);
  }

  /**
   * Transition: Reviewer completes an assignment (ACCEPTED -> COMPLETED).
   * Called atomically inside ClinicalReviewService.submitReview().
   */
  public async markAssignmentCompleted(
    assignmentId: string,
    completedAt: Date = new Date(),
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this.prisma;

    const assignment = await client.reviewerAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error(`PrismaAssignmentRepository: Assignment '${assignmentId}' not found.`);
    }

    if (assignment.status !== 'ACCEPTED') {
      throw new Error(
        `INVALID_TRANSITION: Cannot complete assignment with status '${assignment.status}'. Expected 'ACCEPTED'.`
      );
    }

    await client.reviewerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'COMPLETED',
        completedAt,
      },
    });
  }

  /**
   * Lists assignments by revision or reviewer.
   */
  public async listAssignments(
    filter: { revisionId?: string; reviewerId?: string },
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord[]> {
    const client = tx ?? this.prisma;

    const assignments = await client.reviewerAssignment.findMany({
      where: {
        revisionId: filter.revisionId,
        reviewerId: filter.reviewerId,
      },
      orderBy: { assignedAt: 'desc' },
    });

    return assignments.map((a) => this.mapToAuthoritativeRecord(a));
  }

  /**
   * Maps raw Prisma entity to the domain AuthoritativeAssignmentRecord contract.
   */
  private mapToAuthoritativeRecord(record: any): AuthoritativeAssignmentRecord {
    return {
      id: record.id,
      revisionId: record.revisionId,
      reviewerId: record.reviewerId,
      assignedByAdminId: record.assignedByAdminId,
      status: record.status as AssignmentLifecycleStatus,
      assignedAt: record.assignedAt,
      acceptedAt: record.acceptedAt,
      completedAt: record.completedAt,
      revokedAt: record.revokedAt,
      revocationReason: record.revocationReason,
      withdrawnAt: record.withdrawnAt,
      withdrawalReason: record.withdrawalReason,
      expiresAt: record.expiresAt,
    };
  }
}

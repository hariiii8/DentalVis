// packages/database/src/governance/prismaCoiRepository.ts
// DentalVis — Server-Only Prisma-Backed COI Repository (M6.1.5-A)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-A

import 'server-only';
import type { PrismaClient, Prisma } from '@prisma/client';
import type {
  AuthoritativeCoiRecord,
  CoiDeclarationStatus,
  ICoiRepository,
} from './interfaces';

/**
 * Concrete PostgreSQL/Prisma implementation of the authoritative ICoiRepository.
 * Enforces:
 * - Scoped resolution: revision-specific -> procedure-specific -> user-wide.
 * - Supersession preservation.
 * - Strict fail-closed error handling.
 * - Prevention of self-clearance (assessedByAdminId !== userId).
 */
export class PrismaCoiRepository implements ICoiRepository {
  private readonly prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient }) {
    if (!options.prisma) {
      throw new Error('PrismaCoiRepository requires an initialized PrismaClient instance.');
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
   * Resolves the authoritative active COI declaration for a given reviewer and context.
   * Checks hierarchy:
   * 1. Exact Revision-specific declaration (targetRevisionId === context.revisionId)
   * 2. Procedure-specific declaration (targetProcedureId === context.procedureId && targetRevisionId IS NULL)
   * 3. User-wide / Annual declaration (targetProcedureId IS NULL && targetRevisionId IS NULL)
   *
   * Ignores SUPERSEDED declarations.
   */
  public async getActiveDeclaration(
    userId: string,
    context?: { procedureId?: string; revisionId?: string },
    asOf: Date = new Date(),
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeCoiRecord | null> {
    const client = tx ?? this.prisma;

    if (!userId || userId.trim() === '') {
      return null;
    }

    // 1. Revision-Specific Check
    if (context?.revisionId) {
      const revDeclaration = await client.conflictOfInterestDeclaration.findFirst({
        where: {
          userId,
          targetRevisionId: context.revisionId,
          status: { not: 'SUPERSEDED' },
        },
        orderBy: { declaredAt: 'desc' },
      });

      if (revDeclaration) {
        return this.mapToAuthoritativeRecord(revDeclaration, asOf);
      }
    }

    // 2. Procedure-Specific Check
    if (context?.procedureId) {
      const procDeclaration = await client.conflictOfInterestDeclaration.findFirst({
        where: {
          userId,
          targetProcedureId: context.procedureId,
          targetRevisionId: null,
          status: { not: 'SUPERSEDED' },
        },
        orderBy: { declaredAt: 'desc' },
      });

      if (procDeclaration) {
        return this.mapToAuthoritativeRecord(procDeclaration, asOf);
      }
    }

    // 3. User-Wide / Annual Disclosure Check
    const userWideDeclaration = await client.conflictOfInterestDeclaration.findFirst({
      where: {
        userId,
        targetProcedureId: null,
        targetRevisionId: null,
        status: { not: 'SUPERSEDED' },
      },
      orderBy: { declaredAt: 'desc' },
    });

    if (userWideDeclaration) {
      return this.mapToAuthoritativeRecord(userWideDeclaration, asOf);
    }

    return null;
  }

  /**
   * Creates a new COI declaration.
   */
  public async createDeclaration(
    input: {
      userId: string;
      targetProcedureId?: string | null;
      targetRevisionId?: string | null;
      hasFinancialInterest: boolean;
      hasInstitutionalAffiliation: boolean;
      hasAuthorRelationship: boolean;
      hasCommercialSponsorship: boolean;
      conflictDetails?: string | null;
      expiresAt: Date;
    },
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeCoiRecord> {
    const client = tx ?? this.prisma;
    const now = new Date();

    const hasConflict =
      input.hasFinancialInterest ||
      input.hasInstitutionalAffiliation ||
      input.hasAuthorRelationship ||
      input.hasCommercialSponsorship;

    const status: CoiDeclarationStatus = hasConflict ? 'CONFLICT_DECLARED' : 'SUBMITTED';

    const record = await client.conflictOfInterestDeclaration.create({
      data: {
        userId: input.userId,
        targetProcedureId: input.targetProcedureId ?? null,
        targetRevisionId: input.targetRevisionId ?? null,
        status,
        hasFinancialInterest: input.hasFinancialInterest,
        hasInstitutionalAffiliation: input.hasInstitutionalAffiliation,
        hasAuthorRelationship: input.hasAuthorRelationship,
        hasCommercialSponsorship: input.hasCommercialSponsorship,
        conflictDetails: input.conflictDetails ?? null,
        isRecused: hasConflict, // Conservative default
        declaredAt: now,
        expiresAt: input.expiresAt,
      },
    });

    return this.mapToAuthoritativeRecord(record, now);
  }

  /**
   * Assesses an existing COI declaration by an authorized administrator.
   * Strictly enforces prevention of self-clearance (assessorAdminId cannot be declarant).
   */
  public async assessDeclaration(
    input: {
      declarationId: string;
      assessorAdminId: string;
      outcome: 'VERIFIED_CLEAR' | 'RECUSED';
      recusalReason?: string;
      assessmentNotes?: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeCoiRecord> {
    const client = tx ?? this.prisma;
    const now = new Date();

    const declaration = await client.conflictOfInterestDeclaration.findUnique({
      where: { id: input.declarationId },
    });

    if (!declaration) {
      throw new Error(`PrismaCoiRepository: Declaration '${input.declarationId}' not found.`);
    }

    // Security Invariant: Declarant cannot assess or clear their own declaration
    if (declaration.userId === input.assessorAdminId) {
      throw new Error(
        'SECURITY VIOLATION: Reviewer cannot assess or clear their own conflict of interest declaration.'
      );
    }

    const updated = await client.conflictOfInterestDeclaration.update({
      where: { id: input.declarationId },
      data: {
        status: input.outcome,
        isRecused: input.outcome === 'RECUSED',
        recusalReason: input.recusalReason ?? declaration.recusalReason,
        assessedByAdminId: input.assessorAdminId,
        assessedAt: now,
        assessmentNotes: input.assessmentNotes ?? null,
      },
    });

    return this.mapToAuthoritativeRecord(updated, now);
  }

  /**
   * Supersedes an existing declaration with a newly submitted declaration.
   * Atomically links supersededById and marks previous as SUPERSEDED.
   */
  public async supersedeDeclaration(
    oldDeclarationId: string,
    newDeclarationData: {
      userId: string;
      targetProcedureId?: string | null;
      targetRevisionId?: string | null;
      hasFinancialInterest: boolean;
      hasInstitutionalAffiliation: boolean;
      hasAuthorRelationship: boolean;
      hasCommercialSponsorship: boolean;
      conflictDetails?: string | null;
      expiresAt: Date;
    },
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeCoiRecord> {
    const execute = async (client: Prisma.TransactionClient) => {
      const now = new Date();
      const old = await client.conflictOfInterestDeclaration.findUnique({
        where: { id: oldDeclarationId },
      });

      if (!old) {
        throw new Error(`PrismaCoiRepository: Old declaration '${oldDeclarationId}' not found.`);
      }

      if (old.userId !== newDeclarationData.userId) {
        throw new Error('PrismaCoiRepository: Declarant user ID mismatch during supersession.');
      }

      const hasConflict =
        newDeclarationData.hasFinancialInterest ||
        newDeclarationData.hasInstitutionalAffiliation ||
        newDeclarationData.hasAuthorRelationship ||
        newDeclarationData.hasCommercialSponsorship;

      // 1. Create new declaration
      const newRecord = await client.conflictOfInterestDeclaration.create({
        data: {
          userId: newDeclarationData.userId,
          targetProcedureId: newDeclarationData.targetProcedureId ?? null,
          targetRevisionId: newDeclarationData.targetRevisionId ?? null,
          status: hasConflict ? 'CONFLICT_DECLARED' : 'SUBMITTED',
          hasFinancialInterest: newDeclarationData.hasFinancialInterest,
          hasInstitutionalAffiliation: newDeclarationData.hasInstitutionalAffiliation,
          hasAuthorRelationship: newDeclarationData.hasAuthorRelationship,
          hasCommercialSponsorship: newDeclarationData.hasCommercialSponsorship,
          conflictDetails: newDeclarationData.conflictDetails ?? null,
          isRecused: hasConflict,
          declaredAt: now,
          expiresAt: newDeclarationData.expiresAt,
        },
      });

      // 2. Mark old declaration as superseded
      await client.conflictOfInterestDeclaration.update({
        where: { id: oldDeclarationId },
        data: {
          status: 'SUPERSEDED',
          supersededById: newRecord.id,
        },
      });

      return this.mapToAuthoritativeRecord(newRecord, now);
    };

    if (tx) {
      return execute(tx);
    }
    return this.prisma.$transaction(execute);
  }

  /**
   * Maps raw Prisma entity to the domain AuthoritativeCoiRecord contract.
   * Computes dynamic EXPIRED status if expired as of the target timestamp.
   */
  private mapToAuthoritativeRecord(
    record: any,
    asOf: Date
  ): AuthoritativeCoiRecord {
    let status = record.status as CoiDeclarationStatus;

    // Check expiration dynamically if not already superseded or recused
    if (
      status !== 'SUPERSEDED' &&
      status !== 'RECUSED' &&
      record.expiresAt.getTime() <= asOf.getTime()
    ) {
      status = 'EXPIRED';
    }

    return {
      id: record.id,
      userId: record.userId,
      targetProcedureId: record.targetProcedureId,
      targetRevisionId: record.targetRevisionId,
      status,
      hasFinancialInterest: record.hasFinancialInterest,
      hasInstitutionalAffiliation: record.hasInstitutionalAffiliation,
      hasAuthorRelationship: record.hasAuthorRelationship,
      hasCommercialSponsorship: record.hasCommercialSponsorship,
      conflictDetails: record.conflictDetails,
      isRecused: record.isRecused || status === 'RECUSED',
      recusalReason: record.recusalReason,
      declaredAt: record.declaredAt,
      expiresAt: record.expiresAt,
      supersededById: record.supersededById,
      assessedByAdminId: record.assessedByAdminId,
      assessedAt: record.assessedAt,
    };
  }
}

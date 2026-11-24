// packages/database/test/prismaAssignmentRepository.test.ts
// DentalVis — Unit Tests for PrismaAssignmentRepository (M6.1.5-A)
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { PrismaAssignmentRepository } from '../src/governance/prismaAssignmentRepository';
import type { PrismaClient } from '@prisma/client';

describe('PrismaAssignmentRepository (M6.1.5-A Unit Tests)', () => {
  let mockPrisma: any;
  let repository: PrismaAssignmentRepository;

  const mockDate = new Date('2026-11-24T12:00:00Z');

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
      reviewerAssignment: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    repository = new PrismaAssignmentRepository({
      prisma: mockPrisma as unknown as PrismaClient,
    });
  });

  it('TEST-ASG-01: Verifies persistence health check', async () => {
    const isHealthy = await repository.isPersistenceHealthy();
    expect(isHealthy).toBe(true);
    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });

  it('TEST-ASG-02: Creates assignment in ASSIGNED status', async () => {
    mockPrisma.reviewerAssignment.create.mockImplementation(async ({ data }) => ({
      id: 'asg-uuid-1',
      ...data,
      createdAt: mockDate,
      updatedAt: mockDate,
    }));

    const result = await repository.createAssignment({
      revisionId: 'rev-uuid-1',
      reviewerId: 'user-rev-1',
      assignedByAdminId: 'user-admin-1',
      expiresAt: new Date(mockDate.getTime() + 86400000 * 7),
    });

    expect(result.id).toBe('asg-uuid-1');
    expect(result.status).toBe('ASSIGNED');
    expect(result.revisionId).toBe('rev-uuid-1');
    expect(result.reviewerId).toBe('user-rev-1');
  });

  it('TEST-ASG-03: Successfully accepts assignment (ASSIGNED -> ACCEPTED)', async () => {
    mockPrisma.reviewerAssignment.findUnique.mockResolvedValueOnce({
      id: 'asg-uuid-1',
      reviewerId: 'user-rev-1',
      status: 'ASSIGNED',
      expiresAt: new Date(mockDate.getTime() + 86400000 * 5),
    });

    mockPrisma.reviewerAssignment.update.mockImplementation(async ({ data }) => ({
      id: 'asg-uuid-1',
      reviewerId: 'user-rev-1',
      status: data.status,
      acceptedAt: data.acceptedAt,
      expiresAt: new Date(mockDate.getTime() + 86400000 * 5),
    }));

    const result = await repository.acceptAssignment('asg-uuid-1', 'user-rev-1', mockDate);
    expect(result.status).toBe('ACCEPTED');
    expect(result.acceptedAt).toEqual(mockDate);
  });

  it('TEST-ASG-04: Rejects acceptance if assignment belongs to another reviewer', async () => {
    mockPrisma.reviewerAssignment.findUnique.mockResolvedValueOnce({
      id: 'asg-uuid-1',
      reviewerId: 'user-rev-99', // Different reviewer
      status: 'ASSIGNED',
      expiresAt: new Date(mockDate.getTime() + 86400000 * 5),
    });

    await expect(
      repository.acceptAssignment('asg-uuid-1', 'user-rev-1', mockDate)
    ).rejects.toThrow('SECURITY VIOLATION: Reviewer cannot accept assignment assigned to another reviewer.');
  });

  it('TEST-ASG-05: Rejects acceptance if assignment has expired', async () => {
    mockPrisma.reviewerAssignment.findUnique.mockResolvedValueOnce({
      id: 'asg-uuid-1',
      reviewerId: 'user-rev-1',
      status: 'ASSIGNED',
      expiresAt: new Date(mockDate.getTime() - 1000), // Expired
    });

    await expect(
      repository.acceptAssignment('asg-uuid-1', 'user-rev-1', mockDate)
    ).rejects.toThrow('ASSIGNMENT_EXPIRED: Cannot accept an expired reviewer assignment.');
  });

  it('TEST-ASG-06: Marks assignment completed (ACCEPTED -> COMPLETED)', async () => {
    mockPrisma.reviewerAssignment.findUnique.mockResolvedValueOnce({
      id: 'asg-uuid-1',
      status: 'ACCEPTED',
    });

    mockPrisma.reviewerAssignment.update.mockResolvedValueOnce({});

    await repository.markAssignmentCompleted('asg-uuid-1', mockDate);
    expect(mockPrisma.reviewerAssignment.update).toHaveBeenCalledWith({
      where: { id: 'asg-uuid-1' },
      data: {
        status: 'COMPLETED',
        completedAt: mockDate,
      },
    });
  });

  it('TEST-ASG-07: Rejects completion if status is not ACCEPTED', async () => {
    mockPrisma.reviewerAssignment.findUnique.mockResolvedValueOnce({
      id: 'asg-uuid-1',
      status: 'ASSIGNED', // Not accepted yet!
    });

    await expect(
      repository.markAssignmentCompleted('asg-uuid-1', mockDate)
    ).rejects.toThrow("INVALID_TRANSITION: Cannot complete assignment with status 'ASSIGNED'. Expected 'ACCEPTED'.");
  });
});

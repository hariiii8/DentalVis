/**
 * DentalVis 2.0 — Transactional Domain Invariant Checkers
 * Mirroring and supporting PostgreSQL 16 database triggers in application layer
 */

export function enforceNoAuthorSelfApproval(authorId: string, reviewerId: string): void {
  if (authorId === reviewerId) {
    throw new Error(
      `CLINICAL GOVERNANCE VIOLATION: Clinical author (${authorId}) cannot approve their own content revision.`
    );
  }
}

export function validatePrimaryDepartmentInvariant(params: {
  currentStatus: string;
  publishedRevisionId: string | null;
  primaryDepartmentCount: number;
}): void {
  if (params.currentStatus === 'PUBLISHED') {
    if (!params.publishedRevisionId) {
      throw new Error('PUBLICATION INVARIANT VIOLATION: Cannot publish Procedure without setting a publishedRevisionId.');
    }
    if (params.primaryDepartmentCount !== 1) {
      throw new Error(
        `TAXONOMY INVARIANT VIOLATION: Procedure must have exactly one primary department to be PUBLISHED. Current primary count: ${params.primaryDepartmentCount}.`
      );
    }
  }
}

export function validateDepartmentTransferIntegrity(params: {
  sourceProcedure: { id: string; isPublished: boolean; primaryDeptCountAfter: number };
  targetProcedure: { id: string; isPublished: boolean; primaryDeptCountAfter: number };
}): void {
  if (params.sourceProcedure.isPublished && params.sourceProcedure.primaryDeptCountAfter !== 1) {
    throw new Error(
      `TAXONOMY INVARIANT VIOLATION: Transfer leaves published source Procedure (${params.sourceProcedure.id}) with ${params.sourceProcedure.primaryDeptCountAfter} primary departments. Exactly one is required.`
    );
  }
  if (params.targetProcedure.isPublished && params.targetProcedure.primaryDeptCountAfter !== 1) {
    throw new Error(
      `TAXONOMY INVARIANT VIOLATION: Transfer leaves published target Procedure (${params.targetProcedure.id}) with ${params.targetProcedure.primaryDeptCountAfter} primary departments. Exactly one is required.`
    );
  }
}

export function validateSessionSuccession(params: {
  userId: string;
  sessionFamilyId: string;
  familyStatus: string;
  newSessionId: string;
  predecessor: { userId: string; sessionFamilyId: string } | null;
  existingPredecessorChain?: string[]; // Chain of ancestor IDs
}): void {
  if (params.familyStatus !== 'ACTIVE') {
    throw new Error(
      `SESSION SECURITY VIOLATION: Cannot create or update session in inactive/revoked family (${params.sessionFamilyId}).`
    );
  }

  if (params.predecessor) {
    if (params.predecessor.userId !== params.userId) {
      throw new Error(
        `SESSION SECURITY VIOLATION: Cross-user session succession attempted. Predecessor belongs to user ${params.predecessor.userId}, successor belongs to ${params.userId}.`
      );
    }
    if (params.predecessor.sessionFamilyId !== params.sessionFamilyId) {
      throw new Error(
        `SESSION SECURITY VIOLATION: Cross-family session succession attempted. Predecessor family ${params.predecessor.sessionFamilyId}, successor family ${params.sessionFamilyId}.`
      );
    }

    if (params.existingPredecessorChain && params.existingPredecessorChain.includes(params.newSessionId)) {
      throw new Error(
        `SESSION SECURITY VIOLATION: Cyclic succession detected. Session ${params.newSessionId} cannot be its own ancestor.`
      );
    }
  }
}

export function validateRevocationTargetMatch(params: {
  targetType: 'SESSION' | 'FAMILY' | 'USER';
  targetId: string;
  targetSessionId: string | null;
  targetFamilyId: string | null;
  targetUserId: string | null;
}): void {
  const isMatch =
    (params.targetType === 'SESSION' &&
      params.targetSessionId === params.targetId &&
      !params.targetFamilyId &&
      !params.targetUserId) ||
    (params.targetType === 'FAMILY' &&
      params.targetFamilyId === params.targetId &&
      !params.targetSessionId &&
      !params.targetUserId) ||
    (params.targetType === 'USER' &&
      params.targetUserId === params.targetId &&
      !params.targetSessionId &&
      !params.targetFamilyId);

  if (!isMatch) {
    throw new Error(
      `DATABASE INTEGRITY VIOLATION: Invalid target foreign key match for revocation targetType: ${params.targetType}`
    );
  }
}

/**
 * Simulates and verifies atomic conditional outbox completion:
 * Returns true if completed, or false/throws if lease is stale/reclaimed.
 */
export function executeAtomicOutboxCompletion(params: {
  job: {
    id: string;
    status: string;
    leaseOwner: string | null;
    fencingGeneration: bigint;
    leaseExpiresAt: Date | null;
  };
  workerId: string;
  workerExpectedGeneration: bigint;
  now?: Date;
}): boolean {
  const currentTime = params.now ?? new Date();

  // Atomically matches SQL:
  // WHERE id = p_job_id AND status = 'PROCESSING' AND leaseOwner = p_worker_id
  //   AND fencingGeneration = p_expected_fencing_generation AND leaseExpiresAt >= CURRENT_TIMESTAMP
  if (
    params.job.status === 'PROCESSING' &&
    params.job.leaseOwner === params.workerId &&
    params.job.fencingGeneration === params.workerExpectedGeneration &&
    params.job.leaseExpiresAt !== null &&
    params.job.leaseExpiresAt >= currentTime
  ) {
    params.job.status = 'COMPLETED';
    return true;
  }

  return false;
}

export function validatePublicationQuorum(
  approvals: Array<{ id: string; decision: 'APPROVED' | 'REJECTED'; isRevoked: boolean }>,
  requiredQuorum: number
): void {
  const validApprovals = approvals.filter(
    (a) => a.decision === 'APPROVED' && !a.isRevoked
  );

  if (validApprovals.length < requiredQuorum) {
    throw new Error(
      `CLINICAL GOVERNANCE VIOLATION: Publication quorum not met. Required unrevoked approvals: ${requiredQuorum}, active: ${validApprovals.length}.`
    );
  }
}

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

export function validateSessionSuccession(params: {
  userId: string;
  sessionFamilyId: string;
  familyStatus: string;
  predecessor: { userId: string; sessionFamilyId: string } | null;
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

export function validateOutboxFencingCompletion(params: {
  currentOwner: string;
  claimingOwner: string;
  currentFencingGen: bigint;
  claimingFencingGen: bigint;
  leaseExpiresAt: Date;
}): void {
  if (params.currentOwner !== params.claimingOwner) {
    throw new Error(
      `OUTBOX FENCING VIOLATION: Mismatched lease owner. Expected ${params.currentOwner}, got ${params.claimingOwner}.`
    );
  }

  if (params.currentFencingGen !== params.claimingFencingGen) {
    throw new Error(
      `OUTBOX FENCING VIOLATION: Stale fencing generation. Current generation: ${params.currentFencingGen}, submitted: ${params.claimingFencingGen}.`
    );
  }

  if (params.leaseExpiresAt.getTime() < Date.now()) {
    throw new Error(
      `OUTBOX FENCING VIOLATION: Cannot complete job on expired lease (expired at ${params.leaseExpiresAt.toISOString()}).`
    );
  }
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

import { describe, it, expect } from 'vitest';
import {
  enforceNoAuthorSelfApproval,
  validatePrimaryDepartmentInvariant,
  validateSessionSuccession,
  validateRevocationTargetMatch,
  validateOutboxFencingCompletion,
  validatePublicationQuorum,
} from '../src/domainInvariants';

describe('Phase 2.2 Database & Domain Invariant Test Suite', () => {

  // 1. Author Self-Approval Invariant
  describe('Author Self-Approval Guard', () => {
    it('rejects when author attempts to approve their own revision', () => {
      const authorId = '00000000-0000-4000-a000-000000000001';
      const reviewerId = authorId;
      expect(() => enforceNoAuthorSelfApproval(authorId, reviewerId)).toThrow(
        /Clinical author .* cannot approve their own content revision/
      );
    });

    it('permits approval when reviewer is a distinct certified doctor', () => {
      const authorId = '00000000-0000-4000-a000-000000000001';
      const reviewerId = '00000000-0000-4000-a000-000000000002';
      expect(() => enforceNoAuthorSelfApproval(authorId, reviewerId)).not.toThrow();
    });
  });

  // 2. Primary Department Bidirectional Invariant
  describe('Primary Department Invariant', () => {
    it('permits draft procedures with zero primary departments', () => {
      expect(() =>
        validatePrimaryDepartmentInvariant({
          currentStatus: 'DRAFT',
          publishedRevisionId: null,
          primaryDepartmentCount: 0,
        })
      ).not.toThrow();
    });

    it('rejects publishing a procedure with 0 primary departments', () => {
      expect(() =>
        validatePrimaryDepartmentInvariant({
          currentStatus: 'PUBLISHED',
          publishedRevisionId: 'rev-1',
          primaryDepartmentCount: 0,
        })
      ).toThrow(/must have exactly one primary department to be PUBLISHED/);
    });

    it('rejects publishing a procedure with multiple primary departments', () => {
      expect(() =>
        validatePrimaryDepartmentInvariant({
          currentStatus: 'PUBLISHED',
          publishedRevisionId: 'rev-1',
          primaryDepartmentCount: 2,
        })
      ).toThrow(/must have exactly one primary department to be PUBLISHED/);
    });

    it('permits publishing when exactly 1 primary department exists', () => {
      expect(() =>
        validatePrimaryDepartmentInvariant({
          currentStatus: 'PUBLISHED',
          publishedRevisionId: 'rev-1',
          primaryDepartmentCount: 1,
        })
      ).not.toThrow();
    });
  });

  // 3. Session Succession & Family Ownership Invariant
  describe('Session Succession & Family Guard', () => {
    const userId = 'user-1';
    const familyId = 'family-1';

    it('rejects session creation in revoked family', () => {
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'REVOKED',
          predecessor: null,
        })
      ).toThrow(/Cannot create or update session in inactive\/revoked family/);
    });

    it('rejects predecessor belonging to different user', () => {
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'ACTIVE',
          predecessor: {
            userId: 'user-attacker',
            sessionFamilyId: familyId,
          },
        })
      ).toThrow(/Cross-user session succession attempted/);
    });

    it('rejects predecessor belonging to different family', () => {
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'ACTIVE',
          predecessor: {
            userId,
            sessionFamilyId: 'different-family-id',
          },
        })
      ).toThrow(/Cross-family session succession attempted/);
    });

    it('permits valid successor within same user and family', () => {
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'ACTIVE',
          predecessor: {
            userId,
            sessionFamilyId: familyId,
          },
        })
      ).not.toThrow();
    });
  });

  // 4. Revocation Target Foreign Key Integrity
  describe('Revocation Target FK Integrity Guard', () => {
    it('validates SESSION target with matching targetSessionId', () => {
      const sessionId = 'session-123';
      expect(() =>
        validateRevocationTargetMatch({
          targetType: 'SESSION',
          targetId: sessionId,
          targetSessionId: sessionId,
          targetFamilyId: null,
          targetUserId: null,
        })
      ).not.toThrow();
    });

    it('rejects SESSION target when targetSessionId is missing or points elsewhere', () => {
      expect(() =>
        validateRevocationTargetMatch({
          targetType: 'SESSION',
          targetId: 'session-123',
          targetSessionId: null,
          targetFamilyId: null,
          targetUserId: null,
        })
      ).toThrow(/Invalid target foreign key match for revocation/);
    });
  });

  // 5. Outbox Lease Fencing Completion Guard
  describe('Outbox Lease Fencing Guard', () => {
    it('rejects completion with mismatched lease owner', () => {
      expect(() =>
        validateOutboxFencingCompletion({
          currentOwner: 'worker-1',
          claimingOwner: 'worker-2-impostor',
          currentFencingGen: 5n,
          claimingFencingGen: 5n,
          leaseExpiresAt: new Date(Date.now() + 60000),
        })
      ).toThrow(/Mismatched lease owner/);
    });

    it('rejects completion with stale fencing generation', () => {
      expect(() =>
        validateOutboxFencingCompletion({
          currentOwner: 'worker-1',
          claimingOwner: 'worker-1',
          currentFencingGen: 6n, // Reclaimed by worker-1 in next cycle
          claimingFencingGen: 5n, // Stale response from previous cycle
          leaseExpiresAt: new Date(Date.now() + 60000),
        })
      ).toThrow(/Stale fencing generation/);
    });

    it('rejects completion on expired lease', () => {
      expect(() =>
        validateOutboxFencingCompletion({
          currentOwner: 'worker-1',
          claimingOwner: 'worker-1',
          currentFencingGen: 5n,
          claimingFencingGen: 5n,
          leaseExpiresAt: new Date(Date.now() - 5000), // Expired 5 seconds ago
        })
      ).toThrow(/Cannot complete job on expired lease/);
    });

    it('permits completion with valid matching owner, generation, and active lease', () => {
      expect(() =>
        validateOutboxFencingCompletion({
          currentOwner: 'worker-1',
          claimingOwner: 'worker-1',
          currentFencingGen: 5n,
          claimingFencingGen: 5n,
          leaseExpiresAt: new Date(Date.now() + 30000),
        })
      ).not.toThrow();
    });
  });

  // 6. Publication Quorum & Revocation Verification
  describe('Clinical Publication Quorum Guard', () => {
    it('rejects publishing when approvals < required quorum', () => {
      const approvals = [
        { id: 'app-1', decision: 'APPROVED' as const, isRevoked: false },
      ];
      expect(() => validatePublicationQuorum(approvals, 2)).toThrow(
        /Publication quorum not met/
      );
    });

    it('rejects counting revoked approvals toward quorum', () => {
      const approvals = [
        { id: 'app-1', decision: 'APPROVED' as const, isRevoked: false },
        { id: 'app-2', decision: 'APPROVED' as const, isRevoked: true }, // Revoked!
      ];
      expect(() => validatePublicationQuorum(approvals, 2)).toThrow(
        /Publication quorum not met/
      );
    });

    it('rejects counting rejected decisions toward quorum', () => {
      const approvals = [
        { id: 'app-1', decision: 'APPROVED' as const, isRevoked: false },
        { id: 'app-2', decision: 'REJECTED' as const, isRevoked: false }, // Rejected!
      ];
      expect(() => validatePublicationQuorum(approvals, 2)).toThrow(
        /Publication quorum not met/
      );
    });

    it('permits publishing when valid unrevoked approved quorum is met', () => {
      const approvals = [
        { id: 'app-1', decision: 'APPROVED' as const, isRevoked: false },
        { id: 'app-2', decision: 'APPROVED' as const, isRevoked: false },
      ];
      expect(() => validatePublicationQuorum(approvals, 2)).not.toThrow();
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  enforceNoAuthorSelfApproval,
  validatePrimaryDepartmentInvariant,
  validateDepartmentTransferIntegrity,
  validateSessionSuccession,
  validateRevocationTargetMatch,
  executeAtomicOutboxCompletion,
  validatePublicationQuorum,
} from '../src/domainInvariants';

describe('Phase 2.2 Database & Domain Invariant Test Suite — Final Audit', () => {

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

  // 2. Primary Department Bidirectional & Transfer Invariants
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

    it('rejects moving department if it leaves published source procedure with 0 primary depts', () => {
      expect(() =>
        validateDepartmentTransferIntegrity({
          sourceProcedure: { id: 'proc-source', isPublished: true, primaryDeptCountAfter: 0 },
          targetProcedure: { id: 'proc-target', isPublished: false, primaryDeptCountAfter: 1 },
        })
      ).toThrow(/Transfer leaves published source Procedure .* with 0 primary departments/);
    });

    it('rejects moving department if it leaves published target procedure with 2 primary depts', () => {
      expect(() =>
        validateDepartmentTransferIntegrity({
          sourceProcedure: { id: 'proc-source', isPublished: false, primaryDeptCountAfter: 0 },
          targetProcedure: { id: 'proc-target', isPublished: true, primaryDeptCountAfter: 2 },
        })
      ).toThrow(/Transfer leaves published target Procedure .* with 2 primary departments/);
    });

    it('permits transfer between published procedures when both maintain exactly 1 primary dept', () => {
      expect(() =>
        validateDepartmentTransferIntegrity({
          sourceProcedure: { id: 'proc-source', isPublished: true, primaryDeptCountAfter: 1 },
          targetProcedure: { id: 'proc-target', isPublished: true, primaryDeptCountAfter: 1 },
        })
      ).not.toThrow();
    });
  });

  // 3. Session Succession & Multi-Session Cycle Prevention
  describe('Session Succession & Cyclic Guard', () => {
    const userId = 'user-1';
    const familyId = 'family-1';

    it('rejects session creation in revoked family', () => {
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'REVOKED',
          newSessionId: 'sess-new',
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
          newSessionId: 'sess-new',
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
          newSessionId: 'sess-new',
          predecessor: {
            userId,
            sessionFamilyId: 'different-family-id',
          },
        })
      ).toThrow(/Cross-family session succession attempted/);
    });

    it('rejects multi-session cycle: A -> B -> C -> A', () => {
      const chain = ['sess-c', 'sess-b', 'sess-a'];
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'ACTIVE',
          newSessionId: 'sess-a',
          predecessor: {
            userId,
            sessionFamilyId: familyId,
          },
          existingPredecessorChain: chain,
        })
      ).toThrow(/Cyclic succession detected. Session sess-a cannot be its own ancestor/);
    });

    it('permits valid linear succession without cycles', () => {
      const chain = ['sess-b', 'sess-a'];
      expect(() =>
        validateSessionSuccession({
          userId,
          sessionFamilyId: familyId,
          familyStatus: 'ACTIVE',
          newSessionId: 'sess-c',
          predecessor: {
            userId,
            sessionFamilyId: familyId,
          },
          existingPredecessorChain: chain,
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

  // 5. Outbox Lease Fencing & Reclamation Scenarios
  describe('Outbox Lease Fencing & Reclamation', () => {
    it('handles scenario: Worker A acquires generation 4, Worker B reclaims generation 5, Worker A subsequently attempts completion and fails', () => {
      const baseTime = new Date('2026-11-19T12:00:00Z');
      const leaseExpiresA = new Date('2026-11-19T12:00:30Z');

      // Shared Job in DB
      const jobRecord = {
        id: 'job-101',
        status: 'PROCESSING',
        leaseOwner: 'worker-a',
        fencingGeneration: 4n,
        leaseExpiresAt: leaseExpiresA,
      };

      // Worker A is currently working with generation 4
      const workerAExpectedGen = 4n;

      // 1. Time passes, Worker A stalls, and lease expires
      const reclamationTime = new Date('2026-11-19T12:00:31Z');

      // 2. Worker B reclaims lease via acquire_outbox_lease() -> generation increments to 5
      jobRecord.leaseOwner = 'worker-b';
      jobRecord.fencingGeneration = 5n;
      jobRecord.leaseExpiresAt = new Date('2026-11-19T12:01:01Z');

      // 3. Worker A wakes up and attempts completion with stale generation 4
      const workerASuccess = executeAtomicOutboxCompletion({
        job: jobRecord,
        workerId: 'worker-a',
        workerExpectedGeneration: workerAExpectedGen,
        now: reclamationTime,
      });

      // Worker A MUST fail
      expect(workerASuccess).toBe(false);
      expect(jobRecord.status).toBe('PROCESSING'); // Still owned by Worker B

      // 4. Worker B completes with active generation 5
      const workerBSuccess = executeAtomicOutboxCompletion({
        job: jobRecord,
        workerId: 'worker-b',
        workerExpectedGeneration: 5n,
        now: new Date('2026-11-19T12:00:45Z'),
      });

      // Worker B MUST succeed
      expect(workerBSuccess).toBe(true);
      expect(jobRecord.status).toBe('COMPLETED');
    });

    it('rejects completion after lease has expired even if generation matches', () => {
      const expiredJob = {
        id: 'job-102',
        status: 'PROCESSING',
        leaseOwner: 'worker-a',
        fencingGeneration: 4n,
        leaseExpiresAt: new Date('2026-11-19T12:00:00Z'),
      };

      const result = executeAtomicOutboxCompletion({
        job: expiredJob,
        workerId: 'worker-a',
        workerExpectedGeneration: 4n,
        now: new Date('2026-11-19T12:00:01Z'), // 1 second after expiration
      });

      expect(result).toBe(false);
      expect(expiredJob.status).toBe('PROCESSING');
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

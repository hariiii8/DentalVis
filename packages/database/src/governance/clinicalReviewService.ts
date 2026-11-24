// packages/database/src/governance/clinicalReviewService.ts
// DentalVis — Server-Only Clinical Review Service (Secure Review Recording & Quorum Separation)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.4

import 'server-only';
import { PrismaClient, Prisma } from '@prisma/client';
import { GovernanceAuthorizationService } from './authorizationService';
import { PolicyConfigurationAdapter } from './policyAdapter';
import { ReviewerEligibilityService } from './reviewerEligibilityService';
import { GovernanceAuditService } from './governanceAuditService';
import type {
  IAssignmentRepository,
  ICoiRepository,
  IClinicalReviewService,
  SubmitClinicalReviewInput,
  SubmitClinicalReviewResult,
  RevokeClinicalApprovalInput,
  RevokeClinicalApprovalResult,
} from './interfaces';

/**
 * Server-only clinical review service.
 * Manages clinical review submissions, reviewer assignments, author-reviewer separation,
 * unratified quorum fail-closed enforcement, approval revocations, and transaction boundaries.
 */
export class ClinicalReviewService implements IClinicalReviewService {
  private readonly prisma: PrismaClient;
  private readonly authzService: GovernanceAuthorizationService;
  private readonly policyAdapter: PolicyConfigurationAdapter;
  private readonly eligibilityService: ReviewerEligibilityService;
  private readonly auditService: GovernanceAuditService;
  private readonly assignmentRepository: IAssignmentRepository;

  constructor(options: {
    prisma: PrismaClient;
    assignmentRepository: IAssignmentRepository;
    coiRepository: ICoiRepository;
    policyAdapter?: PolicyConfigurationAdapter;
    authzService?: GovernanceAuthorizationService;
    auditService?: GovernanceAuditService;
    eligibilityService?: ReviewerEligibilityService;
  }) {
    if (!options.prisma) {
      throw new Error('ClinicalReviewService requires an initialized PrismaClient instance.');
    }
    if (!options.assignmentRepository) {
      throw new Error('ClinicalReviewService requires an authoritative IAssignmentRepository.');
    }
    if (!options.coiRepository) {
      throw new Error('ClinicalReviewService requires an authoritative ICoiRepository.');
    }

    this.prisma = options.prisma;
    this.assignmentRepository = options.assignmentRepository;
    this.policyAdapter = options.policyAdapter ?? new PolicyConfigurationAdapter();
    this.authzService =
      options.authzService ??
      new GovernanceAuthorizationService({
        prisma: this.prisma,
        policyAdapter: this.policyAdapter,
      });
    this.auditService = options.auditService ?? new GovernanceAuditService({ prisma: this.prisma });
    this.eligibilityService =
      options.eligibilityService ??
      new ReviewerEligibilityService({
        coiRepository: options.coiRepository,
        policyAdapter: this.policyAdapter,
      });
  }

  /**
   * Accepts and records an individual clinical reviewer decision.
   * Executes inside an atomic transaction with row locks, re-evaluating authorization,
   * author separation, reviewer assignment, and contextual eligibility.
   */
  public async submitReview(
    input: SubmitClinicalReviewInput
  ): Promise<SubmitClinicalReviewResult> {
    const submittedAt = new Date().toISOString();

    // ------------------------------------------------------------------
    // 1. Initial Authorization Verification via GovernanceAuthorizationService
    // ------------------------------------------------------------------
    let authzResult;
    try {
      authzResult = await this.authzService.authorize({
        sessionTokenHash: input.sessionTokenHash,
        requestedScope: 'crb:review:submit',
        targetRevisionId: input.revisionId,
      });
    } catch (err: any) {
      return {
        success: false,
        revisionId: input.revisionId,
        decision: input.decision,
        revisionStatus: 'UNKNOWN',
        quorumSatisfied: false,
        denialReason: 'AUTHORIZATION_DENIED',
        diagnosticMessage: `Authorization service check failed: ${err.message}`,
        submittedAt,
      };
    }

    if (authzResult.decision === 'REQUIRES_VERIFICATION') {
      return {
        success: false,
        revisionId: input.revisionId,
        decision: input.decision,
        revisionStatus: 'UNKNOWN',
        quorumSatisfied: false,
        denialReason: 'AUTHORIZATION_REQUIRES_VERIFICATION',
        diagnosticMessage: authzResult.diagnosticMessage ?? 'Authorization requires verification.',
        submittedAt,
      };
    }

    if (authzResult.decision !== 'ALLOW') {
      return {
        success: false,
        revisionId: input.revisionId,
        decision: input.decision,
        revisionStatus: 'UNKNOWN',
        quorumSatisfied: false,
        denialReason: 'AUTHORIZATION_DENIED',
        diagnosticMessage: authzResult.diagnosticMessage ?? 'Authorization explicitly denied.',
        submittedAt,
      };
    }

    // ------------------------------------------------------------------
    // 2. Assignment Persistence Health Check
    // ------------------------------------------------------------------
    let assignmentHealthy = false;
    try {
      assignmentHealthy = await this.assignmentRepository.isPersistenceHealthy();
    } catch {
      assignmentHealthy = false;
    }

    if (!assignmentHealthy) {
      return {
        success: false,
        revisionId: input.revisionId,
        decision: input.decision,
        revisionStatus: 'UNKNOWN',
        quorumSatisfied: false,
        denialReason: 'ASSIGNMENT_REPOSITORY_UNAVAILABLE',
        diagnosticMessage: 'Reviewer assignment persistence is unreachable or uninitialized.',
        submittedAt,
      };
    }

    // ------------------------------------------------------------------
    // 3. Transactional Review Mutation with Bounded Retry (Max 3 attempts)
    // ------------------------------------------------------------------
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        const result = await this.executeSubmitReviewTransaction(input);
        return result;
      } catch (err: any) {
        // Detect PostgreSQL retryable concurrency errors: 40001 (serialization_failure) or 40P01 (deadlock_detected)
        const isRetryable =
          err?.code === 'P2034' || // Prisma transaction conflict / serialization failure
          err?.message?.includes('40001') ||
          err?.message?.includes('40P01') ||
          err?.message?.includes('could not serialize access');

        if (isRetryable && attempt < maxRetries) {
          // Exponential backoff: 50ms, 100ms
          await new Promise((resolve) => setTimeout(resolve, attempt * 50));
          continue;
        }

        // Non-retryable error or retries exhausted
        return {
          success: false,
          revisionId: input.revisionId,
          decision: input.decision,
          revisionStatus: 'UNKNOWN',
          quorumSatisfied: false,
          denialReason: isRetryable ? 'TRANSACTION_CONCURRENCY_EXHAUSTED' : 'INTERNAL_REVIEW_ERROR',
          diagnosticMessage: `Transaction execution failed: ${err.message}`,
          submittedAt,
        };
      }
    }

    return {
      success: false,
      revisionId: input.revisionId,
      decision: input.decision,
      revisionStatus: 'UNKNOWN',
      quorumSatisfied: false,
      denialReason: 'TRANSACTION_CONCURRENCY_EXHAUSTED',
      diagnosticMessage: 'Transaction retries exhausted.',
      submittedAt,
    };
  }

  /**
   * Internal transactional execution of review submission.
   */
  private async executeSubmitReviewTransaction(
    input: SubmitClinicalReviewInput
  ): Promise<SubmitClinicalReviewResult> {
    const now = new Date();
    const submittedAt = now.toISOString();

    return await this.prisma.$transaction(
      async (tx) => {
        // Step A: Revalidate Revision inside transaction
        const revision = await tx.procedureRevision.findUnique({
          where: { id: input.revisionId },
          include: {
            translation: true,
            author: true,
          },
        });

        if (!revision) {
          return {
            success: false,
            revisionId: input.revisionId,
            decision: input.decision,
            revisionStatus: 'UNKNOWN',
            quorumSatisfied: false,
            denialReason: 'REVISION_NOT_FOUND',
            diagnosticMessage: 'Procedure revision not found.',
            submittedAt,
          };
        }

        // Author / Reviewer Separation Invariant
        if (revision.authorId === input.reviewerId) {
          return {
            success: false,
            revisionId: input.revisionId,
            decision: input.decision,
            revisionStatus: revision.translation.currentStatus,
            quorumSatisfied: false,
            denialReason: 'AUTHOR_SELF_APPROVAL_PROHIBITED',
            diagnosticMessage: 'Author cannot review their own procedure revision.',
            submittedAt,
          };
        }

        // Step B: Revalidate Reviewer Assignment
        const assignment = await this.assignmentRepository.getActiveAcceptedAssignment(
          input.revisionId,
          input.reviewerId,
          now,
          tx
        );

        if (!assignment) {
          // Check if assignment exists under another state for precise diagnostics
          const rawAssignment = await this.assignmentRepository.getAssignment(
            input.assignmentId,
            tx
          );

          let denialReason: SubmitClinicalReviewResult['denialReason'] = 'ASSIGNMENT_MISSING';
          let diagnosticMessage = 'Active accepted reviewer assignment not found.';

          if (!rawAssignment) {
            denialReason = 'ASSIGNMENT_MISSING';
            diagnosticMessage = 'Reviewer assignment record not found.';
          } else if (rawAssignment.reviewerId !== input.reviewerId) {
            denialReason = 'ASSIGNMENT_WRONG_REVIEWER';
            diagnosticMessage = 'Assignment belongs to a different reviewer.';
          } else if (rawAssignment.revisionId !== input.revisionId) {
            denialReason = 'ASSIGNMENT_WRONG_REVISION';
            diagnosticMessage = 'Assignment belongs to a different procedure revision.';
          } else if (rawAssignment.status === 'COMPLETED') {
            denialReason = 'ASSIGNMENT_ALREADY_COMPLETED';
            diagnosticMessage = 'Reviewer assignment has already been completed.';
          } else if (rawAssignment.status === 'REVOKED') {
            denialReason = 'ASSIGNMENT_REVOKED';
            diagnosticMessage = 'Reviewer assignment has been revoked.';
          } else if (rawAssignment.status === 'WITHDRAWN') {
            denialReason = 'ASSIGNMENT_WITHDRAWN';
            diagnosticMessage = 'Reviewer assignment has been withdrawn.';
          } else if (rawAssignment.status === 'ASSIGNED') {
            denialReason = 'ASSIGNMENT_NOT_ACCEPTED';
            diagnosticMessage = 'Reviewer assignment has not been accepted by reviewer.';
          } else if (rawAssignment.expiresAt.getTime() <= now.getTime()) {
            denialReason = 'ASSIGNMENT_EXPIRED';
            diagnosticMessage = 'Reviewer assignment has expired.';
          }

          return {
            success: false,
            revisionId: input.revisionId,
            decision: input.decision,
            revisionStatus: revision.translation.currentStatus,
            quorumSatisfied: false,
            denialReason,
            diagnosticMessage,
            submittedAt,
          };
        }

        // Step C: Re-evaluate Contextual Reviewer Eligibility at Submission Time
        const snapshotMeta = (revision.snapshotData as any)?.clinicalMetadata ?? {};
        const eligibilityResult = await this.eligibilityService.evaluateEligibility(
          input.reviewerCredentials,
          {
            procedureId: revision.procedureId,
            revisionId: revision.id,
            authorId: revision.authorId,
            involvesSedation: Boolean(snapshotMeta.involvesSedation),
            sedationLevel: snapshotMeta.sedationLevel,
            surgicalInvasiveness: snapshotMeta.surgicalInvasiveness,
            primarySpecialty: snapshotMeta.primarySpecialty,
            jurisdiction: input.reviewerCredentials.jurisdiction,
          },
          { evaluationTime: now }
        );

        if (!eligibilityResult.isEligible) {
          return {
            success: false,
            revisionId: input.revisionId,
            decision: input.decision,
            revisionStatus: revision.translation.currentStatus,
            quorumSatisfied: false,
            denialReason: 'REVIEWER_INELIGIBLE',
            diagnosticMessage: `Reviewer eligibility check failed: ${eligibilityResult.denialReasons.join(', ')}`,
            submittedAt,
          };
        }

        // Step D: Prevent Duplicate Review Submissions
        const existingApproval = await tx.procedureApproval.findUnique({
          where: {
            revisionId_reviewerId: {
              revisionId: input.revisionId,
              reviewerId: input.reviewerId,
            },
          },
        });

        if (existingApproval && !existingApproval.isRevoked) {
          return {
            success: false,
            revisionId: input.revisionId,
            decision: input.decision,
            revisionStatus: revision.translation.currentStatus,
            quorumSatisfied: false,
            denialReason: 'DUPLICATE_REVIEW_SUBMISSION',
            diagnosticMessage: 'Reviewer has already submitted an active review for this revision.',
            submittedAt,
          };
        }

        // Step E: Insert ProcedureApproval Record
        const createdApproval = await tx.procedureApproval.upsert({
          where: {
            revisionId_reviewerId: {
              revisionId: input.revisionId,
              reviewerId: input.reviewerId,
            },
          },
          create: {
            revisionId: input.revisionId,
            reviewerId: input.reviewerId,
            licenseNumber: input.reviewerCredentials.licenseNumber,
            clinicalSpecialty: input.reviewerCredentials.clinicalSpecialty,
            decision: input.decision,
            clinicalNotes: input.clinicalNotes ?? null,
            isRevoked: false,
            signedAt: now,
          },
          update: {
            licenseNumber: input.reviewerCredentials.licenseNumber,
            clinicalSpecialty: input.reviewerCredentials.clinicalSpecialty,
            decision: input.decision,
            clinicalNotes: input.clinicalNotes ?? null,
            isRevoked: false,
            signedAt: now,
          },
        });

        // Step F: Mark Reviewer Assignment Completed
        await this.assignmentRepository.markAssignmentCompleted(assignment.id, now, tx);

        // Step G: Evaluate Quorum via Policy Adapter (Strictly Fail-Closed for Unratified Quorum)
        let quorumSatisfied = false;
        try {
          if (snapshotMeta.riskTier) {
            // Note: Policy adapter throws UnratifiedGovernancePolicyError for proposed M5 policies
            const quorumPolicy = this.policyAdapter.getReviewerQuorumPolicy(snapshotMeta.riskTier);
            const minReviewers = quorumPolicy?.value?.minimumReviewers;
            if (typeof minReviewers === 'number' && minReviewers > 0) {
              const activeApprovals = await tx.procedureApproval.count({
                where: {
                  revisionId: input.revisionId,
                  decision: 'APPROVED',
                  isRevoked: false,
                },
              });
              if (activeApprovals >= minReviewers) {
                quorumSatisfied = true;
              }
            }
          }
        } catch {
          // Unratified or missing quorum policy fails closed: quorumSatisfied remains false
          quorumSatisfied = false;
        }

        // Step H: Update ProcedureRevision / Translation Status if Quorum Met
        let updatedRevisionStatus = revision.translation.currentStatus;
        if (quorumSatisfied && input.decision === 'APPROVED') {
          await tx.procedureTranslation.update({
            where: {
              procedureId_language: {
                procedureId: revision.procedureId,
                language: revision.language,
              },
            },
            data: {
              currentStatus: 'APPROVED',
            },
          });
          updatedRevisionStatus = 'APPROVED';
        }

        // Step I: Mandatory Atomic Audit Log Insertion within Same Transaction
        const auditRecord = await this.auditService.emitAuditEvent(
          {
            action: 'REVIEW_SUBMITTED',
            actorId: input.reviewerId,
            targetType: 'ProcedureApproval',
            targetId: createdApproval.id,
            payload: {
              revisionId: input.revisionId,
              decision: input.decision,
              licenseNumber: input.reviewerCredentials.licenseNumber,
              clinicalSpecialty: input.reviewerCredentials.clinicalSpecialty,
              quorumSatisfied,
              updatedStatus: updatedRevisionStatus,
              assignmentId: assignment.id,
            },
            ipHash: input.ipHash,
            userAgent: input.userAgent,
          },
          tx
        );

        return {
          success: true,
          approvalId: createdApproval.id,
          revisionId: input.revisionId,
          decision: input.decision,
          revisionStatus: updatedRevisionStatus,
          quorumSatisfied,
          auditLogId: auditRecord.auditId,
          submittedAt,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        timeout: 10000,
      }
    );
  }

  /**
   * Revokes an existing clinical approval and atomically updates revision state.
   */
  public async revokeApproval(
    input: RevokeClinicalApprovalInput
  ): Promise<RevokeClinicalApprovalResult> {
    // 1. Authorize admin revocation scope
    const authzResult = await this.authzService.authorize({
      sessionTokenHash: input.adminSessionTokenHash,
      requestedScope: 'crb:approval:revoke',
    });

    if (authzResult.decision !== 'ALLOW') {
      return {
        success: false,
        approvalId: input.approvalId,
        denialReason: 'AUTHORIZATION_DENIED',
      };
    }

    return await this.prisma.$transaction(
      async (tx) => {
        const approval = await tx.procedureApproval.findUnique({
          where: { id: input.approvalId },
          include: {
            revision: {
              include: {
                translation: true,
              },
            },
          },
        });

        if (!approval) {
          return {
            success: false,
            approvalId: input.approvalId,
            denialReason: 'APPROVAL_NOT_FOUND',
          };
        }

        if (approval.isRevoked) {
          return {
            success: false,
            approvalId: input.approvalId,
            denialReason: 'APPROVAL_ALREADY_REVOKED',
          };
        }

        // Step A: Mark Approval as Revoked
        await tx.procedureApproval.update({
          where: { id: input.approvalId },
          data: { isRevoked: true },
        });

        // Step B: Record ProcedureApprovalRevocation
        const revocation = await tx.procedureApprovalRevocation.create({
          data: {
            approvalId: input.approvalId,
            revokingDoctorId: input.revokingAdminId,
            reason: input.reason,
          },
        });

        // Step C: Demote ProcedureTranslation status if it was APPROVED
        const prevStatus = approval.revision.translation.currentStatus;
        let newStatus = prevStatus;
        if (prevStatus === 'APPROVED') {
          await tx.procedureTranslation.update({
            where: {
              procedureId_language: {
                procedureId: approval.revision.procedureId,
                language: approval.revision.language,
              },
            },
            data: {
              currentStatus: 'PENDING_APPROVAL',
            },
          });
          newStatus = 'PENDING_APPROVAL';
        }

        // Step D: Insert Immutable Audit Log
        const audit = await this.auditService.emitAuditEvent(
          {
            action: 'APPROVAL_REVOKED',
            actorId: input.revokingAdminId,
            targetType: 'ProcedureApproval',
            targetId: input.approvalId,
            payload: {
              revocationId: revocation.id,
              approvalId: input.approvalId,
              revisionId: approval.revisionId,
              reason: input.reason,
              previousStatus: prevStatus,
              updatedStatus: newStatus,
            },
            ipHash: input.ipHash,
            userAgent: input.userAgent,
          },
          tx
        );

        return {
          success: true,
          revocationId: revocation.id,
          approvalId: input.approvalId,
          revisionId: approval.revisionId,
          previousRevisionStatus: prevStatus,
          updatedRevisionStatus: newStatus,
          auditLogId: audit.auditId,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
      }
    );
  }
}

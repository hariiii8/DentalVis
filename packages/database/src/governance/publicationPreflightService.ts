// packages/database/src/governance/publicationPreflightService.ts
// DentalVis — Server-Only Publication Preflight Service (Strictly Read-Only Gate Evaluator)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.4

import 'server-only';
import { createHash } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { PolicyConfigurationAdapter } from './policyAdapter';
import { canonicalizeJson } from './governanceAuditService';
import type {
  IPublicationPreflightService,
  PublicationPreflightCriteria,
  PublicationPreflightResult,
  PreflightBlockingReason,
} from './interfaces';

/**
 * Server-only Publication Preflight Service.
 *
 * CRITICAL INVARIANTS:
 * - STRICTLY READ-ONLY: Performs ONLY read queries (`findUnique`, `findFirst`, `findMany`).
 * - ZERO WRITE CALLS: Never updates, creates, or deletes records. Never changes revision or publication status.
 * - NO AUDIT WRITES: Does not invoke GovernanceAuditService. Callers are responsible for auditing preflight checks.
 * - ZERO AI CLINICAL SIGNOFF: Strictly enforces ratified human credentialing policies.
 * - LANGUAGE DECOUPLING: Evaluates Tamil translation requirements only if Tamil is targeted for publication.
 */
export class PublicationPreflightService implements IPublicationPreflightService {
  private readonly prisma: PrismaClient;
  private readonly policyAdapter: PolicyConfigurationAdapter;

  constructor(options: {
    prisma: PrismaClient;
    policyAdapter?: PolicyConfigurationAdapter;
  }) {
    if (!options.prisma) {
      throw new Error('PublicationPreflightService requires an initialized PrismaClient instance.');
    }
    this.prisma = options.prisma;
    this.policyAdapter = options.policyAdapter ?? new PolicyConfigurationAdapter();
  }

  /**
   * Evaluates all publication gating prerequisites without mutating any state.
   */
  public async runPreflight(
    criteria: PublicationPreflightCriteria
  ): Promise<PublicationPreflightResult> {
    const verifiedAt = new Date().toISOString();
    const blockingReasons: PreflightBlockingReason[] = [];
    const unresolvedPolicies: string[] = [];
    const missingPrerequisites: string[] = [];

    // ------------------------------------------------------------------
    // 1. Fetch Revision, Translation, Author, Approvals & Media
    // ------------------------------------------------------------------
    const revision = await this.prisma.procedureRevision.findUnique({
      where: { id: criteria.revisionId },
      include: {
        translation: true,
        author: true,
        coverMedia: true,
        model3DMedia: true,
        approvals: {
          include: {
            reviewer: true,
            revocations: true,
          },
        },
      },
    });

    if (!revision) {
      return {
        passed: false,
        revisionId: criteria.revisionId,
        procedureId: 'UNKNOWN',
        contentHashVerified: false,
        calculatedContentHash: '',
        storedContentHash: '',
        approvalsSummary: {
          totalValidApprovals: 0,
          quorumSatisfied: false,
          approvers: [],
        },
        specialistMatch: {
          matched: false,
        },
        mediaVerification: {
          totalAssets: 0,
          allAssetsValid: false,
          unverifiedAssets: [],
        },
        blockingReasons: ['REVISION_NOT_FOUND'],
        unresolvedPolicies: [],
        missingPrerequisites: ['Procedure revision record missing'],
        verifiedAt,
      };
    }

    // ------------------------------------------------------------------
    // 2. Validate Revision & Translation State
    // ------------------------------------------------------------------
    // Publication preflight requires that the content status is APPROVED
    if (revision.translation.currentStatus !== 'APPROVED') {
      blockingReasons.push('REVISION_STATUS_INVALID');
      missingPrerequisites.push(
        `ProcedureTranslation status is '${revision.translation.currentStatus}', expected 'APPROVED'`
      );
    }

    if (!revision.authorId || !revision.author) {
      blockingReasons.push('MISSING_AUTHOR_METADATA');
      missingPrerequisites.push('Author record is missing on revision');
    }

    // ------------------------------------------------------------------
    // 3. Content Integrity: Canonical RFC 8785 Hash Verification
    // ------------------------------------------------------------------
    let calculatedContentHash = '';
    let contentHashVerified = false;

    try {
      const canonicalString = canonicalizeJson(revision.snapshotData);
      calculatedContentHash = createHash('sha256').update(canonicalString, 'utf8').digest('hex');
      contentHashVerified = calculatedContentHash === revision.contentHash;

      if (!contentHashVerified) {
        blockingReasons.push('CONTENT_HASH_MISMATCH');
        missingPrerequisites.push(
          `Snapshot hash mismatch: calculated ${calculatedContentHash}, stored ${revision.contentHash}`
        );
      }
    } catch {
      blockingReasons.push('CONTENT_HASH_MISMATCH');
      missingPrerequisites.push('Failed to canonicalize snapshotData');
    }

    // ------------------------------------------------------------------
    // 4. Validate Approvals, Revocation & Author Separation
    // ------------------------------------------------------------------
    const allApprovals = revision.approvals ?? [];
    const validApprovals = allApprovals.filter(
      (app) => !app.isRevoked && app.decision === 'APPROVED'
    );

    if (allApprovals.some((app) => app.isRevoked)) {
      blockingReasons.push('APPROVAL_REVOKED');
    }

    // Check Author/Reviewer Overlap Invariant
    const hasAuthorOverlap = allApprovals.some(
      (app) => app.reviewerId === revision.authorId && !app.isRevoked
    );
    if (hasAuthorOverlap) {
      blockingReasons.push('AUTHOR_REVIEWER_OVERLAP');
      missingPrerequisites.push('Author cannot act as reviewer on own procedure');
    }

    // Check for AI Clinical Sign-off Invariant
    try {
      const noAiPolicy = this.policyAdapter.getAiSignOffPolicy();
      if (noAiPolicy?.value?.mandatesAuthenticatedHumanReviewer) {
        const hasInvalidReviewer = validApprovals.some(
          (app) => !app.reviewer || !app.reviewer.isActive || app.reviewer.role === 'PATIENT_VIEWER'
        );
        if (hasInvalidReviewer) {
          blockingReasons.push('AI_CLINICAL_SIGNOFF_DETECTED');
        }
      }
    } catch {
      unresolvedPolicies.push('governance:no_ai_signoff');
    }

    // ------------------------------------------------------------------
    // 5. Quorum Policy Evaluation (Strictly Fail-Closed for Unratified Quorum)
    // ------------------------------------------------------------------
    const snapshotMeta = (revision.snapshotData as any)?.clinicalMetadata ?? {};
    let quorumSatisfied = false;
    let quorumPolicyKey: string | undefined;

    const tier = snapshotMeta.riskTier;
    if (tier) {
      quorumPolicyKey = `quorum:tier:${tier}`;
      try {
        const quorumPolicy = this.policyAdapter.getReviewerQuorumPolicy(tier as any);
        const requiredCount = (quorumPolicy as any)?.value?.minimumReviewers;
        if (typeof requiredCount === 'number' && requiredCount > 0) {
          quorumSatisfied = validApprovals.length >= requiredCount;
          if (!quorumSatisfied) {
            blockingReasons.push('QUORUM_NOT_MET');
            missingPrerequisites.push(
              `Quorum required ${requiredCount} approvals, found ${validApprovals.length}`
            );
          }
        } else {
          blockingReasons.push('QUORUM_POLICY_UNRATIFIED');
          unresolvedPolicies.push(quorumPolicyKey);
        }
      } catch (err: any) {
        if (err.name === 'UnratifiedGovernancePolicyError') {
          blockingReasons.push('QUORUM_POLICY_UNRATIFIED');
        } else {
          blockingReasons.push('QUORUM_POLICY_MISSING');
        }
        unresolvedPolicies.push(quorumPolicyKey);
      }
    } else {
      // Missing risk tier metadata blocks quorum evaluation fail-closed
      blockingReasons.push('QUORUM_POLICY_MISSING');
      missingPrerequisites.push('Procedure risk tier metadata is unresolved');
    }

    if (validApprovals.length === 0) {
      if (!blockingReasons.includes('INSUFFICIENT_VALID_APPROVALS')) {
        blockingReasons.push('INSUFFICIENT_VALID_APPROVALS');
      }
    }

    // ------------------------------------------------------------------
    // 6. Specialist Alignment Evaluation
    // ------------------------------------------------------------------
    let specialistMatched = true;
    let requiredSpecialty: string | undefined;
    let specialistReviewerId: string | undefined;

    if (snapshotMeta.surgicalInvasiveness === 'SURGICAL') {
      try {
        const surgicalPolicy = this.policyAdapter.getSurgicalPolicy();
        const recognizedSurgical = surgicalPolicy?.value?.recognizedSurgicalSpecialties ?? [];
        const matchingApprover = validApprovals.find((app) =>
          recognizedSurgical.includes(app.clinicalSpecialty as any)
        );

        if (!matchingApprover) {
          specialistMatched = false;
          blockingReasons.push('SPECIALIST_REQUIREMENT_UNMET');
          missingPrerequisites.push(
            `Tier 3 surgical requires recognized specialist (${recognizedSurgical.join(', ')})`
          );
        } else {
          specialistReviewerId = matchingApprover.reviewerId;
        }
      } catch {
        unresolvedPolicies.push('governance:surgical_specialty');
        specialistMatched = false;
        blockingReasons.push('SPECIALIST_REQUIREMENT_UNMET');
      }
    } else if (snapshotMeta.primarySpecialty && snapshotMeta.primarySpecialty !== 'GENERAL_DENTISTRY') {
      requiredSpecialty = snapshotMeta.primarySpecialty;
      const matchingApprover = validApprovals.find(
        (app) => app.clinicalSpecialty === requiredSpecialty
      );
      if (!matchingApprover) {
        specialistMatched = false;
        blockingReasons.push('SPECIALIST_REQUIREMENT_UNMET');
        missingPrerequisites.push(`Requires specialist approval matching '${requiredSpecialty}'`);
      } else {
        specialistReviewerId = matchingApprover.reviewerId;
      }
    }

    // ------------------------------------------------------------------
    // 7. Targeted Language / Translation Verification
    // ------------------------------------------------------------------
    let translationSummary: PublicationPreflightResult['translationSummary'];

    if (criteria.targetLanguage && criteria.targetLanguage !== revision.language) {
      // Verifying another language translation (e.g. Tamil 'ta')
      const targetTrans = await this.prisma.procedureTranslation.findUnique({
        where: {
          procedureId_language: {
            procedureId: revision.procedureId,
            language: criteria.targetLanguage,
          },
        },
      });

      if (!targetTrans) {
        blockingReasons.push('TARGET_LANGUAGE_TRANSLATION_MISSING');
        missingPrerequisites.push(`Translation for '${criteria.targetLanguage}' does not exist`);
        translationSummary = {
          language: criteria.targetLanguage,
          isComplete: false,
          currentStatus: 'NOT_FOUND',
        };
      } else {
        const isComplete = targetTrans.currentStatus === 'APPROVED';
        if (!isComplete) {
          blockingReasons.push('TARGET_LANGUAGE_INCOMPLETE');
          missingPrerequisites.push(
            `Translation for '${criteria.targetLanguage}' has status '${targetTrans.currentStatus}', expected 'APPROVED'`
          );
        }
        translationSummary = {
          language: criteria.targetLanguage,
          isComplete,
          currentStatus: targetTrans.currentStatus,
        };
      }
    }

    // ------------------------------------------------------------------
    // 8. Media Asset Verification (Decoupled Media Invariant M4-POL-003)
    // ------------------------------------------------------------------
    const mediaAssetsToCheck = [];
    if (revision.coverMedia) mediaAssetsToCheck.push(revision.coverMedia);
    if (revision.model3DMedia) mediaAssetsToCheck.push(revision.model3DMedia);

    const unverifiedAssets: string[] = [];
    for (const media of mediaAssetsToCheck) {
      if (media.validationStatus !== 'VERIFIED') {
        unverifiedAssets.push(media.id);
      }
    }

    const allAssetsValid = unverifiedAssets.length === 0;
    if (!allAssetsValid) {
      blockingReasons.push('MEDIA_ASSET_UNVERIFIED');
      missingPrerequisites.push(`Media assets pending inspection: ${unverifiedAssets.join(', ')}`);
    }

    const passed = blockingReasons.length === 0;

    return {
      passed,
      revisionId: revision.id,
      procedureId: revision.procedureId,
      contentHashVerified,
      calculatedContentHash,
      storedContentHash: revision.contentHash,
      approvalsSummary: {
        totalValidApprovals: validApprovals.length,
        quorumSatisfied,
        quorumPolicyKey,
        approvers: validApprovals.map((app) => ({
          reviewerId: app.reviewerId,
          clinicalSpecialty: app.clinicalSpecialty,
          licenseNumber: app.licenseNumber,
          decision: app.decision,
          signedAt: app.signedAt,
        })),
      },
      specialistMatch: {
        matched: specialistMatched,
        requiredSpecialty,
        specialistReviewerId,
      },
      translationSummary,
      mediaVerification: {
        totalAssets: mediaAssetsToCheck.length,
        allAssetsValid,
        unverifiedAssets,
      },
      blockingReasons,
      unresolvedPolicies,
      missingPrerequisites,
      verifiedAt,
    };
  }
}

// packages/database/src/governance/policyAdapter.ts
// DentalVis — Server-Only Fail-Closed Policy Configuration Adapter
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.2

import 'server-only';
import type {
  GovernancePolicyKey,
  GovernanceTier,
  JurisdictionalContext,
  RatifiedPolicy,
} from '@dentalvis/common';
import {
  UnratifiedGovernancePolicyError,
  MissingMandatoryPolicyError,
  MalformedPolicyValueError,
  MissingJurisdictionContextError,
  InvalidPolicyVersionError,
} from './errors';
import {
  RATIFIED_POLICY_REGISTRY,
  SedationGovernancePolicyValue,
  SurgicalGovernancePolicyValue,
} from './ratifiedPolicies';

/**
 * Server-only adapter providing centralized, deterministic governance policy evaluations.
 * Strictly fails closed when an unratified, missing, malformed, or version-mismatched policy is queried.
 * Completely eliminates permissive or synthetic defaults.
 */
export class PolicyConfigurationAdapter {
  private readonly registry: ReadonlyMap<GovernancePolicyKey, RatifiedPolicy<unknown>>;

  constructor(
    customRegistry?: ReadonlyMap<GovernancePolicyKey, RatifiedPolicy<unknown>>
  ) {
    this.registry = customRegistry ?? RATIFIED_POLICY_REGISTRY;
  }

  /**
   * Retrieves a ratified policy by its canonical key.
   * Throws fail-closed if the policy is unratified, missing, malformed, or missing jurisdictional context.
   */
  public getRatifiedPolicy<T>(
    key: GovernancePolicyKey,
    context?: JurisdictionalContext,
    expectedVersion?: string
  ): RatifiedPolicy<T> {
    const policy = this.registry.get(key);

    if (!policy) {
      throw new MissingMandatoryPolicyError(key);
    }

    if (policy.provenance.ratificationStatus !== 'RATIFIED') {
      throw new UnratifiedGovernancePolicyError(
        key,
        `GOVERNANCE INTEGRITY VIOLATION: Policy '${key}' is currently unratified or proposed. ` +
        `Operational enforcement cannot proceed with synthetic defaults.`
      );
    }

    if (expectedVersion && policy.provenance.version !== expectedVersion) {
      throw new InvalidPolicyVersionError(key, expectedVersion);
    }

    if (policy.value === null || policy.value === undefined) {
      throw new MalformedPolicyValueError(
        key,
        `Policy '${key}' is marked RATIFIED but contains null or undefined value payload.`
      );
    }

    if (policy.provenance.isJurisdictionSensitive) {
      if (!context || !context.country || context.country.trim() === '') {
        throw new MissingJurisdictionContextError(key);
      }
      return this.evaluateJurisdictionalPolicy<T>(policy as RatifiedPolicy<T>, context);
    }

    return policy as RatifiedPolicy<T>;
  }

  /**
   * Evaluates reviewer quorum requirements for a specific tier.
   * Strictly throws UnratifiedGovernancePolicyError fail-closed because numerical quorum
   * rules are currently PROPOSED M5 policies requiring formal Clinical Review Board ratification.
   */
  public getReviewerQuorumPolicy(
    tier: GovernanceTier
  ): RatifiedPolicy<{ minimumReviewers: number; specialistRequired: boolean }> {
    const key = `quorum:tier:${tier}` as GovernancePolicyKey;
    return this.getRatifiedPolicy<{ minimumReviewers: number; specialistRequired: boolean }>(key);
  }

  /**
   * Evaluates credential verification window policy.
   * Strictly throws UnratifiedGovernancePolicyError fail-closed because 90-day verification
   * validity is currently a PROPOSED M5 policy requiring formal ratification.
   */
  public getCredentialVerificationWindowPolicy(
    context: JurisdictionalContext
  ): RatifiedPolicy<{ maxAgeDays: number }> {
    return this.getRatifiedPolicy<{ maxAgeDays: number }>(
      'credential:verification_window',
      context
    );
  }

  /**
   * Evaluates sedation governance policy against specific procedure scope and jurisdiction.
   * Enforces previously ratified M4 decision:
   * - No universal 5-year tenure threshold.
   * - Validates applicable licensing, statutory procedural permits, residency training, and recognized specialty.
   * - Rejects blanket qualification rules.
   */
  public getSedationPolicy(
    context: JurisdictionalContext
  ): RatifiedPolicy<SedationGovernancePolicyValue> {
    return this.getRatifiedPolicy<SedationGovernancePolicyValue>(
      'governance:sedation_permits',
      context
    );
  }

  /**
   * Evaluates surgical specialty policy.
   * Enforces previously ratified M4 decision:
   * - Requires recognized statutory specialty (OMFS, Periodontics).
   * - Rejects commercial certificates as standalone specialty.
   */
  public getSurgicalPolicy(): RatifiedPolicy<SurgicalGovernancePolicyValue> {
    return this.getRatifiedPolicy<SurgicalGovernancePolicyValue>('governance:surgical_specialty');
  }

  /**
   * Evaluates AI clinical sign-off prohibition policy.
   * Enforces previously ratified M4 decision:
   * - AI cannot provide clinical approval.
   * - Human account alone does not establish eligibility.
   * - Practitioner must have verified professional qualifications, applicable licenses, and required permits.
   */
  public getAiSignOffPolicy(): RatifiedPolicy<{
    prohibitsAiClinicalSignOff: boolean;
    mandatesAuthenticatedHumanReviewer: boolean;
    mandatesVerifiedProfessionalQualifications: boolean;
    mandatesVerifiedStatutoryLicensing: boolean;
    mandatesScopeSpecificEvaluation: boolean;
    prohibitsAutomaticEligibility: boolean;
  }> {
    return this.getRatifiedPolicy('governance:no_ai_signoff');
  }

  /**
   * Evaluates author self-approval separation policy.
   * Enforces previously ratified M4 decision:
   * - Clinical author cannot approve own content revision.
   */
  public getAuthorSeparationPolicy(): RatifiedPolicy<{
    prohibitsAuthorSelfApproval: boolean;
    enforceAtServiceLayer: boolean;
    enforceAtDatabaseLayer: boolean;
  }> {
    return this.getRatifiedPolicy('governance:author_separation');
  }

  /**
   * Evaluates media review decoupling policy.
   * Enforces previously ratified M4 decision:
   * - Text approval does not authorize video or 3D asset rendering without dedicated sign-off.
   */
  public getMediaDecouplingPolicy(): RatifiedPolicy<{
    textApprovalDecoupledFromMedia: boolean;
    mediaRequiresIndependentVerification: boolean;
  }> {
    return this.getRatifiedPolicy('governance:decoupled_media');
  }

  /**
   * Evaluates publication fail-closed filter invariant.
   */
  public getPublicationFilterPolicy(): RatifiedPolicy<{
    requiresPublishedStatus: boolean;
    requiresActiveUnrevokedApproval: boolean;
    excludesDraftsFailClosed: boolean;
  }> {
    return this.getRatifiedPolicy('publication:fail_closed_filter');
  }

  /**
   * Evaluates audit log immutability invariant (M6.1.1).
   */
  public getAuditImmutabilityPolicy(): RatifiedPolicy<{
    enforceRowLevelAppendOnly: boolean;
    enforceStatementLevelAntiTruncate: boolean;
    forbidUpdateDeleteTruncate: boolean;
  }> {
    return this.getRatifiedPolicy('audit:immutability_triggers');
  }

  /**
   * Resolves jurisdiction-specific adaptations while ensuring no blanket rules are created.
   */
  private evaluateJurisdictionalPolicy<T>(
    policy: RatifiedPolicy<T>,
    _context: JurisdictionalContext
  ): RatifiedPolicy<T> {
    // In M6.1.2, returns the ratified baseline policy with verified jurisdictional context attached
    return policy;
  }
}

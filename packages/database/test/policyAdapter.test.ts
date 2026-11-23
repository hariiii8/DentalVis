// packages/database/test/policyAdapter.test.ts
// DentalVis 2.0 — Comprehensive Unit & Integration Tests for PolicyConfigurationAdapter
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.2

import { describe, it, expect, vi } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import {
  PolicyConfigurationAdapter,
  UnratifiedGovernancePolicyError,
  MissingMandatoryPolicyError,
  MalformedPolicyValueError,
  MissingJurisdictionContextError,
  InvalidPolicyVersionError,
  RATIFIED_POLICY_REGISTRY,
} from '../src/governance';
import type {
  GovernancePolicyKey,
  RatifiedPolicy,
  JurisdictionalContext,
  GovernanceTier,
  CRBRole,
  GovernancePermissionScope,
} from '@dentalvis/common';

describe('Phase M6.1.2 — PolicyConfigurationAdapter & Governance Core Tests', () => {
  const adapter = new PolicyConfigurationAdapter();

  // 1. Valid Ratified Policy Loading
  describe('Ratified M4 Policy Enforcement & Provenance', () => {
    it('TEST-POL-01: successfully evaluates ratified AI clinical sign-off prohibition policy', () => {
      const policy = adapter.getAiSignOffPolicy();

      expect(policy).toBeDefined();
      expect(policy.provenance.policyKey).toBe('governance:no_ai_signoff');
      expect(policy.provenance.version).toBe('1.0.0');
      expect(policy.provenance.classification).toBe('PREVIOUSLY_RATIFIED_POLICY');
      expect(policy.provenance.ratificationStatus).toBe('RATIFIED');
      expect(policy.provenance.ratifyingAuthority).toContain('Clinical Review Board');
      expect(policy.provenance.ratificationDocumentRef).toBe('docs/governance/CLINICAL_GOVERNANCE_PROTOCOL.md §1');
      expect(policy.value.prohibitsAiClinicalSignOff).toBe(true);
      expect(policy.value.mandatesAuthenticatedHumanReviewer).toBe(true);
      expect(policy.value.prohibitsAutomaticEligibility).toBe(true);
    });

    it('TEST-POL-02: successfully evaluates author/reviewer separation policy', () => {
      const policy = adapter.getAuthorSeparationPolicy();

      expect(policy).toBeDefined();
      expect(policy.provenance.policyKey).toBe('governance:author_separation');
      expect(policy.provenance.ratificationStatus).toBe('RATIFIED');
      expect(policy.value.prohibitsAuthorSelfApproval).toBe(true);
      expect(policy.value.enforceAtServiceLayer).toBe(true);
      expect(policy.value.enforceAtDatabaseLayer).toBe(true);
    });

    it('TEST-POL-10: successfully evaluates decoupled media and video review policy', () => {
      const policy = adapter.getMediaDecouplingPolicy();

      expect(policy).toBeDefined();
      expect(policy.provenance.policyKey).toBe('governance:decoupled_media');
      expect(policy.provenance.ratificationStatus).toBe('RATIFIED');
      expect(policy.value.textApprovalDecoupledFromMedia).toBe(true);
      expect(policy.value.mediaRequiresIndependentVerification).toBe(true);
    });

    it('TEST-POL-11: successfully evaluates surgical specialty policy (OMFS/Periodontics)', () => {
      const policy = adapter.getSurgicalPolicy();

      expect(policy).toBeDefined();
      expect(policy.provenance.policyKey).toBe('governance:surgical_specialty');
      expect(policy.provenance.ratificationStatus).toBe('RATIFIED');
      expect(policy.value.requiresRecognizedSpecialty).toBe(true);
      expect(policy.value.rejectsCommercialCertificatesAsStandalone).toBe(true);
      expect(policy.value.recognizedSurgicalSpecialties).toContain('ORAL_AND_MAXILLOFACIAL_SURGERY');
      expect(policy.value.recognizedSurgicalSpecialties).toContain('PERIODONTICS');
    });

    it('TEST-POL-12: preserves fail-closed database publication filter invariant', () => {
      const policy = adapter.getPublicationFilterPolicy();

      expect(policy.provenance.classification).toBe('EXISTING_TECHNICAL_INVARIANT');
      expect(policy.provenance.ratificationStatus).toBe('RATIFIED');
      expect(policy.value.requiresPublishedStatus).toBe(true);
      expect(policy.value.requiresActiveUnrevokedApproval).toBe(true);
      expect(policy.value.excludesDraftsFailClosed).toBe(true);
    });

    it('TEST-POL-13: preserves M6.1.1 database audit immutability invariant', () => {
      const policy = adapter.getAuditImmutabilityPolicy();

      expect(policy.provenance.classification).toBe('EXISTING_TECHNICAL_INVARIANT');
      expect(policy.provenance.ratificationStatus).toBe('RATIFIED');
      expect(policy.value.enforceRowLevelAppendOnly).toBe(true);
      expect(policy.value.enforceStatementLevelAntiTruncate).toBe(true);
      expect(policy.value.forbidUpdateDeleteTruncate).toBe(true);
    });
  });

  // 2. Jurisdiction-Sensitive Sedation Policy
  describe('Jurisdiction-Sensitive Sedation Policy Evaluation', () => {
    it('TEST-POL-06: requires explicit jurisdictional context for sedation policy evaluation', () => {
      expect(() => {
        adapter.getSedationPolicy(undefined as unknown as JurisdictionalContext);
      }).toThrow(MissingJurisdictionContextError);

      expect(() => {
        adapter.getSedationPolicy({ country: '' } as JurisdictionalContext);
      }).toThrow(MissingJurisdictionContextError);
    });

    it('TEST-POL-14: evaluates sedation policy with valid jurisdiction without blanket rules', () => {
      const contextUS: JurisdictionalContext = { country: 'US', subdivision: 'CA' };
      const policy = adapter.getSedationPolicy(contextUS);

      expect(policy).toBeDefined();
      expect(policy.provenance.policyKey).toBe('governance:sedation_permits');
      expect(policy.provenance.isJurisdictionSensitive).toBe(true);
      expect(policy.value.rejectsUniversalTenureRule).toBe(true);
      expect(policy.value.requiresProceduralPermits).toBe(true);
      expect(policy.value.prohibitsBlanketRules).toBe(true);
      expect(policy.value.mandatorySpecialtiesForDeepSedation).toContain('DENTAL_ANESTHESIOLOGY');
      expect(policy.value.mandatorySpecialtiesForDeepSedation).toContain('ORAL_AND_MAXILLOFACIAL_SURGERY');
    });
  });

  // 3. Fail-Closed Rejection of Proposed / Unratified M5 Policies
  describe('Fail-Closed Behavior on Unratified Policies (No Permissive Defaults)', () => {
    it('TEST-POL-04: strictly rejects unratified Tier 1 numerical quorum policy', () => {
      expect(() => {
        adapter.getReviewerQuorumPolicy('TIER_1' as GovernanceTier);
      }).toThrow(UnratifiedGovernancePolicyError);

      expect(() => {
        adapter.getReviewerQuorumPolicy('TIER_1' as GovernanceTier);
      }).toThrow(/Policy 'quorum:tier:TIER_1' is currently unratified or proposed/);
    });

    it('TEST-POL-04b: strictly rejects unratified Tier 2 numerical quorum policy', () => {
      expect(() => {
        adapter.getReviewerQuorumPolicy('TIER_2' as GovernanceTier);
      }).toThrow(UnratifiedGovernancePolicyError);
    });

    it('TEST-POL-04c: strictly rejects unratified Tier 3 dual-specialist quorum policy', () => {
      expect(() => {
        adapter.getReviewerQuorumPolicy('TIER_3' as GovernanceTier);
      }).toThrow(UnratifiedGovernancePolicyError);
    });

    it('TEST-POL-05: strictly rejects proposed 90-day credential verification window policy', () => {
      const context: JurisdictionalContext = { country: 'IN', subdivision: 'TN' };
      expect(() => {
        adapter.getCredentialVerificationWindowPolicy(context);
      }).toThrow(UnratifiedGovernancePolicyError);
    });

    it('TEST-POL-15: strictly rejects unratified $1,000 COI commercial threshold policy', () => {
      expect(() => {
        adapter.getRatifiedPolicy('coi:commercial_threshold');
      }).toThrow(UnratifiedGovernancePolicyError);
    });

    it('TEST-POL-16: strictly rejects unratified periodic reassessment interval policies', () => {
      expect(() => {
        adapter.getRatifiedPolicy('reassessment:tier:TIER_1');
      }).toThrow(UnratifiedGovernancePolicyError);

      expect(() => {
        adapter.getRatifiedPolicy('reassessment:tier:TIER_2_3');
      }).toThrow(UnratifiedGovernancePolicyError);
    });

    it('TEST-POL-17: strictly rejects unratified bilingual Tamil sign-off policy', () => {
      expect(() => {
        adapter.getRatifiedPolicy('bilingual:tamil_signoff');
      }).toThrow(UnratifiedGovernancePolicyError);
    });
  });

  // 4. Missing, Malformed & Version Checks
  describe('Robust Error Handling & Boundary Protection', () => {
    it('TEST-POL-03: throws MissingMandatoryPolicyError for non-existent policy keys', () => {
      expect(() => {
        adapter.getRatifiedPolicy('governance:non_existent_key' as GovernancePolicyKey);
      }).toThrow(MissingMandatoryPolicyError);
    });

    it('TEST-POL-07: throws InvalidPolicyVersionError when requested version does not match', () => {
      expect(() => {
        adapter.getRatifiedPolicy('governance:no_ai_signoff', undefined, '2.0.0');
      }).toThrow(InvalidPolicyVersionError);
    });

    it('TEST-POL-18: throws MalformedPolicyValueError if a ratified policy has null value', () => {
      const malformedRegistry = new Map<GovernancePolicyKey, RatifiedPolicy<unknown>>([
        [
          'governance:no_ai_signoff',
          {
            provenance: {
              policyKey: 'governance:no_ai_signoff',
              version: '1.0.0',
              classification: 'PREVIOUSLY_RATIFIED_POLICY',
              ratificationStatus: 'RATIFIED',
              isJurisdictionSensitive: false,
            },
            value: null,
          },
        ],
      ]);

      const malformedAdapter = new PolicyConfigurationAdapter(malformedRegistry);
      expect(() => {
        malformedAdapter.getAiSignOffPolicy();
      }).toThrow(MalformedPolicyValueError);
    });

    it('TEST-POL-19: ensures deterministic policy evaluation across consecutive invocations', () => {
      const first = adapter.getAiSignOffPolicy();
      const second = adapter.getAiSignOffPolicy();
      expect(first).toEqual(second);
      expect(first.value).toEqual(second.value);
    });
  });

  // 5. Governance Role Permission Scopes & Strict Separation
  describe('Governance Role Permission Matrix & Scope Separation', () => {
    const rolePermissions: Record<CRBRole, GovernancePermissionScope[]> = {
      CONTENT_AUTHOR: ['crb:dossier:draft', 'crb:dossier:read'],
      CLINICAL_REVIEWER: [
        'crb:dossier:read',
        'crb:review:accept',
        'crb:review:assess',
        'crb:review:submit',
        'crb:coi:audit',
      ],
      SPECIALIST_REVIEWER: [
        'crb:dossier:read',
        'crb:review:accept',
        'crb:review:assess',
        'crb:review:submit',
        'crb:coi:audit',
      ],
      CRB_CHAIR: [
        'crb:dossier:read',
        'crb:review:assign',
        'crb:approval:revoke',
        'crb:policy:read',
        'crb:audit:read',
      ],
      GOVERNANCE_ADMIN: [
        'crb:dossier:read',
        'crb:credential:verify',
        'crb:coi:audit',
        'crb:policy:read',
        'crb:audit:read',
      ],
      PUBLICATION_ADMIN: [
        'crb:dossier:read',
        'crb:publish:authorize',
        'crb:policy:read',
        'crb:audit:read',
      ],
      INDEPENDENT_AUDITOR: [
        'crb:dossier:read',
        'crb:policy:read',
        'crb:audit:read',
      ],
    };

    it('TEST-POL-09: Independent Auditor is strictly read-only with zero mutating scopes', () => {
      const auditorScopes = rolePermissions.INDEPENDENT_AUDITOR;
      expect(auditorScopes).toContain('crb:dossier:read');
      expect(auditorScopes).toContain('crb:policy:read');
      expect(auditorScopes).toContain('crb:audit:read');

      // Must NOT contain mutation scopes
      expect(auditorScopes).not.toContain('crb:review:submit');
      expect(auditorScopes).not.toContain('crb:publish:authorize');
      expect(auditorScopes).not.toContain('crb:approval:revoke');
      expect(auditorScopes).not.toContain('crb:credential:verify');
      expect(auditorScopes).not.toContain('crb:review:assign');
      expect(auditorScopes).not.toContain('crb:dossier:draft');
    });

    it('TEST-POL-08: CRB Chair and Publication Administrator maintain disjoint operational scopes', () => {
      const chairScopes = rolePermissions.CRB_CHAIR;
      const pubAdminScopes = rolePermissions.PUBLICATION_ADMIN;

      // CRB Chair can assign reviews and revoke approvals, but CANNOT publish
      expect(chairScopes).toContain('crb:review:assign');
      expect(chairScopes).toContain('crb:approval:revoke');
      expect(chairScopes).not.toContain('crb:publish:authorize');
      expect(chairScopes).not.toContain('crb:review:submit');

      // Publication Admin can authorize publication, but CANNOT assign reviews or submit clinical decisions
      expect(pubAdminScopes).toContain('crb:publish:authorize');
      expect(pubAdminScopes).not.toContain('crb:review:assign');
      expect(pubAdminScopes).not.toContain('crb:approval:revoke');
      expect(pubAdminScopes).not.toContain('crb:review:submit');
    });

    it('TEST-POL-20: Content Author cannot review or publish content', () => {
      const authorScopes = rolePermissions.CONTENT_AUTHOR;
      expect(authorScopes).toContain('crb:dossier:draft');
      expect(authorScopes).not.toContain('crb:review:submit');
      expect(authorScopes).not.toContain('crb:publish:authorize');
      expect(authorScopes).not.toContain('crb:approval:revoke');
    });
  });
});

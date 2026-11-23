// packages/database/src/governance/errors.ts
// DentalVis — Server-Only Governance Policy & RBAC Errors
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.2

/**
 * Thrown when an unratified or proposed policy is queried for operational enforcement.
 * Ensures the system fails closed immediately without synthetic defaults.
 */
export class UnratifiedGovernancePolicyError extends Error {
  public readonly policyKey: string;
  public readonly status: string;

  constructor(policyKey: string, message?: string) {
    super(
      message ??
        `GOVERNANCE INTEGRITY VIOLATION: Policy '${policyKey}' is currently unratified or proposed. ` +
        `Operational enforcement cannot proceed with synthetic defaults.`
    );
    this.name = 'UnratifiedGovernancePolicyError';
    this.policyKey = policyKey;
    this.status = 'UNRATIFIED';
    Object.setPrototypeOf(this, UnratifiedGovernancePolicyError.prototype);
  }
}

/**
 * Thrown when a mandatory policy is completely missing from the governance registry.
 */
export class MissingMandatoryPolicyError extends Error {
  public readonly policyKey: string;

  constructor(policyKey: string) {
    super(
      `GOVERNANCE INTEGRITY VIOLATION: Mandatory policy '${policyKey}' is missing from the configuration registry.`
    );
    this.name = 'MissingMandatoryPolicyError';
    this.policyKey = policyKey;
    Object.setPrototypeOf(this, MissingMandatoryPolicyError.prototype);
  }
}

/**
 * Thrown when a policy value in the registry is malformed or invalid.
 */
export class MalformedPolicyValueError extends Error {
  public readonly policyKey: string;

  constructor(policyKey: string, details?: string) {
    super(
      `GOVERNANCE INTEGRITY VIOLATION: Policy '${policyKey}' contains malformed or invalid value. ${details ?? ''}`
    );
    this.name = 'MalformedPolicyValueError';
    this.policyKey = policyKey;
    Object.setPrototypeOf(this, MalformedPolicyValueError.prototype);
  }
}

/**
 * Thrown when a policy requires explicit jurisdictional context (e.g. State Dental Board, permits)
 * but the context was omitted or incomplete.
 */
export class MissingJurisdictionContextError extends Error {
  public readonly policyKey: string;

  constructor(policyKey: string) {
    super(
      `GOVERNANCE INTEGRITY VIOLATION: Policy '${policyKey}' requires explicit jurisdictional context ` +
      `(country and applicable subdivision). Evaluation cannot proceed without jurisdictional boundaries.`
    );
    this.name = 'MissingJurisdictionContextError';
    this.policyKey = policyKey;
    Object.setPrototypeOf(this, MissingJurisdictionContextError.prototype);
  }
}

/**
 * Thrown when a requested policy version is unsupported or invalid.
 */
export class InvalidPolicyVersionError extends Error {
  public readonly policyKey: string;
  public readonly requestedVersion: string;

  constructor(policyKey: string, requestedVersion: string) {
    super(
      `GOVERNANCE INTEGRITY VIOLATION: Policy '${policyKey}' does not support version '${requestedVersion}'.`
    );
    this.name = 'InvalidPolicyVersionError';
    this.policyKey = policyKey;
    this.requestedVersion = requestedVersion;
    Object.setPrototypeOf(this, InvalidPolicyVersionError.prototype);
  }
}

/**
 * Thrown when an actor attempts an unauthorized governance operation.
 */
export class UnauthorizedGovernanceActionError extends Error {
  public readonly scope: string;
  public readonly actorUserId?: string;

  constructor(scope: string, message?: string, actorUserId?: string) {
    super(
      message ??
        `GOVERNANCE SECURITY VIOLATION: Actor lacks required permission scope '${scope}'.`
    );
    this.name = 'UnauthorizedGovernanceActionError';
    this.scope = scope;
    this.actorUserId = actorUserId;
    Object.setPrototypeOf(this, UnauthorizedGovernanceActionError.prototype);
  }
}

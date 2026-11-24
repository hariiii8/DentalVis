// apps/admin/src/lib/governanceApi.ts
// DentalVis Admin — Centralized Server-Side Governance API Client
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-D

export interface CoiDeclarationDto {
  id: string;
  userId: string;
  targetProcedureId?: string | null;
  targetRevisionId?: string | null;
  status: 'SUBMITTED' | 'VERIFIED_CLEAR' | 'CONFLICT_DECLARED' | 'RECUSED' | 'EXPIRED' | 'SUPERSEDED';
  hasFinancialInterest: boolean;
  hasInstitutionalAffiliation: boolean;
  hasAuthorRelationship: boolean;
  hasCommercialSponsorship: boolean;
  conflictDetails?: string | null;
  isRecused: boolean;
  recusalReason?: string | null;
  declaredAt: string;
  expiresAt: string;
  supersededById?: string | null;
  assessedByAdminId?: string | null;
  assessedAt?: string | null;
}

export interface ReviewerAssignmentDto {
  id: string;
  revisionId: string;
  reviewerId: string;
  assignedByAdminId: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN' | 'REVOKED' | 'EXPIRED' | 'COMPLETED';
  assignedAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  revokedAt?: string | null;
  revocationReason?: string | null;
  declinedAt?: string | null;
  declineReason?: string | null;
  expiresAt: string;
}

export interface ClinicalReviewResultDto {
  success: boolean;
  approvalId?: string;
  revisionId: string;
  decision: 'APPROVED' | 'REJECTED';
  revisionStatus: string;
  quorumSatisfied: boolean;
  auditLogId?: string;
  submittedAt: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export class GovernanceApiClient {
  private readonly baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '/api/governance') {
    this.baseUrl = baseUrl;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: ApiErrorResponse['error']; status: number }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const text = await res.text();
      let json: any = null;
      if (text) {
        try {
          json = JSON.parse(text);
        } catch {
          return {
            status: res.status,
            error: {
              code: 'INVALID_JSON',
              message: 'Server returned non-JSON response.',
            },
          };
        }
      }

      if (!res.ok) {
        return {
          status: res.status,
          error: json?.error || {
            code: `HTTP_${res.status}`,
            message: res.statusText || 'Request failed.',
          },
        };
      }

      return {
        status: res.status,
        data: json?.data as T,
      };
    } catch (err: any) {
      return {
        status: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: err?.message || 'Failed to connect to backend governance API.',
        },
      };
    }
  }

  // ====================================================================
  // 1. COI API CALLS
  // ====================================================================

  public async getActiveCoiDeclaration(params?: {
    procedureId?: string;
    revisionId?: string;
  }) {
    const q = new URLSearchParams();
    if (params?.procedureId) q.set('procedureId', params.procedureId);
    if (params?.revisionId) q.set('revisionId', params.revisionId);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<CoiDeclarationDto>(`/coi${qs}`, { method: 'GET' });
  }

  public async submitCoiDeclaration(input: {
    targetProcedureId?: string;
    targetRevisionId?: string;
    hasFinancialInterest: boolean;
    hasInstitutionalAffiliation: boolean;
    hasAuthorRelationship: boolean;
    hasCommercialSponsorship: boolean;
    conflictDetails?: string;
    expiresAt: string;
  }) {
    return this.request<CoiDeclarationDto>('/coi', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  public async assessCoiDeclaration(input: {
    declarationId: string;
    outcome: 'VERIFIED_CLEAR' | 'RECUSED';
    recusalReason?: string;
    assessmentNotes?: string;
  }) {
    return this.request<CoiDeclarationDto>('/coi/assess', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // ====================================================================
  // 2. REVIEWER ASSIGNMENT API CALLS
  // ====================================================================

  public async listAssignments(params?: { revisionId?: string; reviewerId?: string }) {
    const q = new URLSearchParams();
    if (params?.revisionId) q.set('revisionId', params.revisionId);
    if (params?.reviewerId) q.set('reviewerId', params.reviewerId);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<ReviewerAssignmentDto[]>(`/assignments${qs}`, { method: 'GET' });
  }

  public async createAssignment(input: {
    revisionId: string;
    reviewerId: string;
    expiresAt: string;
  }) {
    return this.request<ReviewerAssignmentDto>('/assignments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  public async transitionAssignment(
    assignmentId: string,
    action: 'ACCEPT' | 'DECLINE' | 'REVOKE',
    reason?: string
  ) {
    return this.request<ReviewerAssignmentDto>(`/assignments/${assignmentId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
  }

  // ====================================================================
  // 3. CLINICAL REVIEW SUBMISSION API CALL
  // ====================================================================

  public async submitClinicalReview(input: {
    revisionId: string;
    decision: 'APPROVED' | 'REJECTED';
    clinicalNotes?: string;
    rubricScore?: number;
  }) {
    return this.request<ClinicalReviewResultDto>('/reviews', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
}

export const governanceApi = new GovernanceApiClient();

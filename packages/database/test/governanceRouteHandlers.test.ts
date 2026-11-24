// packages/database/test/governanceRouteHandlers.test.ts
// DentalVis — Direct Next.js Governance Route-Handler Integration Tests (M6.1.6-R)
// Architecture Baseline v1.9.1 (FROZEN) — Gap TEST-D-01 Resolution

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock server-only and next/server
vi.mock('server-only', () => ({}));
vi.mock('next/server', () => {
  class MockNextResponse {
    status: number;
    headers: Record<string, string>;
    private _data: any;

    constructor(body: any, init?: { status?: number; headers?: Record<string, string> }) {
      this._data = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? {};
    }

    async json() {
      return this._data;
    }

    static json(data: any, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(data, init);
    }
  }

  class MockNextRequest {
    url: string;
    method: string;
    private _body: any;
    private _headers: Map<string, string>;
    cookies: { get: (name: string) => { value: string } | undefined };

    constructor(input: string, init?: { method?: string; body?: any; headers?: Record<string, string>; cookies?: Record<string, string> }) {
      this.url = input;
      this.method = init?.method ?? 'GET';
      this._body = init?.body;
      this._headers = new Map(Object.entries(init?.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
      const cookieMap = new Map(Object.entries(init?.cookies ?? {}));
      this.cookies = {
        get: (name: string) => {
          const val = cookieMap.get(name);
          return val !== undefined ? { value: val } : undefined;
        },
      };
    }

    headers = {
      get: (name: string) => this._headers.get(name.toLowerCase()) ?? null,
    };

    async json() {
      if (this._body === undefined || this._body === null) {
        throw new Error('Unexpected end of JSON input');
      }
      if (typeof this._body === 'string') {
        return JSON.parse(this._body);
      }
      return this._body;
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// 2. Mock individual internal governance modules and prisma
export const mockGuardGovernanceApi = vi.fn();
export const mockCreateDeclaration = vi.fn();
export const mockGetActiveDeclaration = vi.fn();
export const mockAssessDeclaration = vi.fn();
export const mockCreateAssignment = vi.fn();
export const mockGetAssignment = vi.fn();
export const mockListAssignments = vi.fn();
export const mockAcceptAssignment = vi.fn();
export const mockDeclineAssignment = vi.fn();
export const mockRevokeAssignment = vi.fn();
export const mockGetActiveAcceptedAssignment = vi.fn();
export const mockSubmitReview = vi.fn();
export const mockPrismaFindUniqueRevision = vi.fn();
export const mockPrismaFindUniqueUser = vi.fn();

vi.mock('../src/governance/apiPipeline', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    guardGovernanceApi: (...args: any[]) => mockGuardGovernanceApi(...args),
    createGovernanceErrorResponse: (failure: any) => ({
      status: failure.httpStatus,
      body: {
        error: {
          code: failure.errorCode,
          message: failure.message,
          details: failure.details,
        },
      },
    }),
    createGovernanceSuccessResponse: (data: any, status: number = 200) => ({
      status,
      body: { data },
    }),
  };
});

vi.mock('../src/governance/prismaCoiRepository', () => ({
  PrismaCoiRepository: vi.fn().mockImplementation(() => ({
    createDeclaration: mockCreateDeclaration,
    getActiveDeclaration: mockGetActiveDeclaration,
    assessDeclaration: mockAssessDeclaration,
  })),
}));

vi.mock('../src/governance/prismaAssignmentRepository', () => ({
  PrismaAssignmentRepository: vi.fn().mockImplementation(() => ({
    createAssignment: mockCreateAssignment,
    getAssignment: mockGetAssignment,
    listAssignments: mockListAssignments,
    acceptAssignment: mockAcceptAssignment,
    declineAssignment: mockDeclineAssignment,
    revokeAssignment: mockRevokeAssignment,
    getActiveAcceptedAssignment: mockGetActiveAcceptedAssignment,
  })),
}));

vi.mock('../src/governance/clinicalReviewService', () => ({
  ClinicalReviewService: vi.fn().mockImplementation(() => ({
    submitReview: mockSubmitReview,
  })),
}));

vi.mock('../src/index', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    prisma: {
      procedureRevision: {
        findUnique: (...args: any[]) => mockPrismaFindUniqueRevision(...args),
      },
      user: {
        findUnique: (...args: any[]) => mockPrismaFindUniqueUser(...args),
      },
    },
  };
});

// Import Next.js route handlers
import { POST as postCoi, GET as getCoi } from '../../../apps/web/src/app/api/governance/coi/route';
import { POST as postAssessCoi } from '../../../apps/web/src/app/api/governance/coi/assess/route';
import { POST as postAssignment, GET as getAssignments } from '../../../apps/web/src/app/api/governance/assignments/route';
import { POST as postTransitionAssignment } from '../../../apps/web/src/app/api/governance/assignments/[id]/transition/route';
import { POST as postReview } from '../../../apps/web/src/app/api/governance/reviews/route';
import { NextRequest } from 'next/server';

describe('Phase M6.1.6-R — Direct Governance Route-Handler Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ====================================================================
  // 1. COI ROUTES (/api/governance/coi)
  // ====================================================================

  describe('COI Routes (/api/governance/coi)', () => {
    it('POST /api/governance/coi: Rejects missing body or malformed payload with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        body: null,
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('BAD_REQUEST');
    });

    it('POST /api/governance/coi: Rejects non-boolean disclosure flags with 400 VALIDATION_ERROR', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        body: {
          hasFinancialInterest: 'yes', // invalid type
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/governance/coi: Rejects expired or past expiresAt with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() - 1000).toISOString(), // past date
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/governance/coi: Rejects unauthorized caller when guard fails closed (401)', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: false,
        httpStatus: 401,
        errorCode: 'UNAUTHENTICATED',
        message: 'Missing or expired session token.',
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(401);
      expect(json.error.code).toBe('UNAUTHENTICATED');
    });

    it('POST /api/governance/coi: Successfully creates COI declaration for authenticated user (201)', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-clinician-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockCreateDeclaration.mockResolvedValueOnce({
        id: 'coi-100',
        userId: 'usr-clinician-1',
        status: 'SUBMITTED',
        hasFinancialInterest: false,
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        headers: { authorization: 'Bearer test-token-123' },
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.id).toBe('coi-100');
      expect(mockCreateDeclaration).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'usr-clinician-1',
        })
      );
    });

    it('GET /api/governance/coi: Returns 404 when no active declaration exists', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-clinician-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockGetActiveDeclaration.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/governance/coi?procedureId=proc-1');
      const res: any = await getCoi(req);
      const json = await res.json();
      expect(res.status).toBe(404);
      expect(json.error.code).toBe('NOT_FOUND');
    });

    it('GET /api/governance/coi: Returns active declaration for actor (200)', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-clinician-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockGetActiveDeclaration.mockResolvedValueOnce({
        id: 'coi-200',
        userId: 'usr-clinician-1',
        status: 'VERIFIED_CLEAR',
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi');
      const res: any = await getCoi(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe('coi-200');
    });
  });

  // ====================================================================
  // 2. COI ASSESSMENT ROUTE (/api/governance/coi/assess)
  // ====================================================================

  describe('COI Assessment Route (/api/governance/coi/assess)', () => {
    it('POST /api/governance/coi/assess: Rejects invalid assessment outcome with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/coi/assess', {
        method: 'POST',
        body: {
          declarationId: 'coi-1',
          outcome: 'INVALID_OUTCOME',
        },
      });

      const res: any = await postAssessCoi(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/governance/coi/assess: Rejects self-clearance attempts with 403', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-chair-1', roles: ['CRB_CHAIR'] },
        },
      });

      mockAssessDeclaration.mockRejectedValueOnce(
        new Error('SECURITY VIOLATION: Self-assessment is prohibited.')
      );

      const req = new NextRequest('http://localhost:3000/api/governance/coi/assess', {
        method: 'POST',
        headers: { authorization: 'Bearer chair-token' },
        body: {
          declarationId: 'coi-chair-decl',
          outcome: 'VERIFIED_CLEAR',
        },
      });

      const res: any = await postAssessCoi(req);
      const json = await res.json();
      expect(res.status).toBe(403);
      expect(json.error.code).toBe('FORBIDDEN');
      expect(json.error.message).toContain('SECURITY VIOLATION');
    });
  });

  // ====================================================================
  // 3. ASSIGNMENT MANAGEMENT ROUTES (/api/governance/assignments)
  // ====================================================================

  describe('Assignment Routes (/api/governance/assignments)', () => {
    it('POST /api/governance/assignments: Rejects missing reviewerId with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/assignments', {
        method: 'POST',
        body: {
          revisionId: 'rev-1',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postAssignment(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/governance/assignments: Maps partial unique index violation code P2002 to 409 CONFLICT', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-admin-1', roles: ['SYSTEM_ADMIN'] },
        },
      });

      const p2002Err: any = new Error('Unique constraint failed');
      p2002Err.code = 'P2002';
      mockCreateAssignment.mockRejectedValueOnce(p2002Err);

      const req = new NextRequest('http://localhost:3000/api/governance/assignments', {
        method: 'POST',
        headers: { authorization: 'Bearer admin-token' },
        body: {
          revisionId: 'rev-1',
          reviewerId: 'usr-rev-1',
          expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        },
      });

      const res: any = await postAssignment(req);
      const json = await res.json();
      expect(res.status).toBe(409);
      expect(json.error.code).toBe('CONFLICT');
      expect(json.error.message).toContain('active assignment already exists');
    });

    it('GET /api/governance/assignments: Queries assignments for authorized admin', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-admin-1', roles: ['SYSTEM_ADMIN'] },
        },
      });

      mockListAssignments.mockResolvedValueOnce([
        { id: 'asg-1', status: 'ASSIGNED' },
        { id: 'asg-2', status: 'ACCEPTED' },
      ]);

      const req = new NextRequest('http://localhost:3000/api/governance/assignments?revisionId=rev-1');
      const res: any = await getAssignments(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.length).toBe(2);
    });
  });

  // ====================================================================
  // 4. ASSIGNMENT LIFECYCLE TRANSITION (/api/governance/assignments/[id]/transition)
  // ====================================================================

  describe('Assignment Transition Route (/api/governance/assignments/[id]/transition)', () => {
    it('POST: Rejects unknown lifecycle action with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/assignments/asg-1/transition', {
        method: 'POST',
        body: { action: 'UNKNOWN_ACTION' },
      });

      const res: any = await postTransitionAssignment(req, {
        params: Promise.resolve({ id: 'asg-1' }),
      });
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST: Returns 404 if assignment does not exist', async () => {
      mockGetAssignment.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/governance/assignments/asg-missing/transition', {
        method: 'POST',
        body: { action: 'ACCEPT' },
      });

      const res: any = await postTransitionAssignment(req, {
        params: Promise.resolve({ id: 'asg-missing' }),
      });
      const json = await res.json();
      expect(res.status).toBe(404);
      expect(json.error.code).toBe('NOT_FOUND');
    });

    it('POST: Successfully accepts assignment by authorized reviewer (200)', async () => {
      mockGetAssignment.mockResolvedValueOnce({
        id: 'asg-1',
        revisionId: 'rev-1',
        reviewerId: 'usr-rev-1',
        status: 'ASSIGNED',
      });

      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-rev-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockAcceptAssignment.mockResolvedValueOnce({
        id: 'asg-1',
        status: 'ACCEPTED',
      });

      const req = new NextRequest('http://localhost:3000/api/governance/assignments/asg-1/transition', {
        method: 'POST',
        headers: { authorization: 'Bearer rev-token' },
        body: { action: 'ACCEPT' },
      });

      const res: any = await postTransitionAssignment(req, {
        params: Promise.resolve({ id: 'asg-1' }),
      });
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.status).toBe('ACCEPTED');
    });
  });

  // ====================================================================
  // 5. CLINICAL REVIEW SUBMISSION ROUTE (/api/governance/reviews)
  // ====================================================================

  describe('Clinical Review Route (/api/governance/reviews)', () => {
    it('POST /api/governance/reviews: Rejects invalid decision option with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/governance/reviews', {
        method: 'POST',
        body: {
          revisionId: 'rev-1',
          decision: 'PENDING', // invalid
        },
      });

      const res: any = await postReview(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/governance/reviews: Returns 404 when procedure revision is not found', async () => {
      mockPrismaFindUniqueRevision.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/governance/reviews', {
        method: 'POST',
        body: {
          revisionId: 'rev-missing',
          decision: 'APPROVED',
        },
      });

      const res: any = await postReview(req);
      const json = await res.json();
      expect(res.status).toBe(404);
      expect(json.error.code).toBe('NOT_FOUND');
    });

    it('POST /api/governance/reviews: Rejects when author attempts self-approval (403)', async () => {
      mockPrismaFindUniqueRevision.mockResolvedValueOnce({
        id: 'rev-1',
        procedureId: 'proc-1',
        authorId: 'usr-author-1',
        translation: { currentStatus: 'IN_REVIEW' },
      });

      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: false,
        httpStatus: 403,
        errorCode: 'AUTHOR_SELF_APPROVAL_PROHIBITED',
        message: 'Content authors are prohibited from approving their own clinical revisions.',
      });

      const req = new NextRequest('http://localhost:3000/api/governance/reviews', {
        method: 'POST',
        headers: { authorization: 'Bearer author-token' },
        body: {
          revisionId: 'rev-1',
          decision: 'APPROVED',
        },
      });

      const res: any = await postReview(req);
      const json = await res.json();
      expect(res.status).toBe(403);
      expect(json.error.code).toBe('AUTHOR_SELF_APPROVAL_PROHIBITED');
    });

    it('POST /api/governance/reviews: Rejects when no active accepted assignment exists (403)', async () => {
      mockPrismaFindUniqueRevision.mockResolvedValueOnce({
        id: 'rev-1',
        procedureId: 'proc-1',
        authorId: 'usr-other-author',
        translation: { currentStatus: 'IN_REVIEW' },
      });

      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-rev-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockGetActiveAcceptedAssignment.mockResolvedValueOnce(null); // No assignment

      const req = new NextRequest('http://localhost:3000/api/governance/reviews', {
        method: 'POST',
        headers: { authorization: 'Bearer rev-token' },
        body: {
          revisionId: 'rev-1',
          decision: 'APPROVED',
        },
      });

      const res: any = await postReview(req);
      const json = await res.json();
      expect(res.status).toBe(403);
      expect(json.error.message).toContain('No active accepted reviewer assignment found');
    });

    it('POST /api/governance/reviews: Successfully records review and returns 201', async () => {
      mockPrismaFindUniqueRevision.mockResolvedValueOnce({
        id: 'rev-1',
        procedureId: 'proc-1',
        authorId: 'usr-other-author',
        translation: { currentStatus: 'IN_REVIEW' },
      });

      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-rev-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockGetActiveAcceptedAssignment.mockResolvedValueOnce({
        id: 'asg-accepted-1',
        revisionId: 'rev-1',
        reviewerId: 'usr-rev-1',
        status: 'ACCEPTED',
      });

      mockPrismaFindUniqueUser.mockResolvedValueOnce({
        id: 'usr-rev-1',
        licenseNumber: 'DENT-LIC-777',
        clinicalSpecialty: 'PERIODONTICS',
      });

      mockSubmitReview.mockResolvedValueOnce({
        success: true,
        approvalId: 'appr-101',
        revisionId: 'rev-1',
        decision: 'APPROVED',
        revisionStatus: 'IN_REVIEW',
        quorumSatisfied: false,
        submittedAt: new Date().toISOString(),
      });

      const req = new NextRequest('http://localhost:3000/api/governance/reviews', {
        method: 'POST',
        headers: { authorization: 'Bearer rev-token' },
        body: {
          revisionId: 'rev-1',
          decision: 'APPROVED',
          clinicalNotes: 'Evidence-based clinical signoff complete.',
        },
      });

      const res: any = await postReview(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.approvalId).toBe('appr-101');
      expect(json.data.decision).toBe('APPROVED');
      expect(mockSubmitReview).toHaveBeenCalled();
    });
  });

  // ====================================================================
  // 6. CSRF & ORIGIN SECURITY TESTS (SEC-C-01 HARDENING)
  // ====================================================================

  describe('CSRF & Origin Security Scenarios (SEC-C-01)', () => {
    it('CSRF-01: Rejects cookie-authenticated mutation with missing Origin and Referer (403)', async () => {
      mockGuardGovernanceApi.mockImplementation(async (opts) => {
        // Evaluate actual CSRF guard logic from apiPipeline
        const { guardGovernanceApi: realGuard } = await vi.importActual<any>('../src/governance/apiPipeline');
        return realGuard(opts);
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        cookies: { dentalvis_session_token: 'test-cookie-token' },
        // No origin or referer header
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(403);
      expect(json.error.code).toBe('CSRF_ORIGIN_DENIED');
      expect(json.error.message).toContain('Cross-site request forgery protection');
    });

    it('CSRF-02: Rejects cookie-authenticated mutation with untrusted cross-origin Origin (403)', async () => {
      mockGuardGovernanceApi.mockImplementation(async (opts) => {
        const { guardGovernanceApi: realGuard } = await vi.importActual<any>('../src/governance/apiPipeline');
        return realGuard(opts);
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        headers: {
          origin: 'http://malicious-attacker.com',
          host: 'localhost:3000',
        },
        cookies: { dentalvis_session_token: 'test-cookie-token' },
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(403);
      expect(json.error.code).toBe('CSRF_ORIGIN_DENIED');
    });

    it('CSRF-03: Allows Bearer-authenticated mutation even if Origin is missing or cross-origin (immune to ambient CSRF)', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-clinician-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockCreateDeclaration.mockResolvedValueOnce({
        id: 'coi-bearer-ok',
        userId: 'usr-clinician-1',
        status: 'SUBMITTED',
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-admin-bearer-token',
          origin: 'http://custom-trusted-admin.internal',
        },
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.id).toBe('coi-bearer-ok');
    });

    it('CSRF-04: Allows cookie-authenticated mutation when Origin matches trusted host origin', async () => {
      mockGuardGovernanceApi.mockResolvedValueOnce({
        success: true,
        context: {
          actor: { userId: 'usr-clinician-1', roles: ['CLINICAL_REVIEWER'] },
        },
      });

      mockCreateDeclaration.mockResolvedValueOnce({
        id: 'coi-cookie-ok',
        userId: 'usr-clinician-1',
        status: 'SUBMITTED',
      });

      const req = new NextRequest('http://localhost:3000/api/governance/coi', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
          host: 'localhost:3000',
        },
        cookies: { dentalvis_session_token: 'valid-cookie-token' },
        body: {
          hasFinancialInterest: false,
          hasInstitutionalAffiliation: false,
          hasAuthorRelationship: false,
          hasCommercialSponsorship: false,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      const res: any = await postCoi(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.id).toBe('coi-cookie-ok');
    });
  });
});

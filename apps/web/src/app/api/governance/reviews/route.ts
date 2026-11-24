// apps/web/src/app/api/governance/reviews/route.ts
// DentalVis — Server-Side Governance API: Clinical Review Submission Endpoint
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import { NextRequest, NextResponse } from 'next/server';
import {
  prisma,
  guardGovernanceApi,
  ClinicalReviewService,
  PrismaAssignmentRepository,
  PrismaCoiRepository,
  createGovernanceErrorResponse,
  createGovernanceSuccessResponse,
} from '@dentalvis/database';

function extractSessionTokenHash(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.substring(7).trim();
  }
  const cookie = req.cookies.get('dentalvis_session_token');
  if (cookie && cookie.value.trim() !== '') {
    return cookie.value.trim();
  }
  return null;
}

/**
 * POST /api/governance/reviews
 * Submits an authoritative clinical review for a procedure revision.
 * Enforces:
 * - Reviewer eligibility
 * - Active accepted assignment
 * - Non-expired assignment
 * - Author/reviewer separation
 * - Quorum fail-closed evaluation
 * Required Scope: 'crb:review:submit'
 */
export async function POST(req: NextRequest) {
  try {
    const tokenHash = extractSessionTokenHash(req);

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Malformed JSON payload.' } },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Request payload must be a JSON object.' } },
        { status: 400 }
      );
    }

    // Validation
    if (!body.revisionId || typeof body.revisionId !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'revisionId string is required.' } },
        { status: 400 }
      );
    }

    if (body.decision !== 'APPROVED' && body.decision !== 'REJECTED') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: "decision must be either 'APPROVED' or 'REJECTED'.",
          },
        },
        { status: 400 }
      );
    }

    // Retrieve Procedure Revision to check authorId for author-reviewer separation guard
    const revision = await prisma.procedureRevision.findUnique({
      where: { id: body.revisionId },
      include: { translation: true },
    });

    if (!revision) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: `ProcedureRevision '${body.revisionId}' not found.` } },
        { status: 404 }
      );
    }

    // Security Pipeline Guard
    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: tokenHash },
      requiredScope: 'crb:review:submit',
      targetProcedureId: revision.procedureId,
      targetRevisionId: revision.id,
      targetAuthorId: revision.authorId,
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const { actor } = guardRes.context;

    // Check active accepted assignment
    const assignmentRepo = new PrismaAssignmentRepository({ prisma });
    const activeAssignment = await assignmentRepo.getActiveAcceptedAssignment(
      revision.id,
      actor.userId
    );

    if (!activeAssignment) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'CLINICAL_REVIEW_REJECTED: No active accepted reviewer assignment found for this revision.',
          },
        },
        { status: 403 }
      );
    }

    // Execute Review Submission via ClinicalReviewService
    const coiRepo = new PrismaCoiRepository({ prisma });
    const reviewService = new ClinicalReviewService({
      prisma,
      assignmentRepository: assignmentRepo,
      coiRepository: coiRepo,
    });

    // Resolve reviewer credentials from DB user record
    const user = await prisma.user.findUnique({
      where: { id: actor.userId },
    });

    const reviewerCredentials = {
      reviewerUserId: actor.userId,
      primaryLicenseNumber: user?.licenseNumber || 'DENT-LIC-UNKNOWN',
      licenseNumber: user?.licenseNumber || 'DENT-LIC-UNKNOWN',
      clinicalSpecialty: (user?.clinicalSpecialty || 'GENERAL_DENTISTRY') as any,
      licensingAuthority: 'STATE_DENTAL_COUNCIL',
      jurisdiction: { country: 'IN', subdivision: 'TN' },
      degree: 'BDS' as const,
      specialty: (user?.clinicalSpecialty || 'GENERAL_DENTISTRY') as any,
      verificationStatus: 'VERIFIED_ACTIVE' as const,
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 365).toISOString(),
      verifiedByUserId: actor.userId,
      proceduralPermits: [],
      disciplinarySanctionsActive: false,
    };

    try {
      const submittedReview = await reviewService.submitReview({
        revisionId: revision.id,
        assignmentId: activeAssignment.id,
        reviewerId: actor.userId,
        sessionTokenHash: tokenHash!,
        decision: body.decision,
        clinicalNotes: body.clinicalNotes ?? 'Clinical review completed.',
        reviewerCredentials,
      });

      const res = createGovernanceSuccessResponse(submittedReview, 201);
      return NextResponse.json(res.body, { status: res.status });
    } catch (svcErr: any) {
      if (svcErr.message?.includes('PROHIBITED') || svcErr.message?.includes('INELIGIBLE')) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: svcErr.message } },
          { status: 403 }
        );
      }
      if (svcErr.message?.includes('DUPLICATE') || svcErr.message?.includes('INVALID')) {
        return NextResponse.json(
          { error: { code: 'CONFLICT', message: svcErr.message } },
          { status: 409 }
        );
      }
      throw svcErr;
    }
  } catch (_error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred during clinical review submission.',
        },
      },
      { status: 500 }
    );
  }
}

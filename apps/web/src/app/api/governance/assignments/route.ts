// apps/web/src/app/api/governance/assignments/route.ts
// DentalVis — Server-Side Governance API: Reviewer Assignment Management
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import { NextRequest, NextResponse } from 'next/server';
import {
  prisma,
  guardGovernanceApi,
  PrismaAssignmentRepository,
  createGovernanceErrorResponse,
  createGovernanceSuccessResponse,
  extractGovernanceSessionCredentials,
  extractGovernanceRequestContext,
} from '@dentalvis/database';

function extractSessionTokenHash(req: NextRequest): string | null {
  return extractGovernanceSessionCredentials(req).tokenHash;
}

/**
 * POST /api/governance/assignments
 * Creates a new reviewer assignment for a procedure revision.
 * Required Scope: 'crb:review:assign'
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

    if (!body.reviewerId || typeof body.reviewerId !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'reviewerId string is required.' } },
        { status: 400 }
      );
    }

    if (!body.expiresAt || isNaN(Date.parse(body.expiresAt))) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'A valid ISO expiresAt timestamp is required.' } },
        { status: 400 }
      );
    }

    const expiresAtDate = new Date(body.expiresAt);
    if (expiresAtDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'expiresAt timestamp must be in the future.' } },
        { status: 400 }
      );
    }

    // Security Guard with CSRF context
    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: tokenHash },
      requiredScope: 'crb:review:assign',
      targetRevisionId: body.revisionId,
      requestContext: extractGovernanceRequestContext(req),
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const { actor } = guardRes.context;

    // Execute Assignment Creation
    const assignmentRepo = new PrismaAssignmentRepository({ prisma });
    try {
      const assignment = await assignmentRepo.createAssignment({
        revisionId: body.revisionId,
        reviewerId: body.reviewerId,
        assignedByAdminId: actor.userId,
        expiresAt: expiresAtDate,
      });

      const res = createGovernanceSuccessResponse(assignment, 201);
      return NextResponse.json(res.body, { status: res.status });
    } catch (repoErr: any) {
      // Catch unique index violation (e.g. duplicate active assignment)
      if (
        repoErr.code === 'P2002' ||
        repoErr.message?.includes('unique constraint') ||
        repoErr.message?.includes('idx_unique_active_reviewer_assignment')
      ) {
        return NextResponse.json(
          {
            error: {
              code: 'CONFLICT',
              message: 'An active assignment already exists for this revision and reviewer.',
            },
          },
          { status: 409 }
        );
      }
      throw repoErr;
    }
  } catch (_error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while creating reviewer assignment.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/governance/assignments
 * Lists reviewer assignments filtered by revisionId or reviewerId.
 * Required Scope: 'crb:review:assign'
 */
export async function GET(req: NextRequest) {
  try {
    const tokenHash = extractSessionTokenHash(req);

    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: tokenHash },
      requiredScope: 'crb:review:assign',
      requestContext: extractGovernanceRequestContext(req),
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const url = new URL(req.url);
    const revisionId = url.searchParams.get('revisionId') ?? undefined;
    const reviewerId = url.searchParams.get('reviewerId') ?? undefined;

    const assignmentRepo = new PrismaAssignmentRepository({ prisma });
    const list = await assignmentRepo.listAssignments({
      revisionId,
      reviewerId,
    });

    const res = createGovernanceSuccessResponse(list, 200);
    return NextResponse.json(res.body, { status: res.status });
  } catch (_error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while listing reviewer assignments.',
        },
      },
      { status: 500 }
    );
  }
}

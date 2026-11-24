// apps/web/src/app/api/governance/assignments/[id]/transition/route.ts
// DentalVis — Server-Side Governance API: Assignment Lifecycle Transition Endpoint
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import { NextRequest, NextResponse } from 'next/server';
import {
  prisma,
  guardGovernanceApi,
  PrismaAssignmentRepository,
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
 * POST /api/governance/assignments/[id]/transition
 * Manages reviewer assignment lifecycle transitions:
 * - 'ACCEPT': Reviewer accepts assigned task (Scope: 'crb:review:accept')
 * - 'DECLINE': Reviewer declines assigned task (Scope: 'crb:review:accept')
 * - 'REVOKE': Admin revokes assignment (Scope: 'crb:review:assign')
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;
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

    const action = body?.action;
    if (action !== 'ACCEPT' && action !== 'DECLINE' && action !== 'REVOKE') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: "Action must be 'ACCEPT', 'DECLINE', or 'REVOKE'.",
          },
        },
        { status: 400 }
      );
    }

    const assignmentRepo = new PrismaAssignmentRepository({ prisma });
    const assignment = await assignmentRepo.getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: `Assignment '${assignmentId}' not found.` } },
        { status: 404 }
      );
    }

    // Determine required scope by action
    const requiredScope =
      action === 'REVOKE' ? 'crb:review:assign' : 'crb:review:accept';

    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: tokenHash },
      requiredScope,
      targetRevisionId: assignment.revisionId,
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const { actor } = guardRes.context;

    // Execute Lifecycle Transition
    try {
      let updated: any;
      if (action === 'ACCEPT') {
        updated = await assignmentRepo.acceptAssignment(assignmentId, actor.userId);
      } else if (action === 'DECLINE') {
        const reason = body.reason || 'Declined by reviewer without details.';
        updated = await assignmentRepo.declineAssignment(assignmentId, actor.userId, reason);
      } else if (action === 'REVOKE') {
        const reason = body.reason || 'Revoked by governance administrator.';
        updated = await assignmentRepo.revokeAssignment(assignmentId, actor.userId, reason);
      }

      const res = createGovernanceSuccessResponse(updated, 200);
      return NextResponse.json(res.body, { status: res.status });
    } catch (repoErr: any) {
      if (repoErr.message?.includes('SECURITY VIOLATION')) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: repoErr.message } },
          { status: 403 }
        );
      }
      if (repoErr.message?.includes('INVALID_TRANSITION') || repoErr.message?.includes('EXPIRED')) {
        return NextResponse.json(
          { error: { code: 'CONFLICT', message: repoErr.message } },
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
          message: 'An unexpected error occurred during assignment transition.',
        },
      },
      { status: 500 }
    );
  }
}

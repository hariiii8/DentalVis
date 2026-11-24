// apps/web/src/app/api/governance/coi/assess/route.ts
// DentalVis — Server-Side Governance API: COI Assessment Endpoint
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import { NextRequest, NextResponse } from 'next/server';
import {
  prisma,
  guardGovernanceApi,
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
 * POST /api/governance/coi/assess
 * Allows a Governance Admin / CRB Chair to assess a submitted COI declaration.
 * Required Scope: 'crb:coi:audit'
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

    if (!body.declarationId || typeof body.declarationId !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'declarationId string is required.' } },
        { status: 400 }
      );
    }

    if (body.outcome !== 'VERIFIED_CLEAR' && body.outcome !== 'RECUSED') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: "outcome must be either 'VERIFIED_CLEAR' or 'RECUSED'.",
          },
        },
        { status: 400 }
      );
    }

    // Security Pipeline Guard
    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: {
        sessionTokenHash: tokenHash,
      },
      requiredScope: 'crb:coi:audit',
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const { actor } = guardRes.context;

    // Execute Assessment with anti-self-clearance invariant
    const coiRepo = new PrismaCoiRepository({ prisma });
    try {
      const assessed = await coiRepo.assessDeclaration({
        declarationId: body.declarationId,
        assessorAdminId: actor.userId,
        outcome: body.outcome,
        recusalReason: body.recusalReason,
        assessmentNotes: body.assessmentNotes,
      });

      const res = createGovernanceSuccessResponse(assessed, 200);
      return NextResponse.json(res.body, { status: res.status });
    } catch (repoErr: any) {
      if (repoErr.message?.includes('SECURITY VIOLATION')) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: repoErr.message } },
          { status: 403 }
        );
      }
      if (repoErr.message?.includes('not found')) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: repoErr.message } },
          { status: 404 }
        );
      }
      throw repoErr;
    }
  } catch (_error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while assessing the COI declaration.',
        },
      },
      { status: 500 }
    );
  }
}

// apps/web/src/app/api/governance/coi/route.ts
// DentalVis — Server-Side Governance API: COI Declarations Endpoint
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import { NextRequest, NextResponse } from 'next/server';
import {
  prisma,
  guardGovernanceApi,
  PrismaCoiRepository,
  createGovernanceErrorResponse,
  createGovernanceSuccessResponse,
  extractGovernanceSessionCredentials,
  extractGovernanceRequestContext,
} from '@dentalvis/database';

function extractSessionTokenHash(req: NextRequest): string | null {
  return extractGovernanceSessionCredentials(req).tokenHash;
}

/**
 * POST /api/governance/coi
 * Submits a new COI declaration for the authenticated reviewer.
 * Required Scope: 'crb:review:accept'
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

    // Input Validation
    if (
      typeof body.hasFinancialInterest !== 'boolean' ||
      typeof body.hasInstitutionalAffiliation !== 'boolean' ||
      typeof body.hasAuthorRelationship !== 'boolean' ||
      typeof body.hasCommercialSponsorship !== 'boolean'
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message:
              'All disclosure flags (hasFinancialInterest, hasInstitutionalAffiliation, hasAuthorRelationship, hasCommercialSponsorship) must be boolean.',
          },
        },
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

    // Security Pipeline Guard with CSRF context
    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: {
        sessionTokenHash: tokenHash,
        untrustedAssertedUserId: body.userId,
      },
      requiredScope: 'crb:review:accept',
      targetProcedureId: body.targetProcedureId,
      targetRevisionId: body.targetRevisionId,
      requestContext: extractGovernanceRequestContext(req),
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const { actor } = guardRes.context;

    // Execute Governance Persistence Operation
    const coiRepo = new PrismaCoiRepository({ prisma });
    const declaration = await coiRepo.createDeclaration({
      userId: actor.userId,
      targetProcedureId: body.targetProcedureId ?? null,
      targetRevisionId: body.targetRevisionId ?? null,
      hasFinancialInterest: body.hasFinancialInterest,
      hasInstitutionalAffiliation: body.hasInstitutionalAffiliation,
      hasAuthorRelationship: body.hasAuthorRelationship,
      hasCommercialSponsorship: body.hasCommercialSponsorship,
      conflictDetails: typeof body.conflictDetails === 'string' ? body.conflictDetails : null,
      expiresAt: expiresAtDate,
    });

    const res = createGovernanceSuccessResponse(declaration, 201);
    return NextResponse.json(res.body, { status: res.status });
  } catch (_error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing the COI declaration.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/governance/coi
 * Retrieves the authoritative active COI declaration for the authenticated actor.
 * Required Scope: 'crb:review:accept'
 */
export async function GET(req: NextRequest) {
  try {
    const tokenHash = extractSessionTokenHash(req);

    const guardRes = await guardGovernanceApi({
      prisma,
      identityInput: {
        sessionTokenHash: tokenHash,
      },
      requiredScope: 'crb:review:accept',
      requestContext: extractGovernanceRequestContext(req),
    });

    if (!guardRes.success) {
      const err = createGovernanceErrorResponse(guardRes);
      return NextResponse.json(err.body, { status: err.status });
    }

    const { actor } = guardRes.context;
    const url = new URL(req.url);
    const procedureId = url.searchParams.get('procedureId') ?? undefined;
    const revisionId = url.searchParams.get('revisionId') ?? undefined;

    const coiRepo = new PrismaCoiRepository({ prisma });
    const declaration = await coiRepo.getActiveDeclaration(actor.userId, {
      procedureId,
      revisionId,
    });

    if (!declaration) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'No active COI declaration found for this scope.' } },
        { status: 404 }
      );
    }

    const res = createGovernanceSuccessResponse(declaration, 200);
    return NextResponse.json(res.body, { status: res.status });
  } catch (_error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while retrieving the COI declaration.',
        },
      },
      { status: 500 }
    );
  }
}

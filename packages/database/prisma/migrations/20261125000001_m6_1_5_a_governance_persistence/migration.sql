-- packages/database/prisma/migrations/20261125000001_m6_1_5_a_governance_persistence/migration.sql
-- DentalVis — Milestone M6.1.5-A: Clinical Governance Persistence Migration
-- Architecture Baseline v1.9.1 (FROZEN)

-- 1. Create Enums
CREATE TYPE "CoiDeclarationStatus" AS ENUM (
    'SUBMITTED',
    'VERIFIED_CLEAR',
    'CONFLICT_DECLARED',
    'RECUSED',
    'EXPIRED',
    'SUPERSEDED'
);

CREATE TYPE "AssignmentLifecycleStatus" AS ENUM (
    'ASSIGNED',
    'ACCEPTED',
    'DECLINED',
    'WITHDRAWN',
    'REVOKED',
    'EXPIRED',
    'COMPLETED'
);

-- 2. Create ConflictOfInterestDeclaration Table
CREATE TABLE "ConflictOfInterestDeclaration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "targetProcedureId" UUID,
    "targetRevisionId" UUID,
    "status" "CoiDeclarationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "hasFinancialInterest" BOOLEAN NOT NULL DEFAULT false,
    "hasInstitutionalAffiliation" BOOLEAN NOT NULL DEFAULT false,
    "hasAuthorRelationship" BOOLEAN NOT NULL DEFAULT false,
    "hasCommercialSponsorship" BOOLEAN NOT NULL DEFAULT false,
    "conflictDetails" TEXT,
    "isRecused" BOOLEAN NOT NULL DEFAULT false,
    "recusalReason" VARCHAR(255),
    "declaredAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "supersededById" UUID,
    "assessedByAdminId" UUID,
    "assessedAt" TIMESTAMPTZ(6),
    "assessmentNotes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConflictOfInterestDeclaration_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ConflictOfInterestDeclaration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConflictOfInterestDeclaration_targetProcedureId_fkey" FOREIGN KEY ("targetProcedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConflictOfInterestDeclaration_targetRevisionId_fkey" FOREIGN KEY ("targetRevisionId") REFERENCES "ProcedureRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConflictOfInterestDeclaration_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "ConflictOfInterestDeclaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConflictOfInterestDeclaration_assessedByAdminId_fkey" FOREIGN KEY ("assessedByAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Indexes for ConflictOfInterestDeclaration
CREATE INDEX "ConflictOfInterestDeclaration_userId_status_idx" ON "ConflictOfInterestDeclaration"("userId", "status");
CREATE INDEX "ConflictOfInterestDeclaration_targetProcedureId_isRecused_idx" ON "ConflictOfInterestDeclaration"("targetProcedureId", "isRecused");
CREATE INDEX "ConflictOfInterestDeclaration_targetRevisionId_isRecused_idx" ON "ConflictOfInterestDeclaration"("targetRevisionId", "isRecused");
CREATE INDEX "ConflictOfInterestDeclaration_expiresAt_idx" ON "ConflictOfInterestDeclaration"("expiresAt");

-- 3. Create ReviewerAssignment Table
CREATE TABLE "ReviewerAssignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "revisionId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "assignedByAdminId" UUID NOT NULL,
    "status" "AssignmentLifecycleStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMPTZ(6),
    "declinedAt" TIMESTAMPTZ(6),
    "declineReason" VARCHAR(255),
    "completedAt" TIMESTAMPTZ(6),
    "revokedAt" TIMESTAMPTZ(6),
    "revocationReason" VARCHAR(255),
    "withdrawnAt" TIMESTAMPTZ(6),
    "withdrawalReason" VARCHAR(255),
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewerAssignment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ReviewerAssignment_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "ProcedureRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReviewerAssignment_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReviewerAssignment_assignedByAdminId_fkey" FOREIGN KEY ("assignedByAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Standard Indexes for ReviewerAssignment
CREATE INDEX "ReviewerAssignment_reviewerId_status_idx" ON "ReviewerAssignment"("reviewerId", "status");
CREATE INDEX "ReviewerAssignment_revisionId_status_idx" ON "ReviewerAssignment"("revisionId", "status");
CREATE INDEX "ReviewerAssignment_expiresAt_idx" ON "ReviewerAssignment"("expiresAt");

-- 4. CRITICAL ACTIVE ASSIGNMENT UNIQUENESS (POSTGRESQL PARTIAL UNIQUE INDEX)
-- Mandated by architecture: A reviewer cannot have more than one active ('ASSIGNED', 'ACCEPTED')
-- assignment for the same procedure revision. Terminal statuses ('DECLINED', 'WITHDRAWN', 'REVOKED',
-- 'EXPIRED', 'COMPLETED') are excluded from uniqueness to allow legitimate reassignments.
CREATE UNIQUE INDEX "idx_unique_active_reviewer_assignment"
ON "ReviewerAssignment" ("revisionId", "reviewerId")
WHERE "status" IN ('ASSIGNED', 'ACCEPTED');

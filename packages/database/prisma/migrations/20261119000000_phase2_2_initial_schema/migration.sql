-- DentalVis 2.0 — Phase 2.2 Initial Database Schema & Final Integrity Migration
-- PostgreSQL 16 Compatible
-- Enforces:
--   1. Universal UUID identifiers (gen_random_uuid())
--   2. UTC timestamps (TIMESTAMPTZ)
--   3. Partial Unique Index: At most one primary department per procedure
--   4. Bidirectional Trigger Invariant: Exactly one primary department for any PUBLISHED procedure across inserts, updates, deletes, and transfers
--   5. Session succession and family boundary integrity trigger: Prevents multi-session cycles via recursive cycle check
--   6. Strict Revocation Target Foreign Key Integrity (ON DELETE RESTRICT - no cascade deletes of security audit records)
--   7. Stale outbox worker completion fencing guard trigger & atomic completion function
--   8. Append-only triggers: Prohibits UPDATE and DELETE on ProcedureRevision, ProcedureApproval, ProcedureApprovalRevocation
--   9. Prevent author self-approval trigger with certified reviewer verification
--  10. Composite foreign key relationships

-- ======================================================================
-- 1. EXTENSIONS & ENUMS
-- ======================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM (
    'PATIENT_VIEWER',
    'CLINICAL_AUTHOR',
    'CLINICAL_REVIEWER',
    'CHIEF_EDITOR',
    'SYSTEM_ADMIN'
);

CREATE TYPE "SessionStatus" AS ENUM (
    'ACTIVE',
    'SUPERSEDED',
    'REVOKED_MANUAL',
    'REVOKED_REPLAY_ATTACK',
    'EXPIRED'
);

CREATE TYPE "FamilyStatus" AS ENUM (
    'ACTIVE',
    'REVOKED',
    'EXPIRED'
);

CREATE TYPE "RevocationType" AS ENUM (
    'REVOKE_SESSION',
    'REVOKE_FAMILY',
    'REVOKE_USER'
);

CREATE TYPE "RevocationTargetType" AS ENUM (
    'SESSION',
    'FAMILY',
    'USER'
);

CREATE TYPE "ContentLanguage" AS ENUM (
    'en',
    'ta'
);

CREATE TYPE "ContentStatus" AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'PUBLISHED',
    'ARCHIVED'
);

CREATE TYPE "ApprovalDecision" AS ENUM (
    'APPROVED',
    'REJECTED'
);

CREATE TYPE "MediaAssetProvider" AS ENUM (
    'CLOUDINARY',
    'S3_COMPATIBLE',
    'LOCAL_MOCK'
);

CREATE TYPE "MediaValidationStatus" AS ENUM (
    'PENDING_INSPECTION',
    'VERIFIED',
    'REJECTED'
);

CREATE TYPE "OutboxStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'RETRY_SCHEDULED',
    'DEAD_LETTER'
);

-- ======================================================================
-- 2. USER, SESSION & REVOCATION TABLES
-- ======================================================================

CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PATIENT_VIEWER',
    "licenseNumber" VARCHAR(100),
    "clinicalSpecialty" VARCHAR(150),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_user_role_active" ON "User" ("role", "isActive");

CREATE TABLE "SessionFamily" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "status" "FamilyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMPTZ,
    "revocationReason" VARCHAR(255)
);

CREATE INDEX "idx_session_family_user_status" ON "SessionFamily" ("userId", "status");

CREATE TABLE "UserSession" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "sessionFamilyId" UUID NOT NULL REFERENCES "SessionFamily"("id") ON DELETE RESTRICT,
    "tokenHash" VARCHAR(64) NOT NULL UNIQUE,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "revokedAt" TIMESTAMPTZ,
    "revocationReason" VARCHAR(255),
    "predecessorSessionId" UUID UNIQUE REFERENCES "UserSession"("id") ON DELETE RESTRICT,
    "successorSessionId" UUID UNIQUE REFERENCES "UserSession"("id") ON DELETE RESTRICT,
    "lastRequestId" VARCHAR(64),
    "encryptedRecoveryEnvelope" TEXT,
    "recoveryExpiresAt" TIMESTAMPTZ,
    "ipHash" VARCHAR(64),
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_user_session_no_self_succession" CHECK (
        ("id" <> "predecessorSessionId" OR "predecessorSessionId" IS NULL) AND
        ("id" <> "successorSessionId" OR "successorSessionId" IS NULL)
    )
);

CREATE INDEX "idx_user_session_family_status" ON "UserSession" ("sessionFamilyId", "status");
CREATE INDEX "idx_user_session_user_status" ON "UserSession" ("userId", "status");
CREATE INDEX "idx_user_session_recovery_exp" ON "UserSession" ("recoveryExpiresAt");

-- Revocation Events Table: ON DELETE RESTRICT ensures revocation audit records can NEVER be cascade deleted
CREATE TABLE "RevocationEvent" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "type" "RevocationType" NOT NULL,
    "targetType" "RevocationTargetType" NOT NULL,
    "targetId" UUID NOT NULL,
    "targetSessionId" UUID REFERENCES "UserSession"("id") ON DELETE RESTRICT,
    "targetFamilyId" UUID REFERENCES "SessionFamily"("id") ON DELETE RESTRICT,
    "targetUserId" UUID REFERENCES "User"("id") ON DELETE RESTRICT,
    "reason" VARCHAR(255) NOT NULL,
    "occurredAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_revocation_target_fk_match" CHECK (
        ("targetType" = 'SESSION' AND "targetSessionId" IS NOT NULL AND "targetSessionId" = "targetId" AND "targetFamilyId" IS NULL AND "targetUserId" IS NULL) OR
        ("targetType" = 'FAMILY' AND "targetFamilyId" IS NOT NULL AND "targetFamilyId" = "targetId" AND "targetSessionId" IS NULL AND "targetUserId" IS NULL) OR
        ("targetType" = 'USER' AND "targetUserId" IS NOT NULL AND "targetUserId" = "targetId" AND "targetSessionId" IS NULL AND "targetFamilyId" IS NULL)
    )
);

CREATE INDEX "idx_revocation_event_target" ON "RevocationEvent" ("targetId", "type");
CREATE INDEX "idx_revocation_event_occurred" ON "RevocationEvent" ("occurredAt");

CREATE TABLE "RevocationConsumer" (
    "consumerId" VARCHAR(64) PRIMARY KEY,
    "processInstanceId" VARCHAR(64) NOT NULL,
    "leaseOwner" VARCHAR(64) NOT NULL,
    "leaseExpiresAt" TIMESTAMPTZ NOT NULL,
    "fencingGeneration" BIGINT NOT NULL DEFAULT 0,
    "lastProcessedCursor" TIMESTAMPTZ,
    "lastBaselineAt" TIMESTAMPTZ,
    "lastHeartbeatAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registeredAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_revocation_consumer_lease" ON "RevocationConsumer" ("leaseExpiresAt");
CREATE INDEX "idx_revocation_consumer_heartbeat" ON "RevocationConsumer" ("lastHeartbeatAt");

CREATE TABLE "RevocationEventAck" (
    "consumerId" VARCHAR(64) NOT NULL REFERENCES "RevocationConsumer"("consumerId") ON DELETE CASCADE,
    "eventId" UUID NOT NULL REFERENCES "RevocationEvent"("id") ON DELETE RESTRICT,
    "ackedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pk_revocation_ack" PRIMARY KEY ("consumerId", "eventId")
);

-- ======================================================================
-- 3. MEDIA ASSETS
-- ======================================================================

CREATE TABLE "MediaAsset" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "provider" "MediaAssetProvider" NOT NULL DEFAULT 'CLOUDINARY',
    "providerAssetId" VARCHAR(255) NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "format" VARCHAR(20) NOT NULL,
    "fileSizeBytes" BIGINT NOT NULL,
    "width" INT,
    "height" INT,
    "contentHash" CHAR(64) NOT NULL,
    "validationStatus" "MediaValidationStatus" NOT NULL DEFAULT 'PENDING_INSPECTION',
    "validationReport" JSONB,
    "uploadedByUserId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_media_provider_asset" UNIQUE ("provider", "providerAssetId")
);

CREATE INDEX "idx_media_content_hash" ON "MediaAsset" ("contentHash");
CREATE INDEX "idx_media_validation_status" ON "MediaAsset" ("validationStatus");

-- ======================================================================
-- 4. EDUCATIONAL CONTENT ENTITIES & IMMUTABLE REVISIONS
-- ======================================================================

CREATE TABLE "Procedure" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_procedure_archived" ON "Procedure" ("isArchived");

CREATE TABLE "ProcedureTranslation" (
    "procedureId" UUID NOT NULL REFERENCES "Procedure"("id") ON DELETE RESTRICT,
    "language" "ContentLanguage" NOT NULL,
    "currentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedRevisionId" UUID,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pk_procedure_translation" PRIMARY KEY ("procedureId", "language")
);

CREATE INDEX "idx_procedure_translation_status" ON "ProcedureTranslation" ("currentStatus", "isArchived");

CREATE TABLE "ProcedureRevision" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "procedureId" UUID NOT NULL,
    "language" "ContentLanguage" NOT NULL,
    "revisionNumber" INT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "overviewHtml" TEXT NOT NULL,
    "snapshotData" JSONB NOT NULL,
    "contentHash" CHAR(64) NOT NULL,
    "sanitizerVersion" VARCHAR(50) NOT NULL DEFAULT 'DOMPurify-3.2',
    "authorId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "coverMediaId" UUID REFERENCES "MediaAsset"("id") ON DELETE RESTRICT,
    "model3DMediaId" UUID REFERENCES "MediaAsset"("id") ON DELETE RESTRICT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_procedure_revision_parent" FOREIGN KEY ("procedureId", "language")
        REFERENCES "ProcedureTranslation"("procedureId", "language") ON DELETE RESTRICT,
    CONSTRAINT "uq_procedure_revision_number" UNIQUE ("procedureId", "language", "revisionNumber"),
    CONSTRAINT "uq_procedure_revision_composite" UNIQUE ("procedureId", "language", "id")
);

CREATE INDEX "idx_procedure_revision_slug_lang" ON "ProcedureRevision" ("slug", "language");

-- Composite Foreign Key: Guarantees publishedRevisionId references the exact procedure and language
ALTER TABLE "ProcedureTranslation"
    ADD CONSTRAINT "fk_procedure_translation_published_revision"
    FOREIGN KEY ("procedureId", "language", "publishedRevisionId")
    REFERENCES "ProcedureRevision"("procedureId", "language", "id")
    ON DELETE RESTRICT;

CREATE TABLE "ProcedureApproval" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "revisionId" UUID NOT NULL REFERENCES "ProcedureRevision"("id") ON DELETE RESTRICT,
    "reviewerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "licenseNumber" VARCHAR(100) NOT NULL,
    "clinicalSpecialty" VARCHAR(150) NOT NULL,
    "decision" "ApprovalDecision" NOT NULL,
    "clinicalNotes" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_procedure_approval_reviewer" UNIQUE ("revisionId", "reviewerId")
);

CREATE INDEX "idx_procedure_approval_decision" ON "ProcedureApproval" ("decision", "isRevoked");

CREATE TABLE "ProcedureApprovalRevocation" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "approvalId" UUID NOT NULL REFERENCES "ProcedureApproval"("id") ON DELETE RESTRICT,
    "revokingDoctorId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "reason" TEXT NOT NULL,
    "revokedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "InteractiveStep" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "revisionId" UUID NOT NULL REFERENCES "ProcedureRevision"("id") ON DELETE CASCADE,
    "stepNumber" INT NOT NULL,
    "titleEn" VARCHAR(255) NOT NULL,
    "titleTa" VARCHAR(255) NOT NULL,
    "instructionEn" TEXT NOT NULL,
    "instructionTa" TEXT NOT NULL,
    "cameraPosition" JSONB,
    "cameraTarget" JSONB,
    "highlightNode" VARCHAR(100),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_step_revision_number" UNIQUE ("revisionId", "stepNumber")
);

-- ======================================================================
-- 5. TAXONOMY & EXPLORATION ENTITIES
-- ======================================================================

CREATE TABLE "ExploreCategory" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "titleEn" VARCHAR(150) NOT NULL,
    "titleTa" VARCHAR(150) NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionTa" TEXT NOT NULL,
    "iconName" VARCHAR(50) NOT NULL DEFAULT 'Compass',
    "displayOrder" INT NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_explore_cat_order" ON "ExploreCategory" ("isArchived", "displayOrder");

CREATE TABLE "ProcedureExploreCategory" (
    "procedureId" UUID NOT NULL REFERENCES "Procedure"("id") ON DELETE CASCADE,
    "exploreCategoryId" UUID NOT NULL REFERENCES "ExploreCategory"("id") ON DELETE CASCADE,
    "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pk_procedure_explore_category" PRIMARY KEY ("procedureId", "exploreCategoryId")
);

CREATE TABLE "Department" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "nameEn" VARCHAR(150) NOT NULL,
    "nameTa" VARCHAR(150) NOT NULL,
    "descriptionEn" TEXT,
    "descriptionTa" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_department_archived" ON "Department" ("isArchived");

CREATE TABLE "ProcedureDepartment" (
    "procedureId" UUID NOT NULL REFERENCES "Procedure"("id") ON DELETE CASCADE,
    "departmentId" UUID NOT NULL REFERENCES "Department"("id") ON DELETE RESTRICT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pk_procedure_department" PRIMARY KEY ("procedureId", "departmentId")
);

-- Partial Unique Index: Guarantees AT MOST ONE primary department per procedure
CREATE UNIQUE INDEX "idx_procedure_single_primary_dept"
    ON "ProcedureDepartment" ("procedureId")
    WHERE "isPrimary" = true;

-- Clinical Supporting Entities
CREATE TABLE "Condition" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "titleEn" VARCHAR(255) NOT NULL,
    "titleTa" VARCHAR(255) NOT NULL,
    "overviewEn" TEXT NOT NULL,
    "overviewTa" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ConditionProcedure" (
    "conditionId" UUID NOT NULL REFERENCES "Condition"("id") ON DELETE CASCADE,
    "procedureId" UUID NOT NULL REFERENCES "Procedure"("id") ON DELETE CASCADE,
    "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pk_condition_procedure" PRIMARY KEY ("conditionId", "procedureId")
);

CREATE TABLE "AnatomicalStructure" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "nameEn" VARCHAR(150) NOT NULL,
    "nameTa" VARCHAR(150) NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionTa" TEXT NOT NULL,
    "modelNodeName" VARCHAR(100),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PreventionGuide" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "titleEn" VARCHAR(255) NOT NULL,
    "titleTa" VARCHAR(255) NOT NULL,
    "contentHtmlEn" TEXT NOT NULL,
    "contentHtmlTa" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PreventionGuideProcedure" (
    "preventionGuideId" UUID NOT NULL REFERENCES "PreventionGuide"("id") ON DELETE CASCADE,
    "procedureId" UUID NOT NULL REFERENCES "Procedure"("id") ON DELETE CASCADE,
    "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pk_prevention_procedure" PRIMARY KEY ("preventionGuideId", "procedureId")
);

-- ======================================================================
-- 6. CACHE OUTBOX & AUDIT LOGGING
-- ======================================================================

CREATE TABLE "CacheRevalidationOutbox" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tag" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "language" "ContentLanguage" NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "leaseOwner" VARCHAR(64),
    "leaseExpiresAt" TIMESTAMPTZ,
    "fencingGeneration" BIGINT NOT NULL DEFAULT 0,
    "attemptCount" INT NOT NULL DEFAULT 0,
    "maxAttempts" INT NOT NULL DEFAULT 5,
    "lastError" TEXT,
    "completedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_outbox_status_lease" ON "CacheRevalidationOutbox" ("status", "leaseExpiresAt");
CREATE INDEX "idx_outbox_fencing" ON "CacheRevalidationOutbox" ("fencingGeneration");

CREATE TABLE "AdminAuditLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "action" VARCHAR(100) NOT NULL,
    "targetType" VARCHAR(50) NOT NULL,
    "targetId" UUID NOT NULL,
    "metadata" JSONB NOT NULL,
    "ipHash" VARCHAR(64),
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_audit_target" ON "AdminAuditLog" ("targetType", "targetId");
CREATE INDEX "idx_audit_created" ON "AdminAuditLog" ("createdAt");

-- ======================================================================
-- 7. DATABASE INTEGRITY FUNCTIONS & STRICT ENFORCEMENT TRIGGERS
-- ======================================================================

-- ----------------------------------------------------------------------
-- 7.1 Strict Immutability Enforcement Function
-- ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_append_only()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'DATABASE INTEGRITY VIOLATION: Records in table "%" are strictly immutable (append-only). UPDATE and DELETE operations are forbidden.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_procedure_revision_immutable"
    BEFORE UPDATE OR DELETE ON "ProcedureRevision"
    FOR EACH ROW EXECUTE FUNCTION enforce_append_only();

CREATE TRIGGER "trg_procedure_approval_immutable"
    BEFORE UPDATE OR DELETE ON "ProcedureApproval"
    FOR EACH ROW EXECUTE FUNCTION enforce_append_only();

CREATE TRIGGER "trg_procedure_approval_revocation_immutable"
    BEFORE UPDATE OR DELETE ON "ProcedureApprovalRevocation"
    FOR EACH ROW EXECUTE FUNCTION enforce_append_only();

-- ----------------------------------------------------------------------
-- 7.2 Prevent Author Self-Approval & Verify Reviewer Role/Active Status
-- ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_procedure_approval_governance()
RETURNS TRIGGER AS $$
DECLARE
    v_author_id UUID;
    v_reviewer_role "UserRole";
    v_reviewer_active BOOLEAN;
BEGIN
    -- 1. Fetch Author of Revision
    SELECT "authorId" INTO v_author_id
    FROM "ProcedureRevision"
    WHERE "id" = NEW."revisionId";

    -- 2. Reject Author Self-Approval
    IF v_author_id = NEW."reviewerId" THEN
        RAISE EXCEPTION 'CLINICAL GOVERNANCE VIOLATION: Clinical author (%) cannot approve their own content revision (%).', NEW."reviewerId", NEW."revisionId";
    END IF;

    -- 3. Verify Reviewer Role & Active Status
    SELECT "role", "isActive" INTO v_reviewer_role, v_reviewer_active
    FROM "User"
    WHERE "id" = NEW."reviewerId";

    IF v_reviewer_active IS NOT TRUE THEN
        RAISE EXCEPTION 'CLINICAL GOVERNANCE VIOLATION: Reviewer (%) is inactive/deactivated and cannot certify approvals.', NEW."reviewerId";
    END IF;

    IF v_reviewer_role NOT IN ('CLINICAL_REVIEWER', 'CHIEF_EDITOR', 'SYSTEM_ADMIN') THEN
        RAISE EXCEPTION 'CLINICAL GOVERNANCE VIOLATION: User (%) has role % and lacks certified reviewer privileges.', NEW."reviewerId", v_reviewer_role;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_check_procedure_approval_governance"
    BEFORE INSERT ON "ProcedureApproval"
    FOR EACH ROW EXECUTE FUNCTION check_procedure_approval_governance();

-- ----------------------------------------------------------------------
-- 7.3 Session Succession, Family Boundary & Recursive Cycle Prevention
-- ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_session_succession_integrity()
RETURNS TRIGGER AS $$
DECLARE
    v_pred_user UUID;
    v_pred_family UUID;
    v_family_status "FamilyStatus";
    v_curr_id UUID;
    v_hop_count INT := 0;
BEGIN
    -- 1. Verify Session Family is ACTIVE
    SELECT "status" INTO v_family_status
    FROM "SessionFamily"
    WHERE "id" = NEW."sessionFamilyId";

    IF v_family_status <> 'ACTIVE' THEN
        RAISE EXCEPTION 'SESSION SECURITY VIOLATION: Cannot create or update session in inactive/revoked family (%). Current status: %', NEW."sessionFamilyId", v_family_status;
    END IF;

    -- 2. Verify Predecessor Belongs to Same User and Same Family
    IF NEW."predecessorSessionId" IS NOT NULL THEN
        SELECT "userId", "sessionFamilyId" INTO v_pred_user, v_pred_family
        FROM "UserSession"
        WHERE "id" = NEW."predecessorSessionId";

        IF v_pred_user IS NULL THEN
            RAISE EXCEPTION 'SESSION SECURITY VIOLATION: Predecessor session (%) does not exist.', NEW."predecessorSessionId";
        END IF;

        IF v_pred_user <> NEW."userId" THEN
            RAISE EXCEPTION 'SESSION SECURITY VIOLATION: Cross-user session succession attempted. Predecessor belongs to user %, but successor belongs to user %.', v_pred_user, NEW."userId";
        END IF;

        IF v_pred_family <> NEW."sessionFamilyId" THEN
            RAISE EXCEPTION 'SESSION SECURITY VIOLATION: Cross-family session succession attempted. Predecessor family %, successor family %.', v_pred_family, NEW."sessionFamilyId";
        END IF;

        -- 3. Recursive Cycle Detection: Traverse predecessor chain up to 100 hops
        v_curr_id := NEW."predecessorSessionId";
        WHILE v_curr_id IS NOT NULL LOOP
            IF v_curr_id = NEW."id" THEN
                RAISE EXCEPTION 'SESSION SECURITY VIOLATION: Cyclic succession detected. Session % cannot be its own ancestor.', NEW."id";
            END IF;

            v_hop_count := v_hop_count + 1;
            IF v_hop_count > 100 THEN
                RAISE EXCEPTION 'SESSION SECURITY VIOLATION: Succession depth exceeded 100 hops or infinite cycle encountered.';
            END IF;

            SELECT "predecessorSessionId" INTO v_curr_id
            FROM "UserSession"
            WHERE "id" = v_curr_id;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_check_session_succession_integrity"
    BEFORE INSERT OR UPDATE ON "UserSession"
    FOR EACH ROW EXECUTE FUNCTION check_session_succession_integrity();

-- ----------------------------------------------------------------------
-- 7.4 Bidirectional Primary Department Invariant for Published Procedures
-- ----------------------------------------------------------------------
-- 7.4a Checked when ProcedureTranslation is inserted or updated
CREATE OR REPLACE FUNCTION check_publication_has_primary_dept()
RETURNS TRIGGER AS $$
DECLARE
    v_primary_count INT;
BEGIN
    IF NEW."currentStatus" = 'PUBLISHED' THEN
        IF NEW."publishedRevisionId" IS NULL THEN
            RAISE EXCEPTION 'PUBLICATION INVARIANT VIOLATION: Cannot publish Procedure (%) without setting a publishedRevisionId.', NEW."procedureId";
        END IF;

        SELECT COUNT(*) INTO v_primary_count
        FROM "ProcedureDepartment"
        WHERE "procedureId" = NEW."procedureId" AND "isPrimary" = true;

        IF v_primary_count <> 1 THEN
            RAISE EXCEPTION 'TAXONOMY INVARIANT VIOLATION: Procedure (%) must have exactly one primary department to be PUBLISHED. Current primary count: %.', NEW."procedureId", v_primary_count;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_check_publication_primary_dept"
    BEFORE INSERT OR UPDATE ON "ProcedureTranslation"
    FOR EACH ROW EXECUTE FUNCTION check_publication_has_primary_dept();

-- 7.4b Checked when ProcedureDepartment is inserted, modified, or deleted (checks both OLD and NEW procedures if transferred)
CREATE OR REPLACE FUNCTION check_published_procedure_cannot_lose_primary_dept()
RETURNS TRIGGER AS $$
DECLARE
    v_proc_id UUID;
    v_has_published BOOLEAN;
    v_primary_count INT;
BEGIN
    -- Check procedure from OLD record if available (DELETE or procedure transfer)
    IF TG_OP IN ('DELETE', 'UPDATE') AND OLD."procedureId" IS NOT NULL THEN
        v_proc_id := OLD."procedureId";
        SELECT EXISTS (
            SELECT 1 FROM "ProcedureTranslation"
            WHERE "procedureId" = v_proc_id AND "currentStatus" = 'PUBLISHED'
        ) INTO v_has_published;

        IF v_has_published THEN
            SELECT COUNT(*) INTO v_primary_count
            FROM "ProcedureDepartment"
            WHERE "procedureId" = v_proc_id AND "isPrimary" = true;

            IF v_primary_count <> 1 THEN
                RAISE EXCEPTION 'TAXONOMY INVARIANT VIOLATION: Operation leaves published Procedure (%) with % primary departments. Exactly one is required.', v_proc_id, v_primary_count;
            END IF;
        END IF;
    END IF;

    -- Check procedure from NEW record if available (INSERT or UPDATE)
    IF TG_OP IN ('INSERT', 'UPDATE') AND NEW."procedureId" IS NOT NULL AND (TG_OP = 'INSERT' OR NEW."procedureId" <> OLD."procedureId" OR NEW."isPrimary" <> OLD."isPrimary") THEN
        v_proc_id := NEW."procedureId";
        SELECT EXISTS (
            SELECT 1 FROM "ProcedureTranslation"
            WHERE "procedureId" = v_proc_id AND "currentStatus" = 'PUBLISHED'
        ) INTO v_has_published;

        IF v_has_published THEN
            SELECT COUNT(*) INTO v_primary_count
            FROM "ProcedureDepartment"
            WHERE "procedureId" = v_proc_id AND "isPrimary" = true;

            IF v_primary_count <> 1 THEN
                RAISE EXCEPTION 'TAXONOMY INVARIANT VIOLATION: Operation leaves published Procedure (%) with % primary departments. Exactly one is required.', v_proc_id, v_primary_count;
            END IF;
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "trg_check_published_procedure_dept_change"
    AFTER INSERT OR UPDATE OR DELETE ON "ProcedureDepartment"
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION check_published_procedure_cannot_lose_primary_dept();

-- ----------------------------------------------------------------------
-- 7.5 Outbox Monotonic Fencing Lease Acquisition & Atomic Completion Functions
-- ----------------------------------------------------------------------
-- 7.5a Atomic Lease Acquisition (Increments Fencing Generation)
CREATE OR REPLACE FUNCTION acquire_outbox_lease(
    p_worker_id VARCHAR(64),
    p_lease_duration_seconds INT DEFAULT 30,
    p_batch_size INT DEFAULT 10
)
RETURNS TABLE (
    "id" UUID,
    "tag" VARCHAR(100),
    "slug" VARCHAR(255),
    "language" "ContentLanguage",
    "payload" JSONB,
    "fencingGeneration" BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH available_records AS (
        SELECT o."id"
        FROM "CacheRevalidationOutbox" o
        WHERE o."status" = 'PENDING'
           OR (o."status" = 'PROCESSING' AND o."leaseExpiresAt" < CURRENT_TIMESTAMP)
           OR (o."status" = 'RETRY_SCHEDULED' AND o."leaseExpiresAt" <= CURRENT_TIMESTAMP)
        ORDER BY o."createdAt" ASC
        LIMIT p_batch_size
        FOR UPDATE SKIP LOCKED
    )
    UPDATE "CacheRevalidationOutbox" u
    SET
        "status" = 'PROCESSING',
        "leaseOwner" = p_worker_id,
        "leaseExpiresAt" = CURRENT_TIMESTAMP + (p_lease_duration_seconds || ' seconds')::INTERVAL,
        "fencingGeneration" = u."fencingGeneration" + 1,
        "attemptCount" = u."attemptCount" + 1,
        "updatedAt" = CURRENT_TIMESTAMP
    FROM available_records a
    WHERE u."id" = a."id"
    RETURNING u."id", u."tag", u."slug", u."language", u."payload", u."fencingGeneration";
END;
$$ LANGUAGE plpgsql;

-- 7.5b Atomic Conditional Completion (Enforces Exact Expected Fencing Generation & Active Lease)
CREATE OR REPLACE FUNCTION complete_outbox_job(
    p_job_id UUID,
    p_worker_id VARCHAR(64),
    p_expected_fencing_generation BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_rows_updated INT;
BEGIN
    UPDATE "CacheRevalidationOutbox"
    SET
        "status" = 'COMPLETED',
        "completedAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = p_job_id
      AND "status" = 'PROCESSING'
      AND "leaseOwner" = p_worker_id
      AND "fencingGeneration" = p_expected_fencing_generation
      AND "leaseExpiresAt" >= CURRENT_TIMESTAMP;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    IF v_rows_updated = 1 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

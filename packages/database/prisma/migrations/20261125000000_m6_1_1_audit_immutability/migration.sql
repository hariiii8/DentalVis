-- Enforce database-level immutability and anti-truncate protection on AdminAuditLog
-- Milestone M6.1.1

-- 1. Attach row-level immutability trigger using existing enforce_append_only() function
CREATE TRIGGER "trg_admin_audit_log_immutable"
BEFORE UPDATE OR DELETE ON "AdminAuditLog"
FOR EACH ROW
EXECUTE FUNCTION enforce_append_only();

-- 2. Define statement-level anti-truncate function
CREATE OR REPLACE FUNCTION enforce_no_truncate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'DATABASE INTEGRITY VIOLATION: Truncating table "%" is strictly forbidden.', TG_TABLE_NAME;
END;
$$;

-- 3. Attach statement-level anti-truncate trigger to AdminAuditLog
CREATE TRIGGER "trg_admin_audit_log_truncate"
BEFORE TRUNCATE ON "AdminAuditLog"
FOR EACH STATEMENT
EXECUTE FUNCTION enforce_no_truncate();

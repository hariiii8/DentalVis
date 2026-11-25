// packages/database/src/repository/errors.ts
// DentalVis 2.0 — Database Repository Sanitized Error Classes
// Architecture Baseline v1.9.1 — Phase B3.2: Database Repository Implementation

/**
 * Base sanitized error thrown by the DatabaseProcedureRepository.
 * Strips raw SQL queries, credentials, connection strings, and internal Prisma engine traces.
 */
export class DatabaseRepositoryError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'DATABASE_REPOSITORY_ERROR') {
    super(message);
    this.name = 'DatabaseRepositoryError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a database connection failure, query crash, or operational timeout occurs.
 */
export class DatabaseConnectionError extends DatabaseRepositoryError {
  constructor(message = 'The database service is temporarily unavailable.') {
    super(message, 'DATABASE_CONNECTION_ERROR');
    this.name = 'DatabaseConnectionError';
  }
}

/**
 * Thrown when database relational records or JSONB snapshot data cannot be mapped
 * into a valid ProcedureDetail DTO (e.g. data corruption or schema violation).
 */
export class DatabaseDataIntegrityError extends DatabaseRepositoryError {
  constructor(message = 'Database content failed clinical structural integrity verification.') {
    super(message, 'DATABASE_DATA_INTEGRITY_ERROR');
    this.name = 'DatabaseDataIntegrityError';
  }
}

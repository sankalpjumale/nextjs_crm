// payload passed signature verification but doesn't match what we expect. Permanent: route returns 422. 
export class InvalidEventPayloadError extends Error {
  constructor(
    public readonly eventType: string,
    public readonly issues: string[],
  ) {
    super(`Invalid ${eventType} payload: ${issues.join("; ")}`);
    this.name = "InvalidEventPayloadError";
  }
}

// the database call failed. Possibly transient: route returns 500 so Clerk retries. 
export class ClerkSyncDatabaseError extends Error {
  constructor(operation: string, cause: { message: string; code?: string }) {
    super(`${operation} failed: ${cause.message}${cause.code ? ` (${cause.code})` : ""}`);
    this.name = "ClerkSyncDatabaseError";
  }
}
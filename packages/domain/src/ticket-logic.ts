import { ProtectionItem, ProtectionType } from "./domain";

const ALL_PROTECTION_TYPES: ProtectionType[] = ["LIFE", "ACCIDENT", "HEALTH", "CRITICAL_ILLNESS", "DISABILITY"];

/**
 * Formats a sequence number into a human-readable ticket reference,
 * e.g. formatTicketNumber(123, 2026) -> "PP-2026-000123".
 */
export function formatTicketNumber(sequence: number, year: number = new Date().getFullYear()): string {
  if (!Number.isInteger(sequence) || sequence <= 0) {
    throw new Error("sequence must be a positive integer");
  }
  return `PP-${year}-${String(sequence).padStart(6, "0")}`;
}

const NO_FINDING_STATES = new Set(["UNKNOWN", "NOT_DETECTED"]);

/**
 * A discovery run never claims completeness. A protection type counts as
 * "covered" only if at least one matched item carries some actual finding
 * (VERIFIED, USER_CONFIRMED or NEEDS_VERIFICATION) — an UNKNOWN or
 * NOT_DETECTED item means nothing conclusive was found, so that type is
 * still "missing" and should prompt a ticket, per the PRD's non-negotiable:
 * weak/absent signals are never presented as coverage.
 */
export function missingProtectionTypes(matched: ProtectionItem[]): ProtectionType[] {
  const covered = new Set(
    matched.filter((item) => !NO_FINDING_STATES.has(item.verification.state)).map((item) => item.type)
  );
  return ALL_PROTECTION_TYPES.filter((type) => !covered.has(type));
}

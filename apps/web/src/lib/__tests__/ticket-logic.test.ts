import { describe, expect, it } from "vitest";
import { ProtectionItem } from "@protection-passport/domain";
import { formatTicketNumber, missingProtectionTypes } from "@protection-passport/domain";

function makeItem(overrides: Partial<ProtectionItem>): ProtectionItem {
  return {
    id: "prot_test",
    personId: "p_test",
    type: "LIFE",
    sourceType: "INDIVIDUAL_POLICY",
    productName: "Test Policy",
    provider: "Test Insurer",
    coverage: { amountInr: 100000, conditions: [] },
    evidence: [],
    verification: { state: "VERIFIED", reason: "test", verifier: "SYSTEM", timestamp: "2025-01-01T00:00:00Z" },
    lastVerifiedAt: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("formatTicketNumber", () => {
  it("pads the sequence to 6 digits and includes the year", () => {
    expect(formatTicketNumber(1, 2026)).toBe("PP-2026-000001");
    expect(formatTicketNumber(123, 2026)).toBe("PP-2026-000123");
    expect(formatTicketNumber(999999, 2026)).toBe("PP-2026-999999");
  });

  it("rejects non-positive or non-integer sequences", () => {
    expect(() => formatTicketNumber(0)).toThrow();
    expect(() => formatTicketNumber(-5)).toThrow();
    expect(() => formatTicketNumber(1.5)).toThrow();
  });
});

describe("missingProtectionTypes", () => {
  it("flags every type with no matched item at all", () => {
    const matched = [makeItem({ type: "LIFE" })];
    const missing = missingProtectionTypes(matched);
    expect(missing).toEqual(expect.arrayContaining(["ACCIDENT", "HEALTH", "CRITICAL_ILLNESS", "DISABILITY"]));
    expect(missing).not.toContain("LIFE");
  });

  it("still flags a type whose only matched item is UNKNOWN or NOT_DETECTED — no real finding means raise a ticket", () => {
    const matched = [
      makeItem({ type: "ACCIDENT", verification: { state: "UNKNOWN", reason: "", verifier: "SYSTEM", timestamp: "" } }),
      makeItem({ type: "HEALTH", verification: { state: "NOT_DETECTED", reason: "", verifier: "SYSTEM", timestamp: "" } }),
    ];
    const missing = missingProtectionTypes(matched);
    expect(missing).toContain("ACCIDENT");
    expect(missing).toContain("HEALTH");
  });

  it("does not flag a type backed by NEEDS_VERIFICATION, USER_CONFIRMED or VERIFIED evidence", () => {
    const matched = [
      makeItem({ type: "LIFE", verification: { state: "VERIFIED", reason: "", verifier: "SYSTEM", timestamp: "" } }),
      makeItem({ type: "HEALTH", verification: { state: "USER_CONFIRMED", reason: "", verifier: "USER", timestamp: "" } }),
      makeItem({ type: "ACCIDENT", verification: { state: "NEEDS_VERIFICATION", reason: "", verifier: "SYSTEM", timestamp: "" } }),
    ];
    const missing = missingProtectionTypes(matched);
    expect(missing).not.toContain("LIFE");
    expect(missing).not.toContain("HEALTH");
    expect(missing).not.toContain("ACCIDENT");
    expect(missing).toEqual(expect.arrayContaining(["CRITICAL_ILLNESS", "DISABILITY"]));
  });

  it("flags everything when nothing is matched", () => {
    expect(missingProtectionTypes([])).toHaveLength(5);
  });
});

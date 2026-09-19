import { describe, expect, it } from "vitest";
import { ProtectionItem } from "@/lib/domain";
import {
  attentionNeededItems,
  emergencyReadiness,
  isConfirmed,
  needsAttention,
  totalConfirmedCoverageInr,
} from "@/lib/protection-logic";

function makeItem(overrides: Partial<ProtectionItem>): ProtectionItem {
  return {
    id: "prot_test",
    personId: "p_self",
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

describe("needsAttention / isConfirmed", () => {
  it("flags NEEDS_VERIFICATION and UNKNOWN as needing attention", () => {
    expect(needsAttention(makeItem({ verification: { state: "NEEDS_VERIFICATION", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(true);
    expect(needsAttention(makeItem({ verification: { state: "UNKNOWN", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(true);
  });

  it("does not flag VERIFIED, USER_CONFIRMED or NOT_DETECTED as needing attention", () => {
    expect(needsAttention(makeItem({ verification: { state: "VERIFIED", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(false);
    expect(needsAttention(makeItem({ verification: { state: "NOT_DETECTED", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(false);
  });

  it("treats VERIFIED and USER_CONFIRMED as confirmed, weak signals as not confirmed", () => {
    expect(isConfirmed(makeItem({ verification: { state: "VERIFIED", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(true);
    expect(isConfirmed(makeItem({ verification: { state: "USER_CONFIRMED", reason: "", verifier: "USER", timestamp: "" } }))).toBe(true);
    expect(isConfirmed(makeItem({ verification: { state: "NEEDS_VERIFICATION", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(false);
    expect(isConfirmed(makeItem({ verification: { state: "NOT_DETECTED", reason: "", verifier: "SYSTEM", timestamp: "" } }))).toBe(false);
  });
});

describe("totalConfirmedCoverageInr", () => {
  it("only sums confirmed items, never weak-signal items (NON-NEGOTIABLE per PRD section 6)", () => {
    const items = [
      makeItem({ id: "a", coverage: { amountInr: 500000, conditions: [] }, verification: { state: "VERIFIED", reason: "", verifier: "SYSTEM", timestamp: "" } }),
      makeItem({ id: "b", coverage: { amountInr: 10000000, conditions: [] }, verification: { state: "NEEDS_VERIFICATION", reason: "", verifier: "SYSTEM", timestamp: "" } }),
      makeItem({ id: "c", coverage: { amountInr: 200000, conditions: [] }, verification: { state: "USER_CONFIRMED", reason: "", verifier: "USER", timestamp: "" } }),
    ];
    expect(totalConfirmedCoverageInr(items)).toBe(700000);
  });

  it("filters by type when provided", () => {
    const items = [
      makeItem({ id: "a", type: "LIFE", coverage: { amountInr: 500000, conditions: [] } }),
      makeItem({ id: "b", type: "HEALTH", coverage: { amountInr: 300000, conditions: [] } }),
    ];
    expect(totalConfirmedCoverageInr(items, "LIFE")).toBe(500000);
  });
});

describe("attentionNeededItems", () => {
  it("returns only items needing attention", () => {
    const items = [
      makeItem({ id: "a", verification: { state: "VERIFIED", reason: "", verifier: "SYSTEM", timestamp: "" } }),
      makeItem({ id: "b", verification: { state: "NEEDS_VERIFICATION", reason: "", verifier: "SYSTEM", timestamp: "" } }),
    ];
    const result = attentionNeededItems(items);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });
});

describe("emergencyReadiness", () => {
  it("is zero with no confirmed items — a policy list alone is not readiness (PRD 2.2)", () => {
    const items = [makeItem({ verification: { state: "NEEDS_VERIFICATION", reason: "", verifier: "SYSTEM", timestamp: "" } })];
    expect(emergencyReadiness(items).score).toBe(0);
  });

  it("scores 100 when every confirmed item has a nominee and claim route", () => {
    const items = [
      makeItem({
        nominee: { personName: "Spouse", relationship: "Spouse", evidenceState: "VERIFIED" },
        claimRoute: { provider: "Insurer", contact: "1800", requiredDocuments: [] },
      }),
    ];
    const readiness = emergencyReadiness(items);
    expect(readiness.score).toBe(100);
    expect(readiness.hasNominee).toBe(true);
    expect(readiness.hasClaimRoute).toBe(true);
  });

  it("scores partially when only some confirmed items have nominee/claim route", () => {
    const items = [
      makeItem({
        id: "a",
        nominee: { personName: "Spouse", relationship: "Spouse", evidenceState: "VERIFIED" },
        claimRoute: { provider: "Insurer", contact: "1800", requiredDocuments: [] },
      }),
      makeItem({ id: "b" }),
    ];
    const readiness = emergencyReadiness(items);
    expect(readiness.score).toBe(50);
  });
});

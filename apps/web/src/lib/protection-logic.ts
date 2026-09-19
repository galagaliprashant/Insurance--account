import { ProtectionItem, ProtectionType, VerificationState } from "./domain";

/**
 * Pure evidence/verification helpers. Deterministic rules only —
 * per PRD section 6, structured rules control final coverage status,
 * not the LLM.
 */

const ATTENTION_STATES: VerificationState[] = ["NEEDS_VERIFICATION", "UNKNOWN"];

export function needsAttention(item: ProtectionItem): boolean {
  return ATTENTION_STATES.includes(item.verification.state);
}

export function isConfirmed(item: ProtectionItem): boolean {
  return item.verification.state === "VERIFIED" || item.verification.state === "USER_CONFIRMED";
}

export function totalConfirmedCoverageInr(items: ProtectionItem[], type?: ProtectionType): number {
  return items
    .filter((item) => (type ? item.type === type : true))
    .filter(isConfirmed)
    .reduce((sum, item) => sum + item.coverage.amountInr, 0);
}

export function attentionNeededItems(items: ProtectionItem[]): ProtectionItem[] {
  return items.filter(needsAttention);
}

export function recentlyVerifiedItems(items: ProtectionItem[], withinDays = 90): ProtectionItem[] {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return items
    .filter(isConfirmed)
    .filter((item) => new Date(item.lastVerifiedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime());
}

export interface EmergencyReadiness {
  score: number;
  hasNominee: boolean;
  hasClaimRoute: boolean;
  confirmedItemCount: number;
}

/**
 * "A policy list does not equal emergency readiness" (PRD 2.2).
 * Readiness requires confirmed coverage AND a resolvable nominee/claim route.
 */
export function emergencyReadiness(items: ProtectionItem[]): EmergencyReadiness {
  const confirmed = items.filter(isConfirmed);
  const withNominee = confirmed.filter((item) => item.nominee && item.nominee.evidenceState !== "NOT_DETECTED");
  const withClaimRoute = confirmed.filter((item) => Boolean(item.claimRoute));

  const hasNominee = withNominee.length > 0;
  const hasClaimRoute = withClaimRoute.length > 0;
  const confirmedItemCount = confirmed.length;

  if (confirmedItemCount === 0) {
    return { score: 0, hasNominee, hasClaimRoute, confirmedItemCount };
  }

  const nomineeRatio = withNominee.length / confirmedItemCount;
  const claimRouteRatio = withClaimRoute.length / confirmedItemCount;
  const score = Math.round(((nomineeRatio + claimRouteRatio) / 2) * 100);

  return { score, hasNominee, hasClaimRoute, confirmedItemCount };
}

export function byType(items: ProtectionItem[]): Record<ProtectionType, ProtectionItem[]> {
  const grouped: Record<string, ProtectionItem[]> = {};
  for (const item of items) {
    grouped[item.type] = grouped[item.type] ?? [];
    grouped[item.type].push(item);
  }
  return grouped as Record<ProtectionType, ProtectionItem[]>;
}

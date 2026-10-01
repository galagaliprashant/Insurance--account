import { demoHousehold, demoProtectionItems } from "@/data/demo-data";
import { ProtectionItem } from "@protection-passport/domain";

/**
 * Matches a deceased person's entered name against the demo household —
 * this stands in for the real "household resolution" step a production
 * build would do against verified records/AA-linked accounts. Matching by
 * name only (no live KYC of the deceased — see architecture notes: a
 * dead person cannot receive an OTP).
 */
export function matchDeceasedProtections(deceasedName: string): ProtectionItem[] {
  const normalized = deceasedName.trim().toLowerCase();
  const person = demoHousehold.members.find((m) => m.name.toLowerCase() === normalized);
  if (!person) return [];
  return demoProtectionItems.filter((item) => item.personId === person.id);
}

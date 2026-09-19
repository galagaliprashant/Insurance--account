import { NextResponse } from "next/server";
import { demoHousehold, demoProtectionItems } from "@/data/demo-data";
import { attentionNeededItems, emergencyReadiness, recentlyVerifiedItems, totalConfirmedCoverageInr } from "@/lib/protection-logic";

/** GET /api/dashboard — Protection summary (PRD 8.1) */
export function GET() {
  return NextResponse.json({
    household: demoHousehold,
    totalConfirmedCoverageInr: totalConfirmedCoverageInr(demoProtectionItems),
    attentionNeeded: attentionNeededItems(demoProtectionItems),
    recentlyVerified: recentlyVerifiedItems(demoProtectionItems),
    emergencyReadiness: emergencyReadiness(demoProtectionItems),
  });
}

import { NextResponse } from "next/server";
import { demoEmergencyGrants, demoProtectionItems } from "@/data/demo-data";
import { isConfirmed, needsAttention } from "@/lib/protection-logic";

/** GET /api/emergency — Emergency summary (PRD 8.1) */
export function GET() {
  const grant = demoEmergencyGrants[0];
  const authorizedItems = demoProtectionItems.filter((item) => grant.scope.includes(item.type));
  return NextResponse.json({
    grant,
    verified: authorizedItems.filter(isConfirmed),
    potentiallyClaimable: authorizedItems.filter(needsAttention),
  });
}

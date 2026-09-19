import { NextRequest, NextResponse } from "next/server";
import { demoProtectionItems } from "@/data/demo-data";

/** GET /api/protections — Protection inventory (PRD 8.1) */
export function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const source = request.nextUrl.searchParams.get("source");
  const items = demoProtectionItems.filter(
    (item) => (!type || item.type === type) && (!source || item.sourceType === source)
  );
  return NextResponse.json({ items });
}

/** POST /api/protections — Manual entry (PRD 8.1). Demo: validates and echoes back, does not persist. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.productName !== "string" || typeof body.type !== "string") {
    return NextResponse.json({ error: "productName and type are required" }, { status: 400 });
  }
  return NextResponse.json(
    {
      id: `prot_manual_${Date.now()}`,
      ...body,
      verification: { state: "USER_CONFIRMED", reason: "Manually entered by user.", verifier: "USER", timestamp: new Date().toISOString() },
      evidence: [],
    },
    { status: 201 }
  );
}

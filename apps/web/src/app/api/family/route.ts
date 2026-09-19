import { NextRequest, NextResponse } from "next/server";
import { demoHousehold } from "@/data/demo-data";

/** GET /api/family — Household (PRD 8.1) */
export function GET() {
  return NextResponse.json(demoHousehold);
}

/** POST /api/family — Add member (PRD 8.1). Demo: validates and echoes back, does not persist. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.relationship !== "string") {
    return NextResponse.json({ error: "name and relationship are required" }, { status: 400 });
  }
  return NextResponse.json({ id: `p_${Date.now()}`, ...body }, { status: 201 });
}

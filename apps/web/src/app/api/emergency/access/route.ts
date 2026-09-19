import { NextRequest, NextResponse } from "next/server";

/** POST /api/emergency/access — Authorize access (PRD 8.1). Demo: validates and echoes back, does not persist. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.authorizedPersonId !== "string" || !Array.isArray(body.scope)) {
    return NextResponse.json({ error: "authorizedPersonId and scope are required" }, { status: 400 });
  }
  return NextResponse.json(
    {
      id: `grant_${Date.now()}`,
      ...body,
      grantedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}

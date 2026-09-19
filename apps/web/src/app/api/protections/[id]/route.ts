import { NextResponse } from "next/server";
import { getProtectionById } from "@/data/demo-data";

/** GET /api/protections/{id} — Detail/evidence (PRD 8.1) */
export function GET(_request: Request, { params }: { params: { id: string } }) {
  const item = getProtectionById(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

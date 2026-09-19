import { NextResponse } from "next/server";
import { demoProtectionItems } from "@/data/demo-data";

/** GET /api/evidence/{id} — Evidence record (PRD 8.1) */
export function GET(_request: Request, { params }: { params: { id: string } }) {
  for (const item of demoProtectionItems) {
    const evidence = item.evidence.find((ev) => ev.id === params.id);
    if (evidence) return NextResponse.json(evidence);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

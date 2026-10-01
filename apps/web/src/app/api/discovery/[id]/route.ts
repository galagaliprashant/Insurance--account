import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { demoProtectionItems } from "@/data/demo-data";

export const runtime = "nodejs";

/** GET /api/discovery/{id} — status, matched items, missing types (drives the ticket prompt). */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const run = await prisma.discoveryRun.findUnique({ where: { id: params.id }, include: { case: true } });
  if (!run || run.case.userId !== session.sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const matchedIds: string[] = JSON.parse(run.matchedProtectionIdsJson);
  const missingTypes: string[] = JSON.parse(run.missingTypesJson);
  const matched = demoProtectionItems.filter((item) => matchedIds.includes(item.id));

  return NextResponse.json({
    caseId: run.caseId,
    status: run.status,
    matched,
    missingTypes,
  });
}

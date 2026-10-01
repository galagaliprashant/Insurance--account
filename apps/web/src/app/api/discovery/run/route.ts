import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { getOwnedCase } from "@/lib/case-access";
import { matchDeceasedProtections } from "@/lib/discovery";
import { missingProtectionTypes } from "@protection-passport/domain";

export const runtime = "nodejs";

const RunSchema = z.object({ caseId: z.string().min(1) });

/**
 * POST /api/discovery/run — caseId → matches the deceased person against
 * the demo protection dataset (no real bank/AA call — see architecture
 * notes). Requires KYC to be complete, since discovery is gated on
 * claimant identity, not the deceased's.
 */
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = RunSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "caseId is required" }, { status: 400 });

  const matchedCase = await getOwnedCase(session, parsed.data.caseId);
  if (!matchedCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const kyc = await prisma.kycRecord.findUnique({ where: { caseId: matchedCase.id } });
  if (!kyc || kyc.aadhaarState !== "VERIFIED" || kyc.panState !== "VERIFIED") {
    return NextResponse.json({ error: "Complete Aadhaar and PAN verification before running discovery" }, { status: 409 });
  }

  const matched = matchDeceasedProtections(matchedCase.deceasedName);
  const missingTypes = missingProtectionTypes(matched);

  const run = await prisma.discoveryRun.create({
    data: {
      caseId: matchedCase.id,
      status: "COMPLETE",
      matchedProtectionIdsJson: JSON.stringify(matched.map((item) => item.id)),
      missingTypesJson: JSON.stringify(missingTypes),
      completedAt: new Date(),
    },
  });
  await prisma.case.update({ where: { id: matchedCase.id }, data: { status: "DISCOVERY_COMPLETE" } });

  return NextResponse.json({ discoveryId: run.id, status: run.status });
}

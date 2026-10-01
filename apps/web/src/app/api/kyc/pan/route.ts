import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { getOwnedCase } from "@/lib/case-access";
import { isValidPanFormat, maskPan } from "@/lib/kyc";

export const runtime = "nodejs";

const PanSchema = z.object({
  caseId: z.string().min(1),
  panNumber: z.string().min(1),
});

/** POST /api/kyc/pan — caseId, panNumber → format-validated and marked verified (demo mode). Requires Aadhaar to already be verified. */
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = PanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "caseId and panNumber are required" }, { status: 400 });
  }

  const matchedCase = await getOwnedCase(session, parsed.data.caseId);
  if (!matchedCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const record = await prisma.kycRecord.findUnique({ where: { caseId: matchedCase.id } });
  if (!record || record.aadhaarState !== "VERIFIED") {
    return NextResponse.json({ error: "Verify Aadhaar before submitting PAN" }, { status: 409 });
  }

  if (!isValidPanFormat(parsed.data.panNumber)) {
    await prisma.kycRecord.update({ where: { caseId: matchedCase.id }, data: { panState: "FAILED" } });
    return NextResponse.json({ error: "Enter a valid PAN (format: ABCDE1234F)" }, { status: 400 });
  }

  const updated = await prisma.kycRecord.update({
    where: { caseId: matchedCase.id },
    data: { panNumberMasked: maskPan(parsed.data.panNumber), panState: "VERIFIED" },
  });
  await prisma.case.update({ where: { id: matchedCase.id }, data: { status: "KYC_VERIFIED" } });

  return NextResponse.json({ panVerified: true, maskedPan: updated.panNumberMasked });
}

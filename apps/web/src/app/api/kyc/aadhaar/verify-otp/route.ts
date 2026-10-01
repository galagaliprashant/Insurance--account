import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { getOwnedCase } from "@/lib/case-access";

export const runtime = "nodejs";

const VerifyOtpSchema = z.object({
  caseId: z.string().min(1),
  otp: z.string().length(6),
});

/** POST /api/kyc/aadhaar/verify-otp — caseId, otp → marks the claimant's Aadhaar step verified. */
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = VerifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "caseId and a 6-digit otp are required" }, { status: 400 });
  }

  const matchedCase = await getOwnedCase(session, parsed.data.caseId);
  if (!matchedCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const record = await prisma.kycRecord.findUnique({ where: { caseId: matchedCase.id } });
  if (!record || record.aadhaarState !== "OTP_SENT") {
    return NextResponse.json({ error: "Request an OTP before verifying it" }, { status: 409 });
  }

  if (record.demoOtpCode !== parsed.data.otp) {
    await prisma.kycRecord.update({ where: { caseId: matchedCase.id }, data: { aadhaarState: "FAILED" } });
    return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
  }

  const updated = await prisma.kycRecord.update({
    where: { caseId: matchedCase.id },
    data: { aadhaarState: "VERIFIED", otpVerifiedAt: new Date(), demoOtpCode: null },
  });

  return NextResponse.json({ aadhaarVerified: true, verifiedAt: updated.otpVerifiedAt });
}

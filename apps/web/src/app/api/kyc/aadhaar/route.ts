import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { getOwnedCase } from "@/lib/case-access";
import { generateDemoOtp, isValidAadhaarFormat, maskAadhaar } from "@/lib/kyc";

export const runtime = "nodejs";

const AadhaarSchema = z.object({
  caseId: z.string().min(1),
  aadhaarNumber: z.string().min(1),
});

/**
 * POST /api/kyc/aadhaar — verifies the CLAIMANT's own Aadhaar (format only,
 * demo mode — see lib/kyc.ts), then issues a demo OTP. This step proves who
 * the claimant is; it is never run against the deceased person, who cannot
 * receive an OTP.
 */
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = AadhaarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "caseId and aadhaarNumber are required" }, { status: 400 });
  }

  const matchedCase = await getOwnedCase(session, parsed.data.caseId);
  if (!matchedCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  if (!isValidAadhaarFormat(parsed.data.aadhaarNumber)) {
    return NextResponse.json({ error: "Enter a valid 12-digit Aadhaar number" }, { status: 400 });
  }

  const demoOtp = generateDemoOtp();
  const record = await prisma.kycRecord.upsert({
    where: { caseId: matchedCase.id },
    create: {
      caseId: matchedCase.id,
      aadhaarMasked: maskAadhaar(parsed.data.aadhaarNumber),
      aadhaarState: "OTP_SENT",
      demoOtpCode: demoOtp,
      otpSentAt: new Date(),
    },
    update: {
      aadhaarMasked: maskAadhaar(parsed.data.aadhaarNumber),
      aadhaarState: "OTP_SENT",
      demoOtpCode: demoOtp,
      otpSentAt: new Date(),
      otpVerifiedAt: null,
    },
  });

  await prisma.case.update({ where: { id: matchedCase.id }, data: { status: "KYC_PENDING" } });

  return NextResponse.json({
    kycId: record.id,
    otpSent: true,
    maskedAadhaar: record.aadhaarMasked,
    // DEMO MODE: no SMS gateway is wired up, so the OTP is returned directly
    // instead of being delivered to a phone. Never do this in production.
    demoOtp,
  });
}

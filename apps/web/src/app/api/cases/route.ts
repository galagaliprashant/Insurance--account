import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";

const CaseSchema = z.object({
  deceasedName: z.string().min(1).max(120),
  deceasedDob: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date of birth"),
  dateOfDemise: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date of demise"),
  relationshipToClaimant: z.enum(["SPOUSE", "CHILD", "PARENT", "SIBLING", "OTHER"]),
});

/** POST /api/cases — deceased person details → caseId. Starts a claim-assist case for the signed-in claimant. */
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = CaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  if (new Date(parsed.data.dateOfDemise) < new Date(parsed.data.deceasedDob)) {
    return NextResponse.json({ error: "Date of demise cannot be before date of birth" }, { status: 400 });
  }

  const newCase = await prisma.case.create({
    data: {
      userId: session.sub,
      deceasedName: parsed.data.deceasedName,
      deceasedDob: new Date(parsed.data.deceasedDob),
      dateOfDemise: new Date(parsed.data.dateOfDemise),
      relationshipToClaimant: parsed.data.relationshipToClaimant,
    },
  });

  return NextResponse.json({ caseId: newCase.id, status: newCase.status }, { status: 201 });
}

/** GET /api/cases — list the signed-in claimant's cases. */
export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cases = await prisma.case.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ cases });
}

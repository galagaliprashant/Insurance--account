import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { getOwnedCase } from "@/lib/case-access";
import { nextTicketNumber } from "@/lib/ticket-number";

export const runtime = "nodejs";

const TicketSchema = z.object({
  caseId: z.string().min(1),
  missingItemType: z.enum(["LIFE", "ACCIDENT", "HEALTH", "CRITICAL_ILLNESS", "DISABILITY", "OTHER"]),
  description: z.string().min(1).max(2000),
});

/** POST /api/tickets — caseId, missingItemType, notes → ticketId, ticketNumber. Raised when discovery can't confirm a protection type. */
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = TicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const matchedCase = await getOwnedCase(session, parsed.data.caseId);
  if (!matchedCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const ticketNumber = await nextTicketNumber();
  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber,
      caseId: matchedCase.id,
      missingItemType: parsed.data.missingItemType,
      description: parsed.data.description,
    },
  });

  return NextResponse.json({ ticketId: ticket.id, ticketNumber: ticket.ticketNumber, status: ticket.status }, { status: 201 });
}

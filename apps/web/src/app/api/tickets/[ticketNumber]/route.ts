import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";

/** GET /api/tickets/{ticketNumber} — status + history, for later reference lookup. */
export async function GET(request: NextRequest, { params }: { params: { ticketNumber: string } }) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ticket = await prisma.ticket.findUnique({
    where: { ticketNumber: params.ticketNumber },
    include: { case: true },
  });
  if (!ticket || ticket.case.userId !== session.sub) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({
    ticketNumber: ticket.ticketNumber,
    status: ticket.status,
    missingItemType: ticket.missingItemType,
    description: ticket.description,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  });
}

import { prisma } from "./prisma";
import { formatTicketNumber } from "@protection-passport/domain";

/** Atomic per-year sequence, backed by Postgres upsert, so numbering is stable across serverless invocations. */
export async function nextTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const row = await prisma.ticketSequence.upsert({
    where: { year },
    create: { year, lastSeq: 1 },
    update: { lastSeq: { increment: 1 } },
  });
  return formatTicketNumber(row.lastSeq, year);
}

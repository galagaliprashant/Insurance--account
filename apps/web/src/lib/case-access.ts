import { prisma } from "./prisma";
import { SessionClaims } from "./auth";

/** Loads a case only if it belongs to the signed-in claimant — prevents one user from touching another's case by guessing an id. */
export async function getOwnedCase(session: SessionClaims, caseId: string) {
  const found = await prisma.case.findUnique({ where: { id: caseId } });
  if (!found || found.userId !== session.sub) return null;
  return found;
}

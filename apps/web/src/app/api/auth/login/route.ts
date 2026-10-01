import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signSession, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

const LoginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  password: z.string().min(1),
});

/** POST /api/auth/login — phone, password → JWT */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid phone or password" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
  }

  const token = await signSession({ sub: user.id, phone: user.phone });
  return NextResponse.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
}

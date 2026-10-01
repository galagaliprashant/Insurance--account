import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession } from "@/lib/auth";

export const runtime = "nodejs";

const SignupSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  email: z.string().email().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** POST /api/auth/signup — name, phone, email, password → user + JWT */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
  if (existing) {
    return NextResponse.json({ error: "An account with this phone number already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      passwordHash,
    },
  });

  const token = await signSession({ sub: user.id, phone: user.phone });
  return NextResponse.json(
    { token, user: { id: user.id, name: user.name, phone: user.phone } },
    { status: 201 }
  );
}

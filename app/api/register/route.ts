import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { toDbLocale } from "@/lib/i18n/db-locale";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  // The site language at sign-up, for future emails; older clients don't send it.
  locale: z.enum(routing.locales).optional(),
});

export async function POST(req: NextRequest) {
  const prisma = getPrisma();
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your name, email, and password.", code: "invalid_registration" }, { status: 400 });
  }

  const { name, email, password, locale } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists.", code: "email_taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        locale: toDbLocale(locale ?? "en"),
        subscription: {
          create: { plan: "FREE", status: "ACTIVE" },
        },
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists.", code: "email_taken" }, { status: 409 });
    }
    throw err;
  }
}

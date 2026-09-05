import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
const schema = z.object({
  firstName: z.string().min(1).max(50),
  ageBand: z.enum(["3-4", "5-6", "7-8"]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a name and age range." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const child = await prisma.childProfile.create({
    data: {
      parentId: user.id,
      firstName: parsed.data.firstName,
      ageBand: parsed.data.ageBand,
    },
  });

  return NextResponse.json({ id: child.id }, { status: 201 });
}

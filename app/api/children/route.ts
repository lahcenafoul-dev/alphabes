import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

const schema = z.object({
  firstName: z.string().min(1).max(50),
  ageBand: z.enum(["3-4", "5-6", "7-8"]),
  // Language of the child's activities; older clients don't send it.
  language: z.enum(["EN", "FR", "ES"]).optional(),
});

export async function POST(req: NextRequest) {
  const prisma = getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first.", code: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a name and age range.", code: "invalid_child" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Account not found.", code: "account_not_found" }, { status: 404 });
  }

  const child = await prisma.childProfile.create({
    data: {
      parentId: user.id,
      firstName: parsed.data.firstName,
      ageBand: parsed.data.ageBand,
      language: parsed.data.language ?? "EN",
    },
  });

  return NextResponse.json({ id: child.id }, { status: 201 });
}

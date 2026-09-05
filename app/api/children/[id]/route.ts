import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  ageBand: z.enum(["3-4", "5-6", "7-8"]).optional(),
});

async function getOwnedChild(childId: string, email: string) {
  const child = await prisma.childProfile.findUnique({
    where: { id: childId },
    include: { parent: true },
  });
  if (!child || child.parent.email !== email) return null;
  return child;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const child = await prisma.childProfile.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      progress: { include: { lesson: true, game: true, activity: true } },
      storyProgress: { include: { story: true } },
    },
  });

  if (!child || child.parent.email !== session.user.email) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ child });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const owned = await getOwnedChild(params.id, session.user.email);
  if (!owned) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }

  const updated = await prisma.childProfile.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ child: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const owned = await getOwnedChild(params.id, session.user.email);
  if (!owned) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  await prisma.progress.deleteMany({ where: { childId: params.id } });
  await prisma.storyProgress.deleteMany({ where: { childId: params.id } });
  await prisma.childProfile.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
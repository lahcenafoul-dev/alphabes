import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  childId: z.string().min(1),
  lastPageRead: z.number().int().min(0),
  completed: z.boolean(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }

  const story = await prisma.story.findUnique({ where: { slug: params.slug } });
  if (!story) {
    return NextResponse.json({ error: "Story not found." }, { status: 404 });
  }

  const child = await prisma.childProfile.findUnique({
    where: { id: parsed.data.childId },
    include: { parent: true },
  });
  if (!child || child.parent.email !== session.user.email) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const progress = await prisma.storyProgress.upsert({
    where: {
      childId_storyId: {
        childId: parsed.data.childId,
        storyId: story.id,
      },
    },
    update: {
      lastPageRead: parsed.data.lastPageRead,
      completed: parsed.data.completed,
    },
    create: {
      childId: parsed.data.childId,
      storyId: story.id,
      lastPageRead: parsed.data.lastPageRead,
      completed: parsed.data.completed,
    },
  });

  return NextResponse.json({ progress });
}
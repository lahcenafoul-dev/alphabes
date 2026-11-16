import { z } from "zod";
import { appError, appJson } from "@/lib/app-api/account";
import { getAppUser } from "@/lib/app-api/token";
import { getPrisma } from "@/lib/prisma";

// Stories a child read in the app, saved to the same StoryProgress as the
// website's reader (app/api/stories/[slug]/progress), so they show on the
// dashboard too (docs/mobile-app-api.md). Games, tracing and letters stay on
// the phone (owner's decision A, 2026-11-16).
const MAX_ENTRIES = 100;

const schema = z.object({
  childId: z.string().min(1).max(64),
  stories: z
    .array(
      z.object({
        locale: z.enum(["en", "fr", "es", "pt"]),
        slug: z.string().regex(/^[a-z0-9-]{1,120}$/),
        lastPageRead: z.number().int().min(0).max(1000),
        completed: z.boolean(),
      }),
    )
    .min(1)
    .max(MAX_ENTRIES),
});

export async function POST(req: Request) {
  const prisma = getPrisma();
  const user = await getAppUser(req, prisma);
  if (!user) return appError(401, "unauthorized", "Please log in again.");

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return appError(400, "invalid_data", "Invalid data.");
  const { childId, stories } = parsed.data;

  const child = await prisma.childProfile.findUnique({ where: { id: childId }, select: { parentId: true } });
  if (!child || child.parentId !== user.id) return appError(404, "profile_not_found", "Profile not found.");

  // One entry per story: the furthest page, finished if any entry says so.
  const wanted = new Map<string, { locale: string; lastPageRead: number; completed: boolean }>();
  for (const s of stories) {
    const prev = wanted.get(s.slug);
    wanted.set(s.slug, {
      locale: s.locale,
      lastPageRead: Math.max(prev?.lastPageRead ?? 0, s.lastPageRead),
      completed: (prev?.completed ?? false) || s.completed,
    });
  }
  const found = await prisma.story.findMany({ where: { slug: { in: [...wanted.keys()] } }, select: { id: true, slug: true, locale: true } });
  const known = found.filter((s) => wanted.get(s.slug)?.locale === s.locale.toLowerCase());

  await prisma.$transaction(
    known.map((story) => {
      const s = wanted.get(story.slug)!;
      return prisma.storyProgress.upsert({
        where: { childId_storyId: { childId, storyId: story.id } },
        // Saves can arrive late or twice; never undo a finished story.
        update: { lastPageRead: s.lastPageRead, ...(s.completed && { completed: true }) },
        create: { childId, storyId: story.id, lastPageRead: s.lastPageRead, completed: s.completed },
      });
    }),
  );

  const saved = new Set(known.map((s) => s.slug));
  return appJson({ saved: saved.size, unknown: [...wanted.keys()].filter((slug) => !saved.has(slug)) });
}

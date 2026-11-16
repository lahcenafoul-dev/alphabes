import { z } from "zod";
import { appChild, appError, appJson } from "@/lib/app-api/account";
import { getAppUser } from "@/lib/app-api/token";
import { getPrisma } from "@/lib/prisma";

// The parent's child profiles, for the app (docs/mobile-app-api.md). POST has
// the same rules as the website's /api/children.
const schema = z.object({
  firstName: z.string().trim().min(1).max(50),
  ageBand: z.enum(["3-4", "5-6", "7-8"]),
  language: z.enum(["en", "fr", "es", "pt"]).optional(),
});

export async function GET(req: Request) {
  const prisma = getPrisma();
  const user = await getAppUser(req, prisma);
  if (!user) return appError(401, "unauthorized", "Please log in again.");
  const children = await prisma.childProfile.findMany({ where: { parentId: user.id }, orderBy: { createdAt: "asc" } });
  return appJson({ children: children.map(appChild) });
}

export async function POST(req: Request) {
  const prisma = getPrisma();
  const user = await getAppUser(req, prisma);
  if (!user) return appError(401, "unauthorized", "Please log in again.");
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return appError(400, "invalid_child", "Please provide a name and age range.");
  const child = await prisma.childProfile.create({
    data: {
      parentId: user.id,
      firstName: parsed.data.firstName,
      ageBand: parsed.data.ageBand,
      language: (parsed.data.language ?? "en").toUpperCase() as "EN" | "FR" | "ES" | "PT",
    },
  });
  return appJson({ child: appChild(child) }, 201);
}

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { appAccount, appError, appJson } from "@/lib/app-api/account";
import { createAppToken } from "@/lib/app-api/token";
import { getPrisma } from "@/lib/prisma";

// The mobile app's login (docs/mobile-app-api.md): the same e-mail and
// password check as the website's NextAuth login (lib/auth.ts), answered with
// an app token instead of a cookie. Rate limited with the website login in
// middleware.ts.
const schema = z.object({
  email: z.string().min(3).max(200),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return appError(400, "invalid_login", "Please enter your e-mail and password.");

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.trim().toLowerCase() } });
  const valid = !!user?.passwordHash && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !valid) return appError(401, "invalid_login", "That e-mail and password don't match.");

  return appJson({ token: await createAppToken(user), account: await appAccount(prisma, user) });
}

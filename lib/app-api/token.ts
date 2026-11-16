import { decode, encode } from "next-auth/jwt";
import type { PrismaClient, User } from "@prisma/client";

// The mobile app's sign-in token (docs/mobile-app-api.md). An encrypted JWT
// made with NextAuth's own encode/decode and NEXTAUTH_SECRET, but with its own
// salt and audience, so a website session cookie is never accepted as an app
// token, nor the other way round. It carries a fingerprint of the password
// hash: changing the password on the website signs the app out.

export const APP_TOKEN_MAX_AGE = 90 * 24 * 60 * 60; // seconds; renewed by /api/app/me
const SALT = "alphabes-app-token";
const AUDIENCE = "app";

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is not set");
  return s;
}

/** A short, one-way fingerprint of the stored password hash. */
export async function passwordFingerprint(passwordHash: string | null): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${SALT}:${passwordHash ?? ""}`));
  return Array.from(new Uint8Array(bytes).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createAppToken(user: Pick<User, "id" | "passwordHash">): Promise<string> {
  return encode({
    token: { sub: user.id, aud: AUDIENCE, pwd: await passwordFingerprint(user.passwordHash) },
    secret: secret(),
    salt: SALT,
    maxAge: APP_TOKEN_MAX_AGE,
  });
}

/** The user id in a valid app token (right secret, salt, audience, not expired), or null. */
export async function readAppToken(token: string): Promise<{ userId: string; pwd: string } | null> {
  try {
    const claims = await decode({ token, secret: secret(), salt: SALT });
    if (!claims || claims.aud !== AUDIENCE || typeof claims.sub !== "string" || typeof claims.pwd !== "string") return null;
    return { userId: claims.sub, pwd: claims.pwd };
  } catch {
    return null;
  }
}

/**
 * The parent behind `Authorization: Bearer <token>`, or null when the token is
 * missing, invalid, expired, for a deleted account, or from before a password
 * change.
 */
export async function getAppUser(req: Request, prisma: PrismaClient): Promise<User | null> {
  const header = req.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) return null;
  const claims = await readAppToken(match[1]);
  if (!claims) return null;
  const user = await prisma.user.findUnique({ where: { id: claims.userId } });
  if (!user || (await passwordFingerprint(user.passwordHash)) !== claims.pwd) return null;
  return user;
}

import type { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPro } from "./entitlement";

export type Access = { loggedIn: boolean; pro: boolean; suspended: boolean };

// The visitor's access to Pro content, decided on the server from the
// session and the stored subscription (never from anything the browser
// sends). Calling it makes the page or route dynamic.
export async function getAccess(prisma: PrismaClient): Promise<Access> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return { loggedIn: false, pro: false, suspended: false };
  const user = await prisma.user.findUnique({ where: { email }, select: { subscription: true } });
  const sub = user?.subscription ?? null;
  return { loggedIn: !!user, pro: hasPro(sub), suspended: sub?.status === "SUSPENDED" };
}

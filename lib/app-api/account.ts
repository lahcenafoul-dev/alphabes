import { NextResponse } from "next/server";
import type { ChildProfile, PrismaClient, User } from "@prisma/client";
import { hasPro } from "@/lib/billing/entitlement";

// What the mobile app receives about a parent (docs/mobile-app-api.md).
// Store rules: never a price, plan name, PayPal id or payment date. The app
// only learns whether the account has Pro, decided here by hasPro().

export type AppChild = {
  id: string;
  firstName: string;
  ageBand: string;
  /** "en" | "fr" | "es" | "pt" */
  language: string;
  avatarKey: string | null;
};

export type AppAccount = {
  name: string | null;
  email: string;
  pro: boolean;
  children: AppChild[];
};

export function appChild(c: ChildProfile): AppChild {
  return { id: c.id, firstName: c.firstName, ageBand: c.ageBand, language: c.language.toLowerCase(), avatarKey: c.avatarKey };
}

/** Whether this parent has Pro now, from the stored subscription. */
export async function userHasPro(prisma: PrismaClient, userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({ where: { userId }, select: { plan: true, status: true, currentPeriodEnd: true } });
  return hasPro(sub);
}

export async function appAccount(prisma: PrismaClient, user: User): Promise<AppAccount> {
  const [pro, children] = await Promise.all([
    userHasPro(prisma, user.id),
    prisma.childProfile.findMany({ where: { parentId: user.id }, orderBy: { createdAt: "asc" } }),
  ]);
  return { name: user.name, email: user.email, pro, children: children.map(appChild) };
}

/** `{ error, code }` like every API route; never cached. */
export function appError(status: number, code: string, error: string) {
  return NextResponse.json({ error, code }, { status, headers: { "Cache-Control": "no-store" } });
}

export function appJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

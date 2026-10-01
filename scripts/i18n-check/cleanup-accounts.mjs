// Usage (from the repo root): node scripts/i18n-check/cleanup-accounts.mjs
// Deletes the throwaway accounts made by browser.mjs with CHECK_ACCOUNTS=1
// (emails i18n-check-<timestamp>@example.com), with their children.
// Uses DATABASE_URL from .env, which must point at the Neon dev branch.
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const url = readFileSync(".env", "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.slice("DATABASE_URL=".length)
  .replace(/^"|"$/g, "");
if (!url) throw new Error("DATABASE_URL not found in .env");

const prisma = new PrismaClient({ datasources: { db: { url } } });
const users = await prisma.user.findMany({
  where: { email: { startsWith: "i18n-check-", endsWith: "@example.com" } },
  select: { id: true, email: true },
});
for (const u of users) {
  const children = await prisma.childProfile.findMany({ where: { parentId: u.id }, select: { id: true } });
  const childIds = children.map((c) => c.id);
  await prisma.progress.deleteMany({ where: { childId: { in: childIds } } });
  await prisma.storyProgress.deleteMany({ where: { childId: { in: childIds } } });
  await prisma.childProfile.deleteMany({ where: { parentId: u.id } });
  await prisma.subscription.deleteMany({ where: { userId: u.id } });
  await prisma.user.delete({ where: { id: u.id } });
  console.log("deleted", u.email);
}
console.log(`${users.length} test account(s) removed`);
await prisma.$disconnect();

import { appAccount, appError, appJson } from "@/lib/app-api/account";
import { createAppToken, getAppUser } from "@/lib/app-api/token";
import { getPrisma } from "@/lib/prisma";

// The app calls this on each open (docs/mobile-app-api.md): the account as it
// is now (Pro starting or ending on the website shows up) and a renewed token.
export async function GET(req: Request) {
  const prisma = getPrisma();
  const user = await getAppUser(req, prisma);
  if (!user) return appError(401, "unauthorized", "Please log in again.");
  return appJson({ token: await createAppToken(user), account: await appAccount(prisma, user) });
}

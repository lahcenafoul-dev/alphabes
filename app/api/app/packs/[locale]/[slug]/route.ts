import { appError, userHasPro } from "@/lib/app-api/account";
import { getAppUser } from "@/lib/app-api/token";
import { downloadFile, readProFile } from "@/lib/billing/bundles";
import { isLocale } from "@/lib/i18n/routes";
import { getPrisma } from "@/lib/prisma";

type Params = { params: Promise<{ locale: string; slug: string }> };

// A Pro pack (or whole-bundle) PDF for the app: the same files and checks as
// /api/bundles/[locale]/[slug] (?paper=letter|a4, ?part=), but signed in with
// the app token, and answering in JSON instead of redirecting to the login or
// pricing pages, which the app must never show (docs/mobile-app-api.md).
export async function GET(req: Request, { params }: Params) {
  const { locale, slug } = await params;
  const url = new URL(req.url);
  const target = isLocale(locale) && /^[a-z0-9-]{1,80}$/.test(slug) ? downloadFile(locale, slug, url.searchParams) : null;
  if (!target) return appError(404, "not_found", "Not found.");

  const prisma = getPrisma();
  const user = await getAppUser(req, prisma);
  if (!user) return appError(401, "unauthorized", "Please log in again.");
  if (!(await userHasPro(prisma, user.id))) return appError(403, "pro_required", "This needs AlphaBes Pro.");

  const file = await readProFile(target.key);
  if (!file) {
    console.error(`Pro file missing from the bucket: ${target.key}`);
    return appError(404, "not_found", "Not found.");
  }
  return new Response(file.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${target.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

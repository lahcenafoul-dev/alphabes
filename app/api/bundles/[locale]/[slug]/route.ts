import { NextResponse } from "next/server";
import { getAccess } from "@/lib/billing/access";
import { downloadFile, readProFile } from "@/lib/billing/bundles";
import { isLocale, localizedPath } from "@/lib/i18n/routes";
import { getPrisma } from "@/lib/prisma";

type Params = { params: Promise<{ locale: string; slug: string }> };

// A whole-bundle PDF, for Pro only (docs/paypal-plan.md, B4). Logged out:
// the login page, then back to the bundle page. Logged in without Pro: the
// pricing page with a notice. Pro: the file from the private bucket. A Pro
// pack also takes ?paper=letter|a4 and, for the Mega pack, ?part=1…5.
export async function GET(req: Request, { params }: Params) {
  const { locale, slug } = await params;
  const url = new URL(req.url);
  const target = isLocale(locale) && /^[a-z0-9-]{1,80}$/.test(slug) ? downloadFile(locale, slug, url.searchParams) : null;
  if (!isLocale(locale) || !target) {
    return NextResponse.json({ error: "Not found.", code: "not_found" }, { status: 404 });
  }

  const origin = url.origin;
  const access = await getAccess(getPrisma());
  if (!access.loggedIn) {
    const next = localizedPath(locale, "/worksheets/bundles/[bundleSlug]", { bundleSlug: slug });
    return NextResponse.redirect(new URL(`${localizedPath(locale, "/login")}?next=${encodeURIComponent(next)}`, origin), 303);
  }
  if (!access.pro) {
    return NextResponse.redirect(new URL(`${localizedPath(locale, "/pricing")}?billing=bundle`, origin), 303);
  }

  const file = await readProFile(target.key);
  if (!file) {
    console.error(`Pro file missing from the bucket: ${target.key}`);
    return NextResponse.json({ error: "Not found.", code: "not_found" }, { status: 404 });
  }
  return new Response(file.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${target.filename}"`,
      // Per parent: never kept by shared caches.
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

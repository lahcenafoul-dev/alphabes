import { NextResponse } from "next/server";
import { getAccess } from "@/lib/billing/access";
import { bundleExists, bundleKey, readProFile } from "@/lib/billing/bundles";
import { isLocale, localizedPath } from "@/lib/i18n/routes";
import { getPrisma } from "@/lib/prisma";

type Params = { params: Promise<{ locale: string; slug: string }> };

// A whole-bundle PDF, for Pro only (docs/paypal-plan.md, B4). Logged out:
// the login page, then back to the bundle page. Logged in without Pro: the
// pricing page with a notice. Pro: the file from the private bucket.
export async function GET(req: Request, { params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !/^[a-z0-9-]{1,80}$/.test(slug) || !bundleExists(locale, slug)) {
    return NextResponse.json({ error: "Not found.", code: "not_found" }, { status: 404 });
  }

  const origin = new URL(req.url).origin;
  const access = await getAccess(getPrisma());
  if (!access.loggedIn) {
    const next = localizedPath(locale, "/worksheets/bundles/[bundleSlug]", { bundleSlug: slug });
    return NextResponse.redirect(new URL(`${localizedPath(locale, "/login")}?next=${encodeURIComponent(next)}`, origin), 303);
  }
  if (!access.pro) {
    return NextResponse.redirect(new URL(`${localizedPath(locale, "/pricing")}?billing=bundle`, origin), 303);
  }

  const file = await readProFile(bundleKey(locale, slug));
  if (!file) {
    console.error(`Pro file missing from the bucket: ${bundleKey(locale, slug)}`);
    return NextResponse.json({ error: "Not found.", code: "not_found" }, { status: 404 });
  }
  return new Response(file.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="alphabes-${slug}.pdf"`,
      // Per parent: never kept by shared caches.
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

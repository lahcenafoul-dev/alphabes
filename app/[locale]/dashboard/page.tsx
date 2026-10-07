import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { isAvailable } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import ClientMessages from "@/components/ClientMessages";
import { hasPro } from "@/lib/billing/entitlement";
import { confirmReturn, requestedNotice, type BillingNotice } from "@/lib/billing/return";
import AddChildForm from "./add-child-form";
import SubscriptionCard from "./subscription-card";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  return {
    title: t("title"),
    robots: { index: false },
  };
}

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: LocaleParams;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const tb = await getTranslations({ locale, namespace: "Billing" });
  const prisma = getPrisma();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  // Back from PayPal: check the subscription with PayPal before reading the
  // account, so the page already shows Pro (lib/billing/return.ts).
  const query = await searchParams;
  const asked = requestedNotice(query.billing);
  let notice: BillingNotice | null = asked === "alreadyPro" ? "alreadyPro" : null;
  if (asked === "return" && email) {
    const me = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (me) notice = await confirmReturn(prisma, me.id, query.subscription_id);
  }

  const user = email
    ? await prisma.user.findUnique({
        where: { email },
        include: { children: { include: { progress: true } }, subscription: true },
      })
    : null;

  const children = user?.children ?? [];
  const subscription = user?.subscription ?? null;
  const pro = hasPro(subscription);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">
          {user?.name ? t("welcomeName", { name: user.name }) : t("welcome")}
        </h1>
        <span className="rounded-full bg-crayon-yellow px-4 py-1 font-display font-bold text-sm">
          {pro ? t("proPlan") : t("freePlan")}
        </span>
      </div>

      {notice && (
        <p role="status" className="mt-6 rounded-block bg-crayon-yellow/30 border border-crayon-yellow px-5 py-3 font-bold">
          {tb(notice)}
        </p>
      )}

      {children.length === 0 ? (
        <div className="mt-10 rounded-block border border-dashed border-chalkboard/20 p-10 text-center">
          <h2 className="font-display font-bold text-lg">{t("emptyTitle")}</h2>
          <p className="mt-2 text-chalkboard/70">{t("emptyText")}</p>
          <div className="mt-5 flex justify-center">
            <ClientMessages locale={locale} namespaces={["ChildForm", "Errors"]}>
              <AddChildForm />
            </ClientMessages>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {children.map((child) => (
              <Link
                key={child.id}
                href={{ pathname: "/dashboard/[id]", params: { id: child.id } }}
                className="rounded-block border border-chalkboard/10 p-6 shadow-block"
              >
                <h2 className="font-display font-bold text-xl">{child.firstName}</h2>
                <p className="text-sm text-chalkboard/60">
                  {t("ages", { band: child.ageBand })} · {t("language", { language: child.language })}
                </p>
                <p className="mt-4 text-chalkboard/80">
                  {t("lessonsCompleted", { count: child.progress.length })}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <ClientMessages locale={locale} namespaces={["ChildForm", "Errors"]}>
              <AddChildForm />
            </ClientMessages>
          </div>
          {isAvailable(locale, "/stories") && (
            <div className="mt-6">
              <Link
                href="/stories"
                className="inline-block rounded-block bg-crayon-purple text-white px-6 py-3 font-display font-bold"
              >
                {t("storyTime")}
              </Link>
            </div>
          )}
        </>
      )}

      {subscription?.paypalSubscriptionId && <SubscriptionCard locale={locale} sub={subscription} />}

      {!pro && subscription?.status !== "SUSPENDED" && (
        <div className="mt-10 rounded-block bg-chalkboard text-paper p-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display font-bold">{t("upsell")}</p>
          <Link href="/pricing" className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-5 py-2.5">
            {t("seePlans")}
          </Link>
        </div>
      )}
    </main>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);

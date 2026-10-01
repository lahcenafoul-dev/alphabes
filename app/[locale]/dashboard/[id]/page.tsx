import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { isAvailable, localizedPath } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import ClientMessages from "@/components/ClientMessages";
import ChildActions from "./child-actions";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "ChildDashboard" });
  return {
    title: t("title"),
    robots: { index: false },
  };
}

export default async function ChildDashboardPage(props: Props) {
  const params = await props.params;
  const locale = initLocale(params.locale);
  const t = await getTranslations({ locale, namespace: "ChildDashboard" });
  const prisma = getPrisma();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) notFound();

  const child = await prisma.childProfile.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      progress: {
        include: { lesson: true, game: true, activity: true },
        orderBy: { completedAt: "desc" },
      },
      storyProgress: {
        include: { story: true },
      },
    },
  });

  if (!child || child.parent.email !== email) notFound();

  const childLocale = child.language === "FR" ? "fr" : "en";
  const childLinks: { pathname: AppPathname; label: "startAlphabet" | "games" | "storyTime"; color: string }[] = [
    { pathname: "/alphabet", label: "startAlphabet", color: "bg-crayon-green" },
    { pathname: "/games", label: "games", color: "bg-crayon-purple" },
    { pathname: "/stories", label: "storyTime", color: "bg-crayon-blue" },
  ];

  const totalCompleted = child.progress.length;
  const quizResults = child.progress.filter((p) => p.score !== null);
  const avgScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((sum, p) => sum + (p.score ?? 0), 0) /
            quizResults.length
        )
      : null;

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav className="text-sm text-chalkboard/60">
        <Link href="/">{t("home")}</Link> / <Link href="/dashboard">{t("dashboard")}</Link>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{child.firstName}</h1>
      <p className="mt-1 text-chalkboard/70">{t("ages", { band: child.ageBand })}</p>

      <p className="mt-1 text-sm text-chalkboard/60">{t("language", { language: child.language })}</p>

      {/* The child's pages open in the child's learning language, whatever the dashboard's. */}
      <div className="mt-4 flex flex-wrap gap-3">
        {childLinks
          .filter((l) => isAvailable(childLocale, l.pathname))
          .map((l) => (
            <NextLink
              key={l.pathname}
              href={localizedPath(childLocale, l.pathname)}
              hrefLang={childLocale === locale ? undefined : childLocale}
              className={`inline-block rounded-block ${l.color} text-white px-6 py-3 font-display font-bold`}
            >
              {t(l.label)}
            </NextLink>
          ))}
      </div>

      {/* Progress overview */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-block border border-chalkboard/10 p-5 shadow-block">
          <p className="text-sm text-chalkboard/60">{t("lessonsCompleted")}</p>
          <p className="mt-1 text-3xl font-extrabold">{totalCompleted}</p>
        </div>
        <div className="rounded-block border border-chalkboard/10 p-5 shadow-block">
          <p className="text-sm text-chalkboard/60">{t("quizAverage")}</p>
          <p className="mt-1 text-3xl font-extrabold">
            {avgScore !== null ? `${avgScore}%` : "—"}
          </p>
        </div>
        <div className="rounded-block border border-chalkboard/10 p-5 shadow-block">
          <p className="text-sm text-chalkboard/60">{t("storiesRead")}</p>
          <p className="mt-1 text-3xl font-extrabold">
            {child.storyProgress.filter((s) => s.completed).length}
          </p>
        </div>
      </div>
      {/* Quiz results */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">{t("quizResults")}</h2>
        {quizResults.length === 0 ? (
          <p className="mt-2 text-chalkboard/60">{t("noQuizResults")}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {quizResults.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-block border border-chalkboard/10 px-4 py-3"
              >
                <span>{p.game?.title ?? p.lesson?.title ?? p.activity?.title ?? t("activity")}</span>
                <span className="font-bold">{p.score}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stories */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">{t("stories")}</h2>
        {child.storyProgress.length === 0 ? (
          <div className="mt-4 rounded-block border border-dashed border-chalkboard/20 p-6 text-center">
            <p className="font-display font-bold">{t("comingSoon")}</p>
            <p className="mt-1 text-sm text-chalkboard/60">
              {t("storiesOnTheWay", { name: child.firstName })}
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {child.storyProgress.map((sp) => (
              <li
                key={sp.id}
                className="flex items-center justify-between rounded-block border border-chalkboard/10 px-4 py-3"
              >
                <span>{sp.story.title}</span>
                <span className="text-sm text-chalkboard/60">
                  {sp.completed ? t("completed") : t("page", { page: sp.lastPageRead })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Profile settings */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">{t("settings")}</h2>
        <ClientMessages locale={locale} namespaces={["ChildForm", "Errors"]}>
          <ChildActions childId={child.id} firstName={child.firstName} ageBand={child.ageBand} language={child.language} />
        </ClientMessages>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import ClientOnly from "@/components/games/ClientOnly";
import Paywall from "@/components/billing/Paywall";
import { getAccess } from "@/lib/billing/access";
import { isPremiumGame } from "@/lib/billing/premium";
import { getGame } from "@/lib/games-data";
import { getFrenchGame } from "@/lib/games-fr";
import { getSpanishGame } from "@/lib/juegos-es";
import { getPortugueseGame } from "@/lib/jogos-pt";
import { localizedPath } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import { getPrisma } from "@/lib/prisma";
import PremiumGame from "./premium-game";

type Props = { params: Promise<{ locale: string; slug: string }> };

// A premium game, played per request after a Pro check on the server
// (docs/paypal-plan.md, B4). The game's own page stays static and indexable;
// this page is noindex and not in the sitemap. The middleware already 404s
// slugs that aren't premium games (lib/i18n/known-params.ts).

const LABELS: Record<Locale, { games: string; loading: string }> = {
  en: { games: "Games", loading: "Loading game…" },
  fr: { games: "Jeux", loading: "Chargement du jeu…" },
  es: { games: "Juegos", loading: "Cargando el juego…" },
  pt: { games: "Jogos", loading: "Carregando o jogo…" },
};

function gameTitle(locale: Locale, slug: string): string | null {
  const g =
    locale === "fr"
      ? getFrenchGame(slug)
      : locale === "es"
        ? getSpanishGame(slug)
        : locale === "pt"
          ? getPortugueseGame(slug)
          : getGame(slug);
  return g?.title ?? null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  return { title: gameTitle(locale, slug) ?? undefined, robots: { index: false } };
}

export default async function PlayPage(props: Props) {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  const title = gameTitle(locale, slug);
  if (!title || !isPremiumGame(locale, slug)) notFound();

  const access = await getAccess(getPrisma());
  const labels = LABELS[locale];

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav className="text-sm text-chalkboard/60">
        <Link href="/games">{labels.games}</Link> /{" "}
        <Link href={{ pathname: "/games/[slug]", params: { slug } }}>{title}</Link>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">{title}</h1>

      {access.pro ? (
        <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
          <ClientOnly fallback={<p className="text-chalkboard/50">{labels.loading}</p>}>
            <PremiumGame locale={locale} slug={slug} />
          </ClientOnly>
        </div>
      ) : (
        <Paywall
          locale={locale}
          kind="game"
          access={access}
          next={localizedPath(locale, "/games/[slug]/play", { slug })}
        />
      )}
    </main>
  );
}

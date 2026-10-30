import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import { homeQuizRounds } from "@/lib/home-quiz";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import LanguageLinks from "./LanguageLinks";
import { OwlMark } from "./Owl";
import OwlQuiz, { type QuizCopy } from "./OwlQuiz";
import PathLine from "./PathLine";

/** Every word of the home page's design in one language (app/[locale]/home-*.tsx). */
export type HomeCopy = {
  nav: { games: string; worksheets: string; stories: string; parents: string; join: string };
  /** The SEO line above "Little minds," / "big" / "s." around the coloured ABC. */
  headline: { seo: string; line1: string; big: string; after: string };
  intro: string;
  play: string;
  howItWorks: string;
  speaks: string;
  quiz: QuizCopy;
  features: {
    title: string;
    intro: string;
    letters: [string, string];
    tracing: [string, string];
    worksheets: [string, string];
    stories: [string, string];
  };
  path: { title: string; steps: [string, string][] };
  parents: { title: string; text: string; cta: string };
  footer: { ages: string; languages: string; legal: string };
};

const LANGUAGE_NAMES: Record<Locale, string> = { en: "English", fr: "Français", es: "Español", pt: "Português" };
const LOCALES: Locale[] = ["en", "fr", "es", "pt"];

// The letter tracing game in each language (lib/i18n/routes.ts, GAME_PARAMS).
const TRACING_GAME: Record<Locale, string> = {
  en: "letter-tracing",
  fr: "trace-la-lettre",
  es: "traza-la-letra",
  pt: "trace-a-letra",
};

const FOOTER_LINKS = [
  { href: "/about", label: "about" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
  { href: "/pricing", label: "pricing" },
  { href: "/privacy-policy", label: "privacy" },
  { href: "/terms", label: "terms" },
  { href: "/refunds", label: "refunds" },
  { href: "/cookies", label: "cookies" },
] as const;

const h2 = "m-0 font-display text-[34px] font-extrabold leading-[1.05] sm:text-[clamp(34px,4.2vw,52px)]";

// The "Owl Quiz" home page (design: owl-design/owl-homepage-reference.html),
// shared by the four languages. The page's own SEO sections come in as
// children, between the path and the parents band. The page brings its own
// header and footer; globals.css hides the site-wide ones on it.
export default async function OwlHome({ locale, copy, children }: { locale: Locale; copy: HomeCopy; children: ReactNode }) {
  const th = await getTranslations({ locale, namespace: "Header" });
  const tf = await getTranslations({ locale, namespace: "Footer" });
  const path = (p: Parameters<typeof localizedPath>[1], params?: Record<string, string>) => localizedPath(locale, p, params);
  const nav = [
    { href: path("/games"), label: copy.nav.games },
    { href: path("/worksheets"), label: copy.nav.worksheets },
    { href: path("/stories"), label: copy.nav.stories },
    { href: path("/dashboard"), label: copy.nav.parents },
  ];
  // The page's own language first: it is the one shown when the words don't rotate.
  const languages = [locale, ...LOCALES.filter((l) => l !== locale)];
  const { features } = copy;
  const tiles = [
    { href: path("/alphabet"), text: features.letters, className: "bg-owl-purple text-white", textClass: "text-white", art: <Equalizer /> },
    { href: path("/games/[slug]", { slug: TRACING_GAME[locale] }), text: features.tracing, className: "bg-white ring-1 ring-owl-ink/5", textClass: "text-owl-muted", art: <TracingS /> },
    { href: path("/worksheets"), text: features.worksheets, className: "bg-owl-cream", textClass: "text-owl-muted", art: <Sheets /> },
    { href: path("/stories"), text: features.stories, className: "bg-owl-mint", textClass: "text-owl-muted", art: <Book /> },
  ];

  return (
    <div data-owl-home className="min-h-screen overflow-x-clip bg-owl-bg font-body text-owl-ink">
      <header className="relative print:hidden">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-[22px]">
          <Link
            href={path("/")}
            aria-label={th("homeLabel")}
            className="flex items-center gap-2.5 font-display text-[26px] font-extrabold text-owl-ink sm:text-[32px]"
          >
            <OwlMark className="h-10 w-10 sm:h-11 sm:w-11" />
            AlphaBes
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <nav aria-label={th("mainNav")} className="hidden lg:block">
              <ul className="flex items-center gap-1 text-[17px] font-extrabold">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      rel={item.href === path("/dashboard") ? "nofollow" : undefined}
                      className="rounded-full px-3.5 py-2.5 text-owl-ink hover:text-owl-purple"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={path("/register")} className="owl-btn owl-btn-purple ml-1.5 px-[22px] text-[17px] font-extrabold shadow-none">
                    {copy.nav.join}
                  </Link>
                </li>
              </ul>
            </nav>
            <LanguageSwitcher />
            <MobileMenu
              items={nav}
              account={{ href: path("/register"), label: copy.nav.join }}
              menuLabel={th("menu")}
              closeLabel={th("closeMenu")}
              navLabel={th("mainNav")}
              variant="owl"
            />
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero and the quiz */}
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 px-4 pb-20 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:gap-14">
          <div className="min-w-0 flex-[1_1_440px]">
            <h1 className="owl-fade-up m-0 font-display text-[clamp(44px,6.4vw,82px)] font-extrabold leading-[0.98] tracking-[-1px]">
              <span className="mb-4 block font-body text-base font-extrabold leading-snug tracking-normal text-owl-purple sm:text-lg">
                {copy.headline.seo}
              </span>
              {copy.headline.line1}
              <br />
              <span className="text-owl-purple">{copy.headline.big}</span>{" "}
              {/* Darker than the design's pink, yellow and green so the letters reach 3:1 (large text). */}
              <span className="text-[#F0457F]">A</span>
              <span className="text-[#C47F00]">B</span>
              <span className="text-[#13956F]">C</span>
              {copy.headline.after}
            </h1>
            <p className="owl-fade-up mb-8 mt-6 max-w-[480px] text-lg leading-relaxed text-owl-muted [animation-delay:.12s] sm:text-[21px]">
              {copy.intro}
            </p>
            <div className="owl-fade-up flex flex-wrap items-center gap-3.5 [animation-delay:.24s]">
              <Link href={path("/games")} className="owl-btn owl-btn-purple px-[34px] py-[18px] text-2xl shadow-[0_6px_0_#4428C9]">
                {copy.play}
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2.5 px-2 py-3.5 text-lg font-extrabold text-owl-ink hover:text-owl-purple">
                <span className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(29,24,70,.1)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4l13 8-13 8z" fill="#6A4CFF" />
                  </svg>
                </span>
                {copy.howItWorks}
              </a>
            </div>
            <div className="owl-fade-up mt-9 flex items-center gap-3 font-extrabold text-owl-muted [animation-delay:.36s]">
              <p className="sr-only">
                {copy.speaks} {languages.map((l) => LANGUAGE_NAMES[l]).join(", ")}
              </p>
              <span aria-hidden="true">{copy.speaks}</span>
              <span aria-hidden="true" className="inline-block h-9 overflow-hidden rounded-full bg-white px-3.5 shadow-[0_0_0_1px_rgba(29,24,70,.08)]">
                <span className="owl-words flex flex-col font-display text-xl leading-9 text-owl-purple">
                  {languages.map((l) => (
                    <span key={l} lang={l}>
                      {LANGUAGE_NAMES[l]}
                    </span>
                  ))}
                </span>
              </span>
            </div>
          </div>

          <div className="owl-fade-up min-w-0 flex-[1_1_460px] [animation-delay:.2s]">
            <OwlQuiz locale={locale} rounds={homeQuizRounds(locale)} copy={copy.quiz} />
          </div>
        </section>

        {/* Everything a little reader needs */}
        <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6">
          <h2 className={`${h2} mb-3 text-center`}>{features.title}</h2>
          <p className="mx-auto mb-12 max-w-[560px] text-center text-lg leading-relaxed text-owl-muted sm:text-[19px]">{features.intro}</p>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
            {tiles.map((tile) => (
              <li key={tile.href}>
                <Link
                  href={tile.href}
                  className={`block h-full rounded-[32px] p-[30px] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-20px_rgba(29,24,70,.35)] ${tile.className}`}
                >
                  <div className="h-[120px]" aria-hidden="true">
                    {tile.art}
                  </div>
                  <h3 className="mb-1.5 mt-5 font-display text-[28px] font-bold">{tile.text[0]}</h3>
                  <p className={`m-0 text-[17px] leading-relaxed ${tile.textClass}`}>{tile.text[1]}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* A clear path from A to Z */}
        <section id="how-it-works" className="scroll-mt-4 bg-owl-ink px-4 py-[88px] text-white sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <h2 className={`${h2} mb-12 text-center`}>{copy.path.title}</h2>
            <div className="relative">
              <PathLine />
              <ol className="relative grid grid-cols-1 gap-7 text-center sm:grid-cols-2 lg:grid-cols-4">
                {copy.path.steps.map(([title, text], i) => (
                  <li key={title}>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-owl-sun font-display text-[34px] font-extrabold text-owl-ink"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mb-1.5 mt-[18px] font-display text-2xl font-bold">{title}</h3>
                    <p className="m-0 leading-relaxed text-[#C9C3EE]">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {children}

        {/* Built for parents, too */}
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 rounded-[32px] bg-white p-7 shadow-[0_0_0_1px_rgba(29,24,70,.06)] sm:rounded-[40px] sm:p-14">
            <div className="min-w-0 flex-[1_1_420px]">
              <h2 className="mb-3 font-display text-[32px] font-extrabold leading-[1.05] sm:text-[clamp(32px,3.6vw,44px)]">{copy.parents.title}</h2>
              <p className="m-0 text-lg leading-relaxed text-owl-muted sm:text-[19px]">{copy.parents.text}</p>
            </div>
            <Link href={path("/register")} className="owl-btn owl-btn-ink px-8 py-[18px] text-[22px]">
              {copy.parents.cta}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E6E1FA] print:hidden">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 pb-11 pt-8 text-[15px] font-bold text-owl-muted sm:px-6">
          <div className="flex flex-wrap justify-between gap-4">
            <p className="m-0">{copy.footer.ages}</p>
            <LanguageLinks locale={locale} label={copy.footer.languages} />
          </div>
          <nav aria-label={copy.footer.legal}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={path(link.href)} className="text-owl-muted hover:text-owl-purple">
                    {tf(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Equalizer() {
  const bars = [
    { color: "#FFC94D", height: 40 },
    { color: "#FF7AA8", height: 58 },
    { color: "#FFFFFF", height: 30 },
    { color: "#35C9A0", height: 64 },
    { color: "#FFC94D", height: 46 },
  ];
  return (
    <div className="flex h-full items-end gap-2.5">
      {bars.map((bar, i) => (
        <span
          key={i}
          className="owl-eq w-3.5 rounded-[7px]"
          style={{ background: bar.color, height: bar.height, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function TracingS() {
  const d = "M140 50C110 20 50 30 60 70s80 30 80 70-70 40-85 15";
  return (
    <div className="flex h-full items-center">
      <svg width="120" height="120" viewBox="0 0 200 200">
        <path d={d} stroke="#FFE1EC" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path className="owl-draw" pathLength={100} d={d} stroke="#FF5C93" strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Sheets() {
  const sheet = "absolute left-[30px] top-2.5 h-[100px] w-[78px] rounded-[10px] bg-white shadow-[0_6px_14px_-6px_rgba(29,24,70,.3)]";
  return (
    <div className="relative h-full">
      <span className={`owl-fan-1 ${sheet}`} />
      <span className={`owl-fan-2 ${sheet}`} />
      <span className={`${sheet} flex items-center justify-center font-display text-5xl font-extrabold text-[#B37400]`}>Bb</span>
    </div>
  );
}

function Book() {
  return (
    <div className="flex h-full items-center [perspective:600px]">
      <span className="relative flex h-24 w-[140px]">
        <span className="h-24 w-[70px] rounded-l-xl bg-owl-green" />
        <span className="h-24 w-[70px] rounded-r-xl bg-[#35C9A0]" />
        <span className="owl-flip absolute left-[70px] top-0 h-24 w-[70px] rounded-r-xl bg-white shadow-[0_0_0_1px_rgba(29,24,70,.08)]" />
      </span>
    </div>
  );
}

import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { isAvailable, localizedPath } from "@/lib/i18n/routes";

// The 404 page body. English is kept exactly as it was before the French
// version; French only links to sections that already exist in French. Links
// use next/link with locale-built hrefs so this can render outside [locale]
// (app/not-found.tsx) without reading the request.
export default function NotFoundContent({ locale }: { locale: Locale }) {
  return locale === "fr" ? <NotFoundFr /> : <NotFoundEn />;
}

function Blocks() {
  return (
    <div className="flex justify-center gap-3" aria-hidden="true">
      {["4", "0", "4"].map((char, i) => (
        <div key={i} className="letter-block bg-crayon-yellow h-20 w-20 text-4xl">
          {char}
        </div>
      ))}
    </div>
  );
}

function NotFoundEn() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-20 text-center">
      <Blocks />

      <h1 className="mt-8 text-3xl font-extrabold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-chalkboard/70">
        The page you&apos;re looking for may have moved or no longer exists. Here are some good
        places to start instead:
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={localizedPath("en", "/")}
          className="rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Go Home
        </Link>
        <Link
          href={localizedPath("en", "/worksheets")}
          className="rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Browse Worksheets
        </Link>
        <Link
          href={localizedPath("en", "/alphabet")}
          className="rounded-block border-2 border-chalkboard/20 font-display font-bold px-5 py-2.5 hover:border-crayon-blue transition"
        >
          Explore the Alphabet
        </Link>
        <Link
          href={localizedPath("en", "/blog")}
          className="rounded-block border-2 border-chalkboard/20 font-display font-bold px-5 py-2.5 hover:border-crayon-blue transition"
        >
          Read the Blog
        </Link>
      </div>

      <div className="mt-10">
        <p className="text-sm font-bold text-chalkboard/60">Popular worksheets</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <Link href={localizedPath("en", "/worksheets/[category]", { category: "letter-a-tracing" })} className="text-sm font-display font-bold text-crayon-blue hover:underline">
            Letter A Tracing
          </Link>
          <Link href={localizedPath("en", "/worksheets/[category]", { category: "cvc-words" })} className="text-sm font-display font-bold text-crayon-blue hover:underline">
            CVC Words
          </Link>
          <Link href={localizedPath("en", "/worksheets/[category]", { category: "sight-words" })} className="text-sm font-display font-bold text-crayon-blue hover:underline">
            Sight Words
          </Link>
        </div>
      </div>
    </main>
  );
}

function NotFoundFr() {
  const links = [
    { href: "/worksheets", label: "Voir les fiches", style: "bg-crayon-green text-paper shadow-block hover:shadow-blockHover" },
    { href: "/alphabet", label: "Découvrir l'alphabet", style: "border-2 border-chalkboard/20 hover:border-crayon-blue" },
    { href: "/games", label: "Jouer avec les lettres", style: "border-2 border-chalkboard/20 hover:border-crayon-blue" },
  ] as const;

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-20 text-center">
      <Blocks />

      <h1 className="mt-8 text-3xl font-extrabold">Oups, cette page est introuvable</h1>
      <p className="mt-3 text-chalkboard/70">
        La page que vous cherchez a peut-être changé d&apos;adresse, ou elle n&apos;existe plus.
        Voici quelques bons points de départ :
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={localizedPath("fr", "/")}
          className="rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Retour à l&apos;accueil
        </Link>
        {links
          .filter((link) => isAvailable("fr", link.href))
          .map((link) => (
            <Link
              key={link.href}
              href={localizedPath("fr", link.href)}
              className={`rounded-block font-display font-bold px-5 py-2.5 transition ${link.style}`}
            >
              {link.label}
            </Link>
          ))}
      </div>
    </main>
  );
}

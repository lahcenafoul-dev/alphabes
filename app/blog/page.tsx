import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts, blogCategories } from "@/lib/blog-data";

const BASE_URL = "https://alphabes.com";
const title = "AlphaBes Blog: Alphabet, Phonics & Early Learning Guides";
const description =
  "Practical, original guides for parents and teachers on teaching the alphabet, phonics, letter tracing, and early reading skills.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: { title, description, url: `${BASE_URL}/blog` },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const featured = sorted.slice(0, 2);
  const latest = sorted;

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Early Learning Activities &amp; Printable Resources</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Practical, original articles on teaching the alphabet, phonics, and early reading —
        written for parents, preschool and kindergarten teachers, and homeschool families.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Blog categories">
        {blogCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/blog/${c.slug}`}
            className="rounded-block bg-crayon-blue/10 text-crayon-blue px-4 py-2 text-sm font-display font-bold hover:bg-crayon-blue/20"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <section className="mt-10" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-2xl font-bold">Featured Articles</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-5">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition-colors"
            >
              <h3 className="font-display font-bold text-xl">{post.title}</h3>
              <p className="mt-2 text-chalkboard/70">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="text-2xl font-bold">Latest Articles</h2>
        <div className="mt-4 space-y-5">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition-colors"
            >
              <h3 className="font-display font-bold text-xl">{post.title}</h3>
              <p className="mt-2 text-chalkboard/70">{post.excerpt}</p>
              <p className="mt-2 text-xs text-chalkboard/50">{formatDate(post.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-block bg-crayon-green/10 p-6" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="text-xl font-bold">Explore More on AlphaBes</h2>
        <p className="mt-2 text-chalkboard/70">
          Every article links back to the lesson, worksheet, or activity it's about — here are the
          main hubs those links point to.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          <li><Link href="/alphabet" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue">Alphabet Hub</Link></li>
          <li><Link href="/phonics" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue">Phonics Hub</Link></li>
          <li><Link href="/worksheets" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue">Worksheets</Link></li>
          <li><Link href="/preschool" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue">Preschool Hub</Link></li>
          <li><Link href="/kindergarten" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue">Kindergarten Hub</Link></li>
          <li><Link href="/games" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue">Games</Link></li>
        </ul>
      </section>

      <section className="mt-12 border-t border-chalkboard/10 pt-8" aria-labelledby="about-heading">
        <h2 id="about-heading" className="text-lg font-bold">About This Blog</h2>
        <p className="mt-2 text-sm text-chalkboard/70 max-w-2xl">
          Articles are written in-house by the AlphaBes team and updated when a resource they link
          to changes. We don't publish sponsored posts or copy other sites' content. Read more on{" "}
          <Link href="/about" className="font-bold underline">our About page</Link>, or{" "}
          <Link href="/contact" className="font-bold underline">get in touch</Link> if you spot
          something that needs fixing.
        </p>
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPost } from "@/lib/blog-data";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://alphabes.com/blog/${post.slug}` },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: "AlphaBes" },
    publisher: { "@type": "Organization", name: "AlphaBes" },
    mainEntityOfPage: `https://alphabes.com/blog/${post.slug}`,
  };

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/blog">Blog</Link> /</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold">{post.title}</h1>
      <div className="mt-6 space-y-4 text-chalkboard/80 leading-relaxed">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {post.relatedLinks.length > 0 && (
        <section className="mt-10 rounded-block bg-crayon-blue/10 p-6" aria-labelledby="continue-learning-heading">
          <h2 id="continue-learning-heading" className="text-xl font-bold">
            Continue learning
          </h2>
          <ul className="mt-3 space-y-2">
            {post.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-display font-bold text-crayon-blue hover:underline">
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </main>
  );
}

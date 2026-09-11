import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  blogCategories,
  blogPosts,
  getBlogCategory,
  getBlogPost,
  getPostsByCategory,
  getRelatedPosts,
  type BlogCategory,
  type BlogPost,
} from "@/lib/blog-data";
import { buildBreadcrumbJsonLd, buildArticleJsonLd } from "@/lib/json-ld";
import RelatedArticles from "@/components/blog/RelatedArticles";

const BASE_URL = "https://alphabes.com";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return [
    ...blogCategories.map((c) => ({ slug: c.slug })),
    ...blogPosts.map((p) => ({ slug: p.slug })),
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug;

  const category = getBlogCategory(slug);
  if (category) {
    const title = `${category.name} Blog Articles`;
    return {
      title,
      description: category.description,
      alternates: { canonical: `${BASE_URL}/blog/${category.slug}` },
      openGraph: { title, description: category.description, url: `${BASE_URL}/blog/${category.slug}` },
    };
  }

  const post = getBlogPost(slug);
  if (post) {
    const title = post.metaTitle ?? post.title;
    const description = post.metaDescription ?? post.excerpt;
    const canonical = post.canonicalUrl ?? `${BASE_URL}/blog/${post.slug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: "article" },
      twitter: { card: "summary", title, description },
    };
  }

  return {};
}

export default function BlogSlugPage({ params }: Props) {
  const slug = params.slug;

  const category = getBlogCategory(slug);
  if (category) return <CategoryView category={category} />;

  const post = getBlogPost(slug);
  if (post) return <ArticleView post={post} />;

  notFound();
}

function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ---------- Category view ----------

function CategoryView({ category }: { category: BlogCategory }) {
  const posts = getPostsByCategory(category.slug);
  const otherCategories = blogCategories.filter((c) => c.slug !== category.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: category.name, url: `${BASE_URL}/blog/${category.slug}` },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/blog">Blog</Link> /</li>
          <li aria-current="page" className="font-bold">{category.name}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{category.name}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{category.description}</p>

      {posts.length > 0 ? (
        <div className="mt-8 space-y-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition-colors"
            >
              <h2 className="font-display font-bold text-xl">{post.title}</h2>
              <p className="mt-2 text-chalkboard/70">{post.excerpt}</p>
              <p className="mt-2 text-xs text-chalkboard/50">{formatDate(post.publishedAt)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-chalkboard/70">
          New {category.name.toLowerCase()} articles are on the way. In the meantime, explore{" "}
          <Link href="/blog" className="font-bold underline">every AlphaBes article</Link>.
        </p>
      )}

      <section className="mt-12" aria-labelledby="other-categories-heading">
        <h2 id="other-categories-heading" className="text-xl font-bold">More Blog Categories</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <li key={c.slug}>
              <Link href={`/blog/${c.slug}`} className="rounded-block border border-chalkboard/15 px-3 py-1.5 text-sm font-bold hover:border-crayon-blue">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

// ---------- Article view ----------

function ArticleView({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.categorySlug)!;
  const related = getRelatedPosts(post);
  const canonical = post.canonicalUrl ?? `${BASE_URL}/blog/${post.slug}`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: category.name, url: `${BASE_URL}/blog/${category.slug}` },
    { name: post.title, url: canonical },
  ]);

  const articleJsonLd = buildArticleJsonLd({
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    url: canonical,
    author: post.author,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  });

  const faqJsonLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/blog">Blog</Link> /</li>
          <li><Link href={`/blog/${category.slug}`}>{category.name}</Link> /</li>
          <li aria-current="page" className="font-bold">{post.title}</li>
        </ol>
      </nav>

      <span className="mt-4 inline-block rounded-full bg-crayon-blue/10 text-crayon-blue px-3 py-1 text-xs font-bold">
        {category.name}
      </span>
      <h1 className="mt-2 text-3xl font-extrabold">{post.title}</h1>
      <p className="mt-2 text-sm text-chalkboard/50">
        By {post.author} • Published {formatDate(post.publishedAt)}
        {post.updatedAt && post.updatedAt !== post.publishedAt ? ` • Updated ${formatDate(post.updatedAt)}` : ""}
      </p>

      {post.sections.length > 1 && (
        <nav aria-label="Table of contents" className="mt-6 rounded-block bg-crayon-blue/10 p-4">
          <p className="font-display font-bold text-sm">In this article</p>
          <ol className="mt-2 space-y-1 text-sm">
            {post.sections.map((section) => (
              <li key={section.heading}>
                <a href={`#${slugifyHeading(section.heading)}`} className="text-crayon-blue hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-6 space-y-6 text-chalkboard/80 leading-relaxed">
        {post.sections.map((section) => (
          <section key={section.heading} aria-labelledby={slugifyHeading(section.heading)}>
            <h2 id={slugifyHeading(section.heading)} className="text-xl font-bold text-chalkboard">
              {section.heading}
            </h2>
            {section.paragraphs.map((para, i) => (
              <p key={i} className="mt-2">{para}</p>
            ))}
          </section>
        ))}
      </div>

      {post.faq.length > 0 && (
        <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="article-faq-heading">
          <h2 id="article-faq-heading" className="text-xl font-bold">FAQ</h2>
          <dl className="mt-4 space-y-4">
            {post.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-display font-bold">{item.question}</dt>
                <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

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

      <RelatedArticles posts={related} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
    </main>
  );
}

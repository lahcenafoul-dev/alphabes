import Link from "next/link";
import type { BlogPost } from "@/lib/blog-data";

export default function RelatedArticles({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="related-articles-heading">
      <h2 id="related-articles-heading" className="text-xl font-bold">
        Related Articles
      </h2>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:shadow-blockHover hover:border-crayon-blue transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
          >
            <p className="font-display font-bold">{post.title}</p>
            <p className="mt-1 text-sm text-chalkboard/70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

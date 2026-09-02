import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical, research-informed articles on teaching the alphabet and phonics at home.",
  alternates: { canonical: "https://alphabes.com/blog" },
};

export default function BlogIndexPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Blog</h1>
      <p className="mt-2 text-chalkboard/70">
        Practical guidance for parents and teachers on early letters and phonics.
      </p>
      <div className="mt-8 space-y-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition"
          >
            <h2 className="font-display font-bold text-xl">{post.title}</h2>
            <p className="mt-2 text-chalkboard/70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

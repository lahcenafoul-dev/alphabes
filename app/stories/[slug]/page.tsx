import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StoryReader from "./story-reader";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({ select: { slug: true } });
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }: Props) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
  });

  if (!story) notFound();

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  let children: { id: string; firstName: string }[] = [];
  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { children: { select: { id: true, firstName: true } } },
    });
    children = user?.children ?? [];
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      <nav className="text-sm text-chalkboard/60">
        <Link href="/">Home</Link> / <Link href="/stories">Story Time</Link>
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold">{story.title}</h1>

      <StoryReader story={story} children={children} />
    </main>
  );
}
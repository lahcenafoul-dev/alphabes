import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import StoryReader from "./story-reader";

type Props = { params: Promise<{ slug: string }> };

export default async function StoryPage(props: Props) {
  const prisma = getPrisma();
  const params = await props.params;
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
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ChildActions from "./child-actions";

type Props = { params: { id: string } };

export default async function ChildDashboardPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) notFound();

  const child = await prisma.childProfile.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      progress: {
        include: { lesson: true, game: true, activity: true },
        orderBy: { completedAt: "desc" },
      },
      storyProgress: {
        include: { story: true },
      },
    },
  });

  if (!child || child.parent.email !== email) notFound();

  const totalCompleted = child.progress.length;
  const quizResults = child.progress.filter((p) => p.score !== null);
  const avgScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((sum, p) => sum + (p.score ?? 0), 0) /
            quizResults.length
        )
      : null;

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav className="text-sm text-chalkboard/60">
        <Link href="/">Home</Link> / <Link href="/dashboard">Dashboard</Link>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{child.firstName}</h1>
      <p className="mt-1 text-chalkboard/70">Ages {child.ageBand}</p>

<Link
  href="/alphabet/a"
  className="mt-4 inline-block rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold"
>
  Start Learning the Alphabet →
</Link>

      {/* Progress overview */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-block border border-chalkboard/10 p-5 shadow-block">
          <p className="text-sm text-chalkboard/60">Lessons Completed</p>
          <p className="mt-1 text-3xl font-extrabold">{totalCompleted}</p>
        </div>
        <div className="rounded-block border border-chalkboard/10 p-5 shadow-block">
          <p className="text-sm text-chalkboard/60">Quiz Average</p>
          <p className="mt-1 text-3xl font-extrabold">
            {avgScore !== null ? `${avgScore}%` : "—"}
          </p>
        </div>
        <div className="rounded-block border border-chalkboard/10 p-5 shadow-block">
          <p className="text-sm text-chalkboard/60">Stories Read</p>
          <p className="mt-1 text-3xl font-extrabold">
            {child.storyProgress.filter((s) => s.completed).length}
          </p>
        </div>
      </div>
      {/* Quiz results */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Quiz Results</h2>
        {quizResults.length === 0 ? (
          <p className="mt-2 text-chalkboard/60">No quiz results yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {quizResults.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-block border border-chalkboard/10 px-4 py-3"
              >
                <span>{p.game?.title ?? p.lesson?.title ?? p.activity?.title ?? "Activity"}</span>
                <span className="font-bold">{p.score}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stories */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Story Time</h2>
        {child.storyProgress.length === 0 ? (
          <div className="mt-4 rounded-block border border-dashed border-chalkboard/20 p-6 text-center">
            <p className="font-display font-bold">Coming Soon</p>
            <p className="mt-1 text-sm text-chalkboard/60">
              Story adventures for {child.firstName} are on the way!
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {child.storyProgress.map((sp) => (
              <li
                key={sp.id}
                className="flex items-center justify-between rounded-block border border-chalkboard/10 px-4 py-3"
              >
                <span>{sp.story.title}</span>
                <span className="text-sm text-chalkboard/60">
                  {sp.completed ? "Completed" : `Page ${sp.lastPageRead}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Profile settings */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Profile Settings</h2>
        <ChildActions childId={child.id} firstName={child.firstName} ageBand={child.ageBand} />
      </div>
    </main>
  );
}
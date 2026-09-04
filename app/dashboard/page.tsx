import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddChildForm from "./add-child-form";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const user = email
    ? await prisma.user.findUnique({
        where: { email },
        include: { children: { include: { progress: true } }, subscription: true },
      })
    : null;

  const children = user?.children ?? [];
  const plan = user?.subscription?.plan ?? "FREE";

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <span className="rounded-full bg-crayon-yellow px-4 py-1 font-display font-bold text-sm">
          {plan === "FREE" ? "Free Plan" : "Pro"}
        </span>
      </div>

      {children.length === 0 ? (
        <div className="mt-10 rounded-block border border-dashed border-chalkboard/20 p-10 text-center">
          <h2 className="font-display font-bold text-lg">No child profiles yet</h2>
          <p className="mt-2 text-chalkboard/70">
            Add a child profile to start tracking alphabet and phonics progress.
          </p>
          <div className="mt-5 flex justify-center">
            <AddChildForm />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {children.map((child) => {
              const completed = child.progress.length;
              return (
                <div key={child.id} className="rounded-block border border-chalkboard/10 p-6 shadow-block">
                  <h2 className="font-display font-bold text-xl">{child.firstName}</h2>
                  <p className="text-sm text-chalkboard/60">Ages {child.ageBand}</p>
                  <p className="mt-4 text-chalkboard/80">{completed} lessons completed</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <AddChildForm />
          </div>
        </>
      )}

      {plan === "FREE" && (
        <div className="mt-10 rounded-block bg-chalkboard text-paper p-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display font-bold">Unlock every worksheet, game, and phonics lesson.</p>
          <a href="/pricing" className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-5 py-2.5">
            See Pro Plans
          </a>
        </div>
      )}
    </main>
  );
}

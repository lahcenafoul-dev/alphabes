import Link from "next/link";
import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main id="main-content" className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-extrabold text-center">Log In</h1>
      <p className="mt-2 text-center text-chalkboard/70">
        Welcome back! Log in to see your child&apos;s progress.
      </p>
      <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-chalkboard/70">
        New here?{" "}
        <Link href="/register" className="font-bold text-crayon-blue">
          Create an account
        </Link>
      </p>
    </main>
  );
}

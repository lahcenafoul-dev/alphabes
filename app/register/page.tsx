import Link from "next/link";
import type { Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create an Account",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <main id="main-content" className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-extrabold text-center">Create Your Free Account</h1>
      <p className="mt-2 text-center text-chalkboard/70">
        Start with basic alphabet lessons, worksheets, and games — free.
      </p>
      <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-chalkboard/70">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-crayon-blue">
          Log in
        </Link>
      </p>
    </main>
  );
}

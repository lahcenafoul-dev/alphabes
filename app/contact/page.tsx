import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AlphaBes team.",
  alternates: { canonical: "https://alphabes.com/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-extrabold text-center">Contact Us</h1>
      <p className="mt-2 text-center text-chalkboard/70">
        Questions, feedback, or a bug to report? Send us a message.
      </p>
      <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
        <ContactForm />
      </div>
    </main>
  );
}

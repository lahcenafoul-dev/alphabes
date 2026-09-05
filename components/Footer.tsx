import Link from "next/link";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/alphabet", label: "Alphabet" },
      { href: "/stories", label: "storytime" },
      { href: "/phonics", label: "Phonics" },
      { href: "/worksheets", label: "Worksheets" },
      { href: "/games", label: "Games" },
      { href: "/flashcards", label: "Flashcards" },
      { href: "/activities", label: "Activities" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/login", label: "Log In" },
      { href: "/register", label: "Sign Up" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-chalkboard text-paper mt-16">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-display font-bold text-sm uppercase tracking-wide text-paper/60">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-paper/80 hover:text-paper text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-paper/60">
          <p>&copy; {new Date().getFullYear()} AlphaBes. All rights reserved.</p>
          <p>Made for curious learners ages 3-8.</p>
        </div>
      </div>
    </footer>
  );
}

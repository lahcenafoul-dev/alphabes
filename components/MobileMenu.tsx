"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

type Props = {
  items: Item[];
  account: Item;
  menuLabel: string;
  closeLabel: string;
  navLabel: string;
};

export default function MobileMenu({ items, account, menuLabel, closeLabel, navLabel }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-block border-2 border-chalkboard/15"
      >
        <span className="sr-only">{open ? closeLabel : menuLabel}</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label={navLabel}
          className="absolute inset-x-0 top-full z-40 border-b border-chalkboard/10 bg-paper shadow-block"
        >
          <ul className="mx-auto max-w-6xl px-6 py-4 space-y-1 font-display font-bold text-lg">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-block px-3 py-2 hover:bg-crayon-blue/10">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={account.href}
                className="block rounded-block bg-crayon-yellow px-3 py-2 text-center shadow-block"
              >
                {account.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

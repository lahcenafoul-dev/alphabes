"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

type Props = {
  /** `children` are listed under their item, indented (the worksheet types under "Worksheets"). */
  items: (Item & { children?: Item[] })[];
  account: Item;
  menuLabel: string;
  closeLabel: string;
  navLabel: string;
  /** "owl": the home page's look (components/home/OwlHome.tsx). */
  variant?: "site" | "owl";
};

const STYLES = {
  site: {
    button: "flex h-10 w-10 items-center justify-center rounded-block border-2 border-chalkboard/15",
    nav: "absolute inset-x-0 top-full z-40 border-b border-chalkboard/10 bg-paper shadow-block",
    list: "mx-auto max-w-6xl px-6 py-4 space-y-1 font-display font-bold text-lg",
    item: "block rounded-block px-3 py-2 hover:bg-crayon-blue/10",
    account: "block rounded-block bg-crayon-yellow px-3 py-2 text-center shadow-block",
  },
  owl: {
    button:
      "flex h-10 w-10 items-center justify-center rounded-full bg-white text-owl-ink shadow-[0_0_0_1px_rgba(29,24,70,.12)] hover:text-owl-purple",
    nav: "absolute inset-x-0 top-full z-40 px-4 pb-4 sm:px-6",
    list: "mx-auto max-w-[1200px] space-y-1 rounded-[28px] bg-white p-3 font-display text-lg font-extrabold text-owl-ink shadow-[0_24px_40px_-20px_rgba(29,24,70,.35),0_0_0_1px_rgba(29,24,70,.06)]",
    item: "block rounded-full px-4 py-2.5 hover:bg-owl-lilac hover:text-owl-purple",
    account: "owl-btn owl-btn-purple w-full",
  },
};

export default function MobileMenu({ items, account, menuLabel, closeLabel, navLabel, variant = "site" }: Props) {
  const style = STYLES[variant];
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
        className={style.button}
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
          className={style.nav}
        >
          <ul className={style.list}>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={style.item}>
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-4 border-l-2 border-current/10 pl-2 text-base">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className={style.item}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={account.href}
                className={style.account}
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

"use client";

import { useEffect, useRef, useState } from "react";

// The yellow line of "A clear path from A to Z": it fills once the section
// scrolls into view (globals.css, owl-grow). Without JavaScript, or for
// visitors who ask for less motion, it is simply full.
export default function PathLine() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    setInView(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-in-view={inView === null ? undefined : String(inView)}
      aria-hidden="true"
      className="absolute left-[6%] right-[6%] top-9 hidden h-2 rounded-full bg-[#3A3470] lg:block"
    >
      <div className="owl-grow h-full w-full rounded-full bg-owl-sun" />
    </div>
  );
}

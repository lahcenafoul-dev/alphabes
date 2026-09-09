"use client";

// Every game picks its starting round with Math.random() during its
// initial render. That produced a different result on the server vs.
// during client hydration, which React flagged as a hydration mismatch
// (errors #418/#423/#425) -- confirmed via real-browser testing. Rendering
// `fallback` during SSR and only mounting `children` after the client has
// hydrated means the random content is never part of the server-rendered
// HTML at all, so there's nothing for the client to mismatch against.
import { useEffect, useState, type ReactNode } from "react";

export default function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}

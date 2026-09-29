import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and next/navigation. <Link
// href="/pricing"> renders /pricing in English and /fr/tarifs in French.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// In-memory sliding window; swap for Upstash/Redis in a multi-instance
// deployment so limits are shared across serverless instances.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth/callback/credentials")) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(`login:${ip}`)) {
      return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
    }
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/auth/callback/credentials"],
};

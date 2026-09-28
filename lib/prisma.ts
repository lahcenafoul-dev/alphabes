import { cache } from "react";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// One client per request. On Cloudflare Workers a Neon WebSocket opened in
// one request cannot be reused by another ("Cannot perform I/O on behalf of
// a different request"), so a module-level singleton breaks. React's cache()
// shares the client within a single server render; route handlers and
// callbacks call getPrisma() once at the top and reuse the result.
export const getPrisma = cache(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter: new PrismaNeon(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
});

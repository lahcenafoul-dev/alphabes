// Server only: never import from a "use client" file. PAYPAL_CLIENT_SECRET
// must not reach the browser, and nothing here may log it.
//
// Settings are read per call, not at module load, so the Workers runtime
// secrets are seen (as in lib/stripe.ts before it). See docs/paypal-plan.md.

export type PayPalMode = "sandbox" | "live";

export function paypalMode(): PayPalMode {
  return process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
}

export function paypalBaseUrl(mode: PayPalMode = paypalMode()): string {
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

// A PayPal API failure. The message carries the status, PayPal's error name
// and debug_id (for PayPal support), never the request or the credentials.
export class PayPalError extends Error {
  constructor(
    readonly status: number,
    readonly errorName: string | undefined,
    readonly debugId: string | undefined,
    what: string,
  ) {
    super(`PayPal ${what} failed (${status}${errorName ? ` ${errorName}` : ""}${debugId ? `, debug_id ${debugId}` : ""})`);
    this.name = "PayPalError";
  }
}

// Access tokens last about 9 hours. Cached per Workers isolate (a token
// isn't a connection, so sharing it between requests is fine), refreshed a
// minute before it expires; a new isolate simply asks for a new one.
let cachedToken: { key: string; value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not configured.");
  }
  const mode = paypalMode();
  const key = `${mode}:${clientId}`;
  const now = Date.now();
  if (cachedToken && cachedToken.key === key && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.value;
  }

  const res = await fetch(`${paypalBaseUrl(mode)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw await paypalError(res, "token request");

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { key, value: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return data.access_token;
}

async function paypalError(res: Response, what: string): Promise<PayPalError> {
  const data = (await res.json().catch(() => null)) as { name?: string; error?: string; debug_id?: string } | null;
  return new PayPalError(res.status, data?.name ?? data?.error, data?.debug_id, what);
}

export interface PayPalFetchOptions {
  method?: "GET" | "POST" | "PATCH";
  // An object is sent as JSON; a string is sent exactly as given (the
  // webhook check needs the event's raw bytes).
  body?: unknown;
  // Makes a retried POST safe: PayPal returns the first result again.
  requestId?: string;
}

// Every PayPal API call goes through here.
export async function paypalFetch<T>(path: string, options: PayPalFetchOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${await getAccessToken()}`,
    "Content-Type": "application/json",
  };
  if (options.requestId) headers["PayPal-Request-Id"] = options.requestId;

  const res = await fetch(`${paypalBaseUrl()}${path}`, {
    method,
    headers,
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body),
    cache: "no-store",
  });
  if (!res.ok) throw await paypalError(res, `${method} ${path.split("?")[0]}`);

  // Some actions (cancel, suspend) answer 204 No Content.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

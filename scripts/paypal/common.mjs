// Shared by the PayPal setup scripts (docs/paypal-plan.md). Run them with
// the settings loaded from .env:  node --env-file=.env scripts/paypal/<script>.mjs
//
// Secrets are never printed. In sandbox mode the IDs a script creates are
// written into .env without printing them; in live mode (PAYPAL_MODE=live,
// plus --live to confirm) they're printed for the owner to paste into
// Cloudflare, so the owner runs live mode in their own terminal.

import { readFileSync, writeFileSync } from "node:fs";

export const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
export const baseUrl = mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export function checkMode(argv) {
  if (mode === "live" && !argv.includes("--live")) {
    console.error("PAYPAL_MODE is live. Add --live to confirm, and run this in your own terminal: it prints the new IDs.");
    process.exit(1);
  }
  if (mode === "sandbox" && argv.includes("--live")) {
    console.error("--live given but PAYPAL_MODE is not live.");
    process.exit(1);
  }
}

async function token() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    console.error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET missing. Run with --env-file=.env.");
    process.exit(1);
  }
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal token request failed (${res.status})`);
  return (await res.json()).access_token;
}

let cached;

// A PayPal API call. Errors show the status, PayPal's error name and its
// details, never the credentials.
export async function api(method, path, body, requestId) {
  cached ??= await token();
  const headers = { Authorization: `Bearer ${cached}`, "Content-Type": "application/json" };
  if (requestId) headers["PayPal-Request-Id"] = requestId;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const err = new Error(
      `PayPal ${method} ${path} failed (${res.status} ${data?.name ?? ""}): ${data?.message ?? ""} ${JSON.stringify(data?.details ?? [])}`,
    );
    err.status = res.status;
    throw err;
  }
  return data;
}

// Sets KEY=value in the text of an env file: replaces the line if the key
// is there (commented-out lines are left alone), appends it otherwise.
// Keeps the file's line endings.
export function setEnvLine(text, key, value) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.length ? text.split(/\r?\n/) : [];
  const line = `${key}=${value}`;
  const i = lines.findIndex((l) => l.startsWith(`${key}=`));
  if (i >= 0) {
    lines[i] = line;
  } else {
    if (lines.length && lines[lines.length - 1] === "") lines.pop();
    lines.push(line, "");
  }
  return lines.join(eol);
}

// Saves IDs: into .env in sandbox mode (not printed), printed in live mode.
export function saveIds(ids) {
  if (mode === "live") {
    console.log("\nLive IDs. Paste them into Cloudflare (Workers & Pages → alphabes → Settings → Variables and Secrets, type Secret), then deploy:");
    for (const [k, v] of Object.entries(ids)) console.log(`  ${k}=${v}`);
    return;
  }
  let text = "";
  try {
    text = readFileSync(".env", "utf8");
  } catch {}
  for (const [k, v] of Object.entries(ids)) text = setEnvLine(text, k, v);
  writeFileSync(".env", text);
  console.log(`Written to .env (values not shown): ${Object.keys(ids).join(", ")}`);
}

// Registers (or moves) the PayPal webhook that sends subscription events to
// app/api/paypal/webhook (docs/paypal-plan.md):
//
//   node --env-file=.env scripts/paypal/setup-webhook.mjs https://<tunnel>/api/paypal/webhook
//   node --env-file=<live env file> scripts/paypal/setup-webhook.mjs https://alphabes.com/api/paypal/webhook --live
//
// If PAYPAL_WEBHOOK_ID is already set, that webhook is pointed at the new URL
// (a new tunnel address each time cloudflared starts) and keeps its ID;
// otherwise a webhook is created and its ID saved (.env in sandbox, printed
// in live).

import { api, checkMode, mode, saveIds } from "./common.mjs";
import { EVENT_TYPES } from "./events.mjs";

const argv = process.argv.slice(2);
checkMode(argv);
const url = argv.find((a) => !a.startsWith("--"));
if (!url || !/^https:\/\/[^/]+\/api\/paypal\/webhook$/.test(url)) {
  console.error("Usage: node --env-file=.env scripts/paypal/setup-webhook.mjs https://<host>/api/paypal/webhook [--live]");
  process.exit(1);
}

const event_types = EVENT_TYPES.map((name) => ({ name }));
const existing = process.env.PAYPAL_WEBHOOK_ID;
if (existing) {
  try {
    await api("PATCH", `/v1/notifications/webhooks/${encodeURIComponent(existing)}`, [
      { op: "replace", path: "/url", value: url },
      { op: "replace", path: "/event_types", value: event_types },
    ]);
    console.log(`[${mode}] Webhook updated: now sends to ${url} (ID unchanged).`);
    process.exit(0);
  } catch (err) {
    if (err.status !== 404) throw err;
    console.log(`[${mode}] PAYPAL_WEBHOOK_ID not found at PayPal; creating a new webhook.`);
  }
}
const hook = await api("POST", "/v1/notifications/webhooks", { url, event_types });
console.log(`[${mode}] Webhook created for ${url}.`);
saveIds({ PAYPAL_WEBHOOK_ID: hook.id });

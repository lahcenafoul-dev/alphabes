// Creates the "AlphaBes Pro" product and its plans in PayPal, once per
// environment (docs/paypal-plan.md):
//
//   node --env-file=.env scripts/paypal/setup-plans.mjs            # sandbox: IDs go into .env
//   node --env-file=<live env file> scripts/paypal/setup-plans.mjs --live   # live: IDs printed
//
// Plans: $7.99 a month, $59 a year (owner's decision B1), and in sandbox a
// $1 daily plan to watch renewals within a day. PayPal doesn't detect
// duplicates, so the script stops if the plan variables are already set
// (--force to create a new set anyway; the old plans stay in PayPal, where
// they can be deactivated).

import { api, checkMode, mode, saveIds } from "./common.mjs";

const argv = process.argv.slice(2);
checkMode(argv);

const VARS = mode === "live" ? ["PAYPAL_PLAN_MONTHLY", "PAYPAL_PLAN_YEARLY"] : ["PAYPAL_PLAN_MONTHLY", "PAYPAL_PLAN_YEARLY", "PAYPAL_PLAN_TEST"];
if (VARS.some((v) => process.env[v]) && !argv.includes("--force")) {
  console.error(`Already set: ${VARS.filter((v) => process.env[v]).join(", ")}. Use --force to create new plans.`);
  process.exit(1);
}

const run = Date.now();

const product = await api(
  "POST",
  "/v1/catalogs/products",
  {
    name: "AlphaBes Pro",
    description: "AlphaBes Pro: premium alphabet games, stories and printable bundles for children 3-8.",
    type: "DIGITAL",
    home_url: "https://alphabes.com",
  },
  `alphabes-product-${run}`,
);
console.log(`[${mode}] Product created.`);

async function plan(key, name, interval_unit, price) {
  const p = await api(
    "POST",
    "/v1/billing/plans",
    {
      product_id: product.id,
      name,
      description: `${name}. Renews automatically; cancel any time.`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit, interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // renews until canceled
          pricing_scheme: { fixed_price: { value: price, currency_code: "USD" } },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        // Suspended after 2 failed attempts at a renewal.
        payment_failure_threshold: 2,
      },
    },
    `alphabes-plan-${key}-${run}`,
  );
  console.log(`[${mode}] Plan created: ${name}.`);
  return p.id;
}

const ids = {
  PAYPAL_PLAN_MONTHLY: await plan("monthly", "AlphaBes Pro Monthly", "MONTH", "7.99"),
  PAYPAL_PLAN_YEARLY: await plan("yearly", "AlphaBes Pro Yearly", "YEAR", "59.00"),
};
if (mode === "sandbox") ids.PAYPAL_PLAN_TEST = await plan("test", "AlphaBes Pro Daily (sandbox test)", "DAY", "1.00");

saveIds(ids);

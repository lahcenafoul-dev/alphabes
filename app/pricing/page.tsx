import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare AlphaBes Free and Pro plans. Pro is $7.99/month or $59/year.",
  alternates: { canonical: "https://alphabes.com/pricing" },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    priceId: null,
    features: [
      "Basic alphabet lessons",
      "Selected worksheets",
      "Basic games",
    ],
  },
  {
    name: "Pro Monthly",
    price: "$7.99",
    period: "/month",
    priceId: "price_pro_monthly", // set to a real Stripe Price ID
    features: [
      "All worksheets",
      "All games",
      "Full phonics library",
      "Progress tracking",
      "Premium activities",
      "Printable bundles",
    ],
  },
  {
    name: "Pro Annual",
    price: "$59",
    period: "/year",
    priceId: "price_pro_annual",
    features: [
      "Everything in Pro Monthly",
      "2 months free vs. monthly",
    ],
  },
];

export default function PricingPage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center">Pricing</h1>
      <p className="mt-2 text-center text-chalkboard/70">
        Start free. Upgrade any time.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-block border border-chalkboard/10 p-6 shadow-block flex flex-col"
          >
            <h2 className="font-display font-bold text-xl">{plan.name}</h2>
            <p className="mt-2 text-3xl font-extrabold">
              {plan.price}
              <span className="text-base font-normal">{plan.period}</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-chalkboard/70 flex-1">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            {plan.priceId ? (
              <form action="/api/stripe/checkout" method="POST" className="mt-6">
                <input type="hidden" name="priceId" value={plan.priceId} />
                <button
                  type="submit"
                  className="w-full rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
                >
                  Choose {plan.name}
                </button>
              </form>
            ) : (
              <a
                href="/register"
                className="mt-6 block text-center rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
              >
                Start Free
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

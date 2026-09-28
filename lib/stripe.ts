import Stripe from "stripe";

// Built per call rather than at module load so the secret is read at request
// time (Workers runtime secrets), and using fetch because Cloudflare Workers
// has no Node http module for Stripe's default client.
export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

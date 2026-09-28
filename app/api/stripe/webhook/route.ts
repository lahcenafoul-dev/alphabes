import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const prisma = getPrisma();
  // Stripe webhooks must read the raw body to verify the signature.
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Async variant: Workers only has Web Crypto, which is async.
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const priceId = sub.items.data[0]?.price.id;

      const plan =
        priceId === process.env.STRIPE_PRICE_PRO_ANNUAL
          ? "PRO_ANNUAL"
          : priceId === process.env.STRIPE_PRICE_PRO_MONTHLY
          ? "PRO_MONTHLY"
          : "FREE";

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          plan,
          status: sub.status.toUpperCase() as any,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { plan: "FREE", status: "CANCELED" },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const ALLOWED_PRICE_IDS = new Set([
  process.env.STRIPE_PRICE_PRO_MONTHLY,
  process.env.STRIPE_PRICE_PRO_ANNUAL,
]);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login?next=/pricing", req.url));
  }

  const form = await req.formData();
  const priceId = form.get("priceId");

  // Never trust a client-submitted Stripe price ID directly -- only allow
  // the price IDs configured server-side.
  if (typeof priceId !== "string" || !ALLOWED_PRICE_IDS.has(priceId)) {
    return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session.user.email as string },
    include: { subscription: true },
  });

  let customerId = user.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=canceled`,
    allow_promotion_codes: true,
  });

  return NextResponse.redirect(checkoutSession.url as string, 303);
}

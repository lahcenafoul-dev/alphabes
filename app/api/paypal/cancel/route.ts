import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/billing/same-origin";
import { syncSubscription } from "@/lib/billing/sync";
import { cancelSubscription } from "@/lib/paypal/subscriptions";

// "Cancel subscription" on the dashboard. Stops future payments at PayPal;
// Pro stays until the end of the paid period (docs/paypal-plan.md, B5).
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden.", code: "forbidden" }, { status: 403 });
  }
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Please log in first.", code: "unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
  const sub = user?.subscription;
  if (!user || !sub?.paypalSubscriptionId || (sub.status !== "ACTIVE" && sub.status !== "SUSPENDED")) {
    return NextResponse.json(
      { error: "There is no subscription to cancel.", code: "no_subscription" },
      { status: 404 },
    );
  }

  try {
    await cancelSubscription(sub.paypalSubscriptionId, "Canceled by the parent on alphabes.com");
    const synced = await syncSubscription(prisma, sub.paypalSubscriptionId, { expectUserId: user.id });
    if (synced.result !== "updated") throw new Error(`sync ${synced.result}`);
    return NextResponse.json({ status: synced.status, pro: synced.pro });
  } catch (err) {
    console.error("PayPal: cancel failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "PayPal couldn't cancel the subscription. Please try again.", code: "paypal_error" },
      { status: 502 },
    );
  }
}

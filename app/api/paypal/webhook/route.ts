import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { syncSubscription } from "@/lib/billing/sync";
import {
  HANDLED_EVENTS,
  REFUND_EVENTS,
  isWebhookEvent,
  resolveSubscriptionId,
  verifyWebhookSignature,
} from "@/lib/paypal/webhooks";

const HANDLED: ReadonlySet<string> = new Set(HANDLED_EVENTS);

// PayPal subscription events: activation, renewal payments, failed
// payments, suspension, cancellation, expiry, refunds.
//
// 1. The signature is checked with PayPal before anything else (400 if not).
// 2. Each event id is recorded in PaymentEvent; an event already processed
//    is acknowledged without doing anything again.
// 3. The subscription's current state is copied from PayPal
//    (lib/billing/sync.ts), which is safe to repeat.
// An unexpected error answers 500 so PayPal delivers the event again later.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body.", code: "invalid_data" }, { status: 400 });
  }
  if (!isWebhookEvent(event)) {
    return NextResponse.json({ error: "Invalid body.", code: "invalid_data" }, { status: 400 });
  }

  let verified: boolean;
  try {
    verified = await verifyWebhookSignature(rawBody, req.headers);
  } catch (err) {
    console.error("PayPal webhook: signature check failed to run:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Try again.", code: "generic" }, { status: 500 });
  }
  if (!verified) {
    console.error(`PayPal webhook: invalid signature for ${event.event_type} ${event.id}`);
    return NextResponse.json({ error: "Invalid signature.", code: "invalid_signature" }, { status: 400 });
  }

  if (!HANDLED.has(event.event_type)) return NextResponse.json({ received: true });

  const prisma = getPrisma();
  try {
    const paypalId = await resolveSubscriptionId(event);
    if (!paypalId) {
      // Payments that aren't for a subscription (none are expected).
      return NextResponse.json({ received: true });
    }

    // INSERT ... ON CONFLICT DO NOTHING: count 0 means we've seen this event.
    const { count } = await prisma.paymentEvent.createMany({
      data: [{ id: event.id, type: event.event_type, resourceId: paypalId }],
      skipDuplicates: true,
    });
    if (count === 0) {
      const seen = await prisma.paymentEvent.findUnique({ where: { id: event.id } });
      if (seen?.processedAt) return NextResponse.json({ received: true, duplicate: true });
      // Recorded but not finished (an earlier attempt failed): process again.
    }

    const result = await syncSubscription(prisma, paypalId, { refunded: REFUND_EVENTS.has(event.event_type) });
    if (result.result !== "updated") {
      console.warn(`PayPal webhook: ${event.event_type} ${event.id} for ${paypalId}: ${result.result}${"reason" in result ? ` (${result.reason})` : ""}`);
    }
    await prisma.paymentEvent.update({ where: { id: event.id }, data: { processedAt: new Date() } });
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`PayPal webhook: ${event.event_type} ${event.id} failed:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Try again.", code: "generic" }, { status: 500 });
  }
}

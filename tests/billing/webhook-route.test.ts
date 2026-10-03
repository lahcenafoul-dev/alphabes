import { beforeEach, describe, expect, it, vi } from "vitest";

// The route with the database, PayPal and the sync replaced by fakes, to
// check signature handling and that an event is never processed twice.

const events = new Map<string, { processedAt: Date | null }>();
const prisma = {
  paymentEvent: {
    createMany: vi.fn(async ({ data }: { data: { id: string }[] }) => {
      if (events.has(data[0].id)) return { count: 0 };
      events.set(data[0].id, { processedAt: null });
      return { count: 1 };
    }),
    findUnique: vi.fn(async ({ where }: { where: { id: string } }) => events.get(where.id) ?? null),
    update: vi.fn(async ({ where, data }: { where: { id: string }; data: { processedAt: Date } }) => {
      events.get(where.id)!.processedAt = data.processedAt;
    }),
  },
};
vi.mock("@/lib/prisma", () => ({ getPrisma: () => prisma }));

const verify = vi.fn(async () => true);
const resolve = vi.fn(async () => "I-SUB0000001");
vi.mock("@/lib/paypal/webhooks", async (orig) => ({
  ...(await orig<typeof import("@/lib/paypal/webhooks")>()),
  verifyWebhookSignature: (...a: unknown[]) => verify(...(a as [])),
  resolveSubscriptionId: (...a: unknown[]) => resolve(...(a as [])),
}));

const sync = vi.fn(async () => ({ result: "updated", userId: "u1", status: "ACTIVE", pro: true }));
vi.mock("@/lib/billing/sync", () => ({ syncSubscription: (...a: unknown[]) => sync(...(a as [])) }));

const { POST } = await import("@/app/api/paypal/webhook/route");

const post = (body: string) =>
  POST(new Request("https://alphabes.com/api/paypal/webhook", { method: "POST", body }) as never);
const event = (id: string, event_type = "PAYMENT.SALE.COMPLETED") =>
  JSON.stringify({ id, event_type, resource: { id: "SALE1", billing_agreement_id: "I-SUB0000001" } });

beforeEach(() => {
  events.clear();
  vi.clearAllMocks();
  verify.mockResolvedValue(true);
  sync.mockResolvedValue({ result: "updated", userId: "u1", status: "ACTIVE", pro: true });
});

describe("POST /api/paypal/webhook", () => {
  it("rejects a body that isn't a PayPal event", async () => {
    expect((await post("not json")).status).toBe(400);
    expect((await post('{"id":"x"}')).status).toBe(400);
    expect(verify).not.toHaveBeenCalled();
  });

  it("rejects an event whose signature PayPal doesn't confirm, changing nothing", async () => {
    verify.mockResolvedValue(false);
    const res = await post(event("WH-1"));
    expect(res.status).toBe(400);
    expect(prisma.paymentEvent.createMany).not.toHaveBeenCalled();
    expect(sync).not.toHaveBeenCalled();
  });

  it("passes the raw body to the signature check", async () => {
    const body = event("WH-RAW");
    await post(body);
    expect(verify).toHaveBeenCalledWith(body, expect.any(Headers));
  });

  it("acknowledges events it doesn't handle without touching the database", async () => {
    const res = await post(event("WH-2", "CHECKOUT.ORDER.APPROVED"));
    expect(res.status).toBe(200);
    expect(prisma.paymentEvent.createMany).not.toHaveBeenCalled();
    expect(sync).not.toHaveBeenCalled();
  });

  it("processes an event once, however often PayPal sends it", async () => {
    expect((await post(event("WH-3"))).status).toBe(200);
    expect(sync).toHaveBeenCalledTimes(1);
    expect(sync).toHaveBeenCalledWith(prisma, "I-SUB0000001", { refunded: false });
    expect(events.get("WH-3")?.processedAt).toBeInstanceOf(Date);

    const again = await post(event("WH-3"));
    expect(again.status).toBe(200);
    expect(await again.json()).toMatchObject({ duplicate: true });
    expect(sync).toHaveBeenCalledTimes(1);
  });

  it("answers 500 when processing fails, and processes the retry", async () => {
    sync.mockRejectedValueOnce(new Error("PayPal down"));
    expect((await post(event("WH-4"))).status).toBe(500);
    expect(events.get("WH-4")?.processedAt).toBeNull();
    expect((await post(event("WH-4"))).status).toBe(200);
    expect(sync).toHaveBeenCalledTimes(2);
    expect(events.get("WH-4")?.processedAt).toBeInstanceOf(Date);
  });

  it("treats refunds and reversals as refunds", async () => {
    await post(event("WH-5", "PAYMENT.SALE.REFUNDED"));
    await post(event("WH-6", "PAYMENT.SALE.REVERSED"));
    await post(event("WH-7", "BILLING.SUBSCRIPTION.CANCELLED"));
    expect(sync.mock.calls.map((c) => (c as unknown[])[2])).toEqual([
      { refunded: true },
      { refunded: true },
      { refunded: false },
    ]);
  });

  it("acknowledges a payment that isn't for a subscription", async () => {
    resolve.mockResolvedValueOnce(null as never);
    expect((await post(event("WH-8"))).status).toBe(200);
    expect(sync).not.toHaveBeenCalled();
  });
});

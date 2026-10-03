-- PayPal Subscriptions, migration 1 (additive; docs/paypal-plan.md).
-- The Stripe columns stay until migration 2: the code live when this runs
-- still selects them.

-- AlterEnum (needs PostgreSQL 12+; Neon is newer)
ALTER TYPE "SubscriptionStatus" ADD VALUE 'APPROVAL_PENDING';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'SUSPENDED';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "lastPaymentAt" TIMESTAMP(3),
ADD COLUMN     "paypalPlanId" TEXT,
ADD COLUMN     "paypalSubscriptionId" TEXT,
ADD COLUMN     "syncedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentEvent_resourceId_idx" ON "PaymentEvent"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_paypalSubscriptionId_key" ON "Subscription"("paypalSubscriptionId");

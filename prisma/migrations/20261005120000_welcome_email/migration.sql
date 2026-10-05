-- "Welcome to Pro" email, sent once per PayPal subscription (docs/paypal-plan.md,
-- phase 7). Additive.

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "welcomeEmailFor" TEXT;

-- Subscriptions that started before this email existed don't get one late.
UPDATE "Subscription" SET "welcomeEmailFor" = "paypalSubscriptionId" WHERE "paypalSubscriptionId" IS NOT NULL;

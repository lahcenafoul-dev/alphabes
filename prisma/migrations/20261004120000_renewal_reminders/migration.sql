-- Yearly renewal reminder emails (docs/paypal-plan.md, phase 6b). Additive.

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "renewalReminderFor" TIMESTAMP(3);

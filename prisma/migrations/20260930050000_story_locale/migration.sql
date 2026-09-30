-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'FR');

-- AlterTable
ALTER TABLE "ChildProfile" ADD COLUMN     "language" "Locale" NOT NULL DEFAULT 'EN';

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'EN',
ADD COLUMN     "translationGroup" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'EN';

-- CreateIndex
CREATE INDEX "Story_locale_order_idx" ON "Story"("locale", "order");


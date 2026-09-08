-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('FIND_THE_LETTER', 'MATCH_LETTER_PICTURE', 'BEGINNING_SOUND', 'LETTER_TRACING', 'ALPHABET_QUIZ');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('RECOGNITION', 'TRACING', 'BEGINNING_SOUND', 'VOCABULARY');

-- CreateEnum
CREATE TYPE "PhonicsSkill" AS ENUM ('LETTER_SOUNDS', 'BEGINNING_SOUNDS', 'CVC_WORDS', 'BLENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PARENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO_MONTHLY', 'PRO_ANNUAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "letterId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildProfile" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "ageBand" TEXT NOT NULL,
    "avatarKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "letterId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "letterId" TEXT NOT NULL,
    "type" "LessonType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "uppercase" TEXT NOT NULL,
    "lowercase" TEXT NOT NULL,
    "phonicsSound" TEXT NOT NULL,
    "audioUrl" TEXT,
    "order" INTEGER NOT NULL,
    "exampleWords" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhonicsLesson" (
    "id" TEXT NOT NULL,
    "letterId" TEXT,
    "skill" "PhonicsSkill" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhonicsLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT,
    "gameId" TEXT,
    "activityId" TEXT,
    "score" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coverUrl" TEXT,
    "ageRangeMin" INTEGER NOT NULL,
    "ageRangeMax" INTEGER NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryPage" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "audioUrl" TEXT,

    CONSTRAINT "StoryPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryProgress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "lastPageRead" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PARENT',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worksheet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "letterId" TEXT,
    "ageRangeMin" INTEGER NOT NULL,
    "ageRangeMax" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worksheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorksheetCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "WorksheetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug" ASC);

-- CreateIndex
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt" ASC);

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug" ASC);

-- CreateIndex
CREATE INDEX "ChildProfile_parentId_idx" ON "ChildProfile"("parentId" ASC);

-- CreateIndex
CREATE INDEX "Flashcard_letterId_idx" ON "Flashcard"("letterId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug" ASC);

-- CreateIndex
CREATE INDEX "Lesson_letterId_idx" ON "Lesson"("letterId" ASC);

-- CreateIndex
CREATE INDEX "Letter_order_idx" ON "Letter"("order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Letter_order_key" ON "Letter"("order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Letter_slug_key" ON "Letter"("slug" ASC);

-- CreateIndex
CREATE INDEX "PhonicsLesson_skill_idx" ON "PhonicsLesson"("skill" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PhonicsLesson_slug_key" ON "PhonicsLesson"("slug" ASC);

-- CreateIndex
CREATE INDEX "Progress_activityId_idx" ON "Progress"("activityId" ASC);

-- CreateIndex
CREATE INDEX "Progress_childId_idx" ON "Progress"("childId" ASC);

-- CreateIndex
CREATE INDEX "Progress_gameId_idx" ON "Progress"("gameId" ASC);

-- CreateIndex
CREATE INDEX "Progress_lessonId_idx" ON "Progress"("lessonId" ASC);

-- CreateIndex
CREATE INDEX "Story_order_idx" ON "Story"("order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug" ASC);

-- CreateIndex
CREATE INDEX "StoryPage_storyId_idx" ON "StoryPage"("storyId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StoryPage_storyId_pageNumber_key" ON "StoryPage"("storyId" ASC, "pageNumber" ASC);

-- CreateIndex
CREATE INDEX "StoryProgress_childId_idx" ON "StoryProgress"("childId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StoryProgress_childId_storyId_key" ON "StoryProgress"("childId" ASC, "storyId" ASC);

-- CreateIndex
CREATE INDEX "StoryProgress_storyId_idx" ON "StoryProgress"("storyId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId" ASC);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- CreateIndex
CREATE INDEX "Worksheet_categoryId_idx" ON "Worksheet"("categoryId" ASC);

-- CreateIndex
CREATE INDEX "Worksheet_isPremium_idx" ON "Worksheet"("isPremium" ASC);

-- CreateIndex
CREATE INDEX "Worksheet_letterId_idx" ON "Worksheet"("letterId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Worksheet_slug_key" ON "Worksheet"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "WorksheetCategory_slug_key" ON "WorksheetCategory"("slug" ASC);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProfile" ADD CONSTRAINT "ChildProfile_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhonicsLesson" ADD CONSTRAINT "PhonicsLesson_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryPage" ADD CONSTRAINT "StoryPage_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryProgress" ADD CONSTRAINT "StoryProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryProgress" ADD CONSTRAINT "StoryProgress_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worksheet" ADD CONSTRAINT "Worksheet_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WorksheetCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worksheet" ADD CONSTRAINT "Worksheet_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE SET NULL ON UPDATE CASCADE;


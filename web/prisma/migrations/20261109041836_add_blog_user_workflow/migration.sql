-- CreateEnum
CREATE TYPE "BlogReviewStage" AS ENUM ('DRAFT', 'SUBMITTED', 'RETURNED', 'APPROVED');

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "ownerId" INTEGER,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewStage" "BlogReviewStage" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" INTEGER,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- Backfill: existing public content must stay public after the workflow
-- column lands. Only status=PUBLISHED rows move to APPROVED; every
-- other BlogPost (drafts, archived, legacy placeholders) keeps the new
-- DRAFT default. Nothing is deleted, renamed, or rewritten.
UPDATE "BlogPost" SET "reviewStage" = 'APPROVED' WHERE "status" = 'PUBLISHED';

-- CreateTable
CREATE TABLE "BlogUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogUser_email_key" ON "BlogUser"("email");

-- CreateIndex
CREATE INDEX "BlogPost_ownerId_status_idx" ON "BlogPost"("ownerId", "status");

-- CreateIndex
CREATE INDEX "BlogPost_reviewStage_status_idx" ON "BlogPost"("reviewStage", "status");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "BlogUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

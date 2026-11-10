-- CreateEnum
CREATE TYPE "ContributorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'ACCEPTED', 'FAILED');

-- AlterTable
ALTER TABLE "BlogUser" ADD COLUMN     "applicationId" INTEGER;

-- CreateTable
CREATE TABLE "ContributorApplication" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "professionalRole" TEXT NOT NULL,
    "company" TEXT,
    "bio" TEXT NOT NULL,
    "linkedInUrl" TEXT,
    "portfolioUrl" TEXT,
    "contributionReason" TEXT NOT NULL,
    "status" "ContributorApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "approvedBlogUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributorInvitation" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "blogUserId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "sentStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "providerId" TEXT,
    "deliveryError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributorInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContributorApplication_approvedBlogUserId_key" ON "ContributorApplication"("approvedBlogUserId");

-- CreateIndex
CREATE INDEX "ContributorApplication_status_createdAt_idx" ON "ContributorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContributorApplication_email_status_idx" ON "ContributorApplication"("email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ContributorInvitation_applicationId_key" ON "ContributorInvitation"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ContributorInvitation_blogUserId_key" ON "ContributorInvitation"("blogUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ContributorInvitation_tokenHash_key" ON "ContributorInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "ContributorInvitation_expiresAt_idx" ON "ContributorInvitation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogUser_applicationId_key" ON "BlogUser"("applicationId");

-- Prisma cannot express partial unique indexes in schema.prisma; it is
-- declared here (committed migration history) and verified post-deploy.
-- Exactly one PENDING application per email; non-pending records keep
-- history. Cross-table (Admin/BlogUser) email conflicts stay app-checked.
CREATE UNIQUE INDEX "ContributorApplication_pending_email_unique"
  ON "ContributorApplication"("email")
  WHERE "status" = 'PENDING'::"ContributorApplicationStatus";

-- AddForeignKey
ALTER TABLE "BlogUser" ADD CONSTRAINT "BlogUser_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ContributorApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorApplication" ADD CONSTRAINT "ContributorApplication_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorInvitation" ADD CONSTRAINT "ContributorInvitation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ContributorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorInvitation" ADD CONSTRAINT "ContributorInvitation_blogUserId_fkey" FOREIGN KEY ("blogUserId") REFERENCES "BlogUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

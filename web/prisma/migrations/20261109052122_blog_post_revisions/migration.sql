-- CreateEnum
CREATE TYPE "BlogAuditAction" AS ENUM ('ASSIGNED', 'APPROVED', 'RETURNED', 'SLUG_CHANGED');

CREATE TABLE "BlogPostRevision" (
    "id" SERIAL NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Insights',
    "coverImage" TEXT,
    "author" TEXT NOT NULL DEFAULT 'WebEaz Technologies',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "reviewStage" "BlogReviewStage" NOT NULL DEFAULT 'DRAFT',
    "rejectionReason" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPostRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogSlugRedirect" (
    "oldSlug" TEXT NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogSlugRedirect_pkey" PRIMARY KEY ("oldSlug")
);

-- CreateTable
CREATE TABLE "BlogPostAudit" (
    "id" SERIAL NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "adminId" INTEGER,
    "action" "BlogAuditAction" NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPostAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogPostRevision_blogPostId_reviewStage_idx" ON "BlogPostRevision"("blogPostId", "reviewStage");

-- CreateIndex
CREATE INDEX "BlogPostRevision_reviewStage_submittedAt_idx" ON "BlogPostRevision"("reviewStage", "submittedAt");

-- Prisma cannot express partial unique indexes in schema.prisma; it is
-- declared here (committed migration history) and verified post-deploy.
-- Allows exactly one pending (non-APPROVED) revision per BlogPost.
CREATE UNIQUE INDEX "BlogPostRevision_pending_unique"
  ON "BlogPostRevision"("blogPostId")
  WHERE "reviewStage" IS DISTINCT FROM 'APPROVED'::"BlogReviewStage";

-- CreateIndex
CREATE INDEX "BlogPostAudit_blogPostId_createdAt_idx" ON "BlogPostAudit"("blogPostId", "createdAt");

-- AddForeignKey
ALTER TABLE "BlogPostRevision" ADD CONSTRAINT "BlogPostRevision_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostRevision" ADD CONSTRAINT "BlogPostRevision_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogSlugRedirect" ADD CONSTRAINT "BlogSlugRedirect_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostAudit" ADD CONSTRAINT "BlogPostAudit_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostAudit" ADD CONSTRAINT "BlogPostAudit_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

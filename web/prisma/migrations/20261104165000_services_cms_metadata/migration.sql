ALTER TABLE "ServiceCategory"
ADD COLUMN "image" TEXT;

ALTER TABLE "Service"
ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT;

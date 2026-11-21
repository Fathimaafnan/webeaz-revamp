-- CreateEnum
CREATE TYPE "HomepageLogoGroup" AS ENUM ('PARTNER', 'CLIENT');

-- CreateEnum
CREATE TYPE "CapabilityGroup" AS ENUM ('CAPABILITY', 'SOLUTION');

-- CreateEnum
CREATE TYPE "FooterLinkGroup" AS ENUM ('PRODUCTS', 'COMPANY', 'SUPPORT', 'LEGAL', 'SOCIAL');

-- AlterTable
ALTER TABLE "HomepageContent" ALTER COLUMN "ctaDescription" SET DEFAULT 'Have a business challenge, digital idea or transformation goal? Let''s create the right technology solution for your business.',
ALTER COLUMN "ctaLabel" SET DEFAULT 'Start a Conversation →';

-- CreateTable
CREATE TABLE "OfficeLocation" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionLabel" TEXT NOT NULL DEFAULT '',
    "addressLines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL DEFAULT '',
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "watermark" TEXT NOT NULL DEFAULT '',
    "flagUrl" TEXT NOT NULL,
    "mapImageUrl" TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
    "mapUrl" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "href" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageLogo" (
    "id" SERIAL NOT NULL,
    "group" "HomepageLogoGroup" NOT NULL,
    "name" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,
    "href" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageLogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapabilityCard" (
    "id" SERIAL NOT NULL,
    "group" "CapabilityGroup" NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '',
    "iconKey" TEXT NOT NULL DEFAULT 'software',
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapabilityCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" SERIAL NOT NULL,
    "industry" TEXT NOT NULL,
    "challenge" TEXT NOT NULL DEFAULT '',
    "solution" TEXT NOT NULL DEFAULT '',
    "technology" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterLink" (
    "id" SERIAL NOT NULL,
    "group" "FooterLinkGroup" NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "iconKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfficeLocation_code_key" ON "OfficeLocation"("code");

-- CreateIndex
CREATE INDEX "OfficeLocation_status_order_idx" ON "OfficeLocation"("status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_status_order_idx" ON "Product"("status", "order");

-- CreateIndex
CREATE INDEX "HomepageLogo_group_status_order_idx" ON "HomepageLogo"("group", "status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageLogo_group_name_key" ON "HomepageLogo"("group", "name");

-- CreateIndex
CREATE INDEX "CapabilityCard_group_status_order_idx" ON "CapabilityCard"("group", "status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "CapabilityCard_group_title_key" ON "CapabilityCard"("group", "title");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_industry_key" ON "CaseStudy"("industry");

-- CreateIndex
CREATE INDEX "CaseStudy_status_order_idx" ON "CaseStudy"("status", "order");

-- CreateIndex
CREATE INDEX "FooterLink_group_status_order_idx" ON "FooterLink"("group", "status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FooterLink_group_label_key" ON "FooterLink"("group", "label");

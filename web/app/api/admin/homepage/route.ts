import { revalidatePath } from "next/cache";
import { DEFAULT_HOME, DEFAULT_SECTIONS } from "@/lib/defaults";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  errorJson,
  hasOnlyKeys,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";

export const dynamic = "force-dynamic";

const HERO_FIELDS = [
  "heroEyebrow",
  "heroTitle",
  "heroDescription",
  "heroPrimaryLabel",
  "heroPrimaryHref",
  "heroSecondaryLabel",
  "heroSecondaryHref",
  "heroImage",
] as const;

const CTA_FIELDS = [
  "ctaEyebrow",
  "ctaTitle",
  "ctaDescription",
  "ctaLabel",
  "ctaHref",
] as const;

const FIELD_LIMITS: Record<string, number> = {
  heroEyebrow: 140,
  heroTitle: 180,
  heroDescription: 600,
  heroPrimaryLabel: 80,
  heroPrimaryHref: 2048,
  heroSecondaryLabel: 80,
  heroSecondaryHref: 2048,
  heroImage: 2048,
  ctaEyebrow: 140,
  ctaTitle: 180,
  ctaDescription: 600,
  ctaLabel: 80,
  ctaHref: 2048,
};

function isValidHref(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isValidHeroImage(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const content = await prisma.homepageContent.findFirst({
      select: {
        heroEyebrow: true,
        heroTitle: true,
        heroDescription: true,
        heroPrimaryLabel: true,
        heroPrimaryHref: true,
        heroSecondaryLabel: true,
        heroSecondaryHref: true,
        heroImage: true,
        ctaEyebrow: true,
        ctaTitle: true,
        ctaDescription: true,
        ctaLabel: true,
        ctaHref: true,
        updatedAt: true,
      },
    });
    return successJson({
      content: content
        ? { ...content, heroImage: content.heroImage ?? "" }
        : DEFAULT_HOME,
    });
  } catch (error) {
    console.error("admin homepage read failed:", error);
    return errorJson("Could not load homepage content.", 500);
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;
  const keys = Object.keys(body);
  const isHero = HERO_FIELDS.some((field) => keys.includes(field));
  const isCta = CTA_FIELDS.some((field) => keys.includes(field));
  const allowedFields = [...HERO_FIELDS, ...CTA_FIELDS];

  if (!keys.length || !hasOnlyKeys(body, allowedFields)) {
    return errorJson("Request contains missing or unsupported homepage fields.", 400);
  }
  if (
    (isHero && !HERO_FIELDS.every((field) => keys.includes(field))) ||
    (isCta && !CTA_FIELDS.every((field) => keys.includes(field))) ||
    (!isHero && !isCta)
  ) {
    return errorJson("Provide every field for the hero or final CTA section.", 400);
  }

  for (const [field, value] of Object.entries(body)) {
    if (
      typeof value !== "string" ||
      value.length > FIELD_LIMITS[field] ||
      ([
        "heroTitle",
        "heroDescription",
        "heroPrimaryLabel",
        "heroSecondaryLabel",
        "ctaTitle",
        "ctaDescription",
        "ctaLabel",
      ].includes(field) &&
        !value.trim())
    ) {
      return errorJson(`Invalid or missing value for ${field}.`, 400);
    }
  }

  if (
    (typeof body.heroPrimaryHref === "string" &&
      !isValidHref(body.heroPrimaryHref)) ||
    (typeof body.heroSecondaryHref === "string" &&
      !isValidHref(body.heroSecondaryHref)) ||
    (typeof body.ctaHref === "string" && !isValidHref(body.ctaHref))
  ) {
    return errorJson("CTA URLs must be site paths or valid HTTP(S) URLs.", 400);
  }
  if (
    typeof body.heroImage === "string" &&
    !isValidHeroImage(body.heroImage)
  ) {
    return errorJson("Hero image must be a site path or HTTPS URL.", 400);
  }

  const data = body as Record<string, string>;
  try {
    await prisma.$transaction(async (transaction) => {
      const updated = await transaction.homepageContent.updateMany({
        data,
      });
      if (updated.count === 0) {
        await transaction.homepageContent.create({ data });
      }

      if (isCta) {
        const finalCta = DEFAULT_SECTIONS.find(
          (section) => section.key === "final-cta",
        );
        if (!finalCta) {
          throw new Error("The existing final CTA section is not configured.");
        }
        await transaction.homepageSection.upsert({
          where: { key: finalCta.key },
          create: {
            key: finalCta.key,
            eyebrow: data.ctaEyebrow,
            title: data.ctaTitle,
            description: data.ctaDescription,
            visible: finalCta.visible,
            order: finalCta.order,
          },
          update: {
            eyebrow: data.ctaEyebrow,
            title: data.ctaTitle,
            description: data.ctaDescription,
          },
        });
      }
    });

    revalidatePath("/");
    return successJson({ updated: true });
  } catch (error) {
    console.error("admin homepage save failed:", error);
    return errorJson("Could not save homepage content.", 500);
  }
}

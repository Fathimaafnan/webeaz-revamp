import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Server-side payload validation for CMS mutations.
 *
 * No new validation dependency is introduced: every module normalises
 * its own input here and returns either a human-readable error or a
 * Prisma-ready data object, so route handlers stay thin and no
 * malformed row can reach the database.
 */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const STATUS_VALUES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type StatusValue = (typeof STATUS_VALUES)[number];

export function parseStatus(
  value: unknown,
  fallback: StatusValue = "DRAFT",
): StatusValue | null {
  if (value === undefined) return fallback;
  return typeof value === "string" &&
    STATUS_VALUES.includes(value as StatusValue)
    ? (value as StatusValue)
    : null;
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServicePayloadData = {
  categoryId: number;
  slug: string;
  name: string;
  summary: string;
  icon: string;
  image: string | null;
  overview: string;
  provides: string[];
  capabilities: string[];
  benefits: string[];
  useCases: string[];
  technologies: string[];
  status: StatusValue;
};

export async function parseServicePayload(
  body: Record<string, unknown>,
): Promise<{ error: string; data?: never } | { error: null; data: ServicePayloadData }> {
  for (const key of ["categorySlug", "slug", "name"] as const) {
    const value = body[key];
    if (typeof value !== "string" || !value.trim()) {
      return { error: `"${key}" is required.` };
    }
  }

  const categorySlug = String(body.categorySlug).trim();
  const slug = String(body.slug).trim().toLowerCase();
  const name = String(body.name).trim();

  if (!SLUG_PATTERN.test(slug)) {
    return {
      error:
        "Slug must be lowercase letters, numbers and dashes (e.g. website-development).",
    };
  }
  if (name.length > 120) return { error: "Service name is too long." };

  const category = await prisma.serviceCategory.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return { error: "Unknown service category." };

  const text = (key: string, max = 4000) => {
    const value = body[key];
    if (value === undefined || value === null || value === "") return "";
    if (typeof value !== "string") return null;
    if (value.length > max) return null;
    return value.trim();
  };

  const summary = text("summary", 600);
  const overview = text("overview", 8000);
  if (summary === null || overview === null) {
    return { error: "Text fields are too long or invalid." };
  }

  const list = (key: string, maxItems = 40, maxLen = 200) => {
    const value = body[key];
    if (value === undefined || value === null) return [] as string[];
    if (!Array.isArray(value)) return null;
    if (value.length > maxItems) return null;
    const items: string[] = [];
    for (const item of value) {
      if (typeof item !== "string" || !item.trim() || item.length > maxLen) return null;
      items.push(item.trim());
    }
    return items;
  };

  const provides = list("provides");
  const capabilities = list("capabilities");
  const benefits = list("benefits");
  const useCases = list("useCases");
  const technologies = list("technologies");
  if (
    provides === null ||
    capabilities === null ||
    benefits === null ||
    useCases === null ||
    technologies === null
  ) {
    return { error: "List fields must be arrays of short text." };
  }

  const icon =
    typeof body.icon === "string" && body.icon.trim() ? body.icon.trim() : "software";
  const status = parseStatus(body.status);
  if (!status) return { error: "Status must be DRAFT, PUBLISHED or ARCHIVED." };

  let image: string | null = null;
  if (typeof body.image === "string" && body.image.trim()) {
    const value = body.image.trim();
    if (!value.startsWith("/uploads/") && !/^https:\/\//i.test(value)) {
      return { error: "Image must be an uploaded image path or HTTPS URL." };
    }
    image = value;
  }

  return {
    error: null,
    data: {
      categoryId: category.id,
      slug,
      name,
      summary,
      icon,
      image,
      overview,
      provides,
      capabilities,
      benefits,
      useCases,
      technologies,
      status,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export type BlogPayloadData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  author: string;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: StatusValue;
};

export function parseBlogPayload(
  body: Record<string, unknown>,
): { error: string; data?: never } | { error: null; data: BlogPayloadData } {
  const status = parseStatus(body.status);
  if (!status) return { error: "Status must be DRAFT, PUBLISHED or ARCHIVED." };

  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error:
        "Slug must be lowercase letters, numbers and dashes (e.g. applying-ai-to-operations).",
    };
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 200) {
    return { error: "Title is required (max 200 characters)." };
  }

  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  if (excerpt.length > 500) return { error: "Excerpt must be 500 characters or fewer." };

  const content = typeof body.content === "string" ? body.content : "";
  if (status === "PUBLISHED" && !content.trim()) {
    return { error: "A published post needs body content." };
  }

  const category =
    typeof body.category === "string" && body.category.trim()
      ? body.category.trim().slice(0, 60)
      : "Insights";

  const author =
    typeof body.author === "string" && body.author.trim()
      ? body.author.trim().slice(0, 80)
      : "WebEaz Technologies";

  const optionalText = (value: unknown, max: number, label: string) => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") return { error: `${label} must be text.` } as const;
    const trimmed = value.trim();
    if (trimmed.length > max) {
      return { error: `${label} must be ${max} characters or fewer.` } as const;
    }
    return { value: trimmed };
  };

  const coverImage = optionalText(body.coverImage, 400, "Cover image");
  if (coverImage && coverImage.error) return { error: coverImage.error };
  const seoTitle = optionalText(body.seoTitle, 150, "SEO title");
  if (seoTitle && seoTitle.error) return { error: seoTitle.error };
  const seoDescription = optionalText(body.seoDescription, 300, "Meta description");
  if (seoDescription && seoDescription.error) {
    return { error: seoDescription.error };
  }

  const coverImageValue =
    coverImage && "value" in coverImage ? coverImage.value : null;
  const seoTitleValue = seoTitle && "value" in seoTitle ? seoTitle.value : null;
  const seoDescriptionValue =
    seoDescription && "value" in seoDescription ? seoDescription.value : null;

  if (
    coverImageValue &&
    !coverImageValue.startsWith("/") &&
    !/^https:\/\//i.test(coverImageValue)
  ) {
    return { error: "Cover image must be an uploaded file path or HTTPS URL." };
  }

  let publishedAt: Date | null = null;
  if (status === "PUBLISHED") {
    if (typeof body.publishedAt === "string" && body.publishedAt) {
      const parsed = new Date(body.publishedAt);
      if (Number.isNaN(parsed.getTime())) {
        return { error: "Publication date is not a valid date." };
      }
      publishedAt = parsed;
    } else {
      publishedAt = new Date();
    }
  }

  return {
    error: null,
    data: {
      slug,
      title,
      excerpt,
      content,
      category,
      coverImage: coverImageValue,
      author,
      publishedAt,
      seoTitle: seoTitleValue,
      seoDescription: seoDescriptionValue,
      status,
    },
  };
}

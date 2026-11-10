import "server-only";

import { prisma } from "@/lib/prisma";
import { SERVICE_ICON_NAMES, type ServiceIconName } from "@/lib/services";

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
  icon: ServiceIconName;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  overview: string;
  provides: string[];
  capabilities: string[];
  benefits: string[];
  useCases: string[];
  technologies: string[];
  order: number;
  status: StatusValue;
};

export type ServiceCategoryPayloadData = {
  slug: string;
  name: string;
  num: string;
  tagline: string;
  description: string;
  image: string | null;
  icon: ServiceIconName;
  accent: "blue" | "orange";
  order: number;
  status: StatusValue;
};

function isOrder(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 1_000_000
  );
}

function isValidImage(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isServiceIcon(value: unknown): value is ServiceIconName {
  return (
    typeof value === "string" &&
    SERVICE_ICON_NAMES.some((candidate) => candidate === value)
  );
}

export function parseServiceCategoryPayload(
  body: Record<string, unknown>,
): { error: string; data?: never } | { error: null; data: ServiceCategoryPayloadData } {
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const num = typeof body.num === "string" ? body.num.trim() : "";
  const tagline = typeof body.tagline === "string" ? body.tagline.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const imageValue =
    typeof body.image === "string" ? body.image.trim() : "";
  const icon = body.icon;
  const accent = body.accent;
  const status = parseStatus(body.status);
  const order = body.order;

  if (!name || name.length > 120) {
    return { error: "Category name is required and must be 120 characters or fewer." };
  }
  if (!SLUG_PATTERN.test(slug)) {
    return { error: "Category slug must use lowercase letters, numbers and dashes." };
  }
  if (
    (body.num !== undefined && typeof body.num !== "string") ||
    (body.tagline !== undefined && typeof body.tagline !== "string") ||
    (body.description !== undefined && typeof body.description !== "string") ||
    (body.image !== undefined &&
      body.image !== null &&
      typeof body.image !== "string")
  ) {
    return { error: "Category text and image fields must be valid strings." };
  }
  if (
    num.length > 20 ||
    tagline.length > 200 ||
    !description ||
    description.length > 2000
  ) {
    return { error: "Category description is required; other category text is too long." };
  }
  if (imageValue.length > 2048 || (imageValue && !isValidImage(imageValue))) {
    return { error: "Category image must be a site path or HTTPS URL." };
  }
  if (!isServiceIcon(icon)) {
    return { error: "Choose a supported category icon." };
  }
  if (accent !== "blue" && accent !== "orange") {
    return { error: "Category accent must be blue or orange." };
  }
  if (!isOrder(order)) {
    return { error: "Category display order must be a whole number from 0 to 1,000,000." };
  }
  if (!status) return { error: "Status must be DRAFT, PUBLISHED or ARCHIVED." };

  return {
    error: null,
    data: {
      slug,
      name,
      num,
      tagline,
      description,
      image: imageValue || null,
      icon,
      accent,
      order,
      status,
    },
  };
}

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
  const status = parseStatus(body.status);

  if (!SLUG_PATTERN.test(slug)) {
    return {
      error:
        "Slug must be lowercase letters, numbers and dashes (e.g. website-development).",
    };
  }
  if (name.length > 120) return { error: "Service name is too long." };
  if (!status) return { error: "Status must be DRAFT, PUBLISHED or ARCHIVED." };

  const category = await prisma.serviceCategory.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return { error: "Unknown service category." };
  const order = body.order;
  if (!isOrder(order)) {
    return { error: "Service display order must be a whole number from 0 to 1,000,000." };
  }

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
  if (status === "PUBLISHED" && (!summary.trim() || !overview.trim())) {
    return { error: "Published services need both a short and full description." };
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

  const icon = typeof body.icon === "string" ? body.icon.trim() : "";
  if (!isServiceIcon(icon)) {
    return { error: "Choose a supported service icon." };
  }

  let image: string | null = null;
  if (
    body.image !== undefined &&
    body.image !== null &&
    typeof body.image !== "string"
  ) {
    return { error: "Service image must be a site path or HTTPS URL." };
  }
  if (typeof body.image === "string" && body.image.trim()) {
    const value = body.image.trim();
    if (value.length > 2048 || !isValidImage(value)) {
      return { error: "Image must be a site path or HTTPS URL." };
    }
    image = value;
  }

  const optionalText = (
    key: string,
    max: number,
    label: string,
  ): { ok: true; value: string | null } | { ok: false; error: string } => {
    const value = body[key];
    if (value === undefined || value === null || value === "") {
      return { ok: true, value: null };
    }
    if (typeof value !== "string" || value.trim().length > max) {
      return { ok: false, error: `${label} must be ${max} characters or fewer.` };
    }
    return { ok: true, value: value.trim() };
  };
  const seoTitle = optionalText("seoTitle", 150, "SEO title");
  const seoDescription = optionalText("seoDescription", 300, "SEO description");
  if (!seoTitle.ok) return { error: seoTitle.error };
  if (!seoDescription.ok) {
    return { error: seoDescription.error };
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
      seoTitle: seoTitle.value,
      seoDescription: seoDescription.value,
      overview,
      provides,
      capabilities,
      benefits,
      useCases,
      technologies,
      order,
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

/* ------------------------------------------------------------------ */
/* BlogUser workflow (posts/revisions)                                 */
/*                                                                     */
/* The parsers below are for BlogUser traffic ONLY. They deliberately   */
/* accept fewer fields than parseBlogPayload: anything that controls   */
/* visibility, ownership or review state is forbidden and rejected, so */
/* a BlogUser can never mass-assign their way to publishing.           */
/* ------------------------------------------------------------------ */

export const BLOG_USER_CONTENT_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "coverImage",
  "author",
  "seoTitle",
  "seoDescription",
] as const;

export type BlogUserContentData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Validate BlogUser content fields. `slug` may be omitted only when
 * editing (the caller supplies the kept slug); on create it is derived
 * from the title when absent. Any forbidden field (status, reviewStage,
 * ownerId, reviewedBy, publishedAt, …) is a 400 — never ignored.
 */
export function parseBlogUserContentPayload(
  body: Record<string, unknown>,
  opts: { existingSlug?: string },
): { error: string; data?: never } | { error: null; data: BlogUserContentData } {
  const forbidden = [
    "id",
    "ownerId",
    "status",
    "reviewStage",
    "rejectionReason",
    "reviewedBy",
    "reviewedAt",
    "publishedAt",
    "submittedAt",
    "createdAt",
    "updatedAt",
  ];
  for (const key of forbidden) {
    if (key in body) {
      return { error: `Field "${key}" cannot be set by blog authors.` };
    }
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 200) {
    return { error: "Title is required (max 200 characters)." };
  }

  const slugInput =
    typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const slug = slugInput || opts.existingSlug || slugifyTitle(title);
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error:
        "Slug must be lowercase letters, numbers and dashes (e.g. applying-ai-to-operations).",
    };
  }

  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  if (excerpt.length > 500) return { error: "Excerpt must be 500 characters or fewer." };

  const content = typeof body.content === "string" ? body.content : "";
  if (content.length > 100000) return { error: "Content is too long." };

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
  if (
    coverImageValue &&
    !coverImageValue.startsWith("/") &&
    !/^https:\/\//i.test(coverImageValue)
  ) {
    return { error: "Cover image must be an uploaded file path or HTTPS URL." };
  }

  return {
    error: null,
    data: {
      title,
      slug,
      excerpt,
      content,
      category,
      coverImage: coverImageValue,
      author,
      seoTitle: seoTitle && "value" in seoTitle ? seoTitle.value : null,
      seoDescription:
        seoDescription && "value" in seoDescription ? seoDescription.value : null,
    },
  };
}

/** Submission bodies carry no partial fields: submit means "the current
 *  draft is complete". An empty object is the only accepted shape. */
export function parseBlogSubmitPayload(
  body: Record<string, unknown>,
): { error: string; data?: never } | { error: null; data: Record<string, never> } {
  if (Object.keys(body).length > 0) {
    return { error: "Submit takes no fields — save the draft first, then submit." };
  }
  return { error: null, data: {} };
}

/* ------------------------------------------------------------------ */
/* BlogUser account management (Admin-only)                            */
/*                                                                     */
/* Deliberately separate from parseBlogPayload / the draft parsers:    */
/* account rows are admin-managed only. Unknown keys are rejected and  */
/* every password rule matches the admin bootstrap scripts (12–72      */
/* UTF-8 bytes, the bcryptjs limit).                                   */
/* ------------------------------------------------------------------ */

export const BLOG_USER_ACCOUNT_FIELDS = [
  "name",
  "email",
  "password",
  "isActive",
] as const;

export type BlogUserAccountData = {
  name: string;
  email: string;
};

export function normalizeBlogUserEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function validateBlogUserPassword(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (Array.from(value).length < 12 || Buffer.byteLength(value, "utf8") > 72) {
    return null;
  }
  return value;
}

/**
 * Validate an Admin-submitted BlogUser creation payload. `role` and any
 * other field are rejected — accounts are always created as plain
 * BlogUser rows with `isActive` defaulting true.
 */
export function parseBlogUserAccountPayload(
  body: Record<string, unknown>,
): { error: string; data?: never } | { error: null; data: BlogUserAccountData & { password: string } } {
  if (!hasOnlyKeysBody(body, BLOG_USER_ACCOUNT_FIELDS)) {
    return { error: "Request contains fields that cannot be set." };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 80) {
    return { error: "Name is required and must be 80 characters or fewer." };
  }

  const email = normalizeBlogUserEmail(body.email);
  if (!email) return { error: "Enter a valid email address." };

  const password = validateBlogUserPassword(body.password);
  if (!password) {
    return {
      error: "Password must be at least 12 characters and no more than 72 UTF-8 bytes.",
    };
  }

  return { error: null, data: { name, email, password } };
}

/**
 * PATCH payload: activate/deactivate and/or rename. At least one
 * supported field is required; passwords go through the reset route.
 */
export function parseBlogUserAccountUpdatePayload(
  body: Record<string, unknown>,
): {
  error: string;
  data?: never;
} | {
  error: null;
  data: { name?: string; isActive?: boolean };
} {
  if (!hasOnlyKeysBody(body, ["name", "isActive"])) {
    return { error: "Request contains fields that cannot be set." };
  }

  const data: { name?: string; isActive?: boolean } = {};

  if ("name" in body) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) {
      return { error: "Name must be 80 characters or fewer." };
    }
    data.name = name;
  }

  if ("isActive" in body) {
    if (typeof body.isActive !== "boolean") {
      return { error: "Active status must be true or false." };
    }
    data.isActive = body.isActive;
  }

  if (data.name === undefined && data.isActive === undefined) {
    return { error: "Provide a name or an active status to update." };
  }

  return { error: null, data };
}

function hasOnlyKeysBody(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

/* ------------------------------------------------------------------ */
/* Contributor applications (public apply + admin review)              */
/*                                                                     */
/* Deliberately separate from the blog parsers above: these are      */
/* IDENTITY-adjacent inputs (email, names, links), never blog        */
/* content. The public parser rejects role-shaped fields so an       */
/* applicant can never influence account status through submission.  */
/* ------------------------------------------------------------------ */

export const CONTRIBUTOR_APPLICATION_FIELDS = [
  "fullName",
  "email",
  "professionalRole",
  "company",
  "bio",
  "linkedInUrl",
  "portfolioUrl",
  "contributionReason",
] as const;

export type ContributorApplicationData = {
  fullName: string;
  email: string;
  professionalRole: string;
  company: string | null;
  bio: string;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  contributionReason: string;
};

function optionalHttpUrl(
  value: unknown,
  label: string,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }
  if (typeof value !== "string") return { ok: false, error: `${label} must be text.` };
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > 400) {
    return { ok: false, error: `${label} must be 400 characters or fewer.` };
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { ok: false, error: `${label} must be a valid URL.` };
    }
    return { ok: true, value: trimmed };
  } catch {
    return { ok: false, error: `${label} must be a valid URL.` };
  }
}

export function parseContributorApplicationPayload(
  body: Record<string, unknown>,
): { error: string; data?: never } | { error: null; data: ContributorApplicationData } {
  if (!hasOnlyKeysBody(body, CONTRIBUTOR_APPLICATION_FIELDS)) {
    return { error: "Request contains fields that cannot be set." };
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  if (!fullName || fullName.length > 100) {
    return { error: "Full name is required (max 100 characters)." };
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const professionalRole =
    typeof body.professionalRole === "string" ? body.professionalRole.trim() : "";
  if (!professionalRole || professionalRole.length > 120) {
    return { error: "Professional role is required (max 120 characters)." };
  }

  const company =
    typeof body.company === "string" && body.company.trim()
      ? body.company.trim().slice(0, 100)
      : null;

  const bio = typeof body.bio === "string" ? body.bio.trim() : "";
  if (!bio || bio.length > 2000) {
    return { error: "A short professional bio is required (max 2000 characters)." };
  }

  const linkedInUrl = optionalHttpUrl(body.linkedInUrl, "LinkedIn profile URL");
  if (!linkedInUrl.ok) return { error: linkedInUrl.error };
  const portfolioUrl = optionalHttpUrl(body.portfolioUrl, "Portfolio URL");
  if (!portfolioUrl.ok) return { error: portfolioUrl.error };

  const contributionReason =
    typeof body.contributionReason === "string" ? body.contributionReason.trim() : "";
  if (!contributionReason || contributionReason.length > 2000) {
    return {
      error: "Please tell us why you want to contribute (max 2000 characters).",
    };
  }

  return {
    error: null,
    data: {
      fullName,
      email,
      professionalRole,
      company,
      bio,
      linkedInUrl: linkedInUrl.value,
      portfolioUrl: portfolioUrl.value,
      contributionReason,
    },
  };
}

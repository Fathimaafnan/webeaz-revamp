import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Shared configuration for the new Site Content admin APIs. Every
 * collection is explicitly allowlisted; unknown collections are rejected.
 * Field specs drive both validation and the generic CRUD client.
 */

type FieldType = "string" | "stringArray" | "number" | "enum" | "url" | "nullableString";

export type FieldSpec = {
  name: string;
  type: FieldType;
  required?: boolean;
  allowed?: readonly string[];
  maxLength?: number;
};

export type CollectionConfig = {
  label: string;
  model: unknown;
  uniqueBy: string;
  groupField?: string;
  fields: FieldSpec[];
  orderDefault: number;
};

const TEXT = 2000;
const SHORT = 300;

export const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  locations: {
    label: "Office Locations",
    model: prisma.officeLocation,
    uniqueBy: "code",
    fields: [
      { name: "code", type: "string", required: true, maxLength: 20 },
      { name: "name", type: "string", required: true, maxLength: SHORT },
      { name: "company", type: "string", maxLength: SHORT },
      { name: "regionLabel", type: "string", maxLength: SHORT },
      { name: "flagAlt", type: "string", maxLength: SHORT },
      { name: "watermark", type: "string", maxLength: SHORT },
      { name: "addressLines", type: "stringArray" },
      { name: "email", type: "string", maxLength: SHORT },
      { name: "mobile", type: "string", maxLength: SHORT },
      { name: "lat", type: "number", required: true },
      { name: "lng", type: "number", required: true },
      { name: "flagUrl", type: "url", required: true },
      { name: "mapImageUrl", type: "url" },
      { name: "mapEmbedUrl", type: "url" },
      { name: "mapUrl", type: "url" },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  products: {
    label: "Our Products",
    model: prisma.product,
    uniqueBy: "name",
    fields: [
      { name: "name", type: "string", required: true, maxLength: SHORT },
      { name: "tag", type: "string", maxLength: SHORT },
      { name: "description", type: "string", maxLength: TEXT },
      { name: "features", type: "stringArray" },
      { name: "href", type: "url", required: true },
      { name: "imageUrl", type: "url", required: true },
      { name: "imageAlt", type: "string", maxLength: TEXT },
      { name: "imageWidth", type: "number" },
      { name: "imageHeight", type: "number" },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  logos: {
    label: "Logos",
    model: prisma.homepageLogo,
    uniqueBy: "name",
    groupField: "group",
    fields: [
      { name: "group", type: "enum", required: true, allowed: ["PARTNER", "CLIENT"] },
      { name: "name", type: "string", required: true, maxLength: SHORT },
      { name: "alt", type: "string", maxLength: SHORT },
      { name: "imageUrl", type: "url", required: true },
      { name: "href", type: "nullableString", maxLength: TEXT },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  capabilities: {
    label: "What We Do",
    model: prisma.capabilityCard,
    uniqueBy: "title",
    groupField: "group",
    fields: [
      { name: "group", type: "enum", required: true, allowed: ["CAPABILITY", "SOLUTION"] },
      { name: "num", type: "string", maxLength: 20 },
      { name: "slug", type: "string", maxLength: SHORT },
      { name: "title", type: "string", required: true, maxLength: SHORT },
      { name: "tag", type: "string", maxLength: TEXT },
      { name: "tags", type: "stringArray" },
      { name: "description", type: "string", maxLength: TEXT },
      { name: "href", type: "string", maxLength: TEXT },
      { name: "iconKey", type: "string", maxLength: SHORT },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  "case-studies": {
    label: "Our Work",
    model: prisma.caseStudy,
    uniqueBy: "industry",
    fields: [
      { name: "industry", type: "string", required: true, maxLength: SHORT },
      { name: "challenge", type: "string", maxLength: TEXT },
      { name: "solution", type: "string", maxLength: TEXT },
      { name: "technology", type: "string", maxLength: TEXT },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  faq: {
    label: "FAQ",
    model: prisma.faq,
    uniqueBy: "question",
    fields: [
      { name: "question", type: "string", required: true, maxLength: TEXT },
      { name: "answer", type: "string", required: true, maxLength: 10000 },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  testimonials: {
    label: "Testimonials",
    model: prisma.testimonial,
    uniqueBy: "name",
    fields: [
      { name: "name", type: "string", required: true, maxLength: SHORT },
      { name: "role", type: "string", maxLength: SHORT },
      { name: "company", type: "string", maxLength: SHORT },
      { name: "quote", type: "string", required: true, maxLength: TEXT },
      { name: "image", type: "string", maxLength: TEXT },
      { name: "companyLogo", type: "nullableString", maxLength: TEXT },
      { name: "rating", type: "number" },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
  "footer-links": {
    label: "Footer",
    model: prisma.footerLink,
    uniqueBy: "label",
    groupField: "group",
    fields: [
      { name: "group", type: "enum", required: true, allowed: ["PRODUCTS", "COMPANY", "SUPPORT", "LEGAL", "SOCIAL"] },
      { name: "label", type: "string", required: true, maxLength: SHORT },
      { name: "href", type: "string", required: true, maxLength: TEXT },
      { name: "iconKey", type: "nullableString", maxLength: SHORT },
      { name: "order", type: "number" },
      { name: "status", type: "enum", allowed: ["PUBLISHED", "DRAFT", "ARCHIVED"] },
    ],
    orderDefault: 0,
  },
};

export function getCollection(name: string): CollectionConfig | null {
  return COLLECTION_CONFIGS[name] ?? null;
}

function isUrl(value: string): boolean {
  if (value.startsWith("/")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Validate and normalise a payload. Returns an error message or clean data. */
export function validatePayload(
  config: CollectionConfig,
  input: Record<string, unknown>,
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  const allowed = new Set(config.fields.map((f) => f.name));
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) return { ok: false, error: `Unsupported field: ${key}` };
  }

  const data: Record<string, unknown> = {};
  for (const spec of config.fields) {
    const value = input[spec.name];
    if (value === undefined) {
      if (spec.required) return { ok: false, error: `${spec.name} is required` };
      continue;
    }
    if (spec.type === "string" || spec.type === "url") {
      if (typeof value !== "string") return { ok: false, error: `${spec.name} must be text` };
      if (spec.maxLength && value.length > spec.maxLength) return { ok: false, error: `${spec.name} is too long` };
      if (spec.required && !value.trim()) return { ok: false, error: `${spec.name} cannot be empty` };
      if (spec.type === "url" && value && !isUrl(value)) return { ok: false, error: `${spec.name} must be a valid URL or path` };
      data[spec.name] = value;
    } else if (spec.type === "nullableString") {
      if (value !== null && typeof value !== "string") return { ok: false, error: `${spec.name} must be text` };
      data[spec.name] = value === "" ? null : value;
    } else if (spec.type === "stringArray") {
      if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
        return { ok: false, error: `${spec.name} must be a list of text values` };
      }
      data[spec.name] = value;
    } else if (spec.type === "number") {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return { ok: false, error: `${spec.name} must be a number` };
      }
      data[spec.name] = value;
    } else if (spec.type === "enum") {
      if (typeof value !== "string" || !spec.allowed?.includes(value)) {
        return { ok: false, error: `${spec.name} has an unsupported value` };
      }
      data[spec.name] = value;
    }
  }
  if (data.order === undefined) data.order = config.orderDefault;
  if (data.status === undefined) data.status = "PUBLISHED";
  return { ok: true, data };
}

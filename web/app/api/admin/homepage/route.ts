import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { DEFAULT_HOME } from "@/lib/defaults";

/**
 * PUT /api/admin/homepage
 * Saves the hero + final CTA copy as one record.
 */
export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") return badRequest("Invalid payload.");

    const str = (key: keyof typeof DEFAULT_HOME, fallback: string) => {
      const value = body[key];
      if (value === undefined) return fallback;
      if (typeof value !== "string") return null;
      return value.trim();
    };

    const fields: Record<string, string> = {};
    for (const key of Object.keys(DEFAULT_HOME) as Array<keyof typeof DEFAULT_HOME>) {
      const value = str(key, DEFAULT_HOME[key]);
      if (value === null) return badRequest(`Field "${key}" must be text.`);
      fields[key] = value;
    }

    for (const required of ["heroTitle", "heroDescription", "ctaTitle"] as const) {
      if (!fields[required]) return badRequest(`"${required}" cannot be empty.`);
    }
    if (
      fields.heroImage &&
      !fields.heroImage.startsWith("/uploads/") &&
      !/^https:\/\//i.test(fields.heroImage)
    ) {
      return badRequest("Hero image must be an uploaded image path or HTTPS URL.");
    }
    for (const hrefKey of ["heroPrimaryHref", "heroSecondaryHref", "ctaHref"] as const) {
      const href = fields[hrefKey];
      if (!href.startsWith("/") && !/^https?:\/\//.test(href)) {
        return badRequest(`"${hrefKey}" must be a path or absolute URL.`);
      }
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.homepageContent.findFirst();
      if (existing) {
        await tx.homepageContent.update({
          where: { id: existing.id },
          data: fields,
        });
      } else {
        await tx.homepageContent.create({ data: fields });
      }

      await tx.homepageSection.upsert({
        where: { key: "final-cta" },
        update: {
          eyebrow: fields.ctaEyebrow,
          title: fields.ctaTitle,
          description: fields.ctaDescription,
        },
        create: {
          key: "final-cta",
          eyebrow: fields.ctaEyebrow,
          title: fields.ctaTitle,
          description: fields.ctaDescription,
          visible: true,
          order: 80,
        },
      });
    });

    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("homepage PUT failed:", error);
    return serverError("Could not save homepage content.");
  }
}

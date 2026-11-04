import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { DEFAULT_SECTIONS } from "@/lib/defaults";

type HomepageSectionInput = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  visible: boolean;
  order: number;
};

function isHomepageSectionInput(value: unknown): value is HomepageSectionInput {
  if (typeof value !== "object" || value === null) return false;
  const section = value as Record<string, unknown>;
  return (
    typeof section.key === "string" &&
    typeof section.eyebrow === "string" &&
    typeof section.title === "string" &&
    typeof section.description === "string" &&
    typeof section.visible === "boolean" &&
    typeof section.order === "number"
  );
}

/**
 * PUT /api/admin/homepage/sections
 * Upserts the editable section headings and their visibility. Keys that
 * are not sent keep their stored row, and unknown keys are rejected so
 * the admin UI can only ever manage real homepage sections.
 */
export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const rawSections: unknown[] = Array.isArray(body?.sections) ? body.sections : [];
    if (!Array.isArray(body?.sections)) return badRequest("Expected { sections: [...] }.");

    const known = new Set(DEFAULT_SECTIONS.map((s) => s.key));
    const sections: HomepageSectionInput[] = [];

    for (const section of rawSections) {
      if (!isHomepageSectionInput(section)) return badRequest("Invalid section.");
      if (!known.has(section.key)) {
        return badRequest(`Unknown section key: ${String(section.key)}`);
      }
      if (!section.title.trim()) {
        return badRequest(`Section "${section.key}" needs a title.`);
      }
      sections.push(section);
    }

    await prisma.$transaction(async (tx) => {
      for (const section of sections) {
        await tx.homepageSection.upsert({
          where: { key: section.key },
          update: {
            eyebrow: section.eyebrow.trim(),
            title: section.title.trim(),
            description: section.description.trim(),
            visible: section.visible,
            order: section.order,
          },
          create: {
            key: section.key,
            eyebrow: section.eyebrow.trim(),
            title: section.title.trim(),
            description: section.description.trim(),
            visible: section.visible,
            order: section.order,
          },
        });
      }

      const finalCta = sections.find((section) => section.key === "final-cta");
      if (finalCta) {
        const content = await tx.homepageContent.findFirst();
        if (content) {
          await tx.homepageContent.update({
            where: { id: content.id },
            data: {
              ctaEyebrow: finalCta.eyebrow.trim(),
              ctaTitle: finalCta.title.trim(),
              ctaDescription: finalCta.description.trim(),
            },
          });
        } else {
          await tx.homepageContent.create({
            data: {
              ctaEyebrow: finalCta.eyebrow.trim(),
              ctaTitle: finalCta.title.trim(),
              ctaDescription: finalCta.description.trim(),
            },
          });
        }
      }
    });

    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("sections PUT failed:", error);
    return serverError("Could not save section content.");
  }
}

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

function parseTestimonialUpdate(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return { error: "Customer name is required." };
    data.name = name;
  }
  if (body.quote !== undefined) {
    const quote = typeof body.quote === "string" ? body.quote.trim() : "";
    if (!quote) return { error: "Feedback is required." };
    if (quote.length > 2000) return { error: "Feedback must be 2000 characters or fewer." };
    data.quote = quote;
  }
  if (body.role !== undefined) {
    data.role = typeof body.role === "string" ? body.role.trim().slice(0, 120) : "";
  }
  if (body.company !== undefined) {
    data.company = typeof body.company === "string" ? body.company.trim().slice(0, 120) : "";
  }
  if (body.companyLogo !== undefined) {
    const companyLogo = typeof body.companyLogo === "string" ? body.companyLogo.trim() : "";
    if (
      companyLogo &&
      !companyLogo.startsWith("/") &&
      !/^https:\/\//i.test(companyLogo)
    ) {
      return { error: "Company logo must be an uploaded file path or HTTPS URL." };
    }
    data.companyLogo = companyLogo || null;
  }
  if (body.image !== undefined) {
    const image = typeof body.image === "string" ? body.image.trim() : "";
    if (
      image &&
      !image.startsWith("/") &&
      !/^https:\/\//i.test(image)
    ) {
      return { error: "Image must be an uploaded file path or HTTPS URL." };
    }
    data.image = image;
  }
  if (body.rating !== undefined) {
    if (body.rating === null || body.rating === "") {
      data.rating = null;
    } else {
      const value = Number(body.rating);
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        return { error: "Rating must be a whole number between 1 and 5." };
      }
      data.rating = value;
    }
  }
  if (body.status !== undefined) {
    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(String(body.status))) {
      return { error: "Invalid status." };
    }
    data.status = body.status;
  }
  if (body.order !== undefined) {
    if (typeof body.order !== "number") return { error: "Order must be a number." };
    data.order = body.order;
  }

  if (Object.keys(data).length === 0) return { error: "Nothing to update." };
  return { error: null, data };
}

/** PUT /api/admin/testimonials/[id] — edit a testimonial. */
export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid testimonial id.");

    const body = await request.json();
    const parsed = parseTestimonialUpdate(body ?? {});
    if (parsed.error !== null) return badRequest(parsed.error);

    const updated = await prisma.testimonial.updateMany({
      where: { id },
      data: parsed.data,
    });
    if (updated.count === 0) return badRequest("Testimonial not found.");

    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("testimonials PUT failed:", error);
    return serverError("Could not update the testimonial.");
  }
}

/** DELETE /api/admin/testimonials/[id] — permanent removal (confirmed in UI). */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid testimonial id.");

    const deleted = await prisma.testimonial.deleteMany({ where: { id } });
    if (deleted.count === 0) return badRequest("Testimonial not found.");

    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("testimonials DELETE failed:", error);
    return serverError("Could not delete the testimonial.");
  }
}

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { parseStatus } from "@/lib/cms";

function parseTestimonial(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const quote = typeof body.quote === "string" ? body.quote.trim() : "";
  if (!name) return { error: "Customer name is required." };
  if (name.length > 120) return { error: "Name is too long." };
  if (!quote) return { error: "Feedback is required." };
  if (quote.length > 2000) return { error: "Feedback must be 2000 characters or fewer." };

  const role = typeof body.role === "string" ? body.role.trim().slice(0, 120) : "";
  const company = typeof body.company === "string" ? body.company.trim().slice(0, 120) : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const companyLogo =
    typeof body.companyLogo === "string" ? body.companyLogo.trim() : "";
  if (
    [image, companyLogo].some(
      (value) =>
        value &&
        !value.startsWith("/") &&
        !/^https:\/\//i.test(value),
    )
  ) {
    return { error: "Images must be uploaded file paths or HTTPS URLs." };
  }

  // Ratings are only stored when explicitly supplied — the CMS never
  // invents a score for a customer.
  let rating: number | null = null;
  if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
    const value = Number(body.rating);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return { error: "Rating must be a whole number between 1 and 5." };
    }
    rating = value;
  }

  const status = parseStatus(body.status);
  if (!status) return { error: "Status must be DRAFT, PUBLISHED or ARCHIVED." };

  return {
    error: null,
    data: { name, quote, role, company, companyLogo, image, rating, status },
  };
}

/** POST /api/admin/testimonials — add a customer testimonial. */
export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const parsed = parseTestimonial(body ?? {});
    if (parsed.error !== null) return badRequest(parsed.error);

    const lowest = await prisma.testimonial.aggregate({ _min: { order: true } });
    const testimonial = await prisma.testimonial.create({
      data: { ...parsed.data, order: (lowest._min.order ?? 0) - 10 },
    });

    revalidatePath("/", "layout");
    return Response.json({ ok: true, id: testimonial.id });
  } catch (error) {
    console.error("testimonials POST failed:", error);
    return serverError("Could not add the testimonial.");
  }
}

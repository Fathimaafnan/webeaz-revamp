import { errorJson, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Admin review queue: every SUBMITTED revision, oldest first, with the
 * blog summary and its owner so the admin can triage without opening
 * each detail page. Read-only; transitions live on the [id] routes.
 */
export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const reviews = await prisma.blogPostRevision.findMany({
      where: { reviewStage: "SUBMITTED" },
      orderBy: [{ submittedAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        submittedAt: true,
        createdAt: true,
        blogPost: {
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
    return successJson({ reviews });
  } catch (error) {
    console.error("admin blog review queue failed:", error);
    return errorJson("Could not load the review queue.", 500);
  }
}

import { errorJson, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status");

  let where: Record<string, unknown> = {};
  if (statusParam) {
    if (!STATUSES.includes(statusParam as (typeof STATUSES)[number])) {
      return errorJson("Status filter must be PENDING, APPROVED or REJECTED.", 400);
    }
    where = { status: statusParam };
  }

  try {
    const [applications, totals] = await Promise.all([
      prisma.contributorApplication.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          fullName: true,
          email: true,
          professionalRole: true,
          company: true,
          bio: true,
          linkedInUrl: true,
          portfolioUrl: true,
          contributionReason: true,
          status: true,
          reviewedAt: true,
          rejectionReason: true,
          createdAt: true,
          updatedAt: true,
          invitation: {
            select: {
              id: true,
              expiresAt: true,
              usedAt: true,
              revokedAt: true,
              sentStatus: true,
              sentAt: true,
              deliveryError: true,
              blogUser: {
                select: { id: true, name: true, email: true, isActive: true },
              },
            },
          },
          approvedBlogUser: {
            select: { id: true, name: true, email: true, isActive: true },
          },
        },
      }),
      prisma.contributorApplication.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    for (const row of totals) {
      counts[row.status] = row._count._all;
    }

    return successJson({
      applications,
      counts,
      total: applications.length,
    });
  } catch (error) {
    console.error("admin contributor list failed:", error);
    return errorJson("Could not load contributor applications.", 500);
  }
}

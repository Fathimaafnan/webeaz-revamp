import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { sendRejectionEmail } from "@/lib/contributor-email";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}

/** Reject a pending application with a required reason. No BlogUser is
 *  ever created on this path; the applicant is notified by email when
 *  delivery is configured (failure is reported, never faked). */
export async function POST(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const adminId = Number(guard.user.id);

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid application id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;

  const reason =
    typeof parsed.value.reason === "string" ? parsed.value.reason.trim() : "";
  if (!reason || reason.length > 2000) {
    return errorJson("A rejection reason is required (max 2000 characters).", 400);
  }

  try {
    const application = await prisma.contributorApplication.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        approvedBlogUserId: true,
      },
    });
    if (!application) return errorJson("Application not found.", 404);
    if (application.status !== "PENDING") {
      return errorJson("Only pending applications can be rejected.", 422);
    }
    if (application.approvedBlogUserId) {
      return errorJson("This application already created an account.", 409);
    }

    const now = new Date();
    await prisma.contributorApplication.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedBy: adminId,
        reviewedAt: now,
        rejectionReason: reason,
      },
    });

    const sent = await sendRejectionEmail({
      applicantName: application.fullName,
      email: application.email,
      reason,
    });

    return successJson({
      applicationId: id,
      emailNotified: sent.ok,
      ...(sent.ok ? {} : { emailError: sent.error }),
    });
  } catch (error) {
    console.error("admin contributor reject failed:", error);
    return errorJson("Could not reject the application.", 500);
  }
}

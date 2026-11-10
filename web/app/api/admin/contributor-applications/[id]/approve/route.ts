import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { errorJson, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import {
  buildAcceptUrl,
  generateInvitationToken,
  hashInvitationToken,
  invitationExpiresAt,
} from "@/lib/contributor-tokens";
import { sendInvitationEmail } from "@/lib/contributor-email";
import { withTransactionRetry } from "@/lib/blog-workflow";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}

const DETAIL_SELECT = {
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
  reviewer: { select: { id: true, name: true, email: true } },
  createdAt: true,
  updatedAt: true,
  approvedBlogUser: { select: { id: true, name: true, email: true, isActive: true } },
  invitation: {
    select: {
      id: true,
      expiresAt: true,
      usedAt: true,
      revokedAt: true,
      sentStatus: true,
      sentAt: true,
      providerId: true,
      deliveryError: true,
      blogUser: { select: { id: true, name: true, email: true, isActive: true } },
    },
  },
} as const;

async function load(id: number) {
  return prisma.contributorApplication.findUnique({
    where: { id },
    select: DETAIL_SELECT,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid application id.", 400);

  try {
    const application = await load(id);
    if (!application) return errorJson("Application not found.", 404);
    return successJson({ application });
  } catch (error) {
    console.error("admin contributor detail failed:", error);
    return errorJson("Could not load the application.", 500);
  }
}

/** Approve: creates the inactive BlogUser + invitation, then SENDS the
 *  invitation email after the database commits. A failed send leaves
 *  the invitation valid and resendable — never marked "sent" on failure. */
async function handleApprove(request: Request, rawId: string) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const adminId = Number(guard.user.id);

  const id = readId(rawId);
  if (!id) return errorJson("Invalid application id.", 400);

  try {
    const application = await prisma.contributorApplication.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        invitation: { select: { id: true } },
      },
    });
    if (!application) return errorJson("Application not found.", 404);
    if (application.status !== "PENDING") {
      return errorJson("Only pending applications can be approved.", 422);
    }

    // Cross-table email availability (no cross-table uniqueness exists).
    const [adminConflict, userConflict] = await Promise.all([
      prisma.admin.findUnique({
        where: { email: application.email },
        select: { id: true },
      }),
      prisma.blogUser.findUnique({
        where: { email: application.email },
        select: { id: true },
      }),
    ]);
    if (adminConflict || userConflict) {
      return errorJson(
        "That email already belongs to an existing account. This application cannot be approved for it.",
        409,
      );
    }

    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);
    const expiresAt = invitationExpiresAt();
    const placeholder = randomBytes(32).toString("base64url");
    const placeholderHash = await bcrypt.hash(placeholder, 12);

    const created = await withTransactionRetry(prisma, async (tx) => {
      const blogUser = await tx.blogUser.create({
        data: {
          name: application.fullName,
          email: application.email,
          passwordHash: placeholderHash,
          isActive: false,
        },
      });
      const approvedApplication = await tx.contributorApplication.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedBy: adminId,
          reviewedAt: new Date(),
          rejectionReason: null,
          approvedBlogUserId: blogUser.id,
        },
      });
      await tx.blogUser.update({
        where: { id: blogUser.id },
        data: { applicationId: approvedApplication.id },
      });
      const invitation = await tx.contributorInvitation.create({
        data: {
          applicationId: approvedApplication.id,
          blogUserId: blogUser.id,
          tokenHash,
          expiresAt,
          sentStatus: "PENDING",
        },
      });
      return { blogUserId: blogUser.id, invitationId: invitation.id };
    });

    // Send AFTER commit; record provider acceptance honestly.
    const acceptUrl = buildAcceptUrl(token);
    const sent = acceptUrl
      ? await sendInvitationEmail({
          applicantName: application.fullName,
          email: application.email,
          acceptUrl,
        })
      : {
          ok: false as const,
          error: "APP_BASE_URL is not configured, so no invitation link could be built. Resend once it is set.",
        };

    await prisma.contributorInvitation.update({
      where: { id: created.invitationId },
      data: {
        sentStatus: sent.ok ? "ACCEPTED" : "FAILED",
        sentAt: sent.ok ? new Date() : null,
        providerId: sent.ok ? sent.providerId : null,
        deliveryError: sent.ok ? null : sent.error,
      },
    }).catch(() => undefined);

    return successJson({
      applicationId: id,
      blogUserId: created.blogUserId,
      invitationSent: sent.ok,
      ...(sent.ok ? {} : { emailError: sent.error }),
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "P2002") {
      return errorJson(
        "A concurrent change already created this account or invitation. Reload and try again.",
        409,
      );
    }
    console.error("admin contributor approve failed:", error);
    return errorJson("Could not approve the application.", 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleApprove(request, id);
}

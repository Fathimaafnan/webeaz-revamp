import { errorJson, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import {
  buildAcceptUrl,
  generateInvitationToken,
  hashInvitationToken,
  invitationExpiresAt,
} from "@/lib/contributor-tokens";
import { sendInvitationEmail } from "@/lib/contributor-email";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Admin-only retry for a failed or expired invitation delivery.
 * Revokes the old invitation row (kept for history) and issues a new
 * one with a fresh token + expiry — the previous token can never be
 * used again. Never marks delivery "sent" without provider acceptance.
 */
export async function POST(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  if (!/^[1-9]\d*$/.test(rawId)) return errorJson("Invalid application id.", 400);
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return errorJson("Invalid application id.", 400);

  try {
    const application = await prisma.contributorApplication.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        approvedBlogUserId: true,
        invitation: {
          select: {
            id: true,
            blogUserId: true,
            expiresAt: true,
            usedAt: true,
            revokedAt: true,
            sentStatus: true,
            blogUser: { select: { id: true, isActive: true } },
          },
        },
      },
    });
    if (!application) return errorJson("Application not found.", 404);
    if (application.status !== "APPROVED") {
      return errorJson("Only approved applications have invitations to resend.", 422);
    }
    if (!application.approvedBlogUserId) {
      return errorJson("No account is linked to this application.", 409);
    }
    const currentInvitation = application.invitation;
    if (currentInvitation?.usedAt) {
      return errorJson("The invitation was already used. The account is active.", 422);
    }
    if (currentInvitation && !currentInvitation.revokedAt && currentInvitation.expiresAt.getTime() > Date.now() && currentInvitation.sentStatus === "ACCEPTED") {
      return errorJson(
        "A valid invitation was already delivered. Revoke behavior: resend only for failed or expired invitations.",
        409,
      );
    }

    const blogUserId = application.approvedBlogUserId;
    const blogUser = currentInvitation?.blogUser ?? null;
    if (!blogUser || blogUser.isActive) {
      return errorJson("The linked account is no longer awaiting invitation setup.", 422);
    }

    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);
    const expiresAt = invitationExpiresAt();
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      if (currentInvitation && !currentInvitation.revokedAt) {
        await tx.contributorInvitation.update({
          where: { id: currentInvitation.id },
          data: { revokedAt: now },
        });
      }
      await tx.contributorInvitation.upsert({
        where: { applicationId: id },
        update: {
          blogUserId,
          tokenHash,
          expiresAt,
          usedAt: null,
          revokedAt: null,
          sentStatus: "PENDING",
          sentAt: null,
          providerId: null,
          deliveryError: null,
        },
        create: {
          applicationId: id,
          blogUserId,
          tokenHash,
          expiresAt,
          sentStatus: "PENDING",
        },
      });
    });

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
      where: { applicationId: id },
      data: {
        sentStatus: sent.ok ? "ACCEPTED" : "FAILED",
        sentAt: sent.ok ? new Date() : null,
        providerId: sent.ok ? sent.providerId : null,
        deliveryError: sent.ok ? null : sent.error,
      },
    }).catch(() => undefined);

    return successJson({
      applicationId: id,
      invitationSent: sent.ok,
      ...(sent.ok ? {} : { emailError: sent.error }),
    });
  } catch (error) {
    console.error("admin contributor resend failed:", error);
    return errorJson("Could not resend the invitation.", 500);
  }
}

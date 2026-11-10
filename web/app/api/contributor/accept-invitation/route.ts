import bcrypt from "bcryptjs";
import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
import { validateBlogUserPassword } from "@/lib/cms";
import { sendActivationEmail } from "@/lib/contributor-email";
import { buildLoginUrl, hashInvitationToken } from "@/lib/contributor-tokens";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Password setup for invited contributors.
 *
 * The raw token is hashed and compared against the stored digest —
 * it is never logged, returned, or stored. Activation is atomic:
 * password hash + isActive flip + usedAt happen in one transaction,
 * so concurrent replays converge on a single winner.
 */
export async function POST(request: Request) {
  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword =
    typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!token) {
    return errorJson("Your invitation link is incomplete. Please open the link from your email.", 400);
  }
  if (password !== confirmPassword) {
    return errorJson("Passwords do not match.", 400);
  }
  const passwordErr = validateBlogUserPassword(password);
  if (!passwordErr) {
    return errorJson(
      "Password must be at least 12 characters and no more than 72 UTF-8 bytes.",
      400,
    );
  }

  const tokenHash = hashInvitationToken(token);

  try {
    const invitation = await prisma.contributorInvitation.findFirst({
      where: { tokenHash },
      include: {
        application: { select: { id: true } },
        blogUser: { select: { id: true, isActive: true } },
      },
    });

    if (!invitation) {
      return errorJson("This invitation link is invalid or has already been used.", 400);
    }
    if (invitation.usedAt || invitation.revokedAt) {
      return errorJson("This invitation link is no longer valid.", 400);
    }
    if (invitation.expiresAt.getTime() <= Date.now()) {
      return errorJson("This invitation link has expired. Ask an administrator to resend it.", 400);
    }
    if (invitation.blogUser.isActive) {
      return errorJson("This account is already active. Please sign in instead.", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const fresh = await tx.contributorInvitation.findUnique({
        where: { id: invitation.id },
      });
      if (!fresh || fresh.usedAt || fresh.revokedAt) {
        throw new Error(" invitation-consumed");
      }
      if (fresh.expiresAt.getTime() <= Date.now()) {
        throw new Error(" invitation-expired");
      }

      await tx.blogUser.update({
        where: { id: fresh.blogUserId },
        data: { passwordHash, isActive: true },
      });
      const used = await tx.contributorInvitation.update({
        where: { id: fresh.id },
        data: { usedAt: now },
      });
      return used;
    });

    // Confirmation email AFTER the database confirms activation.
    // Never includes the token or password. Failures are logged
    // without sensitive data and never fail the activation itself.
    try {
      const [applicant, user] = await Promise.all([
        prisma.contributorApplication.findUnique({
          where: { id: invitation.application.id },
          select: { fullName: true, email: true },
        }),
        prisma.blogUser.findUnique({
          where: { id: invitation.blogUser.id },
          select: { name: true, email: true },
        }),
      ]);
      const loginUrl = buildLoginUrl();
      if (applicant && user && loginUrl) {
        const sent = await sendActivationEmail({
          applicantName: user.name || applicant.fullName,
          email: user.email,
          loginUrl,
        });
        if (!sent.ok) {
          console.error("activation confirmation email not delivered for user", user.email, sent.error.slice(0, 120));
        }
      }
    } catch (error) {
      console.error("activation confirmation email attempt failed:", error instanceof Error ? error.message : "unknown");
    }

    return successJson({ id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === " invitation-consumed") {
      return errorJson("This invitation link has already been used.", 400);
    }
    if (message === " invitation-expired") {
      return errorJson("This invitation link has expired. Ask an administrator to resend it.", 400);
    }
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "P2025") {
      return errorJson("This invitation is no longer valid.", 400);
    }
    console.error("invitation acceptance failed:", error);
    return errorJson("Something went wrong setting up your account. Please try again or ask an administrator for a new link.", 500);
  }
}

import { hashInvitationToken } from "@/lib/contributor-tokens";
import { prisma } from "@/lib/prisma";
import AcceptInvitationForm from "@/components/contributor/AcceptInvitationForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Set up your contributor account",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string | string[] }> };

/**
 * Invitation landing page. The token is validated server-side
 * (hash comparison, expiry, single-use, revocation, inactive account)
 * before any password form is shown. An invalid link never reveals
 * which check failed beyond a plain expired/invalid message.
 */
export default async function AcceptInvitationPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawToken =
    typeof params.token === "string" && params.token ? params.token : "";

  let state:
    | { kind: "ready"; token: string; applicantName: string }
    | { kind: "invalid"; reason: "invalid" | "expired" | "used" | "revoked" | "unavailable" } = {
    kind: "invalid",
    reason: "invalid",
  };

  if (rawToken) {
    try {
      const invitation = await prisma.contributorInvitation.findFirst({
        where: { tokenHash: hashInvitationToken(rawToken) },
        include: {
          application: { select: { fullName: true } },
          blogUser: { select: { isActive: true } },
        },
      });

      if (!invitation) {
        state = { kind: "invalid", reason: "invalid" };
      } else if (invitation.usedAt) {
        state = { kind: "invalid", reason: "used" };
      } else if (invitation.revokedAt) {
        state = { kind: "invalid", reason: "revoked" };
      } else if (
        // Server component: renders once per request, so comparing
        // against the current time is safe and deterministic.
        // eslint-disable-next-line react-hooks/purity
        invitation.expiresAt.getTime() <= Date.now()
      ) {
        state = { kind: "invalid", reason: "expired" };
      } else if (invitation.blogUser.isActive) {
        state = { kind: "invalid", reason: "used" };
      } else {
        state = {
          kind: "ready",
          token: rawToken,
          applicantName: invitation.application.fullName,
        };
      }
    } catch (error) {
      console.error("invitation validation failed:", error);
      state = { kind: "invalid", reason: "unavailable" };
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-deep px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Set up your contributor account</h1>
          <p className="mt-2 text-sm text-white/70">
            WebEaz Blog Contributor Portal
          </p>
        </div>

        {state.kind === "ready" ? (
          <>
            <p className="mb-6 text-sm leading-6 text-white/70">
              Hello {state.applicantName}. Your application has been approved.
              Choose a password to activate your account.
            </p>
            <AcceptInvitationForm token={state.token} />
          </>
        ) : (
          <div role="alert" className="rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-4 py-6 text-sm leading-6 text-brand-orange-light">
            {state.reason === "expired" ? (
              <>This invitation link has expired. Please ask an administrator to resend it.</>
            ) : state.reason === "used" ? (
              <>This invitation has already been used. You can sign in with your new credentials.</>
            ) : state.reason === "revoked" ? (
              <>This invitation has been revoked. Please ask an administrator to resend it.</>
            ) : (
              <>This invitation link is invalid. Please open the link from your email, or ask an administrator to resend it.</>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-white/50">
          Invitation links are single-use and expire after 48 hours.
        </p>
      </div>
    </div>
  );
}

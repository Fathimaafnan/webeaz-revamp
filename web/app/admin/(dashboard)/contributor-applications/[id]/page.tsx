import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ContributorReviewActions from "@/components/admin/ContributorReviewActions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value)
    : "—";
}

export default async function AdminContributorDetailPage({ params }: Props) {
  const user = await getAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  const { id: rawId } = await params;
  if (!/^[1-9]\d*$/.test(rawId)) redirect("/admin/contributor-applications");
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) redirect("/admin/contributor-applications");

  const application = await prisma.contributorApplication.findUnique({
    where: { id },
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
      reviewer: { select: { name: true, email: true } },
      approvedBlogUser: { select: { id: true, name: true, email: true, isActive: true } },
      invitation: {
        select: {
          id: true,
          expiresAt: true,
          usedAt: true,
          revokedAt: true,
          sentStatus: true,
          sentAt: true,
          deliveryError: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!application) redirect("/admin/contributor-applications");

  const details: Array<[string, string | null]> = [
    ["Professional role", application.professionalRole],
    ["Company", application.company],
    ["LinkedIn", application.linkedInUrl],
    ["Portfolio / website", application.portfolioUrl],
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{application.fullName}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          {application.email} · Status{" "}
          <strong className="text-white">{application.status}</strong> · Submitted{" "}
          {formatDate(application.createdAt)}
        </p>
      </header>

      {application.rejectionReason ? (
        <p role="alert" className="rounded-xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
          <strong>Rejection reason:</strong> {application.rejectionReason}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-black/10 p-6">
          <h2 className="font-semibold text-white">Professional details</h2>
          <dl className="mt-3 space-y-3 text-sm text-white/75">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-white/45">{label}</dt>
                <dd>
                  {value ? (
                    value.startsWith("http") ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-brand-orange-light underline underline-offset-4">
                        {value}
                      </a>
                    ) : (
                      value
                    )
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <h3 className="text-xs uppercase tracking-wide text-white/45">Bio</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white/80">{application.bio}</p>
          </div>
          <div className="mt-5">
            <h3 className="text-xs uppercase tracking-wide text-white/45">Why contribute?</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white/80">{application.contributionReason}</p>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-black/10 p-6">
          <h2 className="font-semibold text-white">Decision & account</h2>
          <dl className="mt-3 space-y-2 text-sm text-white/70">
            <div><dt className="text-white/45">Reviewed by</dt><dd>{application.reviewer?.name ?? "—"}</dd></div>
            <div><dt className="text-white/45">Reviewed at</dt><dd>{formatDate(application.reviewedAt)}</dd></div>
            {application.approvedBlogUser ? (
              <div>
                <dt className="text-white/45">Linked account</dt>
                <dd>
                  {application.approvedBlogUser.name} ({application.approvedBlogUser.email}) —{" "}
                  {application.approvedBlogUser.isActive ? "Active" : "Awaiting password setup"}
                </dd>
              </div>
            ) : null}
            {application.invitation ? (
              <div>
                <dt className="text-white/45">Invitation</dt>
                <dd>
                  Delivery: <strong className="text-white">{application.invitation.sentStatus}</strong>
                  {application.invitation.sentAt ? ` · sent ${formatDate(application.invitation.sentAt)}` : ""}
                  {application.invitation.usedAt ? ` · used ${formatDate(application.invitation.usedAt)}` : ""}
                  {application.invitation.revokedAt ? " · revoked" : ""}
                  {application.invitation.deliveryError ? ` — ${application.invitation.deliveryError}` : ""}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>

      <ContributorReviewActions
        applicationId={application.id}
        status={application.status}
        invitationSentStatus={application.invitation?.sentStatus ?? null}
      />
    </div>
  );
}

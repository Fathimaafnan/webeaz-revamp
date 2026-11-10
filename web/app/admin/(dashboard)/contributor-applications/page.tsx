import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ContributorApplicationsList from "@/components/admin/ContributorApplicationsList";

export const dynamic = "force-dynamic";

export default async function AdminContributorApplicationsPage() {
  const user = await getAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  const counts = await prisma.contributorApplication.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const byStatus = new Map(counts.map((c) => [c.status, c._count._all]));
  const total = [...byStatus.values()].reduce((sum, n) => sum + n, 0);
  const cards = [
    { label: "Total applications", value: total },
    { label: "Pending", value: byStatus.get("PENDING") ?? 0 },
    { label: "Approved", value: byStatus.get("APPROVED") ?? 0 },
    { label: "Rejected", value: byStatus.get("REJECTED") ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Contributor Applications</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          Review public contributor applications. Approving creates an inactive
          contributor account and emails a one-time invitation link (48 hours,
          single use). Nothing is published from these applications directly.
        </p>
      </header>

      <section aria-label="Application statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-white/10 bg-brand-blue-deep/40 p-4">
            <p className="text-xs text-white/60">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <ContributorApplicationsList />
    </div>
  );
}

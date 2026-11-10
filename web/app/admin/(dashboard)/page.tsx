import Link from "next/link";
import { getAdmin } from "@/lib/admin-auth";
import { getHomeSections, getIndustries } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getAdmin();
  // Layout already redirects unauthenticated visitors; this is defense in depth.
  if (!user) return null;

  let databaseStatus: "connected" | "unavailable" = "unavailable";
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";
  } catch (error) {
    console.error("admin dashboard probe failed:", error);
  }

  // Use the same merged view the admin tabs and the public site use —
  // the admin UI always shows the effective section list, so the
  // dashboard counter must report the same number (never a bare 0
  // just because the database probe fails).
  const [sections, industries] = await Promise.all([
    getHomeSections(),
    getIndustries(),
  ]);
  const counts = {
    homepageSections: sections.length,
    industries: industries.length,
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          WebEaz CMS
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Welcome back, {user.name ?? "admin"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Manage homepage content, industries and services that power the
          public site. Changes publish to the live pages after saving.
        </p>
      </header>

      <section
        aria-label="System status"
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
          Status
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-brand-blue-deep/40 p-4">
            <p className="text-xs text-white/60">Database</p>
            <p className="mt-1 text-sm font-bold text-white">
              {databaseStatus === "connected" ? "Connected" : "Unavailable"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-blue-deep/40 p-4">
            <p className="text-xs text-white/60">Homepage sections</p>
            <p className="mt-1 text-sm font-bold text-white">{counts.homepageSections}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-blue-deep/40 p-4">
            <p className="text-xs text-white/60">Industries</p>
            <p className="mt-1 text-sm font-bold text-white">{counts.industries}</p>
          </div>
        </div>
      </section>

      <section aria-label="Content management" className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/homepage"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-orange/40"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
            Homepage
          </p>
          <h2 className="mt-2 text-xl font-bold text-white group-hover:text-white">
            Edit homepage &amp; industries
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Hero copy and calls to action, section headings and visibility,
            homepage statistics and the Industries list.
          </p>
          <span
            aria-hidden="true"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-light"
          >
            Open Homepage editor <span aria-hidden="true">→</span>
          </span>
        </Link>
        <Link
          href="/admin/services"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-orange/40"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
            Services
          </p>
          <h2 className="mt-2 text-xl font-bold text-white group-hover:text-white">
            Manage service catalog
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Edit categories, service content, SEO metadata, ordering and
            publishing status.
          </p>
          <span
            aria-hidden="true"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-light"
          >
            Open Services CMS <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>
    </div>
  );
}

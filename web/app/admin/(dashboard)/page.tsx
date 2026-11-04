import Link from "next/link";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const dynamic = "force-dynamic";

type RecentItem = {
  kind: string;
  label: string;
  title: string;
  href: string;
  updatedAt: Date;
};

export default async function AdminDashboardPage() {
  const user = await getAdmin();
  // The layout already guards this route; this is defence in depth.
  if (!user) return null;

  let databaseStatus: "connected" | "unavailable" = "unavailable";
  let counts = {
    publishedPosts: 0,
    draftPosts: 0,
    archivedPosts: 0,
    services: 0,
    draftServices: 0,
    testimonials: 0,
    hiddenTestimonials: 0,
    media: 0,
    industries: 0,
  };
  let recent: RecentItem[] = [];

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";

    const [
      publishedPosts,
      draftPosts,
      archivedPosts,
      services,
      draftServices,
      testimonials,
      hiddenTestimonials,
      media,
      industries,
      posts,
      serviceRows,
      testimonialRows,
    ] = await Promise.all([
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.count({ where: { status: "DRAFT" } }),
      prisma.blogPost.count({ where: { status: "ARCHIVED" } }),
      prisma.service.count({ where: { status: "PUBLISHED" } }),
      prisma.service.count({ where: { status: { not: "PUBLISHED" } } }),
      prisma.testimonial.count({ where: { status: "PUBLISHED" } }),
      prisma.testimonial.count({ where: { status: { not: "PUBLISHED" } } }),
      prisma.mediaAsset.count(),
      prisma.industry.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
      prisma.service.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.testimonial.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
    ]);

    counts = {
      publishedPosts,
      draftPosts,
      archivedPosts,
      services,
      draftServices,
      testimonials,
      hiddenTestimonials,
      media,
      industries,
    };

    recent = [
      ...posts.map((p) => ({
        kind: "Blog",
        label: p.status,
        title: p.title,
        href: `/admin/blog/${p.id}`,
        updatedAt: p.updatedAt,
      })),
      ...serviceRows.map((s) => ({
        kind: "Service",
        label: s.status,
        title: s.name,
        href: "/admin/services",
        updatedAt: s.updatedAt,
      })),
      ...testimonialRows.map((t) => ({
        kind: "Testimonial",
        label: t.status,
        title: t.name,
        href: "/admin/testimonials",
        updatedAt: t.updatedAt,
      })),
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6);
  } catch {
    databaseStatus = "unavailable";
  }

  const stats = [
    { label: "Published posts", value: counts.publishedPosts, hint: `${counts.draftPosts} draft · ${counts.archivedPosts} archived` },
    { label: "Services", value: counts.services, hint: `${counts.draftServices} not published` },
    { label: "Testimonials", value: counts.testimonials, hint: `${counts.hiddenTestimonials} hidden` },
    { label: "Media files", value: counts.media, hint: `${counts.industries} industries` },
  ];

  const quickActions = [
    { href: "/admin/blog/new", label: "New blog post" },
    { href: "/admin/services", label: "Manage services" },
    { href: "/admin/testimonials", label: "Add testimonial" },
    { href: "/admin/media", label: "Upload media" },
  ];

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user.name ?? "Administrator"}
        </h1>
        <p className="text-sm text-white/70">
          Signed in as {user.email ?? "admin"} · Role: {user.role ?? "admin"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              {s.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-white/60">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              Recent content updates
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                databaseStatus === "connected"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              Database {databaseStatus === "connected" ? "connected" : "unavailable"}
            </span>
          </div>

          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-white/60">
              {databaseStatus === "connected"
                ? "No content yet. Create your first post or service below."
                : "Content cannot be listed while the database is unreachable."}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {recent.map((item) => (
                <li
                  key={`${item.kind}-${item.title}-${item.updatedAt.toISOString()}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {item.kind} · {item.label.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="shrink-0 text-xs font-semibold text-brand-orange-light hover:underline"
                  >
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Quick actions</h2>
          <ul className="mt-4 space-y-2">
            {quickActions.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-brand-orange/50 hover:bg-white/10"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-white/10 pt-4">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}

import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const user = await getAdmin();
  if (!user) return null;

  let rows: Array<{
    id: number;
    name: string;
    role: string;
    company: string;
    companyLogo: string | null;
    image: string;
    quote: string;
    rating: number | null;
    order: number;
    status: string;
  }> = [];
  let media: Array<{ id: number; url: string; originalName: string; alt: string }> = [];
  let dbOk = false;

  try {
    const [testimonialRows, mediaRows] = await Promise.all([
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: { id: true, url: true, originalName: true, alt: true },
      }),
    ]);
    dbOk = true;
    rows = testimonialRows.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      companyLogo: t.companyLogo,
      image: t.image,
      quote: t.quote,
      rating: t.rating,
      order: t.order,
      status: t.status,
    }));
    media = mediaRows;
  } catch {
    dbOk = false;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Testimonials management
        </p>
        <h1 className="text-3xl font-bold text-white">Testimonials</h1>
        <p className="text-sm text-white/70">
          Only published testimonials appear in the homepage “What Our Clients Say”
          section. Ratings are stored only when you enter one — none are invented.
        </p>
        {!dbOk ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            The database is unreachable, so testimonials cannot be edited right now.
          </p>
        ) : null}
      </div>

      <TestimonialsManager initial={rows} media={media} canSave={dbOk} />
    </>
  );
}

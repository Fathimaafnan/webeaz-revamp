import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ServicesManager from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const user = await getAdmin();
  if (!user) return null;

  type Row = {
    id: number;
    slug: string;
    name: string;
    summary: string;
    icon: string;
    image: string | null;
    overview: string;
    provides: string[];
    capabilities: string[];
    benefits: string[];
    useCases: string[];
    technologies: string[];
    status: string;
    order: number;
    categoryId: number;
  };

  let categories: Array<{ id: number; slug: string; name: string; services: Row[] }> = [];
  let media: Array<{ id: number; url: string; originalName: string; alt: string }> = [];
  let dbOk = false;

  try {
    const [categoryRows, mediaRows] = await Promise.all([
      prisma.serviceCategory.findMany({
        orderBy: { order: "asc" },
        include: { services: { orderBy: { order: "asc" } } },
      }),
      prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: { id: true, url: true, originalName: true, alt: true },
      }),
    ]);
    dbOk = true;
    categories = categoryRows.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      services: c.services.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        summary: s.summary,
        icon: s.icon,
        image: s.image,
        overview: s.overview,
        provides: s.provides,
        capabilities: s.capabilities,
        benefits: s.benefits,
        useCases: s.useCases,
        technologies: s.technologies,
        status: s.status,
        order: s.order,
        categoryId: c.id,
      })),
    }));
    media = mediaRows;
  } catch {
    dbOk = false;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Services management
        </p>
        <h1 className="text-3xl font-bold text-white">Services</h1>
        <p className="text-sm text-white/70">
          Create, edit, archive and delete services. Existing service URLs
          (/services/[area]/[service]) keep working — publishing updates them in place.
        </p>
        {!dbOk ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            The database is unreachable, so services cannot be edited right now.
          </p>
        ) : null}
      </div>

      <ServicesManager categories={categories} media={media} canSave={dbOk} />
    </>
  );
}

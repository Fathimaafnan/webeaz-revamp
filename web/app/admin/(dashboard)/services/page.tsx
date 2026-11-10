import ServicesEditor, {
  type ServiceCategoryRow,
  type ServiceRow,
} from "@/components/admin/ServicesEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  let canSave = false;
  let loadError: string | null = null;
  let categories: ServiceCategoryRow[] = [];
  let services: ServiceRow[] = [];

  try {
    const [categoryRows, serviceRows] = await Promise.all([
      prisma.serviceCategory.findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          num: true,
          tagline: true,
          description: true,
          image: true,
          icon: true,
          accent: true,
          order: true,
          status: true,
          _count: { select: { services: true } },
        },
      }),
      prisma.service.findMany({
        orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { id: "asc" }],
        select: {
          id: true,
          categoryId: true,
          slug: true,
          name: true,
          summary: true,
          icon: true,
          image: true,
          seoTitle: true,
          seoDescription: true,
          overview: true,
          provides: true,
          capabilities: true,
          benefits: true,
          useCases: true,
          technologies: true,
          order: true,
          status: true,
          category: { select: { id: true, slug: true, name: true } },
        },
      }),
    ]);

    categories = categoryRows.map(({ _count, ...category }) => ({
      ...category,
      serviceCount: _count.services,
    }));
    services = serviceRows;
    canSave = true;
  } catch (error) {
    console.error("admin services content load failed:", error);
    loadError =
      "Service data is unavailable. The public website uses its existing static content; editing is disabled until the database and Services CMS migration are available.";
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Services CMS
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          Manage service categories and their services. Only published
          categories and services appear on the public website.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-xl border border-amber-300/20 bg-amber-500/5 p-4 text-sm text-amber-100"
        >
          {loadError}
        </p>
      ) : null}

      <ServicesEditor
        initialCategories={categories}
        initialServices={services}
        canSave={canSave}
      />
    </div>
  );
}

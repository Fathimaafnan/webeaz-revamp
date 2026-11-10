import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import {
  ServiceDetailActions,
  ServiceDetailTrail,
  ServiceDetailVisual,
} from "@/components/services/ServiceDetailHero";
import ServicesShell from "@/components/services/ServicesShell";
import { getServiceTree } from "@/lib/content";

type Props = { params: Promise<{ area: string; service: string }> };

export const dynamic = "force-dynamic";

const variants = {
  technology: "cobalt",
  "digital-growth": "ember",
  automation: "steel",
  ai: "midnight",
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area, service: serviceSlug } = await params;
  const { allServices } = await getServiceTree();
  const found = allServices.find(
    (item) => item.category.slug === area && item.service.slug === serviceSlug,
  );
  if (!found) return { title: "Not Found" };
  return {
    title:
      found.service.seoTitle?.trim() ||
      `${found.service.name} — ${found.category.name}`,
    description:
      found.service.seoDescription?.trim() || found.service.summary,
    alternates: { canonical: `/services/${found.category.slug}/${found.service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { area, service: serviceSlug } = await params;
  const { allServices } = await getServiceTree();
  const found = allServices.find(
    (item) => item.category.slug === area && item.service.slug === serviceSlug,
  );
  if (!found) notFound();

  const { category, service } = found;
  const variant =
    variants[category.slug as keyof typeof variants] ?? ("navy" as const);

  return (
    <ServicesShell
      eyebrow={`${category.name} — Service`}
      title={service.name}
      description={service.summary}
      variant={variant}
      trail={<ServiceDetailTrail category={category} service={service} />}
      actions={<ServiceDetailActions category={category} service={service} />}
      aside={<ServiceDetailVisual image={service.image} alt={service.name} />}
    >
      <ServiceDetailBody category={category} service={service} />
    </ServicesShell>
  );
}
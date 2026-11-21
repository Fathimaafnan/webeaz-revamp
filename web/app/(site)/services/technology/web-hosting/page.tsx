import type { Metadata } from "next";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import {
  ServiceDetailActions,
  ServiceDetailTrail,
  ServiceDetailVisual,
} from "@/components/services/ServiceDetailHero";
import ServicesShell from "@/components/services/ServicesShell";
import { Service, ServiceCategory } from "@/lib/services";

const webHostingData: Service = {
  slug: "web-hosting",
  name: "Web Hosting",
  summary:
    "Reliable, high-performance web hosting with domain management, SSL security and round-the-clock uptime for your business site.",
  icon: "website",
  overview:
    "Reliable, high-performance web hosting with domain management, SSL security and round-the-clock uptime for your business site.",
  provides: ["Web hosting and e-mail hosting", "Domain management", "SSL security", "24/7 Uptime"],
  capabilities: ["Cloud infrastructure provisioning", "Content delivery configuration", "Database storage planning", "E-mail hosting on the client's own domain", "Workspace licensing and setup"],
  benefits: ["Scale infrastructure without large capital outlay", "Reliable content delivery across locations", "Business email on the company's own domain", "Infrastructure that can be adjusted as demand changes"],
} as Service;

const webHostingCategory: ServiceCategory = {
  slug: "technology",
  name: "Technology",
  num: "01",
  tagline: "Web • Mobile • Ecommerce • Software • Cloud",
  description:
    "Build modern digital experiences, applications and platforms designed for business growth.",
  icon: "software",
  accent: "blue",
  services: [],
} as ServiceCategory;

export const metadata = {
  title: "Web Hosting — WebEaz",
  description:
    "Reliable, high-performance web hosting with domain management, SSL security and round-the-clock uptime for your business site.",
  alternates: { canonical: "/services/technology/web-hosting" },
};

export default function WebHostingPage() {
  return (
    <ServicesShell
      eyebrow="Services — Web Hosting"
      title={webHostingData.name}
      description={webHostingData.overview}
      variant="navy"
    >
      <ServiceDetailBody
        category={webHostingCategory}
        service={webHostingData}
      />
    </ServicesShell>
  );
}
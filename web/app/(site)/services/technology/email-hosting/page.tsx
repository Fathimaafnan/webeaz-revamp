import type { Metadata } from "next";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import {
  ServiceDetailActions,
  ServiceDetailTrail,
  ServiceDetailVisual,
} from "@/components/services/ServiceDetailHero";
import ServicesShell from "@/components/services/ServicesShell";
import { Service, ServiceCategory } from "@/lib/services";

const emailHostingData: Service = {
  slug: "email-hosting",
  name: "E-mail Hosting",
  summary:
    "Professional e-mail on your own domain, with secure delivery, sync across devices and the support to keep the brand image consistent.",
  icon: "software",
  overview:
    "Professional e-mail on your own domain, with secure delivery, sync across devices and the support to keep your brand image consistent.",
  provides: ["Professional e-mail on your own domain", "Secure delivery", "Sync across devices", "Support"],
  capabilities: ["Professional e-mail delivery", "Sync across devices", "Support"],
  benefits: ["Professional e-mail on your own domain", "Secure delivery", "Sync across devices", "Support"],
} as Service;

const emailHostingCategory: ServiceCategory = {
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
  title: "E-mail Hosting — WebEaz",
  description:
    "Professional e-mail on your own domain, with secure delivery, sync across devices and the support to keep the brand image consistent.",
  alternates: { canonical: "/services/technology/email-hosting" },
};

export default function EmailHostingPage() {
  return (
    <ServicesShell
      eyebrow="Services — E-mail Hosting"
      title={emailHostingData.name}
      description={emailHostingData.overview}
      variant="navy"
    >
      <ServiceDetailBody
        category={emailHostingCategory}
        service={emailHostingData}
      />
    </ServicesShell>
  );
}
import type { Metadata } from "next";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import {
  ServiceDetailActions,
  ServiceDetailTrail,
  ServiceDetailVisual,
} from "@/components/services/ServiceDetailHero";
import ServicesShell from "@/components/services/ServicesShell";
import { Service, ServiceCategory } from "@/lib/services";

const microsoft365Data: Service = {
  name: "Microsoft 365 Licence",
  overview:
    "Comprehensive Microsoft 365 Services. WHY MICROSOFT 365: Microsoft 365 is a subscription-based service that includes access to a range of Microsoft products and services, including Microsoft Office, Microsoft OneDrive, and Microsoft Teams. Your business can store all of its files in the cloud with Microsoft 365. Through collaborative tools, you can instantly edit documents and share mailboxes, calendars, and contacts. There are no software downloads required for any of the necessary programs, including Word, Excel, and Outlook. Workers can concentrate on what is most important with the help of modern apps like Teams, Share-point, and Planner. Additionally, it offers security monitoring to stop or identify any data tampering.",
  provides: ["Microsoft Office", "Microsoft OneDrive", "Microsoft Teams"],
  capabilities: ["Situation analysis", "Integrated strategy", "Channel strategy", "Performance tracking"],
  benefits: ["Reach the right people at the right time", "Increased revenue from existing demand", "A single accountable strategy", "Budget directed to the channels that return results"],
} as Service;

const microsoft365Category: ServiceCategory = {
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
  title: "Microsoft 365 Licence — WebEaz",
  description:
    "Comprehensive Microsoft 365 Services",
  alternates: { canonical: "/services/technology/microsoft-365" },
};

export default function Microsoft365LicencePage() {
  return (
    <ServicesShell
      eyebrow="Services — Microsoft 365 Licence"
      title={microsoft365Data.name}
      description={microsoft365Data.overview}
      variant="navy"
    >
      <ServiceDetailBody
        category={microsoft365Category}
        service={microsoft365Data}
      />
    </ServicesShell>
  );
}
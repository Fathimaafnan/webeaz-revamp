import type { Metadata } from "next";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import {
  ServiceDetailActions,
  ServiceDetailTrail,
  ServiceDetailVisual,
} from "@/components/services/ServiceDetailHero";
import ServicesShell from "@/components/services/ServicesShell";
import { Service, ServiceCategory } from "@/lib/services";

const googleWorkspaceData: Service = {
  slug: "google-workspace",
  name: "Google Workspace Licence",
  summary:
    "Professional Google Workspace Setup. STAY CONNECTED AND PRODUCTIVE WITH A GOOGLE WORKSPACE LICENSE. Google Workspace is a collection of productivity and collaboration tools that was originally known as G Suite. It contains a number of tools like Gmail, Google Drive, Google Calendar, and Google Docs that are made to make it easier for people and organisations to communicate, collaborate, and share information.",
  icon: "google",
  overview:
    "Professional Google Workspace Setup. STAY CONNECTED AND PRODUCTIVE WITH A GOOGLE WORKSPACE LICENSE. Google Workspace is a collection of productivity and collaboration tools that was originally known as G Suite. It contains a number of tools like Gmail, Google Drive, Google Calendar, and Google Docs that are made to make it easier for people and organisations to communicate, collaborate, and share information.",
  provides: ["Gmail", "Google Drive", "Google Calendar", "Google Docs"],
  capabilities: ["Gmail", "Google Drive", "Google Docs", "Google Meet"],
  benefits: ["Stronger organic search visibility over time", "A brand that is found and trusted", "Managed online reputation", "Assets that support every other marketing channel"],
} as unknown as Service;

const googleWorkspaceCategory: ServiceCategory = {
  slug: "technology",
  name: "Technology",
  num: "01",
  tagline: "Web • Mobile • Ecommerce • Software • Cloud",
  description:
    "Build modern digital experiences, applications and platforms designed for business growth.",
  icon: "software",
  accent: "blue",
  services: [],
} as unknown as ServiceCategory;

export const metadata = {
  title: "Google Workspace Licence — WebEaz",
  description:
    "Professional Google Workspace Setup",
  alternates: { canonical: "/services/technology/google-workspace" },
};

export default function GoogleWorkspaceLicencePage() {
  return (
    <ServicesShell
      eyebrow="Services — Google Workspace Licence"
      title={googleWorkspaceData.name}
      description={googleWorkspaceData.overview}
      variant="navy"
    >
      <ServiceDetailBody
        category={googleWorkspaceCategory}
        service={googleWorkspaceData}
      />
    </ServicesShell>
  );
}
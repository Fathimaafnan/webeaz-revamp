import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import { CookiePreferencesButton } from "@/components/privacy/CookieConsent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for WebEaz Technologies Pvt. Ltd.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="Privacy Policy for WebEaz Technologies Pvt. Ltd."
    >
      <CookiePreferencesButton />
    </PageShell>
  );
}

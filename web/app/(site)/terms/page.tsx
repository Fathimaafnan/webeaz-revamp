import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for WebEaz Technologies Pvt. Ltd.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms"
      description="Terms of use for WebEaz Technologies Pvt. Ltd."
    >
    </PageShell>
  );
}

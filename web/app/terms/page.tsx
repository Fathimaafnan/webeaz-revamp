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
      description="These Terms of use for WebEaz Technologies Pvt. Ltd. are a placeholder and will be replaced with the final terms before launch."
    >
      <div className="mt-10 space-y-6 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-base font-semibold text-ink">Use of this website</h2>
          <p className="mt-2">Placeholder — describe acceptable use and intellectual property.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Services and products</h2>
          <p className="mt-2">Placeholder — describe engagements, deliverables and product terms.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Liability</h2>
          <p className="mt-2">Placeholder — describe limitations of liability.</p>
        </section>
      </div>
    </PageShell>
  );
}

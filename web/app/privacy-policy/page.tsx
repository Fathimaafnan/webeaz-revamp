import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";

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
      description="This Privacy Policy for WebEaz Technologies Pvt. Ltd. is a placeholder and will be replaced with the final policy before launch."
    >
      <div className="mt-10 space-y-6 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-base font-semibold text-ink">Information we collect</h2>
          <p className="mt-2">Placeholder — describe the data collected through forms, analytics and products.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">How we use it</h2>
          <p className="mt-2">Placeholder — describe the purposes of processing.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Your rights</h2>
          <p className="mt-2">Placeholder — describe access, correction and deletion rights.</p>
        </section>
      </div>
    </PageShell>
  );
}

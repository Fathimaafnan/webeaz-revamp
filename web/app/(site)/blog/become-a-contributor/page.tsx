import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import ContributorApplyForm from "@/components/contributor/ContributorApplyForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Become a Contributor",
  description:
    "Apply to become a WebEaz blog contributor. Share your knowledge, experience, and ideas with the WebEaz community.",
  alternates: { canonical: "/blog/become-a-contributor" },
};

export default function BecomeContributorPage() {
  return (
    <PageShell
      eyebrow="Contributors"
      title="Become a Contributor"
      description="Share your knowledge, experience, and ideas with the WebEaz community. We welcome contributions from our team members and professionals across the technology industry."
    >
      <div className="mt-10">
        <ContributorApplyForm />
      </div>
    </PageShell>
  );
}

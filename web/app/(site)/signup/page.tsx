import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "How contributor and administrator accounts are created at WebEaz.",
  alternates: { canonical: "/signup" },
};

/**
 * There is no public self-registration for WebEaz accounts (neither for
 * administrators nor for blog contributors). This page replaces a
 * decorative sign-up form with an honest explanation and routes people
 * to the right sign-in page.
 */
export default function SignUpPage() {
  return (
    <AuthCard
      eyebrow="Accounts"
      title="Accounts are created by an administrator"
      description="WebEaz does not offer public self-registration. If you have been given account credentials, sign in with them; otherwise please contact the WebEaz team."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-blue underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <p className="rounded-xl border border-line bg-surface p-4 text-sm leading-6 text-muted">
          Contributor accounts are created by an administrator after review.
          Administrator accounts are issued in person. No account is created
          from this page.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep"
          >
            Go to sign in
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-control px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-blue"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import UnifiedLoginForm from "@/components/auth/UnifiedLoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your WebEaz account.",
  alternates: { canonical: "/login" },
};

export const dynamic = "force-dynamic";

/**
 * Unified homepage sign-in — the same page for every visitor.
 *
 * It never bounces anyone straight into the Admin CMS: reaching the
 * dashboard requires a successful sign-in whose role is verified
 * against the database on the server (see lib/auth.ts and
 * lib/admin-auth.ts). A signed-in blog user still goes to their own
 * portal, which is the existing visitor flow; an admin who opens this
 * page sees the ordinary login form and lands on the CMS only after
 * authenticating.
 */
export default async function LoginPage() {
  const current = await getCurrentUser();
  if (current?.kind === "blog_user") redirect("/user/dashboard");

  return <UnifiedLoginForm />;
}

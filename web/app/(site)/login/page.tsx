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
 * Unified homepage sign-in. Already-authenticated visitors are sent
 * straight to their role's dashboard (checked server-side from the
 * database-backed session, never from a query param or form field).
 */
export default async function LoginPage() {
  const current = await getCurrentUser();
  if (current?.kind === "admin") redirect("/admin");
  if (current?.kind === "blog_user") redirect("/user/dashboard");

  return <UnifiedLoginForm />;
}

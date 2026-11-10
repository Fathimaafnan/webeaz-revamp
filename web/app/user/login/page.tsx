import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import UserLoginForm from "@/components/user/UserLoginForm";

export const dynamic = "force-dynamic";

export default async function UserLoginPage() {
  // Role-aware redirect that preserves the existing admin experience:
  // signed-in admins belong in /admin, signed-in blog users in the
  // user dashboard, everyone else sees the sign-in form.
  const current = await getCurrentUser();

  if (current?.kind === "admin") {
    redirect("/admin");
  }
  if (current?.kind === "blog_user") {
    redirect("/user/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-deep px-6 py-16">
      <UserLoginForm />
    </div>
  );
}

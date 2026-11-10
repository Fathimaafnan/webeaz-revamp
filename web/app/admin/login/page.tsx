import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // Role-aware redirect: keep the existing admin experience intact,
  // but send signed-in blog users to their own portal instead of
  // bouncing them between the two login pages.
  const current = await getCurrentUser();

  if (current?.kind === "admin") {
    redirect("/admin");
  }
  if (current?.kind === "blog_user") {
    redirect("/user/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-deep px-6 py-16">
      <AdminLoginForm />
    </div>
  );
}

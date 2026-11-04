import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-deep px-6 py-16">
      <AdminLoginForm redirectTo="/admin" />
    </div>
  );
}

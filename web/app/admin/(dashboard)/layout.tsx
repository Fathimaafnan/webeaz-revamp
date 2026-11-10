import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Server-side guard for every CMS surface. Route groups do not affect
 * the URL, so this layout protects /admin and /admin/homepage in one
 * place while /admin/login stays outside it.
 *
 * The check runs on the server before any admin markup is produced, so
 * a public visitor only ever receives a redirect to the login page.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdmin();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-blue-deep">
      <AdminSidebar user={user} />
      <main className="flex min-h-screen flex-1 flex-col bg-[#06283f] px-4 pb-10 pt-20 sm:px-6 md:ml-0 md:px-10 md:pt-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

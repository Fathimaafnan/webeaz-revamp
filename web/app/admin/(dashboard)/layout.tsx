import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Server-side guard for every CMS surface. Route groups do not affect
 * the URL, so this layout protects /admin, /admin/homepage,
 * /admin/services, /admin/blog, /admin/testimonials, /admin/media and
 * /admin/settings in one place while /admin/login stays outside it.
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
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-12 pt-20 md:px-8 md:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/admin-auth";
import UserLogoutButton from "@/components/user/UserLogoutButton";

/**
 * Server-side guard for the whole user portal. The check runs on the
 * server (DB re-validated on every request by getCurrentUser) before
 * any portal markup is produced, so anonymous visitors only ever
 * receive a redirect to the user login page and signed-in admins are
 * sent to their own dashboard. Blog users can never see admin markup
 * and admins can never see blog-user markup.
 */
export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentUser();

  if (!current) {
    redirect("/user/login");
  }
  if (current.kind === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-brand-blue-deep">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-ink md:flex">
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-white">WebEaz Blog Portal</p>
          <p className="mt-1 text-xs text-white/60">Contributor Workspace</p>
        </div>
        <nav className="flex-1 space-y-1 px-4" aria-label="User portal">
          <Link
            href="/user/dashboard"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/user/blogs"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            My Blogs
          </Link>
        </nav>
        <div className="space-y-3 border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/60">
            {current.name ?? "Contributor"}
            <span className="block truncate text-white/40">{current.email}</span>
          </p>
          <UserLogoutButton />
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col bg-[#06283f] px-4 pb-10 pt-20 sm:px-6 md:pt-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

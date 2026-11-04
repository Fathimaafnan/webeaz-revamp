"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; role?: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = NAV.map((item) => {
    const active = isActive(pathname, item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={() => setOpen(false)}
          className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${
            active
              ? "bg-brand-blue/35 text-white"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
          aria-current={active ? "page" : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-ink md:flex">
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-white">WebEaz Admin</p>
          <p className="mt-1 text-xs text-white/60">Content Management</p>
        </div>
        <nav className="flex-1 space-y-1 px-4" aria-label="CMS modules">
          <ul className="space-y-1">{links}</ul>
        </nav>
        <div className="space-y-3 border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/60">
            {user.name ?? "Administrator"}
            <span className="block truncate text-white/40">{user.email}</span>
          </p>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-ink px-4 py-3 md:hidden">
        <div>
          <p className="text-sm font-bold text-white">WebEaz Admin</p>
          <p className="text-[11px] text-white/60">Content Management</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div
          id="admin-mobile-nav"
          className="fixed inset-x-0 top-[57px] z-30 border-b border-white/10 bg-ink px-4 py-3 shadow-xl md:hidden"
        >
          <ul className="space-y-1">{links}</ul>
          <div className="mt-3 border-t border-white/10 pt-3">
            <AdminLogoutButton />
          </div>
        </div>
      ) : null}
    </>
  );
}

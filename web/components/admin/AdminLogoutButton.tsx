"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Posts to the /admin/logout route handler and returns to the login page.
 * The session cookie is cleared server-side by the route handler.
 */
export default function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/admin/logout", { method: "POST" });
    } finally {
      setPending(false);
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

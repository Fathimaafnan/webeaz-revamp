"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Signs the administrator out by clearing the session cookies via the
 * server-side logout route, then returns to the public homepage.
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
      router.push("/");
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

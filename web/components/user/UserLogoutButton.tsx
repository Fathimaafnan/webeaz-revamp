"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

/**
 * Signs the blog user out via the shared NextAuth provider, which
 * clears the session cookie(s) server-side; the portal then returns
 * to the user login page.
 */
export default function UserLogoutButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signOut({ callbackUrl: "/user/login" });
      }}
      className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

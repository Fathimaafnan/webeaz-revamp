import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_BASES = [
  // Dev cookie (http) and production cookie (Secure, __Secure- prefix).
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

/**
 * NextAuth v4 may split an oversized JWT across multiple cookies
 * (`base`, `base.0`, `base.1`, …). Clearing only the base name would
 * leave stale authenticated chunks behind, so clear the base plus a
 * generous set of chunk indices. Clearing a cookie that does not exist
 * is harmless.
 */
function sessionCookieNames(): string[] {
  const names = new Set<string>();
  for (const base of SESSION_COOKIE_BASES) {
    names.add(base);
    for (let i = 0; i < 8; i += 1) {
      names.add(`${base}.${i}`);
    }
  }
  return [...names];
}

/**
 * Secure admin logout endpoint.
 *
 * Clears the NextAuth session cookie(s) and redirects to the login page.
 * With the JWT session strategy the session token itself is the credential,
 * so deleting it invalidates the session. POST-only: state-changing.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  for (const name of sessionCookieNames()) {
    response.cookies.set(name, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  return response;
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAMES = [
  // JWT session strategy cookies (secure + non-secure variants).
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

/**
 * Secure admin logout endpoint.
 *
 * Clears the NextAuth session cookie(s) and redirects to the login page.
 * With the JWT session strategy the session token itself is the credential,
 * so deleting it invalidates the session.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
  );

  for (const name of SESSION_COOKIE_NAMES) {
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

export async function GET(request: NextRequest) {
  return POST(request);
}

import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Server-side authorization for every CMS mutation.
 *
 * There is no public registration and no client-trusted identity: the
 * session cookie is minted by NextAuth only after bcrypt verification,
 * so a valid session is the sole proof of admin status. Route handlers
 * call `requireAdmin` before touching the database.
 */

export type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

export async function getAdmin(): Promise<AdminUser | null> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as AdminUser | undefined;
    const id = Number(user?.id);
    if (!Number.isInteger(id) || user?.role !== "admin") return null;

    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!admin || admin.role !== "admin") return null;

    return {
      id: String(admin.id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  } catch (error) {
    console.error("admin authorization check failed:", error);
    return null;
  }
}

/**
 * Reject cross-site state-changing requests. Same-origin requests and
 * same-origin navigations carry an Origin header that matches the
 * Host; cross-site posts do not. State-changing requests without an
 * Origin header are rejected.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export type AdminGuard =
  | { ok: true; user: AdminUser }
  | { ok: false; response: Response };

/** Authorize a CMS API request. Returns a ready-to-send error response
 *  when the caller is not an authenticated admin. */
export async function requireAdmin(request: Request): Promise<AdminGuard> {
  if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return {
      ok: false,
      response: Response.json(
        { error: "Cross-origin request rejected." },
        { status: 403 },
      ),
    };
  }

  const user = await getAdmin();
  if (!user) {
    return {
      ok: false,
      response: Response.json(
        { error: "Unauthorized. Sign in to the admin CMS first." },
        { status: 401 },
      ),
    };
  }

  return { ok: true, user };
}

export function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export function serverError(message = "Unexpected server error."): Response {
  return Response.json({ error: message }, { status: 500 });
}

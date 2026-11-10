import "server-only";

import { getServerSession } from "next-auth";
import { ADMIN_ROLE, BLOG_USER_ROLE, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Server-side authorization for every CMS mutation.
 *
 * There is no public registration and no client-trusted identity: the
 * session cookie is minted by NextAuth only after bcrypt verification,
 * so a valid session is the sole proof of (admin or blog-user) status.
 * Route handlers call `requireAdmin` / `requireBlogUser` before touching
 * the database. Both guards re-fetch the account from the database on
 * every request and never trust the JWT role alone.
 */

export type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

export type BlogUserInfo = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: typeof BLOG_USER_ROLE;
  isActive: boolean;
};

export async function getAdmin(): Promise<AdminUser | null> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as AdminUser | undefined;
    const id = Number(user?.id);
    if (!Number.isInteger(id) || user?.role !== ADMIN_ROLE) return null;

    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!admin || admin.role !== ADMIN_ROLE) return null;

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
 * Resolve the currently authenticated account without disclosing which
 * table it came from. Re-fetches and re-validates on every call:
 * admins must still have `role === "admin"`; blog users must still
 * exist and be active. Returns null for anonymous, tampered, or
 * deactivated sessions.
 */
export type CurrentUser =
  | (AdminUser & { kind: "admin" })
  | (BlogUserInfo & { kind: "blog_user" });

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as AdminUser | undefined;
    const id = Number(user?.id);
    if (!Number.isInteger(id) || !user?.role) return null;

    if (user.role === ADMIN_ROLE) {
      const admin = await prisma.admin.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true },
      });
      if (!admin || admin.role !== ADMIN_ROLE) return null;
      return {
        kind: "admin",
        id: String(admin.id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    }

    if (user.role === BLOG_USER_ROLE) {
      const blogUser = await prisma.blogUser.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, isActive: true },
      });
      if (!blogUser || !blogUser.isActive) return null;
      return {
        kind: "blog_user",
        id: String(blogUser.id),
        name: blogUser.name,
        email: blogUser.email,
        role: BLOG_USER_ROLE,
        isActive: blogUser.isActive,
      };
    }

    return null;
  } catch (error) {
    console.error("current-user resolution failed:", error);
    return null;
  }
}

/**
 * Resolve the authenticated blog user (db re-validated, active only).
 * Blog users can never satisfy admin guards, and admins can never
 * satisfy blog-user guards — the role from the session is always
 * cross-checked against the database.
 */
export async function getBlogUser(): Promise<BlogUserInfo | null> {
  const current = await getCurrentUser();
  if (!current || current.kind !== "blog_user") return null;
  return {
    id: current.id,
    name: current.name,
    email: current.email,
    role: BLOG_USER_ROLE,
    isActive: current.isActive,
  };
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

export type BlogUserGuard =
  | { ok: true; user: BlogUserInfo }
  | { ok: false; response: Response };

/** Authorize a CMS API request. Returns a ready-to-send error response
 *  when the caller is not an authenticated admin. */
export async function requireAdmin(request: Request): Promise<AdminGuard> {
  if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "Cross-origin request rejected." },
        { status: 403 },
      ),
    };
  }

  const user = await getAdmin();
  if (!user) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "Unauthorized. Sign in to the admin CMS first." },
        { status: 401 },
      ),
    };
  }

  return { ok: true, user };
}

/** Authorize a request from an active blog user. Admin sessions are
 *  deliberately NOT accepted: the two roles are mutually exclusive
 *  for user-portal guards so an admin session cannot be reused as a
 *  blog-user session without an explicit separate sign-in. */
export async function requireBlogUser(request: Request): Promise<BlogUserGuard> {
  if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "Cross-origin request rejected." },
        { status: 403 },
      ),
    };
  }

  const user = await getBlogUser();
  if (!user) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "Unauthorized. Sign in to the user portal first." },
        { status: 401 },
      ),
    };
  }

  return { ok: true, user };
}

export function badRequest(message: string): Response {
  return Response.json({ ok: false, error: message }, { status: 400 });
}

export function serverError(message = "Unexpected server error."): Response {
  return Response.json({ ok: false, error: message }, { status: 500 });
}

import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  clearAttempts,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/login-rate-limit";

export const ADMIN_ROLE = "admin";
export const BLOG_USER_ROLE = "blog_user";

/** Prisma error code for "table does not exist" — the ONLY condition
 *  under which a missing BlogUser is treated as "no such user" (the
 *  pre-migration state, where Admin login must keep working). Every
 *  other database error is surfaced by re-throwing so an outage can
 *  never masquerade as an absent account. */
const PRISMA_TABLE_MISSING_CODE = "P2021";

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === PRISMA_TABLE_MISSING_CODE
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Credentials validation lives server-side only. Unknown emails and
       * wrong passwords return the same "invalid credentials" outcome so the
       * endpoint never discloses whether an account exists.
       *
       * Two account types share this provider:
       *   1. Existing Admin rows (`role` must be exactly "admin").
       *   2. New BlogUser rows (active only).
       * An email that exists in BOTH tables is ambiguous and is denied.
       * The returned `role` ("admin" | "blog_user") is carried in the JWT
       * and session so route guards can re-fetch the correct table —
       * never trust the role alone (see lib/admin-auth.ts).
       */
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        const rateKey = `login:${email ?? "unknown"}`;

        if (isRateLimited(rateKey)) {
          return null;
        }

        if (!email || !password) {
          return null;
        }

        let admin: { id: number; name: string; email: string; role: string; passwordHash: string } | null = null;
        let blogUser: { id: number; name: string; email: string; isActive: boolean; passwordHash: string } | null = null;

        try {
          [admin, blogUser] = await Promise.all([
            prisma.admin.findUnique({ where: { email } }),
            // Tolerate ONLY a pre-migration database (BlogUser table
            // missing): fall back to admin-only login so existing Admin
            // sessions are not broken before the migration lands.
            prisma.blogUser.findUnique({ where: { email } }).catch((error) => {
              if (isMissingTableError(error)) {
                console.error("blog user table not yet migrated; skipping lookup:", error);
                return null;
              }
              throw error;
            }),
          ]);
        } catch (error) {
          console.error("login lookup failed:", error);
          // The lookup itself failed (outage, permissions, …): fail
          // closed without pretending the account is absent. Throwing
          // surfaces a 500 instead of a misleading "invalid credentials".
          throw error;
        }

        // Ambiguous identity: never guess which account was meant.
        if (admin && blogUser) {
          recordFailedAttempt(rateKey);
          return null;
        }

        if (admin) {
          if (admin.role !== ADMIN_ROLE) {
            recordFailedAttempt(rateKey);
            return null;
          }

          const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

          if (!passwordMatches) {
            recordFailedAttempt(rateKey);
            return null;
          }

          clearAttempts(rateKey);

          const signedInUser = {
            id: admin.id.toString(),
            name: admin.name,
            email: admin.email,
            role: ADMIN_ROLE,
          } as User;

          return signedInUser;
        }

        if (blogUser) {
          if (!blogUser.isActive) {
            recordFailedAttempt(rateKey);
            return null;
          }

          const passwordMatches = await bcrypt.compare(password, blogUser.passwordHash);

          if (!passwordMatches) {
            recordFailedAttempt(rateKey);
            return null;
          }

          clearAttempts(rateKey);

          const signedInUser = {
            id: blogUser.id.toString(),
            name: blogUser.name,
            email: blogUser.email,
            role: BLOG_USER_ROLE,
          } as User;

          return signedInUser;
        }

        recordFailedAttempt(rateKey);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // 30 days, sliding-ish refresh every 24h.
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User & { role?: string };
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as unknown as { id?: string; sub?: string; role?: string };
      const userId = t.id ?? t.sub;
      const role = t.role;

      if (session.user) {
        session.user = {
          ...session.user,
          id: userId ?? "",
          role: role ?? "",
        } as typeof session.user;
      }

      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};

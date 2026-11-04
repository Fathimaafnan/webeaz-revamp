import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  clearAttempts,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/login-rate-limit";

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
       */
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        const rateKey = `admin-login:${email ?? "unknown"}`;

        if (isRateLimited(rateKey)) {
          return null;
        }

        if (!email || !password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin || admin.role !== "admin") {
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
          role: admin.role,
        } as User;

        return signedInUser;
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

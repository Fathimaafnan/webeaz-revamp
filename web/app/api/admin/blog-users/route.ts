import bcrypt from "bcryptjs";
import { parseBlogUserAccountPayload } from "@/lib/cms";
import {
  errorJson,
  hasOnlyKeys,
  isPrismaTransactionConflict,
  isPrismaUniqueError,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SELECT = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  applicationId: true,
  _count: {
    select: {
      posts: true,
    },
  },
  invitations: {
    select: {
      id: true,
      expiresAt: true,
      usedAt: true,
      revokedAt: true,
      sentStatus: true,
      sentAt: true,
      deliveryError: true,
    },
    take: 1,
    orderBy: { createdAt: "desc" as const },
  },
} as const;

/**
 * Admin-only BlogUser directory. Lists are summaries only — password
 * hashes are never selected or serialized. Account creation is
 * admin-only; there is intentionally no public registration route.
 */
export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const users = await prisma.blogUser.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: SELECT,
    });
    return successJson({
      users: users.map(({ _count, invitations, ...user }) => ({
        ...user,
        postCount: _count.posts,
        latestInvitation: invitations[0]
          ? {
              ...invitations[0],
              expiresAt: invitations[0].expiresAt.toISOString(),
              sentAt: invitations[0].sentAt ? invitations[0].sentAt.toISOString() : null,
              usedAt: invitations[0].usedAt ? invitations[0].usedAt.toISOString() : null,
              revokedAt: invitations[0].revokedAt ? invitations[0].revokedAt.toISOString() : null,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("admin blog users read failed:", error);
    return errorJson("Could not load blog users.", 500);
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (!hasOnlyKeys(parsed.value, ["name", "email", "password"])) {
    return errorJson("Request contains fields that cannot be set.", 400);
  }

  const result = parseBlogUserAccountPayload(parsed.value);
  if (result.error !== null) return errorJson(result.error, 400);

  try {
    const existing = await prisma.blogUser.findUnique({
      where: { email: result.data.email },
      select: { id: true },
    });
    if (existing) {
      return errorJson("An account with that email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(result.data.password, 12);
    const user = await prisma.blogUser.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        passwordHash,
      },
      select: SELECT,
    });

    const { _count, invitations, ...safe } = user;
    return successJson({
      user: {
        ...safe,
        postCount: _count.posts,
        latestInvitation: invitations[0]
          ? {
              ...invitations[0],
              expiresAt: invitations[0].expiresAt.toISOString(),
              sentAt: invitations[0].sentAt ? invitations[0].sentAt.toISOString() : null,
              usedAt: invitations[0].usedAt ? invitations[0].usedAt.toISOString() : null,
              revokedAt: invitations[0].revokedAt ? invitations[0].revokedAt.toISOString() : null,
            }
          : null,
      },
    }, 201);
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("An account with that email already exists.", 409);
    }
    if (isPrismaTransactionConflict(error)) {
      return errorJson("A conflicting change was detected. Reload and try again.", 409);
    }
    console.error("admin blog user create failed:", error);
    return errorJson("Could not create the account.", 500);
  }
}

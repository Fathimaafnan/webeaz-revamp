import bcrypt from "bcryptjs";
import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { validateBlogUserPassword } from "@/lib/cms";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/** Admin-only password reset. The new password travels to the server
 *  over the authenticated session and is immediately bcrypt-hashed;
 *  it is never logged or returned. */
export async function POST(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  if (!/^[1-9]\d*$/.test(rawId)) return errorJson("Invalid account id.", 400);
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return errorJson("Invalid account id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.value).some((key) => key !== "password")) {
    return errorJson("Request contains fields that cannot be set.", 400);
  }

  const password = validateBlogUserPassword(parsed.value.password);
  if (!password) {
    return errorJson(
      "Password must be at least 12 characters and no more than 72 UTF-8 bytes.",
      400,
    );
  }

  try {
    const existing = await prisma.blogUser.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return errorJson("Account not found.", 404);

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.blogUser.update({
      where: { id },
      data: { passwordHash },
    });

    return successJson({ id });
  } catch (error) {
    console.error("admin blog user password reset failed:", error);
    return errorJson("Could not reset the password.", 500);
  }
}

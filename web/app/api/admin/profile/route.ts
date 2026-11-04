import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";

/**
 * PUT /api/admin/profile — update the signed-in admin's display name
 * and, when a password change is requested, verify the current
 * password first. No registration and no password reset by email exist;
 * this is the only way an admin credential changes.
 */
export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const adminId = Number(guard.user.id);
    if (!Number.isInteger(adminId)) return badRequest("Invalid session.");

    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return badRequest("Account not found.");

    const body = await request.json();
    const data: { name?: string; passwordHash?: string } = {};

    if (body?.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) return badRequest("Name cannot be empty.");
      if (name.length > 80) return badRequest("Name is too long.");
      data.name = name;
    }

    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
    if (newPassword) {
      if (newPassword.length < 10) {
        return badRequest("New password must be at least 10 characters.");
      }
      const currentPassword =
        typeof body?.currentPassword === "string" ? body.currentPassword : "";
      if (!currentPassword) {
        return badRequest("Enter your current password to change it.");
      }
      const matches = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!matches) return badRequest("Current password is incorrect.");
      data.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(data).length === 0) return badRequest("Nothing to update.");

    await prisma.admin.update({ where: { id: adminId }, data });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("profile PUT failed:", error);
    return serverError("Could not update the profile.");
  }
}

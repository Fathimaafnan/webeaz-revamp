import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

const ALLOWED_KEYS = Object.keys(DEFAULT_SETTINGS) as Array<keyof typeof DEFAULT_SETTINGS>;

/** PUT /api/admin/settings — save the editable site-wide settings. */
export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") return badRequest("Invalid payload.");

    const data: Record<string, string> = {};
    for (const key of ALLOWED_KEYS) {
      const value = body[key];
      if (value === undefined) continue;
      if (typeof value !== "string") return badRequest(`"${key}" must be text.`);
      const trimmed = value.trim();
      if (!trimmed) return badRequest(`"${key}" cannot be empty.`);
      if (trimmed.length > 600) return badRequest(`"${key}" is too long.`);
      data[key] = trimmed;
    }
    if (Object.keys(data).length === 0) return badRequest("Nothing to save.");

    for (const [key, value] of Object.entries(data)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("settings PUT failed:", error);
    return serverError("Could not save settings.");
  }
}

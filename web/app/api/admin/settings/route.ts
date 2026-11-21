import { revalidatePath } from "next/cache";
import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FOOTER_KEYS = [
  "siteName", "siteDescription", "footerTagline", "footerBlurb", "footerNote", "footerLogoUrl",
] as const;

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...FOOTER_KEYS] } },
    });
    return successJson({ settings: Object.fromEntries(rows.map((r) => [r.key, r.value])) });
  } catch (error) {
    console.error("settings read failed:", error);
    return errorJson("Could not load settings.", 500);
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const values = parsed.value.settings;
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return errorJson("Invalid settings payload.", 400);
  }
  const entries = Object.entries(values as Record<string, unknown>);
  if (entries.length === 0) return errorJson("No settings supplied.", 400);
  for (const [key, value] of entries) {
    if (!(FOOTER_KEYS as readonly string[]).includes(key)) return errorJson(`Unknown setting: ${key}`, 400);
    if (typeof value !== "string" || value.length > 2000) return errorJson(`Invalid value for ${key}.`, 400);
  }

  try {
    for (const [key, value] of entries) {
      const text = String(value);
      await prisma.siteSetting.upsert({ where: { key }, create: { key, value: text }, update: { value: text } });
    }
    revalidatePath("/");
    return successJson({ updated: entries.length });
  } catch (error) {
    console.error("settings save failed:", error);
    return errorJson("Could not save settings.", 500);
  }
}

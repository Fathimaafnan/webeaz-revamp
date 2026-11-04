import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import SettingsForms from "@/components/admin/SettingsForms";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getAdmin();
  if (!user) return null;

  let settings = DEFAULT_SETTINGS;
  let dbOk = false;

  try {
    const rows = await prisma.siteSetting.findMany();
    dbOk = true;
    if (rows.length > 0) {
      const map = new Map(rows.map((r) => [r.key, r.value]));
      settings = {
        siteName: map.get("siteName") ?? DEFAULT_SETTINGS.siteName,
        siteDescription: map.get("siteDescription") ?? DEFAULT_SETTINGS.siteDescription,
        footerTagline: map.get("footerTagline") ?? DEFAULT_SETTINGS.footerTagline,
        footerBlurb: map.get("footerBlurb") ?? DEFAULT_SETTINGS.footerBlurb,
        footerNote: map.get("footerNote") ?? DEFAULT_SETTINGS.footerNote,
      };
    }
  } catch {
    dbOk = false;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Settings
        </p>
        <h1 className="text-3xl font-bold text-white">Website &amp; account</h1>
        <p className="text-sm text-white/70">
          Site-wide copy used by the layout and footer, plus your admin profile.
        </p>
        {!dbOk ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            The database is unreachable, so settings cannot be saved right now.
          </p>
        ) : null}
      </div>

      <SettingsForms
        initialSettings={settings}
        initialProfile={{
          name: user.name ?? "",
          email: user.email ?? "",
        }}
        canSave={dbOk}
      />
    </>
  );
}

import ContentManager from "@/components/admin/ContentManager";
import FooterSettingsForm from "@/components/admin/FooterSettingsForm";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/fallback-content";
import { getCollection } from "@/lib/admin-content";
import { getMediaStorageStatus } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

/** Shared server wrapper for every Site Content editor page. */
export default async function ContentPage({ collection }: { collection: string }) {
  const config = getCollection(collection);
  if (!config) return <p className="text-sm text-red-300">Unknown content collection.</p>;

  const [items, media] = await Promise.all([
    (config.model as any).findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    prisma.mediaAsset.findMany({ orderBy: { id: "desc" }, take: 200, select: { id: true, url: true, originalName: true } }),
  ]);

  // The Footer page additionally edits the footer text stored in SiteSetting.
  let topContent;
  if (collection === "footer-links") {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: { in: ["siteName", "siteDescription", "footerTagline", "footerBlurb", "footerNote", "footerLogoUrl"] },
      },
    });
    topContent = (
      <FooterSettingsForm
        initial={{ ...DEFAULT_FOOTER_SETTINGS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) }}
      />
    );
  }

  return (
    <ContentManager
      collection={collection}
      label={collection === "footer-links" ? "Footer" : config.label}
      fields={config.fields}
      initialItems={JSON.parse(JSON.stringify(items))}
      groupField={config.groupField}
      initialMedia={media}
      storageConfigured={getMediaStorageStatus().configured}
      topContent={topContent}
    />
  );
}

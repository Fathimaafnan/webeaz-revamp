import { getAdmin } from "@/lib/admin-auth";
import { getMediaStorageStatus } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const user = await getAdmin();
  if (!user) return null;

  let assets: Array<{
    id: number;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
    alt: string;
    createdAt: Date;
  }> = [];
  let dbOk = false;
  const storage = getMediaStorageStatus();

  try {
    const rows = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    dbOk = true;
    assets = rows;
  } catch {
    dbOk = false;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Media management
        </p>
        <h1 className="text-3xl font-bold text-white">Media library</h1>
        <p className="text-sm text-white/70">
          JPEG, PNG, WebP and GIF up to 5 MB. Image files are stored in the configured
          S3-compatible bucket; only metadata and object keys live in PostgreSQL.
        </p>
        {!dbOk ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            The database is unreachable, so the library cannot be loaded right now.
          </p>
        ) : null}
        {!storage.configured ? (
          <p className="rounded-lg border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Uploads are disabled until media storage is configured. Missing:{" "}
            {storage.missing.join(", ")}.
          </p>
        ) : null}
      </div>

      <MediaLibrary initial={assets} canSave={dbOk && storage.configured} />
    </>
  );
}

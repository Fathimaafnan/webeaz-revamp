import "server-only";

import { revalidatePath } from "next/cache";

/** Invalidate the public Insights surface after any blog mutation that
 *  can change what visitors see (approval is the only such case in the
 *  BlogUser workflow — drafts, submissions and returns never go live). */
export function revalidateBlogRoutes(slug?: string) {
  revalidatePath("/insights");
  revalidatePath("/sitemap.xml");
  revalidatePath("/", "layout");

  if (slug) {
    revalidatePath(`/insights/${slug}`);
  }
}

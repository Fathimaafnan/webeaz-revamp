import "server-only";

import { revalidatePath } from "next/cache";

export type ServiceRouteRef = {
  categorySlug: string;
  serviceSlug?: string;
};

export function revalidateServiceRoutes(...routes: ServiceRouteRef[]) {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/sitemap.xml");

  for (const route of routes) {
    revalidatePath(`/services/${route.categorySlug}`);
    if (route.serviceSlug) {
      revalidatePath(`/services/${route.categorySlug}/${route.serviceSlug}`);
    }
  }
}

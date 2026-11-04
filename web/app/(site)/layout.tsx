import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/home/IntroSplash";
import FloatingContactButtons from "@/components/contact/FloatingContactButtons";
import { getServiceTree } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    description: settings.siteDescription,
    openGraph: {
      siteName: settings.siteName,
      description: settings.siteDescription,
    },
  };
}

export default async function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories } = await getServiceTree();
  const serviceItems = categories.map((category) => ({
    label: category.name,
    description: category.tagline,
    href: `/services/${category.slug}`,
    tagList: category.tagline.split(" • "),
  }));

  return (
    <>
      <IntroSplash />
      <Navbar serviceItems={serviceItems} />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContactButtons />
    </>
  );
}

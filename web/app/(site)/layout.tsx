import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/home/IntroSplash";
import FloatingContactButtons from "@/components/contact/FloatingContactButtons";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import ScrollMotion from "@/components/layout/ScrollMotion";
import CookieConsent from "@/components/privacy/CookieConsent";
import { getFooterLinks, getFooterSettings, getServiceTree } from "@/lib/content";

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
  const [{ categories }, footerLinks, footerSettings] = await Promise.all([
    getServiceTree(),
    getFooterLinks(),
    getFooterSettings(),
  ]);
  // The Services dropdown lists the four service categories only. Each
  // one links straight to its own category page — the individual
  // services underneath are not listed here.
  const serviceItems = categories.map((category) => ({
    label: category.name,
    href: `/services/${category.slug}`,
  }));

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <IntroSplash />
      <ScrollMotion />
      <Navbar serviceItems={serviceItems} />
      <main className="flex-1" id="main-content" tabIndex={-1}>{children}</main>
      <Footer
        links={footerLinks.filter((l) => l.group !== "SOCIAL")}
        socials={footerLinks.filter((l) => l.group === "SOCIAL")}
        settings={footerSettings.settings}
        logoUrl={footerSettings.logoUrl}
      />
      <FloatingContactButtons />
      <ScrollToTopButton />
      <CookieConsent />
    </>
  );
}

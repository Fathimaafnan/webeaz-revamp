import Capabilities from "@/components/home/Capabilities";
import CaseStudies from "@/components/home/CaseStudies";
import CurvedRectangle from "@/components/home/CurvedRectangle";
import Testimonials from "@/components/home/Testimonials";
import TrustStats from "@/components/home/TrustStats";
import WhyWebEaz from "@/components/home/WhyWebEaz";
import AppointmentPopup from "@/components/home/AppointmentPopup";
import Faq from "@/components/home/Faq";
import FeaturedClients from "@/components/home/FeaturedClients";
import GlobeLocations from "@/components/home/GlobeLocations";
import Partners from "@/components/home/Partners";
import FinalCTA from "@/components/home/FinalCTA";
import Hero from "@/components/home/Hero";
import Insights from "@/components/home/Insights";
import Industries from "@/components/home/Industries";
import { Fragment } from "react";
import {
  getHomeContent,
  getHomeSections,
  getHomeStats,
  getHomepageBlogSettings,
  getHomepageFeaturedPosts,
  getIndustries,
  getTestimonials,
  getOfficeLocations,
  getProducts,
  getLogos,
  getCapabilityCards,
  getCaseStudies,
  getFaqs,
} from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WebEaz Technologies Pvt. Ltd.",
  url: "https://www.webeaz.com",
  logo: "https://www.webeaz.com/webeaz-logo.png",
  description:
    "WebEaz helps businesses build, transform, automate and grow through technology, digital growth, automation and AI.",
  sameAs: [
    "https://erpeaz.com/",
    "https://dgverse.org/",
  ],
};

export default async function Home() {
  const [
    content,
    sections,
    trustStats,
    whyStats,
    industries,
    featuredPosts,
    blogSettings,
    testimonials,
    officeLocations,
    products,
    partnerLogos,
    clientLogos,
    capabilityCards,
    caseStudies,
    faqs,
  ] = await Promise.all([
    getHomeContent(),
    getHomeSections(),
    getHomeStats("trust"),
    getHomeStats("why"),
    getIndustries(),
    getHomepageFeaturedPosts(),
    getHomepageBlogSettings(),
    getTestimonials(),
    getOfficeLocations(),
    getProducts(),
    getLogos("PARTNER"),
    getLogos("CLIENT"),
    getCapabilityCards(),
    getCaseStudies(),
    getFaqs(),
  ]);
  const sectionByKey = new Map(sections.map((section) => [section.key, section]));
  const section = (key: string) => sectionByKey.get(key);
  const capabilitiesSection = section("capabilities");
  const caseStudiesSection = section("case-studies");
  const globeSection = section("globe-locations");
  const productsSection = section("curved-rectangle");
  const industriesSection = section("industries");
  const trustStatsSection = section("trust-stats");
  const whyWebEazSection = section("why-web-eaz");
  const featuredClientsSection = section("featured-clients");
  const partnersSection = section("partners");
  const testimonialsSection = section("testimonials");
  const blogsSection = section("blogs");
  const faqSection = section("faq");
  const finalCtaSection = section("final-cta");

  // Render sections in the exact order saved in the CMS. Hero stays on
  // top; each content section is emitted under its Fragment so nothing
  // is wrapped or moved in the DOM. Keys not in this map are ignored.
  const sectionNodes: Record<string, React.ReactNode> = {
    capabilities: capabilitiesSection?.visible ? (
      <Capabilities section={capabilitiesSection} cards={capabilityCards} />
    ) : null,
    "case-studies": caseStudiesSection?.visible ? (
      <CaseStudies section={caseStudiesSection} items={caseStudies} />
    ) : null,
    "globe-locations": globeSection?.visible ? (
      <GlobeLocations offices={officeLocations} />
    ) : null,
    "curved-rectangle": productsSection?.visible ? (
      <CurvedRectangle products={products} />
    ) : null,
    industries: industriesSection?.visible ? (
      <Industries industries={industries} section={industriesSection} />
    ) : null,
    "trust-stats": trustStatsSection?.visible ? (
      <TrustStats section={trustStatsSection} stats={trustStats} />
    ) : null,
    "why-web-eaz": whyWebEazSection?.visible ? (
      <WhyWebEaz section={whyWebEazSection} stats={whyStats} />
    ) : null,
    "featured-clients": featuredClientsSection?.visible ? (
      <FeaturedClients section={featuredClientsSection} logos={clientLogos} />
    ) : null,
    testimonials: testimonialsSection?.visible ? (
      <Testimonials testimonials={testimonials} section={testimonialsSection} />
    ) : null,
    partners: partnersSection?.visible ? (
      <Partners section={partnersSection} logos={partnerLogos} />
    ) : null,
    blogs: blogsSection?.visible ? (
      <Insights posts={featuredPosts} section={blogsSection} settings={blogSettings} />
    ) : null,
    faq: faqSection?.visible ? <Faq section={faqSection} items={faqs} /> : null,
    "final-cta": finalCtaSection?.visible ? (
      <FinalCTA content={content} section={finalCtaSection} />
    ) : null,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* One continuous gradient spans every section from here to the
          Final CTA. The sections carry no background of their own, so
          the canvas is never interrupted. */}
      <div className="home-canvas">
        {/* 1. Hero — value proposition + primary contact CTA */}
        <Hero content={content} />

        {/* 3. Content sections — rendered in the order saved in the CMS.

        {/* 3. Content sections — rendered in the order saved in the CMS.
            Blogs is section key "blogs" (CMS-managed heading, featured
            selection, Explore More and contributor CTA). */}
        {sections.map((s) => {
          const node = sectionNodes[s.key];
          if (!node) return null;
          return <Fragment key={s.key}>{node}</Fragment>;
        })}
      </div>

      {/* Dismissible Schedule An Appointment popup — fixed overlay, does
          not affect the document flow or any section above/below it. */}
      <AppointmentPopup />
    </>
  );
}

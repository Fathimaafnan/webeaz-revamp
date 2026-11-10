import Hero from "@/components/home/Hero";
import { Fragment } from "react";
import Capabilities from "@/components/home/Capabilities";
import CaseStudies from "@/components/home/CaseStudies";
import TrustStats from "@/components/home/TrustStats";
import WhyWebEaz from "@/components/home/WhyWebEaz";
import FeaturedClients from "@/components/home/FeaturedClients";
import Partners from "@/components/home/Partners";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Insights from "@/components/home/Insights";
import Industries from "@/components/home/Industries";
import {
  getHomeContent,
  getHomeSections,
  getHomeStats,
  getHomepageBlogSettings,
  getHomepageFeaturedPosts,
  getIndustries,
  getTestimonials,
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
  const [content, sections, trustStats, whyStats, testimonials, industries, featuredPosts, blogSettings] =
    await Promise.all([
      getHomeContent(),
      getHomeSections(),
      getHomeStats("trust"),
      getHomeStats("why"),
      getTestimonials(),
      getIndustries(),
      getHomepageFeaturedPosts(),
      getHomepageBlogSettings(),
    ]);
  const sectionByKey = new Map(sections.map((section) => [section.key, section]));
  const section = (key: string) => sectionByKey.get(key);
  const capabilitiesSection = section("capabilities");
  const caseStudiesSection = section("case-studies");
  const industriesSection = section("industries");
  const trustStatsSection = section("trust-stats");
  const whyWebEazSection = section("why-web-eaz");
  const featuredClientsSection = section("featured-clients");
  const partnersSection = section("partners");
  const testimonialsSection = section("testimonials");
  const blogsSection = section("blogs");
  const finalCtaSection = section("final-cta");

  // Render sections in the exact order saved in the CMS. Hero stays on
  // top; each content section is emitted under its Fragment so nothing
  // is wrapped or moved in the DOM. Keys not in this map are ignored.
  const sectionNodes: Record<string, React.ReactNode> = {
    capabilities: capabilitiesSection?.visible ? (
      <Capabilities section={capabilitiesSection} />
    ) : null,
    "case-studies": caseStudiesSection?.visible ? (
      <CaseStudies section={caseStudiesSection} />
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
      <FeaturedClients section={featuredClientsSection} />
    ) : null,
    partners: partnersSection?.visible ? (
      <Partners section={partnersSection} />
    ) : null,
    testimonials: testimonialsSection?.visible ? (
      <Testimonials
        testimonials={testimonials}
        section={testimonialsSection}
      />
    ) : null,
    blogs: blogsSection?.visible ? (
      <Insights posts={featuredPosts} section={blogsSection} settings={blogSettings} />
    ) : null,
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

        {/* 2. Content sections — rendered in the order saved in the CMS.
            Blogs is section key "blogs" (CMS-managed heading, featured
            selection, Explore More and contributor CTA). */}
        {sections.map((s) => {
          const node = sectionNodes[s.key];
          if (!node) return null;
          return <Fragment key={s.key}>{node}</Fragment>;
        })}
      </div>
    </>
  );
}

import Hero from "@/components/home/Hero";
import Capabilities from "@/components/home/Capabilities";
import CaseStudies from "@/components/home/CaseStudies";
import TrustStats from "@/components/home/TrustStats";
import WhyWebEaz from "@/components/home/WhyWebEaz";
import FeaturedClients from "@/components/home/FeaturedClients";
import Partners from "@/components/home/Partners";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Industries from "@/components/home/Industries";
import {
  getHomeContent,
  getHomeSections,
  getHomeStats,
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
  const [content, sections, trustStats, whyStats, testimonials, industries] =
    await Promise.all([
      getHomeContent(),
      getHomeSections(),
      getHomeStats("trust"),
      getHomeStats("why"),
      getTestimonials(),
      getIndustries(),
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
  const finalCtaSection = section("final-cta");

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

        {/* 2. Services Overview — compact service categories */}
        {capabilitiesSection?.visible ? (
          <Capabilities section={capabilitiesSection} />
        ) : null}

        {/* 3. Selected Work / Portfolio — compact case studies */}
        {caseStudiesSection?.visible ? (
          <CaseStudies section={caseStudiesSection} />
        ) : null}

        {industriesSection?.visible ? (
          <Industries industries={industries} section={industriesSection} />
        ) : null}

        {/* 4. Why Choose WebEaz — credibility & differentiators (merged TrustStats + WhyWebEaz) */}
        {trustStatsSection?.visible ? (
          <TrustStats section={trustStatsSection} stats={trustStats} />
        ) : null}
        {whyWebEazSection?.visible ? (
          <WhyWebEaz section={whyWebEazSection} stats={whyStats} />
        ) : null}

        {/* 5. Trust / Social Proof — client logos, partners, testimonials (merged) */}
        {featuredClientsSection?.visible ? (
          <FeaturedClients section={featuredClientsSection} />
        ) : null}
        {partnersSection?.visible ? (
          <Partners section={partnersSection} />
        ) : null}
        {testimonialsSection?.visible ? (
          <Testimonials
            testimonials={testimonials}
            section={testimonialsSection}
          />
        ) : null}

        {/* 6. Contact CTA — moved up significantly for conversion */}
        {finalCtaSection?.visible ? (
          <FinalCTA content={content} section={finalCtaSection} />
        ) : null}
      </div>
    </>
  );
}

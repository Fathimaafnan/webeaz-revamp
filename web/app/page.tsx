import Hero from "@/components/home/Hero";
import TrustStats from "@/components/home/TrustStats";
import FeaturedClients from "@/components/home/FeaturedClients";
import Capabilities from "@/components/home/Capabilities";
import Outcomes from "@/components/home/Outcomes";
import CaseStudies from "@/components/home/CaseStudies";
import Ecosystem from "@/components/home/Ecosystem";
import Products from "@/components/home/Products";
import WhyWebEaz from "@/components/home/WhyWebEaz";
import Industries from "@/components/home/Industries";
import Journey from "@/components/home/Journey";
import Testimonials from "@/components/home/Testimonials";
import Insights from "@/components/home/Insights";
import Partners from "@/components/home/Partners";
import FinalCTA from "@/components/home/FinalCTA";

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* The brand reveal now lives in the root layout, so that it can
          cover a route change — mounted here it would unmount the
          instant the destination rendered, which is exactly when the
          overlay has to still be there. */}
      {/* One continuous gradient spans every section from here to the
          Final CTA. The sections carry no background of their own, so
          the canvas is never interrupted. The Hero keeps its whole
          composition — this wrapper only supplies the ground it sits
          on, which is the same gradient the Hero always had. */}
      <div className="home-canvas">
        <Hero />
        {/* The Founder & CEO spotlight has moved to the About page. */}
        <TrustStats />
        <FeaturedClients />
        <Capabilities />
        <Outcomes />
        <CaseStudies />
        <Ecosystem />
        <Products />
        <WhyWebEaz />
        <Industries />
        <Journey />
        <Testimonials />
        <Insights />
        <Partners />
        <FinalCTA />
      </div>
    </>
  );
}

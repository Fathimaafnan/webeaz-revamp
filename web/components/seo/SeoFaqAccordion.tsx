import Accordion from "@/components/ui/Accordion";
import { faqs } from "@/lib/seo-page-content";

/**
 * SEO page FAQ. Behaviour lives in the shared Accordion so the SEM
 * page reuses one implementation rather than duplicating it.
 */
export default function SeoFaqAccordion() {
  return <Accordion items={faqs} className="mt-12" />;
}
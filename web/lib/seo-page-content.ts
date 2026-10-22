import type { ServiceIconName } from "@/lib/services";

/**
 * Content for the standalone SEO landing page at
 * /search-engine-optimization.
 *
 * Every string here is real copy — no invented metrics, rankings,
 * client results or testimonials. Section 10 (case studies) is an
 * explicit placeholder because no verified SEO engagement data is
 * available yet; it is marked so it cannot be mistaken for a result.
 */

export type SeoBenefit = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SeoCapability = {
  title: string;
  description: string;
};

export type SeoService = {
  icon: ServiceIconName;
  title: string;
  description: string;
  /** Real search terms this service genuinely covers. */
  keywords: string;
};

export type SeoStep = {
  num: string;
  title: string;
  description: string;
  deliverable: string;
};

export type SeoSegment = {
  icon: ServiceIconName;
  title: string;
  description: string;
  focus: string[];
};

export type SeoMetric = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SeoPillar = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SeoFaq = {
  question: string;
  answer: string;
};

/** Anchors used by same-page CTAs. Keep in sync with the page. */
export const seoAnchors = {
  enquiry: "seo-enquiry",
  process: "seo-process",
  services: "seo-services",
  measure: "seo-measure",
  ai: "seo-ai",
} as const;

export const heroLabels = [
  "Technical SEO",
  "Organic Growth",
  "AI-Assisted Insights",
];

export const introHighlights = [
  {
    icon: "seo" as ServiceIconName,
    label: "Search intent",
    detail: "Mapped to the questions customers actually ask.",
  },
  {
    icon: "content" as ServiceIconName,
    label: "Useful content",
    detail: "Pages built to answer, not just to rank.",
  },
  {
    icon: "software" as ServiceIconName,
    label: "Technical foundation",
    detail: "Crawlable, fast and easy for search engines to process.",
  },
];

export const benefits: SeoBenefit[] = [
  {
    icon: "seo",
    title: "Be Discovered by the Right Audience",
    description:
      "Improve your website's relevance for the searches that matter to your products, services, and target customers.",
  },
  {
    icon: "funnel",
    title: "Attract More Relevant Organic Traffic",
    description:
      "Help people with a genuine interest in your offerings find useful pages that answer their needs.",
  },
  {
    icon: "ads",
    title: "Turn Visits into Opportunities",
    description:
      "Improve landing pages, calls to action, and user journeys so visitors can move from research to enquiry.",
  },
  {
    icon: "process",
    title: "Build Long-Term Search Equity",
    description:
      "Strengthen your website's content, usability, and authority over time instead of relying entirely on paid traffic.",
  },
];

export const aiCapabilities: SeoCapability[] = [
  {
    title: "Conversational Search Optimization",
    description:
      "Identify the questions customers ask in natural language and create useful content that addresses their intent.",
  },
  {
    title: "AI-Assisted Keyword & Topic Research",
    description:
      "Discover related queries, content gaps, topic clusters, and search intent patterns to guide content planning.",
  },
  {
    title: "Content Clarity & Semantic Relevance",
    description:
      "Structure pages around specific questions, clear explanations, useful evidence, and naturally related concepts.",
  },
  {
    title: "AI Search Visibility Monitoring",
    description:
      "Where data and tools are available, monitor brand mentions, citations, and referrals from supported AI-powered search experiences.",
  },
  {
    title: "Human-Reviewed, Helpful Content",
    description:
      "Use AI to assist research and workflows while reviewing content for accuracy, originality, relevance, and real customer value.",
  },
];

export const services: SeoService[] = [
  {
    icon: "software",
    title: "Technical SEO",
    description:
      "Improve crawlability, indexability, site architecture, internal linking, mobile usability, page performance, canonicalization, XML sitemaps, and other technical foundations.",
    keywords: "Technical SEO audit · Website SEO optimization · Site health",
  },
  {
    icon: "website",
    title: "On-Page SEO",
    description:
      "Optimize titles, headings, meta descriptions, page copy, image alt text, URLs, internal links, and page structure around search intent.",
    keywords: "On-page SEO services · Website content optimization",
  },
  {
    icon: "seo",
    title: "Keyword & Search Intent Research",
    description:
      "Identify relevant search terms, user questions, commercial intent, long-tail opportunities, and topic gaps to prioritize the right pages.",
    keywords: "Keyword research services · Search intent analysis",
  },
  {
    icon: "content",
    title: "SEO Content Strategy",
    description:
      "Plan service pages, landing pages, blog articles, topic clusters, and FAQs that address customer needs and demonstrate relevant expertise.",
    keywords: "SEO content strategy · SEO copywriting services",
  },
  {
    icon: "marketing",
    title: "Local SEO",
    description:
      "Strengthen local discovery through eligible business profile optimization, consistent business details, location-specific landing pages, and relevant local content.",
    keywords: "Local SEO services · Google Business Profile optimization",
  },
  {
    icon: "social",
    title: "Off-Page SEO & Digital Authority",
    description:
      "Build credibility through relevant digital PR, useful link-worthy content, brand mentions, and ethical outreach. Avoid manipulative link schemes.",
    keywords: "Off-page SEO · Link earning · Digital authority",
  },
  {
    icon: "ai-apps",
    title: "Structured Data & Search Appearance",
    description:
      "Implement eligible, accurate structured data where appropriate, validate markup, and improve page titles and descriptions to help users understand search results.",
    keywords: "Schema markup · Structured data SEO · Rich results",
  },
  {
    icon: "process",
    title: "SEO Analytics & Continuous Improvement",
    description:
      "Track search impressions, clicks, landing-page performance, keyword trends, and agreed conversion metrics to identify what needs improvement.",
    keywords: "SEO reporting · Organic traffic analysis · Conversion tracking",
  },
];

export const processSteps: SeoStep[] = [
  {
    num: "01",
    title: "Discover & Audit",
    description:
      "Understand your business goals, target audience, existing website, competitors, and current search performance. Identify technical issues and content gaps.",
    deliverable: "Initial SEO audit and opportunity assessment.",
  },
  {
    num: "02",
    title: "Research & Strategize",
    description:
      "Map keywords to search intent, study competitors, prioritize pages, and create an SEO roadmap based on your business objectives.",
    deliverable: "Prioritized keyword map and action plan.",
  },
  {
    num: "03",
    title: "Optimize & Implement",
    description:
      "Address agreed technical fixes, improve key pages, develop useful content, strengthen internal links, and implement relevant structured data.",
    deliverable: "Implemented SEO improvements and optimized pages.",
  },
  {
    num: "04",
    title: "Measure & Refine",
    description:
      "Review performance data, evaluate completed work, identify emerging opportunities, and refine the strategy as search behaviour and business priorities evolve.",
    deliverable: "Performance reports and next-step recommendations.",
  },
];

export const segments: SeoSegment[] = [
  {
    icon: "marketing",
    title: "Local Businesses",
    description:
      "Improve local discovery and help nearby customers find your services, contact details, and location.",
    focus: ["Local intent", "Business listings", "Location pages"],
  },
  {
    icon: "ecommerce",
    title: "E-commerce Businesses",
    description:
      "Help product and category pages reach relevant shoppers while improving discoverability and the path to purchase.",
    focus: ["Product SEO", "Category architecture", "Shopping journeys"],
  },
  {
    icon: "crm",
    title: "B2B & Professional Services",
    description:
      "Reach decision-makers researching solutions, compare alternatives, and build confidence in your expertise.",
    focus: ["Service pages", "Commercial intent", "Lead generation"],
  },
  {
    icon: "product",
    title: "Startups & Growing Brands",
    description:
      "Build your search foundation, identify achievable opportunities, and develop topical visibility as your offerings expand.",
    focus: ["Technical foundations", "Content strategy", "Brand discovery"],
  },
];

export const metrics: SeoMetric[] = [
  {
    icon: "seo",
    title: "Search Visibility",
    description:
      "Impressions, query visibility, ranking trends, and relevant search coverage.",
  },
  {
    icon: "funnel",
    title: "Organic Engagement",
    description:
      "Organic clicks, landing-page visits, engagement, and relevant user journeys.",
  },
  {
    icon: "ads",
    title: "Qualified Conversions",
    description:
      "Enquiries, calls, form submissions, purchases, and other agreed goals.",
  },
  {
    icon: "process",
    title: "Growth Opportunities",
    description:
      "Content gaps, technical issues, underperforming pages, and emerging queries.",
  },
];

export const pillars: SeoPillar[] = [
  {
    icon: "process",
    title: "A Connected Digital Approach",
    description:
      "Align SEO with website structure, content, user experience, and your wider digital marketing activities.",
  },
  {
    icon: "seo",
    title: "Data-Informed Decisions",
    description:
      "Use available search and analytics data to prioritize improvements instead of relying on assumptions alone.",
  },
  {
    icon: "ai-consulting",
    title: "AI-Assisted Workflows, Human Oversight",
    description:
      "Apply AI where it adds value to research and analysis while keeping quality, accuracy, and customer needs at the centre.",
  },
  {
    icon: "sales-automation",
    title: "Continuous Optimization",
    description:
      "SEO is an ongoing process. Review performance and refine the strategy as your business and search landscape evolve.",
  },
];

export const faqs: SeoFaq[] = [
  {
    question: "What is SEO, and why does my business need it?",
    answer:
      "Search Engine Optimization (SEO) is the process of improving your website so search engines can discover, understand, and present its pages for relevant searches. It can help your business attract relevant organic traffic, build credibility, and create more opportunities for enquiries and sales over time.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "SEO timelines vary depending on your website's current condition, competition, content quality, technical issues, and the work implemented. Some improvements may be noticed earlier, while meaningful organic growth can take several months or longer. No agency can responsibly guarantee a specific ranking or timeline for every website.",
  },
  {
    question: "What is AI SEO?",
    answer:
      "AI SEO generally refers to using AI-assisted tools and workflows to support activities such as keyword research, topic analysis, content planning, and performance analysis. It can also include preparing content for discovery through AI-powered search experiences. The strategy still needs sound SEO fundamentals, human review, and useful content.",
  },
  {
    question: "Can SEO help my business appear in Google AI Overviews?",
    answer:
      "Good SEO practices can help make your website eligible to be considered as a supporting source in Google's AI search features. There is no special AI optimization or schema that guarantees inclusion. Your pages still need to meet applicable technical requirements and provide useful, reliable information.",
  },
  {
    question: "What is the difference between SEO and Google Ads?",
    answer:
      "SEO focuses on improving unpaid organic visibility. Google Ads provides paid placements that typically run while campaigns are funded. SEO can build lasting search visibility over time, while paid advertising can help you reach audiences through a campaign budget. The right mix depends on your objectives and resources.",
  },
  {
    question: "What is local SEO?",
    answer:
      "Local SEO helps businesses improve their visibility for geographically relevant searches. It can involve optimizing an eligible Google Business Profile, maintaining accurate business information, creating relevant location pages, and developing useful local content.",
  },
  {
    question: "Does my website need technical SEO?",
    answer:
      "Yes, technical SEO is an important foundation. Search engines need to be able to access and understand your pages. Crawlability, indexability, internal linking, mobile usability, performance, and correct canonical signals can all affect how effectively your content is discovered and processed.",
  },
  {
    question: "How do you measure SEO success?",
    answer:
      "SEO success can be assessed through search impressions, organic clicks, relevant query visibility, landing-page performance, qualified enquiries, purchases, and other agreed business goals. The most useful metrics depend on what your business wants to achieve.",
  },
  {
    question: "Can SEO help a new website?",
    answer:
      "Yes. A new website can benefit from a strong technical foundation, logical site architecture, clear service pages, search-intent research, and useful content. Results depend on competition, demand, implementation, and how search engines discover and process the site.",
  },
  {
    question: "How do I get started with WebEaz SEO services?",
    answer:
      "Start by sharing your website URL, business goals, target audience, and priority markets. WebEaz can use that information to understand your needs and discuss suitable SEO priorities, an audit, and the next steps.",
  },
];

export const enquiryGoals = [
  "More leads",
  "More sales",
  "Local visibility",
  "Organic traffic",
  "AI search visibility",
] as const;

export type EnquiryGoal = (typeof enquiryGoals)[number];
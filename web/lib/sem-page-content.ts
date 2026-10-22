import type { ServiceIconName } from "@/lib/services";

/**
 * Content for the Search Engine Marketing landing page at
 * /search-engine-marketing.
 *
 * Every string is real copy. No invented metrics, client names,
 * testimonials or performance claims appear here. The analytics
 * dashboard in Section 8 deliberately shows no numbers — labels and
 * abstract chart shapes only — so nothing can be read as a real
 * WebEaz result.
 */

export type SemValue = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SemService = {
  icon: ServiceIconName;
  title: string;
  description: string;
  detail: string;
};

export type SemFeature = {
  title: string;
  description: string;
};

export type SemStep = {
  num: string;
  title: string;
  description: string;
};

export type SemBenefit = {
  title: string;
  description: string;
};

export type SemIndustry = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SemMetric = {
  title: string;
  description: string;
};

export type SemPillar = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SemFaq = {
  question: string;
  answer: string;
};

/** Anchors used by same-page CTAs. Keep in sync with the page. */
export const semAnchors = {
  process: "sem-process",
  services: "sem-services",
  measurement: "sem-measurement",
} as const;

export const heroMicrocopy =
  "Smarter targeting. Measurable performance. Marketing built around your business goals.";

export const heroSecondaryLine =
  "From your first campaign to your next stage of growth, every decision starts with your objectives.";

export const values: SemValue[] = [
  {
    icon: "marketing",
    title: "Reach the Right Audience",
    description:
      "Connect your campaigns with relevant searches, locations, and customer intent.",
  },
  {
    icon: "crm",
    title: "Drive Meaningful Action",
    description:
      "Guide potential customers toward enquiries, purchases, bookings, or demos.",
  },
  {
    icon: "ai-automation",
    title: "Optimize With Intelligence",
    description:
      "Use AI-assisted insights and campaign data to refine targeting and messaging.",
  },
  {
    icon: "process",
    title: "Measure What Matters",
    description:
      "Track conversions, acquisition costs, and revenue-related outcomes.",
  },
];

export const services: SemService[] = [
  {
    icon: "ads",
    title: "Google Search Advertising",
    description:
      "Reach potential customers when they search for products, services, or solutions relevant to your business.",
    detail:
      "Keyword research, search campaign setup, ad copy, targeting, bidding strategy, and search-term optimization.",
  },
  {
    icon: "ecommerce",
    title: "E-commerce & Shopping Campaigns",
    description:
      "Put your products in front of shoppers who are actively comparing options and considering a purchase.",
    detail:
      "Product feed strategy, Shopping campaign planning, product visibility, conversion tracking, and sales performance analysis, where applicable.",
  },
  {
    icon: "funnel",
    title: "Lead Generation Campaigns",
    description:
      "Turn relevant searches into business enquiries from people who are more likely to need your services.",
    detail:
      "Lead-focused ad messaging, enquiry forms, call or booking goals, conversion tracking, and lead-quality analysis.",
  },
  {
    icon: "social",
    title: "Display & Remarketing Campaigns",
    description:
      "Support brand visibility and reconnect with eligible audiences who have previously interacted with your business.",
    detail:
      "Audience strategy, creative messaging, remarketing setup, and performance monitoring, subject to platform eligibility and consent requirements.",
  },
  {
    icon: "ai-automation",
    title: "AI-Integrated Campaign Optimization",
    description:
      "Use AI-assisted tools to explore relevant searches, improve creative relevance, and make better-informed campaign decisions.",
    detail:
      "Eligible AI-powered search features, smart bidding, asset testing, search-term analysis, and human-reviewed optimization.",
  },
  {
    icon: "website",
    title: "Landing Page & Conversion Optimization",
    description:
      "Help turn advertising traffic into action with landing pages that match customer intent and make the next step clear.",
    detail:
      "Message alignment, CTA refinement, mobile usability review, form improvements, and conversion-rate analysis.",
  },
];

export const aiFeatures: SemFeature[] = [
  {
    title: "Discover More Relevant Searches",
    description:
      "Use AI-assisted search-term matching and keyword insights to explore relevant opportunities beyond your initial keyword list.",
  },
  {
    title: "Create More Relevant Ad Experiences",
    description:
      "Develop and test messaging variations that reflect customer needs, product benefits, and search intent while maintaining your brand voice.",
  },
  {
    title: "Optimize Bids Around Business Goals",
    description:
      "Use suitable automated bidding strategies and reliable conversion data to help guide advertising spend toward your chosen objectives.",
  },
  {
    title: "Connect Searches to Relevant Pages",
    description:
      "Where supported and appropriate, use landing-page selection and URL controls to align an ad experience with what a potential customer is looking for.",
  },
  {
    title: "Learn From Campaign Performance",
    description:
      "Review search terms, conversion quality, cost trends, and audience signals to identify opportunities for refinement.",
  },
];

export const processSteps: SemStep[] = [
  {
    num: "01",
    title: "Discover & Analyze",
    description:
      "We learn about your business, target audience, competitors, current advertising activity, and growth priorities.",
  },
  {
    num: "02",
    title: "Build the Strategy",
    description:
      "We define campaign objectives, keyword themes, geographic targeting, budget allocation, messaging, and conversion goals.",
  },
  {
    num: "03",
    title: "Launch With Purpose",
    description:
      "We structure campaigns, prepare ad assets, review landing pages, and configure tracking before launch.",
  },
  {
    num: "04",
    title: "Monitor & Optimize",
    description:
      "We assess search terms, bidding, ad relevance, budget use, and conversion signals to guide ongoing improvements.",
  },
  {
    num: "05",
    title: "Measure & Refine",
    description:
      "We review performance against agreed objectives, communicate insights, and identify the next opportunities for growth.",
  },
];

export const benefits: SemBenefit[] = [
  {
    title: "Capture High-Intent Demand",
    description:
      "Connect with people actively searching for products and services relevant to your business.",
  },
  {
    title: "Reach the Right Markets",
    description:
      "Tailor campaigns to relevant locations, languages, and audience signals where the platform supports them.",
  },
  {
    title: "Generate Measurable Leads",
    description:
      "Track meaningful enquiries, calls, bookings, and other agreed conversion actions.",
  },
  {
    title: "Make Better Use of Ad Spend",
    description:
      "Use campaign data and bidding strategies to guide budget allocation and identify inefficient spend.",
  },
  {
    title: "Strengthen Brand Visibility",
    description:
      "Build awareness by appearing in relevant paid search results and eligible advertising placements.",
  },
  {
    title: "Make Data-Informed Decisions",
    description:
      "Understand how people interact with your ads and landing pages, then use those insights to improve future campaigns.",
  },
];

export const industries: SemIndustry[] = [
  {
    icon: "ecommerce",
    title: "E-commerce & Retail",
    description:
      "Promote relevant products, reach purchase-ready shoppers, and measure sales performance.",
  },
  {
    icon: "crm",
    title: "B2B & Professional Services",
    description:
      "Target solution-focused searches and generate enquiries from businesses seeking expertise.",
  },
  {
    icon: "product",
    title: "Education & Training",
    description:
      "Reach prospective students and families searching for courses, admissions, and training.",
  },
  {
    icon: "marketing",
    title: "Healthcare & Local Services",
    description:
      "Help eligible local audiences discover relevant services and take the next step.",
  },
];

export const metrics: SemMetric[] = [
  {
    title: "Conversions",
    description:
      "The enquiries, purchases, bookings, or other valuable actions completed.",
  },
  {
    title: "Cost per Conversion",
    description:
      "How much advertising spend is associated with each tracked conversion.",
  },
  {
    title: "Conversion Rate",
    description:
      "The proportion of measured interactions that result in a conversion.",
  },
  {
    title: "Return on Ad Spend (ROAS)",
    description:
      "The revenue attributed to advertising relative to ad spend, when revenue tracking is available.",
  },
  {
    title: "Search-Term Performance",
    description:
      "Which search queries are relevant and which may require exclusions.",
  },
  {
    title: "Landing-Page Performance",
    description:
      "How effectively visitors engage with the destination page and complete the desired action.",
  },
];

export const pillars: SemPillar[] = [
  {
    icon: "process",
    title: "Strategy Before Spend",
    description:
      "We start by understanding your objectives and audience before shaping the campaign approach.",
  },
  {
    icon: "ai-consulting",
    title: "AI With Human Oversight",
    description:
      "We combine relevant AI-assisted tools with human review, brand controls, and performance analysis.",
  },
  {
    icon: "marketing",
    title: "Relevant Audience Targeting",
    description:
      "We align keywords, search intent, geographic targeting, and ad messaging with your ideal customers.",
  },
  {
    icon: "funnel",
    title: "Conversion-Focused Thinking",
    description:
      "We consider the entire journey from search query to advertisement, landing page, and final action.",
  },
  {
    icon: "sales-automation",
    title: "Continuous Optimization",
    description:
      "We use performance insights to identify opportunities, address inefficiencies, and refine campaigns over time.",
  },
  {
    icon: "workflow",
    title: "Transparent, Goal-Oriented Reporting",
    description:
      "We focus reporting on agreed metrics and business objectives, helping you understand what is working and what needs attention.",
  },
];

export const faqs: SemFaq[] = [
  {
    question: "What is Search Engine Marketing (SEM)?",
    answer:
      "Search Engine Marketing is a digital advertising approach that uses paid search campaigns to help businesses appear for relevant search queries. It can support objectives such as website traffic, lead generation, product sales, and enquiries.",
  },
  {
    question: "How is SEM different from SEO?",
    answer:
      "SEM paid campaigns can generate visibility while ads are eligible to serve, subject to budget and auction conditions. SEO focuses on improving organic search visibility through technical optimization, relevant content, and website quality.",
  },
  {
    question: "How does AI help improve SEM campaigns?",
    answer:
      "Eligible AI-powered advertising features can assist with search-term matching, ad asset customization, bidding, and landing-page relevance. Results still depend on campaign setup, conversion data, budget, and human oversight.",
  },
  {
    question: "How much should I invest in SEM?",
    answer:
      "The right budget depends on your market, competition, target locations, average customer value, and conversion goals. We recommend setting a budget after assessing your objectives and expected acquisition costs. Advertising spend and management fees should be clearly distinguished.",
  },
  {
    question: "How soon can I see SEM results?",
    answer:
      "Paid campaigns may begin generating impressions and clicks after approval and launch, but meaningful conversion data and reliable optimization take time. Timing varies by industry, budget, competition, tracking quality, and the buying cycle.",
  },
  {
    question: "Can SEM help my local business?",
    answer:
      "Yes. Search campaigns can target relevant geographic areas and customer searches, making them useful for eligible local businesses seeking calls, enquiries, appointments, or visits.",
  },
  {
    question: "How do you measure SEM success?",
    answer:
      "Success is measured against agreed goals, such as qualified leads, purchases, conversion rate, cost per acquisition, and ROAS where revenue data is available. Impressions and clicks provide useful context but are not the only measures of success.",
  },
  {
    question: "Do I need a landing page for my SEM campaigns?",
    answer:
      "A relevant, mobile-friendly landing page can help visitors understand your offer and complete the desired action. The page should match the ad message, load reliably, and provide a clear next step.",
  },
];
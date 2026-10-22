import type { ServiceIconName } from "@/lib/services";

/**
 * Content for the Social Media Promotion landing page at
 * /social-media-promotion.
 *
 * Real copy only. No fabricated metrics, follower counts, campaign
 * results, testimonials, awards or client statistics. Every visual
 * that could be read as data is labelled illustrative.
 */

export type SmpHighlight = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SmpChallenge = {
  num: string;
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SmpService = {
  num: string;
  icon: ServiceIconName;
  title: string;
  description: string;
  includes: string;
};

export type SmpAiCapability = {
  title: string;
  description: string;
};

export type SmpPlatform = {
  /** No third-party marks — these are WebEaz-styled abbreviations. */
  short: string;
  icon: ServiceIconName;
  title: string;
  description: string;
  bestFor: string;
};

export type SmpContentType = {
  icon: ServiceIconName;
  title: string;
  description: string;
  /** Gradient seed index so the gallery is not six identical boxes. */
  tone: 0 | 1 | 2 | 3 | 4 | 5;
};

export type SmpProcessStep = {
  num: string;
  title: string;
  description: string;
};

export type SmpPillar = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SmpJourneyStage = {
  num: string;
  title: string;
  description: string;
  metrics: string;
};

export type SmpIndustry = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SmpMetricGroup = {
  icon: ServiceIconName;
  title: string;
  description: string;
};

export type SmpReportItem = {
  title: string;
  description: string;
};

export type SmpFaq = {
  question: string;
  answer: string;
};

/** Anchors used by same-page CTAs. */
export const smpAnchors = {
  strategy: "smp-strategy",
  services: "smp-services",
  ai: "smp-ai",
  funnel: "smp-funnel",
  enquiry: "smp-enquiry",
} as const;

export const highlights: SmpHighlight[] = [
  {
    icon: "process",
    title: "Strategy Before Content",
    description: "Every campaign starts with a clear purpose.",
  },
  {
    icon: "ai-automation",
    title: "Creativity With Intelligence",
    description: "Content shaped by audience insights and brand identity.",
  },
  {
    icon: "seo",
    title: "Performance You Can Understand",
    description: "Reporting focused on meaningful metrics and business goals.",
  },
];

export const challenges: SmpChallenge[] = [
  {
    num: "01",
    icon: "ads",
    title: "Low Reach and Visibility",
    description:
      "Your content deserves to reach beyond your existing followers. We develop platform-specific content strategies to help your brand reach relevant audiences and build discoverability.",
  },
  {
    num: "02",
    icon: "funnel",
    title: "Engagement Without Enquiries",
    description:
      "Likes and views are useful signals, but they are not the whole picture. We create clear content journeys that encourage people to visit, enquire, book or buy.",
  },
  {
    num: "03",
    icon: "product",
    title: "Inconsistent Content and Branding",
    description:
      "A scattered content approach can weaken brand recognition. We align your visuals, messaging, content themes and publishing plan to create a consistent identity.",
  },
  {
    num: "04",
    icon: "process",
    title: "Unclear Campaign Performance",
    description:
      "Without meaningful tracking, it is difficult to understand what works. We help establish relevant KPIs and review performance data to guide better decisions.",
  },
];

export const services: SmpService[] = [
  {
    num: "01",
    icon: "process",
    title: "Social Media Strategy & Planning",
    description:
      "We define your business objectives, audience segments, platform priorities, brand positioning and content direction before building a practical campaign roadmap.",
    includes:
      "competitor research, audience personas, content pillars, campaign planning and KPI definition",
  },
  {
    num: "02",
    icon: "content",
    title: "Creative Content & Brand Storytelling",
    description:
      "We turn your products, services and expertise into clear, compelling social content that reflects your brand and gives your audience a reason to engage.",
    includes:
      "post designs, carousels, captions, content themes, brand storytelling and campaign creatives",
  },
  {
    num: "03",
    icon: "mobile",
    title: "Reels, Shorts & Video Content",
    description:
      "We plan short-form video content that communicates your value quickly, demonstrates your offerings and helps your brand connect with people through useful, memorable stories.",
    includes:
      "video concepts, scripts, hooks, storyboards, editing direction and platform-ready formats",
  },
  {
    num: "04",
    icon: "ads",
    title: "Paid Social Media Advertising",
    description:
      "We plan and optimise paid campaigns to reach relevant audiences, promote offers, generate enquiries and support sales goals within your agreed advertising budget.",
    includes:
      "campaign planning, audience targeting, creative testing, retargeting where appropriate and performance monitoring",
  },
  {
    num: "05",
    icon: "social",
    title: "Social Media Management & Community Engagement",
    description:
      "We help maintain a consistent brand presence through planned publishing, audience interaction and organised communication workflows.",
    includes:
      "scheduling, comment and message workflows, engagement monitoring and escalation guidelines",
  },
  {
    num: "06",
    icon: "seo",
    title: "Analytics, Insights & Optimisation",
    description:
      "We review the performance of your content and campaigns to identify useful patterns, improve creative direction and make informed decisions about future activity.",
    includes:
      "reach, engagement, clicks, conversions where trackable, campaign reports and optimisation recommendations",
  },
];

export const aiCapabilities: SmpAiCapability[] = [
  {
    title: "AI-Assisted Audience Insights",
    description:
      "Analyse available audience and campaign data to identify interests, content preferences, engagement patterns and potential audience segments.",
  },
  {
    title: "Intelligent Content Ideation",
    description:
      "Generate and refine content concepts, caption variations, campaign angles, creative briefs and platform-specific messaging with human review.",
  },
  {
    title: "Smarter Content Planning",
    description:
      "Use historical performance and relevant trends to inform content calendars, publishing priorities and format selection.",
  },
  {
    title: "AI-Assisted Campaign Optimisation",
    description:
      "Use platform-provided automation and available performance signals to support creative testing, audience refinement and budget decisions.",
  },
  {
    title: "Social Listening & Sentiment Insights",
    description:
      "Review available conversations, comments and feedback to understand recurring questions, customer concerns and brand perception.",
  },
  {
    title: "Predictive Planning & Performance Analysis",
    description:
      "Use available historical trends to inform planning scenarios and performance expectations without treating forecasts as guaranteed results.",
  },
];

export const platforms: SmpPlatform[] = [
  {
    short: "IG",
    icon: "mobile",
    title: "Instagram Marketing",
    description:
      "Build brand identity and discoverability through Reels, Stories, carousels, creator collaborations and visually engaging content.",
    bestFor:
      "consumer brands, lifestyle, retail, hospitality, products and visual storytelling",
  },
  {
    short: "FB",
    icon: "social",
    title: "Facebook Marketing",
    description:
      "Strengthen community engagement, promote offers, connect with relevant audiences and support lead-generation or sales campaigns.",
    bestFor:
      "local businesses, services, retail, community-focused brands and broader audience campaigns",
  },
  {
    short: "LI",
    icon: "crm",
    title: "LinkedIn Marketing",
    description:
      "Build professional credibility through industry insights, expert perspectives, company updates, thought leadership and B2B campaigns.",
    bestFor:
      "B2B companies, technology firms, consulting, recruitment and professional services",
  },
  {
    short: "YT",
    icon: "mobile",
    title: "YouTube Marketing",
    description:
      "Increase content discoverability with useful videos, Shorts, product demonstrations, educational content and brand storytelling.",
    bestFor:
      "education, technology, tutorials, product demonstrations and long-term video content",
  },
  {
    short: "PN",
    icon: "product",
    title: "Pinterest Marketing",
    description:
      "Help discovery-driven audiences find and save visual ideas, products and inspiration that can lead to website visits.",
    bestFor:
      "home decor, fashion, lifestyle, design, food and selected e-commerce businesses",
  },
  {
    short: "X",
    icon: "meta",
    title: "X Marketing",
    description:
      "Participate in relevant conversations, share timely updates, communicate brand perspectives and engage with industry communities.",
    bestFor:
      "brands where real-time communication, industry commentary and public conversations are relevant",
  },
];

export const contentTypes: SmpContentType[] = [
  {
    icon: "mobile",
    title: "Short-Form Video",
    description: "Reels, Shorts, quick demonstrations and attention-grabbing stories.",
    tone: 0,
  },
  {
    icon: "content",
    title: "Educational Carousels",
    description: "Tips, explainers, industry insights and problem-solving content.",
    tone: 1,
  },
  {
    icon: "ecommerce",
    title: "Product & Service Showcases",
    description: "Product benefits, service explainers, launches and feature highlights.",
    tone: 2,
  },
  {
    icon: "social",
    title: "Trust-Building Stories",
    description: "Customer testimonials, team stories, behind-the-scenes content and case studies.",
    tone: 3,
  },
  {
    icon: "ads",
    title: "Interactive Content",
    description: "Polls, questions, quizzes and audience participation campaigns.",
    tone: 4,
  },
  {
    icon: "meta",
    title: "Campaign & Promotional Creatives",
    description: "Offers, launches, seasonal promotions and conversion-focused messaging.",
    tone: 5,
  },
];

export const processSteps: SmpProcessStep[] = [
  {
    num: "01",
    title: "Discover & Audit",
    description:
      "We understand your business, assess your current social presence, review competitors and identify opportunities for improvement.",
  },
  {
    num: "02",
    title: "Define the Strategy",
    description:
      "We establish objectives, audience priorities, suitable platforms, content pillars, campaign direction and relevant performance indicators.",
  },
  {
    num: "03",
    title: "Create & Optimise Content",
    description:
      "We develop on-brand creatives, captions, video concepts and platform-specific content, using AI-assisted ideation where appropriate and human quality checks.",
  },
  {
    num: "04",
    title: "Publish & Promote",
    description:
      "We coordinate publishing and, where included in the agreed scope, launch paid campaigns to expand relevant reach and support specific goals.",
  },
  {
    num: "05",
    title: "Measure & Learn",
    description:
      "We review performance data, compare results with agreed KPIs, identify useful insights and refine upcoming content and campaigns.",
  },
];

export const pillars: SmpPillar[] = [
  {
    icon: "process",
    title: "Business-First Strategy",
    description:
      "We begin with what you want to achieve, whether that is stronger awareness, qualified enquiries, sales or long-term customer relationships.",
  },
  {
    icon: "content",
    title: "Creative Consistency",
    description:
      "We align your visual identity, content themes and messaging to create a recognisable, professional brand presence.",
  },
  {
    icon: "ai-consulting",
    title: "AI-Assisted Intelligence",
    description:
      "We use relevant AI capabilities to support research, content ideation and performance analysis while maintaining human oversight.",
  },
  {
    icon: "seo",
    title: "Data-Informed Decisions",
    description:
      "We use available analytics to understand what resonates, where opportunities exist and how future activity can improve.",
  },
  {
    icon: "workflow",
    title: "Connected Digital Services",
    description:
      "Social campaigns can work alongside your website, landing pages, SEO, search advertising and lead-generation activities for a more coordinated digital presence.",
  },
  {
    icon: "crm",
    title: "A Collaborative Partnership",
    description:
      "We align the strategy with your business context, budget, priorities and feedback, with clear expectations about deliverables and reporting.",
  },
];

export const journeyStages: SmpJourneyStage[] = [
  {
    num: "01",
    title: "Awareness — Get Discovered",
    description:
      "Introduce your brand to relevant audiences through engaging videos, educational content, creator collaborations where appropriate and targeted campaigns.",
    metrics: "reach, impressions, video views and audience discovery",
  },
  {
    num: "02",
    title: "Engagement — Build Relationships",
    description:
      "Encourage meaningful interaction through useful content, community conversations, stories, polls and consistent brand communication.",
    metrics: "engagement rate, shares, saves, comments and returning audience activity",
  },
  {
    num: "03",
    title: "Consideration — Earn Trust",
    description:
      "Help interested audiences understand your value through product demonstrations, testimonials, expert content, case studies and website visits.",
    metrics: "link clicks, landing-page visits, enquiries and other meaningful intent signals",
  },
  {
    num: "04",
    title: "Conversion — Encourage Action",
    description:
      "Support business outcomes through relevant offers, conversion-focused creatives, suitable retargeting and clear calls to action.",
    metrics:
      "qualified leads, purchases, conversion rate, cost per result and return on ad spend where measurable",
  },
  {
    num: "05",
    title: "Retention — Grow Customer Value",
    description:
      "Maintain customer relationships through community engagement, useful updates, loyalty campaigns and content that encourages repeat interactions.",
    metrics:
      "repeat purchases where trackable, returning customers, customer engagement and retention",
  },
];

export const industries: SmpIndustry[] = [
  {
    icon: "ecommerce",
    title: "E-commerce & Retail",
    description:
      "Product discovery, launches, promotional campaigns and shopping journeys.",
  },
  {
    icon: "product",
    title: "Education & Training",
    description:
      "Course awareness, student engagement, admissions campaigns and enquiries.",
  },
  {
    icon: "software",
    title: "IT & Technology",
    description:
      "Product explainers, thought leadership, B2B visibility and lead generation.",
  },
  {
    icon: "marketing",
    title: "Hospitality & Lifestyle",
    description:
      "Visual storytelling, offers, customer experiences and local discovery.",
  },
  {
    icon: "workflow",
    title: "Real Estate",
    description: "Property showcases, location-based campaigns and buyer enquiries.",
  },
  {
    icon: "crm",
    title: "Professional Services & B2B",
    description:
      "Expert content, reputation building, professional visibility and qualified leads.",
  },
];

export const metricGroups: SmpMetricGroup[] = [
  {
    icon: "ads",
    title: "Visibility",
    description: "Reach, impressions and video views.",
  },
  {
    icon: "social",
    title: "Engagement",
    description: "Comments, shares, saves and interactions.",
  },
  {
    icon: "funnel",
    title: "Traffic",
    description: "Link clicks and website visits.",
  },
  {
    icon: "crm",
    title: "Conversions",
    description: "Leads, sales and cost per result where trackable.",
  },
];

export const reportItems: SmpReportItem[] = [
  {
    title: "Performance reviews",
    description:
      "Understand which content and campaigns are meeting agreed goals.",
  },
  {
    title: "Content insights",
    description: "Identify themes, formats and messages worth testing further.",
  },
  {
    title: "Campaign analysis",
    description:
      "Review spend, audience performance and conversion data when applicable.",
  },
  {
    title: "Next-step recommendations",
    description:
      "Use the findings to inform upcoming content and campaign decisions.",
  },
];

export const faqs: SmpFaq[] = [
  {
    question: "What is social media promotion?",
    answer:
      "Social media promotion involves using social platforms to increase brand visibility, distribute content, engage audiences and support business goals. It can include organic content, account management, paid advertising, campaign planning and performance analysis.",
  },
  {
    question:
      "How is social media promotion different from social media management?",
    answer:
      "Social media management focuses on maintaining and managing your social presence through content publishing and audience interaction. Social media promotion can extend beyond management to include audience growth, campaign distribution, paid advertising and business-focused marketing activities.",
  },
  {
    question: "How does AI improve social media marketing?",
    answer:
      "AI can support content ideation, audience analysis, creative variations, sentiment insights and performance interpretation. Its value depends on the tools and data available, and important outputs still require human review and strategic judgement.",
  },
  {
    question: "Which social media platforms are best for my business?",
    answer:
      "It depends on your target audience, industry, content capabilities and objectives. Instagram and Facebook may suit many consumer-facing businesses, while LinkedIn can be valuable for B2B marketing. YouTube and Pinterest can be useful when video or visual discovery fits your offering.",
  },
  {
    question: "Can social media marketing generate leads and sales?",
    answer:
      "Yes, social media can contribute to lead generation and sales when the strategy, targeting, offer, content and conversion journey work together. Results depend on the market, budget, audience response and sales process, so outcomes cannot be guaranteed.",
  },
  {
    question: "Do you provide both organic promotion and paid social advertising?",
    answer:
      "The strategy can combine organic content and paid campaigns where appropriate. The exact deliverables, advertising budget, platform coverage and campaign management scope should be agreed before work begins.",
  },
  {
    question: "How soon can I see results?",
    answer:
      "Some campaigns can generate engagement or enquiries shortly after launch, while sustainable audience growth and brand recognition usually require consistent activity and ongoing optimisation. The timeline varies by industry, objectives, budget and starting position.",
  },
  {
    question: "Can you work with an existing social media account?",
    answer:
      "Yes. An existing account can be reviewed to assess its content, branding, audience engagement and performance. The recommendations can then focus on improving what already exists rather than starting from scratch.",
  },
  {
    question: "How do you measure social media success?",
    answer:
      "We establish KPIs based on your goals. These may include reach, engagement, website traffic, qualified enquiries, conversions, cost per lead or return on ad spend, depending on the campaign and tracking capabilities.",
  },
  {
    question: "Can social media promotion work with SEO and search advertising?",
    answer:
      "Yes. Social media can complement SEO and search advertising by reinforcing brand messaging, distributing useful content and supporting retargeting or conversion journeys where suitable. Each channel should have a defined role within the wider digital marketing strategy.",
  },
];

/** Multi-select goals for the enquiry form. */
export const enquiryGoals = [
  "Brand Awareness",
  "Engagement & Community Growth",
  "Lead Generation",
  "Sales & Conversions",
  "Paid Social Advertising",
  "Complete Social Media Management",
] as const;

export type EnquiryGoal = (typeof enquiryGoals)[number];
import { capabilities, solutionsCards } from "@/lib/capabilities";
import { caseStudies } from "@/lib/case-studies";

/**
 * Exact pre-CMS homepage content, preserved verbatim so the public site
 * renders identically when the CMS tables are empty or unreachable.
 * These constants are the single fallback source used by lib/content.ts
 * accessors and by the idempotent seed script.
 */

export type OfficeLocationData = {
  code: string;
  name: string;
  company: string;
  regionLabel: string;
  flagAlt: string;
  watermark: string;
  addressLines: string[];
  email: string;
  mobile: string;
  lat: number;
  lng: number;
  flagUrl: string;
  mapImageUrl: string;
  mapEmbedUrl: string;
  mapUrl: string;
  order: number;
};

export type ProductData = {
  name: string;
  tag: string;
  description: string;
  features: string[];
  href: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  order: number;
};

export type LogoData = {
  name: string;
  alt: string;
  imageUrl: string;
  href?: string | null;
  order: number;
};

export type CapabilityData = {
  group: "CAPABILITY" | "SOLUTION";
  num: string;
  slug: string;
  title: string;
  tag: string;
  tags: string[];
  description: string;
  href: string;
  order: number;
};

export type CaseStudyData = {
  industry: string;
  challenge: string;
  solution: string;
  technology: string;
  order: number;
};

export type FaqData = {
  question: string;
  answer: string;
  order: number;
};

export type FooterLinkData = {
  group: "PRODUCTS" | "COMPANY" | "SUPPORT" | "LEGAL" | "SOCIAL";
  label: string;
  href: string;
  iconKey?: string | null;
  order: number;
};

export const DEFAULT_OFFICES: OfficeLocationData[] = [
  {
    code: "BLR",
    name: "Bengaluru",
    company: "Webeaz Technologies Pvt. Ltd.",
    regionLabel: "Head Office · Bengaluru, India",
    flagAlt: "India",
    watermark: "BENGALURU",
    addressLines: [
      "No 125, 1st Floor,",
      "Hosur Main Road,",
      "Madiwala,",
      "Bengaluru-560068,",
      "Karnataka, India.",
    ],
    email: "info@webeaz.com",
    mobile: "+91 98867 71819",
    lat: 12.9716,
    lng: 77.5946,
    flagUrl: "/globe/flags/in.png",
    mapImageUrl: "/globe/maps/bengaluru.webp",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.809672175585!2d77.62008270643362!3d12.919951117987123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae14fa1591a25f%3A0x485afa50faaa6b3d!2sWebeaz%20Technologies%20-%20Digital%20Marketing%20Services%2C%20Website%2C%20Mobile%20App%20%26%20eCommerce%20Development%20Company%20in%20Bangalore!5e0!3m2!1sen!2sin!4v1689334635180!5m2!1sen!2sin",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=12.919951117987123,77.62008270643362",
    order: 0,
  },
  {
    code: "CLT",
    name: "Calicut",
    company: "Webeaz Technologies Pvt. Ltd.",
    regionLabel: "Calicut Office · Kozhikode, India",
    flagAlt: "India",
    watermark: "CALICUT",
    addressLines: [
      "3rd Floor,",
      "Neo Space II Building,",
      "KINFRA Techno Industrial Park,",
      "Kozhikode,",
      "Kerala, India.",
    ],
    email: "info@webeaz.com",
    mobile: "+91 94462 34819",
    lat: 11.2588,
    lng: 75.7804,
    flagUrl: "/globe/flags/in.png",
    mapImageUrl: "/globe/maps/calicut.webp",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15657.94348756625!2d75.8933195!3d11.1516164!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6a13daf8a9484907!2sWebeaz%20Technologies%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1671128487019!5m2!1sen!2sin",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=11.1516164,75.8933195",
    order: 1,
  },
  {
    code: "DXB",
    name: "Dubai",
    company: "Webeaz Technologies FZC LLC.",
    regionLabel: "Dubai Office · Dubai, UAE",
    flagAlt: "UAE",
    watermark: "DUBAI",
    addressLines: ["12A03,", "The Executive Bay,", "Tower B,", "Business Bay,", "Dubai, UAE."],
    email: "info@webeaz.com",
    mobile: "+971562736690",
    lat: 25.2048,
    lng: 55.2708,
    flagUrl: "/globe/flags/ae.png",
    mapImageUrl: "/globe/maps/dubai.webp",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.727637950988!2d55.2661662!3d25.178672799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f690883abb995%3A0x796e03147c88d9dd!2sWebeaz%20Technologies!5e0!3m2!1sen!2sin!4v1698932934343!5m2!1sen!2sin",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=25.178672799999998,55.2661662",
    order: 2,
  },
];

export const DEFAULT_PRODUCTS: ProductData[] = [
  {
    name: "ERPEaz",
    tag: "Cloud ERP",
    description:
      "An all-in-one Cloud ERP solution to simplify business operations and manage everything in one place.",
    features: [
      "Accounting & Finance",
      "Sales & Purchase Management",
      "Inventory Management",
      "HR & Payroll",
      "CRM & Project Management",
      "Reports & Analytics",
    ],
    href: "https://www.erpeaz.com/",
    imageUrl: "/assets/products/erpeaz-dashboard.webp",
    imageAlt: "ERPEaz cloud ERP dashboard showing accounts, sales, stock and reporting",
    imageWidth: 1200,
    imageHeight: 653,
    order: 0,
  },
  {
    name: "DGVerse",
    tag: "AI & Automation",
    description:
      "An AI-powered digital growth and business automation ecosystem designed to help businesses learn, automate and scale.",
    features: [
      "AI Business Automation",
      "Smart CRM & Lead Management",
      "WhatsApp & Email Automation",
      "AI Website & Funnel Builder",
      "AI Agents",
      "Digital Marketing & Learning",
    ],
    href: "https://dgverse.org/",
    imageUrl: "/assets/products/dgverse-product-showcase.webp",
    imageAlt:
      "DGVerse AI-powered growth and business automation dashboard showing workflow automation, CRM, WhatsApp, email marketing, funnel builder, AI ad launcher and analytics, with the official DGVerse logo",
    imageWidth: 1600,
    imageHeight: 1000,
    order: 1,
  },
];

export const DEFAULT_PARTNER_LOGOS: LogoData[] = [
  { name: "Google Workspace Certified Partner", alt: "Google Workspace Certified Partner", imageUrl: "/partners/google-partner.png", order: 0 },
  { name: "Office 365 Microsoft Partner", alt: "Office 365 Microsoft Partner", imageUrl: "/partners/office-partner.jpg", order: 1 },
  { name: "Amazon Web Services Certified Partner", alt: "Amazon Web Services Certified Partner", imageUrl: "/partners/amazon-partner.png", order: 2 },
  { name: "Leadsquared Associate Partner", alt: "Leadsquared Associate Partner", imageUrl: "/partners/leadsquare-partner.png", order: 3 },
  { name: "#startupindia Recognition", alt: "#startupindia Recognition", imageUrl: "/partners/startup-india-recognition.png", order: 4 },
];

const CLIENT_IMAGE_PATHS = [
  "/clients/all-logo_04.jpg", "/clients/all-logo_01.jpg", "/clients/all-logo_06.jpg",
  "/clients/all-logo_11.jpg", "/clients/Bazuki.webp", "/clients/Feet_Match.webp",
  "/clients/Freeline.webp", "/clients/FutureA4.webp", "/clients/Mage.webp",
  "/clients/Confederate-Logo.png", "/clients/Screenshot_from_2024-01-15_16-10-22.png",
  "/clients/Screenshot_from_2024-01-15_16-17-44.png", "/clients/Layer_2.webp",
  "/clients/image_2_-removebg-preview-e1708586105666.png", "/clients/GPT-logo.webp",
  "/clients/fh.webp", "/clients/Classic bold logo.png", "/clients/logo (5).png",
  "/clients/WhatsApp Image 2026-10-21 at 1.22.14 PM.jpeg",
  "/clients/WhatsApp Image 2026-11-03 at 11.41.47 AM (1).jpeg", "/clients/Logo-300x241.webp",
];

export const DEFAULT_CLIENT_LOGOS: LogoData[] = CLIENT_IMAGE_PATHS.map((imageUrl, i) => ({
  name: `client-${String(i + 1).padStart(2, "0")}`,
  alt: "",
  imageUrl,
  order: i,
}));

export const DEFAULT_CAPABILITIES: CapabilityData[] = [
  ...capabilities.map((c, i) => ({
    group: "CAPABILITY" as const, num: c.num, slug: c.slug, title: c.title,
    tag: c.tags, tags: c.tagList, description: c.description, href: c.href, order: i,
  })),
  ...solutionsCards.map((c, i) => ({
    group: "SOLUTION" as const, num: c.num, slug: c.slug, title: c.title,
    tag: c.tags, tags: c.tagList, description: c.description, href: c.href, order: capabilities.length + i,
  })),
];

export const DEFAULT_CASE_STUDIES: CaseStudyData[] = caseStudies.map((c, i) => ({
  industry: c.industry,
  challenge: c.challenge,
  solution: c.solution,
  technology: c.technology,
  order: i,
}));

/** Exact homepage FAQ content preserved verbatim as the CMS fallback. */
export const DEFAULT_FAQS: FaqData[] = [
  {
    question: "What digital marketing services do you offer for businesses?",
    answer:
      "WebEaz offers a wide range of digital marketing services, including Search Engine Optimization (SEO), Social Media Marketing (SMM), Google Ads, Meta Ads, content marketing, lead generation and online brand promotion. Our strategies are customized to meet your business goals and target audience.",
    order: 0,
  },
  {
    question: "Why should I choose WebEaz for my digital transformation needs?",
    answer:
      "WebEaz combines technology, creativity and digital marketing expertise to provide complete digital solutions under one roof. From website development and mobile applications to ERP software and digital marketing, we help businesses improve efficiency, strengthen their online presence and achieve sustainable growth.",
    order: 1,
  },
  {
    question: "Does WebEaz develop e-commerce websites?",
    answer:
      "Yes. WebEaz provides customized e-commerce website development services to help businesses establish and grow their online stores. Our solutions include product management, online ordering, payment gateway integration and user-friendly shopping experiences.",
    order: 2,
  },
  {
    question: "Can WebEaz redesign my existing website?",
    answer:
      "Yes. WebEaz offers professional website redesign services to improve your website's appearance, functionality, mobile responsiveness, loading performance and user experience. We help transform outdated websites into modern, user-friendly platforms that support your business goals.",
    order: 3,
  },
];

export const DEFAULT_FOOTER_LINKS: FooterLinkData[] = [
  { group: "PRODUCTS", label: "ERPEaz", href: "https://erpeaz.com/", order: 0 },
  { group: "PRODUCTS", label: "DGVerse", href: "https://dgverse.org/", order: 1 },
  { group: "COMPANY", label: "About", href: "/about", order: 0 },
  { group: "COMPANY", label: "Services", href: "/services", order: 1 },
  { group: "COMPANY", label: "Industries", href: "/industries", order: 2 },
  { group: "COMPANY", label: "Our Work", href: "/our-work", order: 3 },
  { group: "COMPANY", label: "Insights", href: "/insights", order: 4 },
  { group: "COMPANY", label: "Become a Contributor", href: "/blog/become-a-contributor", order: 5 },
  { group: "COMPANY", label: "Contact", href: "/contact", order: 6 },
  { group: "SUPPORT", label: "Services", href: "/services", order: 0 },
  { group: "SUPPORT", label: "Industries", href: "/industries", order: 1 },
  { group: "SUPPORT", label: "Become a Contributor", href: "/blog/become-a-contributor", order: 2 },
  { group: "LEGAL", label: "Privacy Policy", href: "/privacy-policy", order: 0 },
  { group: "LEGAL", label: "Terms", href: "/terms", order: 1 },
  { group: "SOCIAL", label: "LinkedIn", href: "https://www.linkedin.com/", iconKey: "linkedin", order: 0 },
  { group: "SOCIAL", label: "Instagram", href: "https://www.instagram.com/", iconKey: "instagram", order: 1 },
  { group: "SOCIAL", label: "Facebook", href: "https://www.facebook.com/", iconKey: "facebook", order: 2 },
  { group: "SOCIAL", label: "YouTube", href: "https://www.youtube.com/", iconKey: "youtube", order: 3 },
];

/** Footer strings currently served from DEFAULT_SETTINGS (no DB rows yet). */
export const DEFAULT_FOOTER_SETTINGS: Record<string, string> = {
  siteName: "WebEaz Technologies Pvt. Ltd.",
  siteDescription:
    "WebEaz helps businesses build, transform, automate and grow through technology, digital growth, automation and AI.",
  footerTagline: "Technology • Digital Growth • Automation • AI",
  footerBlurb:
    "Technology and digital solutions that help businesses build, transform, automate and grow.",
  footerNote: "Built for the future of business technology.",
  footerLogoUrl: "/webeaz-logo.png",
};

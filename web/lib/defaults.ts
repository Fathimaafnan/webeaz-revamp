/**
 * Fallback content used by the public site when the CMS database has
 * no rows yet (fresh environment) or cannot be reached.
 *
 * Every value here is copied verbatim from the markup it replaces, so
 * rendering from these constants is pixel-identical to the site that
 * shipped before the CMS existed. The seed script writes the same
 * values into the database, so in practice the public site renders
 * from published CMS rows.
 */

export type HomeHeroContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  heroImage: string;
};

export type HomeCtaContent = {
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HomeContent = HomeHeroContent & HomeCtaContent;

export type HomeSection = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  visible: boolean;
  order: number;
};

export type HomeStat = {
  id?: number;
  group: "trust" | "why";
  value: string;
  unit: string;
  label: string;
  order: number;
  visible: boolean;
};

export type TestimonialItem = {
  id?: number;
  name: string;
  role: string;
  company: string;
  companyLogo?: string | null;
  image: string;
  quote: string;
  /** Only present when a rating was verified with the customer. */
  rating?: number | null;
  order: number;
  visible: boolean;
};

export const DEFAULT_HOME: HomeContent = {
  heroEyebrow: "Technology • Growth • Automation • AI",
  heroTitle: "Build. Transform. Automate. Grow.",
  heroDescription:
    "Technology and digital solutions that help businesses build, transform, automate and grow.",
  heroPrimaryLabel: "Let's Talk",
  heroPrimaryHref: "/contact",
  heroSecondaryLabel: "Explore Our Services",
  heroSecondaryHref: "/services",
  heroImage: "",
  ctaEyebrow: "Let's talk",
  ctaTitle: "Let's Build What's Next.",
  ctaDescription:
    "Have a business challenge, digital idea or transformation goal? Let's create the right technology solution for your business.",
  ctaLabel: "Start a Conversation →",
  ctaHref: "/contact",
};

export const DEFAULT_SECTIONS: HomeSection[] = [
  {
    key: "capabilities",
    eyebrow: "What we do",
    title: "Technology that moves business forward.",
    description:
      "WebEaz combines technology, digital growth, automation and AI to help businesses build, transform, automate and grow.",
    visible: true,
    order: 10,
  },
  {
    key: "case-studies",
    eyebrow: "Our work",
    title: "What we've built.",
    description:
      "Explore selected digital products, platforms and transformation projects delivered by WebEaz.",
    visible: true,
    order: 20,
  },
  {
    key: "industries",
    eyebrow: "Industries",
    title: "Built for real-world business.",
    description:
      "Technology and digital solutions for the industries shaping tomorrow.",
    visible: true,
    order: 25,
  },
  {
    key: "trust-stats",
    eyebrow: "Credibility",
    title: "Experience that moves business forward.",
    description:
      "Two decades of helping businesses build, transform, automate and grow with technology.",
    visible: true,
    order: 30,
  },
  {
    key: "why-web-eaz",
    eyebrow: "Why us",
    title: "Why WebEaz?",
    description: "",
    visible: true,
    order: 40,
  },
  {
    key: "featured-clients",
    eyebrow: "",
    title: "Our Featured Clients",
    description: "",
    visible: true,
    order: 50,
  },
  {
    key: "partners",
    eyebrow: "",
    title: "Partners & Recognition",
    description: "",
    visible: true,
    order: 60,
  },
  {
    key: "testimonials",
    eyebrow: "Testimonials",
    title: "What Our Clients Say",
    description: "",
    visible: true,
    order: 70,
  },
  {
    key: "blogs",
    eyebrow: "Blogs",
    title: "Blogs",
    description:
      "Perspectives on technology, AI, digital growth and automation from the WebEaz team.",
    visible: true,
    order: 75,
  },
  {
    key: "final-cta",
    eyebrow: "Let's talk",
    title: "Let's Build What's Next.",
    description:
      "Have a business challenge, digital idea or transformation goal? Let's create the right technology solution for your business.",
    visible: true,
    order: 80,
  },
];

export const DEFAULT_STATS: HomeStat[] = [
  { group: "trust", value: "10+", unit: "Years", label: "WebEaz Experience", order: 10, visible: true },
  { group: "trust", value: "22+", unit: "Years", label: "Founder Experience", order: 20, visible: true },
  { group: "why", value: "10+", unit: "", label: "years of WebEaz experience", order: 30, visible: true },
  { group: "why", value: "22+", unit: "", label: "years of founder experience", order: 40, visible: true },
];

/**
 * Client testimonials published on www.webeaz.com under
 * "What Our Clients Say". Text, names, roles and portraits are
 * reproduced verbatim — nothing added or reworded.
 */
export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "CA. Ashker",
    role: "Founder & CEO OF",
    company: "Fin Prime Consulting",
    companyLogo: null,
    image: "/clients/testimonials/ashker.jpg",
    quote:
      "I am thrilled with Webeaz Technologies' service. Our challenges were thoroughly understood by them when we approached them. The biggest challenge was the lack of integration between departments, resulting in inefficiencies. Webeaz Technologies implemented a comprehensive ERP system. This integration facilitated real-time data sharing and streamlined workflows, resulting in increased efficiency.",
    order: 10,
    visible: true,
  },
  {
    name: "Nisar Muhammed",
    role: "Founder & CEO OF",
    company: "Cromwell UK",
    companyLogo: null,
    image: "/clients/testimonials/nisar.jpg",
    quote:
      "Webeaz had played a significant role in digital lead generation for improving our campus admissions. Their digital marketing services helped us to increase target audience, and generate quality leads through SEM, Google ads, and SEO services brought us better rankings for organic search. With their commitment to delivering high-quality services, they're the perfect partner for us.",
    order: 20,
    visible: true,
  },
  {
    name: "Shamsudheen Sulaiman",
    role: "CEO OF",
    company: "MEDISOUQ",
    companyLogo: null,
    image: "/clients/testimonials/shamsudheen.jpg",
    quote:
      "I would highly recommend Webeaz to anyone looking to develop an e-commerce platform. They helped us develop a successful online store using Magento for website also developed a mobile apps for IOS and Android using native mobile app development. They worked closely with us to understand our specific requirements and implement it within the budget. Our team is extremely satisfied with their valuable insights and guidance throughout the entire process. Thank you Webeaz!",
    order: 30,
    visible: true,
  },
];

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  footerTagline: string;
  footerBlurb: string;
  footerNote: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "WebEaz Technologies Pvt. Ltd.",
  siteDescription:
    "WebEaz helps businesses build, transform, automate and grow through technology, digital growth, automation and AI.",
  footerTagline: "Technology • Digital Growth • Automation • AI",
  footerBlurb:
    "Technology and digital solutions that help businesses build, transform, automate and grow.",
  footerNote: "Built for the future of business technology.",
};

export type HomepageBlogSettings = {
  exploreLabel: string;
  exploreHref: string;
  /** Ordered BlogPost IDs. null = not customized yet → use 3 most recent eligible. */
  featuredIds: number[] | null;
  ctaVisible: boolean;
  ctaHeading: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
};

export const DEFAULT_HOMEPAGE_BLOG_SETTINGS: HomepageBlogSettings = {
  exploreLabel: "Explore More Blogs",
  exploreHref: "/blog",
  featuredIds: null,
  ctaVisible: true,
  ctaHeading: "Have Insights Worth Sharing?",
  ctaDescription:
    "Become a WebEaz Contributor. Share your knowledge, experiences, and ideas with our community.",
  ctaLabel: "Become a Contributor",
  ctaHref: "/blog/become-a-contributor",
};

export const HOMEPAGE_BLOG_SETTING_KEYS = {
  exploreLabel: "homepage.blogs.exploreLabel",
  exploreHref: "homepage.blogs.exploreHref",
  featuredIds: "homepage.blogs.featuredIds",
  ctaVisible: "homepage.blogs.ctaVisible",
  ctaHeading: "homepage.blogs.ctaHeading",
  ctaDescription: "homepage.blogs.ctaDescription",
  ctaLabel: "homepage.blogs.ctaLabel",
  ctaHref: "homepage.blogs.ctaHref",
} as const;

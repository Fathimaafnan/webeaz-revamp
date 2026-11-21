export type Capability = {
  num: string;
  slug: string;
  title: string;
  tags: string;
  tagList: string[];
  description: string;
  href: string;
};

/**
 * The Solutions offering — the five items WebEaz lists under
 * "Solutions" (Cloud Solutions, Web Hosting, E-mail Hosting,
 * Microsoft 365 License and Google Workspace License).
 *
 * Each card now points to its own dedicated service page, matching
 * the navigation behavior of the reference website's Solutions dropdown.
 */
export const solutionsCards: Capability[] = [
  {
    num: "06",
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    tags: "AWS • Compute • Storage • CDN",
    tagList: ["AWS", "Compute", "Storage", "CDN"],
    description:
      "Cloud services that provide compute power, content delivery and database storage to help businesses scale and grow.",
    href: "/services/technology/cloud-solutions",
  },
  {
    num: "07",
    slug: "web-hosting",
    title: "Web Hosting",
    tags: "Domains • SSL • Backups • Uptime",
    tagList: ["Domains", "SSL", "Backups", "24/7 Uptime"],
    description:
      "Reliable, high-performance web hosting with domain management, SSL security and round-the-clock uptime for your business site.",
    href: "/services/technology/web-hosting",
  },
  {
    num: "08",
    slug: "email-hosting",
    title: "E-mail Hosting",
    tags: "Domain Mail • Security • Sync • Support",
    tagList: ["Domain Mail", "Security", "Sync", "Support"],
    description:
      "Professional e-mail on your own domain, with secure delivery, sync across devices and the support to keep your brand image consistent.",
    href: "/services/technology/email-hosting",
  },
  {
    num: "09",
    slug: "microsoft-365",
    title: "Microsoft 365 License",
    tags: "Office • Teams • Outlook • OneDrive",
    tagList: ["Office", "Teams", "Outlook", "OneDrive"],
    description:
      "Genuine Microsoft 365 licensing with setup and support, giving your team Office, Teams and Outlook ready to work.",
    href: "/services/technology/microsoft-365",
  },
  {
    num: "10",
    slug: "google-workspace",
    title: "Google Workspace License",
    tags: "Gmail • Drive • Docs • Meet",
    tagList: ["Gmail", "Drive", "Docs", "Meet"],
    description:
      "Google Workspace licensing and setup for Gmail, Drive, Docs and Meet, so your team works together from anywhere.",
    href: "/services/technology/google-workspace",
  },
];

export const capabilities: Capability[] = [
  {
    num: "01",
    slug: "digital-transformation",
    title: "Digital Transformation",
    tags: "Web • Mobile • Ecommerce • Software • Cloud",
    tagList: ["Web", "Mobile", "Ecommerce", "Software", "Cloud"],
    description:
      "Help businesses modernize operations, improve digital capabilities, and transform the way they work using technology.",
    href: "/services/technology",
  },
  {
    num: "02",
    slug: "business-automation",
    title: "Business Automation",
    tags: "CRM • Workflow • WhatsApp • Sales • Business Automation",
    tagList: ["CRM", "Workflow", "WhatsApp", "Sales", "Business Automation"],
    description:
      "Streamline business processes, reduce repetitive tasks, and improve operational efficiency through intelligent automation.",
    href: "/services/automation",
  },
  {
    num: "03",
    slug: "ai-solutions",
    title: "AI Solutions",
    tags: "AI Strategy • AI Integration • AI Automation • AI Agents",
    tagList: ["AI Strategy", "AI Integration", "AI Automation", "AI Agents"],
    description:
      "Integrate AI into business operations and digital products to enable smarter decisions, improve productivity, and solve complex challenges.",
    href: "/services/ai",
  },
  {
    num: "04",
    slug: "digital-growth",
    title: "Digital Growth",
    tags: "SEO • Digital Marketing • Ads • Lead Generation • Content",
    tagList: ["SEO", "Digital Marketing", "Ads", "Lead Generation", "Content"],
    description:
      "Strengthen online presence, reach the right audience, and drive measurable business growth through data-driven digital strategies.",
    href: "/services/digital-growth",
  },
  {
    num: "05",
    slug: "product-development",
    title: "Product Development",
    tags: "Strategy • Architecture • Design & Development • Product Support",
    tagList: ["Strategy", "Architecture", "Design & Development", "Product Support"],
    description:
      "Turn ideas into scalable digital products with user-focused design, modern technologies, and reliable development.",
    href: "/services/technology/product-engineering",
  },
];
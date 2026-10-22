export type Capability = {
  num: string;
  slug: string;
  title: string;
  tags: string;
  tagList: string[];
  description: string;
  href: string;
};

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
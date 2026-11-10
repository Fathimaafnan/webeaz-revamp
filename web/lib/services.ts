/**
 * Services hierarchy — Services → Category → Individual Service.
 *
 * Content is drawn from WebEaz's own published service
 * information: the service descriptions, category navigation and
 * digital-transformation copy published on www.webeaz.com, plus
 * the existing capability summaries in this rebuild.
 *
 * Deliberately absent: statistics, client names, awards,
 * certifications and named third-party products that WebEaz has
 * not published. Technologies are listed only where the source
 * material names them.
 */

export type Service = {
  slug: string;
  name: string;
  /** Card summary — the existing published positioning. */
  summary: string;
  icon: ServiceIconName;
  /** Optional artwork. Set through the CMS; rendered on the detail
      hero only when present, so services without one are unchanged. */
  image?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  /** What the service is. */
  overview: string;
  /** What WebEaz provides. */
  provides: string[];
  /** Key capabilities. */
  capabilities: string[];
  /** Business value. */
  benefits: string[];
  /** Relevant use cases — shown where they apply. */
  useCases?: string[];
  /** Named technologies, only where WebEaz publishes them. */
  technologies?: string[];
};

export type ServiceCategory = {
  slug: string;
  name: string;
  num: string;
  tagline: string;
  description: string;
  image?: string | null;
  icon: ServiceIconName;
  accent: "blue" | "orange";
  services: Service[];
};

export const SERVICE_ICON_NAMES = [
  "website",
  "mobile",
  "ecommerce",
  "software",
  "product",
  "cloud",
  "marketing",
  "seo",
  "ads",
  "meta",
  "social",
  "funnel",
  "content",
  "crm",
  "marketing-automation",
  "sales-automation",
  "whatsapp",
  "workflow",
  "process",
  "ai-consulting",
  "ai-integration",
  "ai-automation",
  "ai-agents",
  "ai-apps",
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "technology",
    name: "Technology",
    num: "01",
    tagline: "Web • Mobile • Ecommerce • Software • Cloud",
    description:
      "Build modern digital experiences, applications and platforms designed for business growth.",
    icon: "software",
    accent: "blue",
    services: [
      {
        slug: "website-development",
        name: "Website Development",
        summary:
          "A business' website plays a vital role in deciding its performance online. We design websites by keeping the marketing process in mind.",
        icon: "website",
        overview:
          "A business website is the foundation of its online performance. WebEaz designs and develops websites that are built around how the business actually markets and sells — structure, messaging and calls to action are considered from the start rather than added afterwards.",
        provides: [
          "Web design and responsive web application development",
          "Marketing-led site structure, messaging and page hierarchy",
          "Landing pages built to support campaign and paid activity",
          "Ongoing support and iterative improvements after launch",
        ],
        capabilities: [
          "Responsive, mobile-first layouts",
          "Next-generation UI and UX design informed by target audience and user behaviour analysis",
          "Content-managed pages that business teams can maintain",
          "Landing page builds for campaign testing",
          "Version upgrades that maintain backward compatibility",
        ],
        benefits: [
          "A clearer path from first visit to enquiry",
          "A site that supports the marketing process instead of contradicting it",
          "Easier content updates without developer involvement",
          "A foundation that can grow as the business does",
        ],
      },
      {
        slug: "mobile-app-development",
        name: "Mobile App Development",
        summary:
          "Have an idea for an app for your business? Through a healthy plan discussion, we have the right solution for you.",
        icon: "mobile",
        overview:
          "Mobile apps put a business in every customer's fingertips. WebEaz works with clients from the planning conversation through to release, covering Android, iOS and cross-platform delivery so the app suits the business case rather than the other way round.",
        provides: [
          "Android app development",
          "iOS app development",
          "Cross-platform development",
          "Mobile app marketing support alongside the build",
        ],
        capabilities: [
          "Plan discovery and solution shaping before build",
          "Native Android and iOS development",
          "Cross-platform delivery where one codebase serves both",
          "Store submission and release support",
          "Ongoing support after launch",
        ],
        benefits: [
          "Direct customer access outside the browser",
          "New revenue channel for the existing product or service",
          "Reach customers where they spend their time",
          "A mobile presence that strengthens the brand",
        ],
        technologies: [
          "Native Android development",
          "Native iOS development",
          "Cross-platform development",
        ],
      },
      {
        slug: "ecommerce",
        name: "Ecommerce",
        summary:
          "Ecommerce web development has become a necessity to drive greater traffic — turn visitors into customers, reduce abandoned carts and lift conversion.",
        icon: "ecommerce",
        overview:
          "Ecommerce solutions for streamlining the business and boosting conversion rates. The store is treated as a commercial system: product discovery, checkout and the path to purchase are engineered together, not separately.",
        provides: [
          "Ecommerce application development and store setup",
          "Product catalogue and category architecture",
          "Conversion-focused checkout and cart flows",
          "Ecommerce search and merchandising",
        ],
        capabilities: [
          "Catalogue and category design",
          "Abandoned-cart recovery flows",
          "Conversion rate optimisation",
          "Payment and checkout integration",
          "Ongoing store maintenance and enhancement",
        ],
        benefits: [
          "More visitors converted into customers",
          "Lower abandonment rate at checkout",
          "A sales channel that operates independently",
          "Streamlined order and inventory operations",
        ],
        technologies: ["Magento"],
      },
      {
        slug: "custom-software",
        name: "Custom Software",
        summary:
          "We capture your ideas and develop software around them, adapting new technologies to the way your business actually operates.",
        icon: "software",
        overview:
          "Where off-the-shelf tools stop short, WebEaz builds custom software around the actual process. Business Process Mapping and Process Re-engineering come first, so the software resolves the process rather than forcing the process into the software.",
        provides: [
          "Business process mapping and re-engineering",
          "Custom web application development",
          "Architecture and design informed by real workflows",
          "Integration with the existing systems a business already runs",
        ],
        capabilities: [
          "Process mapping and re-engineering",
          "Architecture and design",
          "Iterative development with version upgrades that maintain backward compatibility",
          "System integration",
          "Support and enhancement after go-live",
        ],
        benefits: [
          "Software that fits the process instead of replacing it",
          "Fewer manual handoffs and duplicate data entry",
          "Clearer ownership of business-critical logic",
          "Flexibility to adapt as requirements change",
        ],
      },
      {
        slug: "product-engineering",
        name: "Product Engineering",
        summary:
          "Digital transformation in product engineering helps your organisation design and develop a solution, system or service that enhances your business operations.",
        icon: "product",
        overview:
          "Product engineering turns a business idea into a working product. WebEaz combines strategy and consulting, architecture, design, development and support — covering the full path from concept through iteration and version upgrades.",
        provides: [
          "Strategy and consulting to frame the product",
          "Architecture, design and development",
          "Product development and support",
          "Iterative innovation through version upgrades with backward compatibility",
        ],
        capabilities: [
          "Strategy and consulting",
          "Product architecture and design",
          "Next-generation UI and UX design",
          "Iterative development and release management",
          "Ongoing product support",
        ],
        benefits: [
          "A product designed around a validated business need",
          "A roadmap that supports incremental improvement",
          "Fewer costly rebuilds as requirements evolve",
          "Design decisions grounded in audience and behaviour analysis",
        ],
      },
      {
        slug: "cloud-solutions",
        name: "Cloud Solutions",
        summary:
          "Cloud services that provide compute power, content delivery and database storage to help businesses scale and grow.",
        icon: "cloud",
        overview:
          "Cloud hosting gives a business room to scale without buying hardware up front. WebEaz works with Amazon Web Services as a secure cloud platform providing compute power, content delivery and database storage, alongside the workspace and hosting services a growing team needs.",
        provides: [
          "Cloud hosting and infrastructure on Amazon Web Services",
          "Compute, content delivery and database storage",
          "Web hosting and e-mail hosting",
          "Business productivity licensing",
        ],
        capabilities: [
          "Cloud infrastructure provisioning",
          "Content delivery configuration",
          "Database storage planning",
          "E-mail hosting on the client's own domain",
          "Workspace licensing and setup",
        ],
        benefits: [
          "Scale infrastructure without large capital outlay",
          "Reliable content delivery across locations",
          "Business email on the company's own domain",
          "Infrastructure that can be adjusted as demand changes",
        ],
        technologies: [
          "Amazon Web Services (AWS)",
          "Microsoft 365",
          "Google Workspace",
        ],
      },
    ],
  },
  {
    slug: "digital-growth",
    name: "Digital Growth",
    num: "02",
    tagline: "SEO • Digital Marketing • Ads • Lead Generation • Content",
    description:
      "Turn digital presence into measurable business growth through data-driven digital strategies.",
    icon: "marketing",
    accent: "orange",
    services: [
      {
        slug: "digital-marketing",
        name: "Digital Marketing",
        summary:
          "Our digital marketing strategies stand on five pillars. When a client approaches us, we conduct a situation analysis to determine what they require.",
        icon: "marketing",
        overview:
          "Digital marketing at WebEaz begins with a situation analysis rather than a preset package. We work back from the client's goal — reaching the right people, at the right time, to increase revenue — and assemble the channels that serve it.",
        provides: [
          "Situation analysis to determine what the business actually requires",
          "Integrated strategy across SEO, SEM, social, content and paid media",
          "Brand building alongside performance activity",
          "Ongoing optimisation based on performance",
        ],
        capabilities: [
          "Situation and competitor analysis",
          "Channel strategy and sequencing",
          "SEO and search engine marketing",
          "Paid media across Google and Meta",
          "Social media presence and content",
          "Performance tracking and optimisation",
        ],
        benefits: [
          "Reach the right people at the right time",
          "Increased revenue from existing demand",
          "A single accountable strategy instead of disconnected activity",
          "Budget directed to the channels that return results",
        ],
      },
      {
        slug: "seo",
        name: "SEO",
        summary:
          "Search Engine Optimization — in a digital era, web presence means little without search presence.",
        icon: "seo",
        overview:
          "Search Engine Optimization builds the organic visibility that compounds over time. WebEaz treats SEO as part of the wider digital strategy alongside SEM and lead generation, so organic and paid activity reinforce each other.",
        provides: [
          "Search Engine Optimization across sites and pages",
          "Technical and on-page SEO foundations",
          "Keyword research mapped to business intent",
          "Content optimisation for search visibility",
        ],
        capabilities: [
          "Technical SEO and site health",
          "On-page optimisation",
          "Keyword research and targeting",
          "Content optimisation",
          "Organic performance tracking",
        ],
        benefits: [
          "Better rankings for organic search",
          "A compounding source of qualified traffic",
          "Lower reliance on paid acquisition over time",
          "Visibility for the terms customers actually search",
        ],
      },
      {
        slug: "google-ads",
        name: "Google Ads",
        summary:
          "Search Engine Marketing and Google Ads campaigns that generate quality leads against measurable return.",
        icon: "ads",
        overview:
          "Google Ads places a business in front of active search demand. WebEaz runs Search Engine Marketing campaigns as part of a broader digital marketing strategy, structured around the leads the business actually needs.",
        provides: [
          "Search Engine Marketing campaign setup and management",
          "Google Ads campaign build and optimisation",
          "Keyword and audience targeting",
          "Landing page alignment with ad messaging",
        ],
        capabilities: [
          "Search and display campaign management",
          "Keyword and audience targeting",
          "Ad copy and creative testing",
          "Bid and budget management",
          "Conversion and cost tracking",
        ],
        benefits: [
          "Immediate visibility for high-intent searches",
          "Qualified leads rather than raw clicks",
          "Measurable return on ad spend",
          "Fast feedback on which offers resonate",
        ],
      },
      {
        slug: "meta-ads",
        name: "Meta Ads",
        summary:
          "Facebook Marketing across Meta's platforms — reaching customers where social discovery happens.",
        icon: "meta",
        overview:
          "WebEaz's Facebook Marketing service now runs across Meta's advertising platforms. Campaigns target audiences on the social channels where customers discover and evaluate brands, with creative and targeting developed around the offer.",
        provides: [
          "Facebook Marketing campaigns across Meta platforms",
          "Audience targeting and segmentation",
          "Creative development for social placements",
          "Campaign monitoring and optimisation",
        ],
        capabilities: [
          "Meta advertising campaigns",
          "Audience segmentation and retargeting",
          "Social creative development",
          "Budget allocation across campaigns",
          "Performance reporting",
        ],
        benefits: [
          "Reach customers during social discovery",
          "Retargeting of engaged but unconverted visitors",
          "Demographic and interest targeting",
          "Scalable spend alongside search activity",
        ],
      },
      {
        slug: "social-media",
        name: "Social Media",
        summary:
          "Build a strong social media presence and connect with your customers where they already spend time.",
        icon: "social",
        overview:
          "Social Media Handling covers ongoing presence rather than isolated campaigns. WebEaz builds and manages a social presence that connects the business to its customers, including Facebook Marketing and Mobile App Marketing for products.",
        provides: [
          "Social media presence setup and management",
          "Social Media Promotions and campaign activity",
          "Facebook Marketing alongside wider social activity",
          "Mobile App Marketing for launched applications",
        ],
        capabilities: [
          "Profile and page setup and branding",
          "Content planning and publishing",
          "Social promotions",
          "Audience engagement and community response",
          "Mobile app promotion",
        ],
        benefits: [
          "A consistent, visible brand presence",
          "Direct connection with existing customers",
          "Support for organic and paid discovery",
          "A channel for launching new products and apps",
        ],
      },
      {
        slug: "lead-generation",
        name: "Lead Generation",
        summary:
          "Digital lead generation that reaches a wider target audience and produces qualified enquiries.",
        icon: "funnel",
        overview:
          "Lead generation is where WebEaz's marketing and technology capabilities meet. SEO, SEM, social and landing pages are combined with CRM and lead automation so enquiries are captured, qualified and followed up rather than lost.",
        provides: [
          "Digital lead generation campaigns",
          "Landing page builds for conversion",
          "CRM setup to capture and track enquiries",
          "Lead automation for prompt follow-up",
        ],
        capabilities: [
          "Target audience research",
          "Conversion-focused landing pages",
          "SEO, SEM and social as lead sources",
          "CRM capture and lead tracking",
          "Lead nurturing and automated follow-up",
        ],
        benefits: [
          "A wider, better-qualified target audience",
          "Fewer enquiries lost between interest and response",
          "Faster follow-up on inbound demand",
          "Clear visibility of pipeline by source",
        ],
      },
      {
        slug: "content-marketing",
        name: "Content Marketing",
        summary:
          "Content marketing that supports search visibility, brand building and online reputation management.",
        icon: "content",
        overview:
          "Content marketing at WebEaz sits alongside Online Reputation Management. Content is produced to support search visibility, establish the brand and give customers the information they need to choose — working together rather than separately.",
        provides: [
          "Content strategy and editorial planning",
          "Content production aligned to search demand",
          "Online Reputation Management",
          "Content support for SEO and campaign activity",
        ],
        capabilities: [
          "Topic and keyword research",
          "Editorial planning and production",
          "Search-optimised publishing",
          "Brand and reputation management",
          "Content refresh for existing pages",
        ],
        benefits: [
          "Stronger organic search visibility over time",
          "A brand that is found and trusted",
          "Managed online reputation",
          "Assets that support every other marketing channel",
        ],
      },
    ],
  },
  {
    slug: "automation",
    name: "Automation",
    num: "03",
    tagline: "CRM • Workflow • WhatsApp • Sales • Business Automation",
    description:
      "Connect processes, reduce repetitive work and improve operational efficiency through automation.",
    icon: "workflow",
    accent: "blue",
    services: [
      {
        slug: "crm",
        name: "CRM",
        summary:
          "Customer relationship management that brings sales, leads and customer history into one place.",
        icon: "crm",
        overview:
          "CRM brings customer relationship management into a single system. WebEaz implements CRM as part of a connected stack — sales activity, enquiries and follow-up tracked consistently, and integrated with the automation and ERP layers where relevant.",
        provides: [
          "CRM implementation and setup",
          "Lead capture, tracking and pipeline management",
          "Sales activity and customer history in one view",
          "Integration with marketing automation and ERP",
        ],
        capabilities: [
          "Contact and company records",
          "Lead capture and assignment",
          "Pipeline and deal tracking",
          "Activity history and notes",
          "Reporting on pipeline and conversion",
        ],
        benefits: [
          "No lost enquiries or duplicated records",
          "A clear view of every customer relationship",
          "Consistent follow-up across the team",
          "Data that feeds marketing and operations",
        ],
        useCases: [
          "Capturing leads from digital campaigns",
          "Managing a sales pipeline end to end",
          "Handover between marketing and sales",
        ],
      },
      {
        slug: "marketing-automation",
        name: "Marketing Automation",
        summary:
          "Automate repetitive marketing work and route leads so campaigns run consistently.",
        icon: "marketing-automation",
        overview:
          "Marketing automation removes manual steps between a lead arriving and a salesperson acting on it. WebEaz connects campaign data, CRM and follow-up sequences so the process runs consistently without relying on individual memory.",
        provides: [
          "Automation of lead capture and routing",
          "Automated follow-up sequences",
          "CRM integration for campaign data",
          "Nurturing flows for prospects not yet ready to buy",
        ],
        capabilities: [
          "Lead routing and assignment rules",
          "Automated email and communication sequences",
          "Lead nurturing",
          "Campaign-to-CRM data flow",
          "Process design for repeatable marketing workflows",
        ],
        benefits: [
          "Faster response to new enquiries",
          "Consistent nurture for prospects not ready to convert",
          "Less manual administration for the marketing team",
          "Better data on which activity produces results",
        ],
        useCases: [
          "Responding to campaign leads immediately",
          "Nurturing a list until prospects are sales-ready",
          "Keeping CRM records complete automatically",
        ],
      },
      {
        slug: "sales-automation",
        name: "Sales Automation",
        summary:
          "Sales automation for lead nurturing, conversion optimisation and structured follow-up.",
        icon: "sales-automation",
        overview:
          "Sales automation connects the CRM to the process that actually converts — lead nurturing, task follow-up and conversion optimisation. WebEaz implements it alongside the CRM so the sales motion is enforced by the system, not by memory.",
        provides: [
          "Sales automation built on the CRM",
          "Lead nurturing sequences",
          "Conversion optimisation across the sales funnel",
          "WhatsApp Sales Flows where messaging is part of the motion",
        ],
        capabilities: [
          "Automated task and follow-up assignment",
          "Lead nurturing sequences",
          "Deal stage progression",
          "Conversion optimisation",
          "WhatsApp Sales Flows",
        ],
        benefits: [
          "No enquiry without an owner",
          "Higher conversion from existing demand",
          "Consistent follow-up without manual chasing",
          "Visibility of where deals are stalling",
        ],
        useCases: [
          "Lead nurturing to sales-ready",
          "Managing a high volume of inbound enquiries",
          "Improving conversion between stages",
        ],
      },
      {
        slug: "whatsapp-automation",
        name: "WhatsApp Automation",
        summary:
          "WhatsApp Business automation for enquiries, follow-up and customer communication at scale.",
        icon: "whatsapp",
        overview:
          "WhatsApp is where many customer conversations already happen. WebEaz automates the repetitive parts — initial response, routine enquiries and follow-up — while keeping people involved where a conversation needs judgement.",
        provides: [
          "WhatsApp Business setup and configuration",
          "Automated responses to common enquiries",
          "WhatsApp Sales Flows connected to CRM",
          "Follow-up sequences over messaging",
        ],
        capabilities: [
          "WhatsApp Business messaging",
          "Automated replies and enquiry handling",
          "CRM integration for conversation history",
          "Broadcast and follow-up messaging",
          "Sales flow automation",
        ],
        benefits: [
          "Faster first response to enquiries",
          "Consistent handling of routine questions",
          "Customer conversations logged in the CRM",
          "Follow-up that does not depend on manual effort",
        ],
        useCases: [
          "Handling inbound enquiries outside business hours",
          "Appointment and order enquiries",
          "Ongoing customer follow-up after enquiry",
        ],
      },
      {
        slug: "workflow-automation",
        name: "Workflow Automation",
        summary:
          "Connect processes and reduce repetitive work to improve operational efficiency.",
        icon: "workflow",
        overview:
          "Workflow automation replaces manual handoffs with defined, repeatable steps. WebEaz maps the process first, then connects the tools so information moves on its own and routine work stops consuming people.",
        provides: [
          "Process design and mapping",
          "Automated handoffs between teams and systems",
          "Reporting automation",
          "Notifications and task routing",
        ],
        capabilities: [
          "Process mapping and redesign",
          "Rule-based triggers and actions",
          "Cross-system data movement",
          "Automated reporting and dashboards",
          "Exception handling and alerts",
        ],
        benefits: [
          "Less repetitive manual work",
          "Faster process cycle times",
          "Fewer errors from manual data entry",
          "Operational reporting available without manual assembly",
        ],
        useCases: [
          "Routing inbound enquiries to the right owner",
          "Automating recurring reporting",
          "Moving data between disconnected systems",
        ],
      },
      {
        slug: "business-process-automation",
        name: "Business Process Automation",
        summary:
          "Map and re-engineer business processes, then automate them with ERP and connected systems.",
        icon: "process",
        overview:
          "Business Process Automation is the broadest layer: understanding how the business actually runs, re-engineering that process, then supporting it with ERP and connected systems. WebEaz's own ERPEaz platform is built on this approach, covering accounting, procurement, project management, risk and compliance, and supply chain operations.",
        provides: [
          "Business Process Mapping and Process Re-engineering",
          "ERP implementation and configuration",
          "Integration of business-critical systems",
          "Support and iteration as processes evolve",
        ],
        capabilities: [
          "Process mapping and re-engineering",
          "ERP modules including accounting, asset, CRM, HRM, payroll, project, purchasing, sales, stock and logistics",
          "Cross-module data flow",
          "Reporting and compliance support",
          "Iterative improvement and version upgrades",
        ],
        benefits: [
          "Integrated operations rather than disconnected departments",
          "Real-time data sharing across the business",
          "Streamlined workflows and fewer handoff errors",
          "A single system of record for core processes",
        ],
        useCases: [
          "Consolidating operations spread across spreadsheets and disconnected tools",
          "Standardising finance, stock and logistics workflows",
          "Automating procurement and sales processes",
        ],
        technologies: ["ERPEaz — ERP software by WebEaz"],
      },
    ],
  },
  {
    slug: "ai",
    name: "AI",
    num: "04",
    tagline: "AI Strategy • AI Integration • AI Automation • AI Agents",
    description:
      "Apply AI to products, processes and business operations to create smarter ways of working.",
    icon: "ai-agents",
    accent: "orange",
    services: [
      {
        slug: "ai-consulting",
        name: "AI Consulting",
        summary:
          "We combine strategy and consulting expertise with our broader capabilities to move your business forward.",
        icon: "ai-consulting",
        overview:
          "AI Consulting applies the same approach WebEaz uses across digital transformation: strategy and consulting first, technology second. The aim is to identify where AI genuinely changes how the business works, rather than starting from the technology and searching for a use.",
        provides: [
          "AI opportunity assessment across the business",
          "AI strategy and roadmap",
          "Prioritisation of use cases by value and feasibility",
          "Alignment with existing systems and processes",
        ],
        capabilities: [
          "Business and process assessment",
          "Use case identification and prioritisation",
          "AI strategy and roadmap definition",
          "Data readiness evaluation",
          "Team enablement planning",
        ],
        benefits: [
          "Investment directed at use cases with real value",
          "A sequenced plan rather than scattered experiments",
          "Alignment between AI activity and existing processes",
          "Clear basis for deciding what to build",
        ],
      },
      {
        slug: "ai-integration",
        name: "AI Integration",
        summary:
          "Integrate AI into existing products, platforms and business operations.",
        icon: "ai-integration",
        overview:
          "AI Integration embeds AI capability into systems the business already runs — products, platforms and operational tools — rather than creating isolated additions. WebEaz connects AI to existing data and workflows so it becomes part of normal operation.",
        provides: [
          "AI integration into existing products and platforms",
          "Connection to business data and operational systems",
          "Integration with ERP, CRM and automation layers",
          "Ongoing support and iteration",
        ],
        capabilities: [
          "Embedding AI into web, mobile and software products",
          "Data connection and preparation",
          "Integration with CRM, ERP and workflow systems",
          "Evaluation and refinement in production",
          "Support and enhancement",
        ],
        benefits: [
          "AI capability added to systems already in use",
          "No parallel tool for the team to maintain",
          "Smarter operation without process disruption",
          "A foundation that later AI work builds on",
        ],
      },
      {
        slug: "ai-automation",
        name: "AI Automation",
        summary:
          "Automate repetitive operational work by applying AI to processes and business operations.",
        icon: "ai-automation",
        overview:
          "AI Automation applies AI to the repetitive parts of operations — the classification, routing and drafting work that consumes time without requiring judgement. WebEaz pairs it with the process mapping and automation layers already in place.",
        provides: [
          "AI-assisted automation of repetitive operational tasks",
          "Process mapping to identify automation targets",
          "Integration with workflow and business systems",
          "Human review built into automated steps",
        ],
        capabilities: [
          "Task and workflow identification",
          "AI-assisted classification and routing",
          "Drafting and summarisation of routine content",
          "Integration with existing automation workflows",
          "Human-in-the-loop review design",
        ],
        benefits: [
          "Reduced repetitive manual effort",
          "Faster turnaround on routine work",
          "Consistent handling across large volumes",
          "People freed to focus on work needing judgement",
        ],
        useCases: [
          "Routing and categorising inbound enquiries",
          "Summarising and drafting routine business content",
          "Assisting repetitive reporting tasks",
        ],
      },
      {
        slug: "ai-agents",
        name: "AI Agents",
        summary:
          "Purpose-built AI agents for defined business tasks, connected to your systems and processes.",
        icon: "ai-agents",
        overview:
          "AI Agents are scoped assistants built for a defined task and connected to the systems that task touches. WebEaz designs each agent around a specific process, with clear boundaries, defined inputs and outputs, and escalation to people where judgement is required.",
        provides: [
          "AI agent design against a defined business process",
          "Connection to relevant business systems and data",
          "Escalation and human review paths",
          "Ongoing evaluation and refinement",
        ],
        capabilities: [
          "Task and scope definition",
          "Agent workflow design",
          "System and data connections",
          "Guardrails and escalation handling",
          "Performance evaluation and iteration",
        ],
        benefits: [
          "A specific task handled consistently and at scale",
          "Clear boundaries on what the agent does and does not do",
          "Escalation to people where it matters",
          "Measurable performance to improve over time",
        ],
        useCases: [
          "Handling defined customer enquiry types",
          "Assisting internal teams with routine process steps",
          "First-pass work before human review",
        ],
      },
      {
        slug: "ai-applications",
        name: "AI Applications",
        summary:
          "AI applied directly to your products and services to create smarter ways of working.",
        icon: "ai-apps",
        overview:
          "AI Applications is the end-user facing layer — AI capability delivered inside the product or service itself. WebEaz builds these on top of the product engineering and digital experience work, so the intelligence is part of the experience rather than a separate tool.",
        provides: [
          "AI capability embedded in products and services",
          "Application design informed by real user behaviour",
          "Connection to application data and workflows",
          "Support and iteration after release",
        ],
        capabilities: [
          "Intelligent features within web and mobile products",
          "Experience design with AI in the flow",
          "Data connection and evaluation",
          "Quality and safety review",
          "Ongoing support",
        ],
        benefits: [
          "Smarter products without adding separate tools",
          "Better experience for the end customer",
          "Capability that differentiates the offering",
          "Grounded in the same product engineering discipline",
        ],
      },
    ],
  },
];

/** All service categories. */
export const categories = serviceCategories;

/** Flattened list of every individual service, with its category. */
export const allServices = serviceCategories.flatMap((c) =>
  c.services.map((s) => ({ category: c, service: s })),
);

export function getCategory(slug: string) {
  return serviceCategories.find((c) => c.slug === slug);
}

export function getService(categorySlug: string, serviceSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const service = category.services.find((s) => s.slug === serviceSlug);
  if (!service) return undefined;
  return { category, service };
}

/** Sibling services within the same category. */
export function getSiblings(categorySlug: string, serviceSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return [];
  return category.services.filter((s) => s.slug !== serviceSlug);
}
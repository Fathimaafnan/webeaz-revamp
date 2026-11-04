// Placeholder editorial entries — replace with real published articles.
// Do not add article titles that imply published content.

export type Insight = {
  category: string;
  title: string;
  description: string;
  date: string;
  /** Optional thumbnail image path. Falls back to a neutral placeholder when absent. */
  image?: string;
};

export const insights: Insight[] = [
  {
    category: "AI",
    title: "Topic: Applying AI to everyday operations",
    description:
      "Editorial placeholder — practical perspective on bringing AI into business workflows.",
    date: "Coming soon",
  },
  {
    category: "Digital Growth",
    title: "Topic: Turning digital presence into pipeline",
    description:
      "Editorial placeholder — how SEO, ads and content work together for growth.",
    date: "Coming soon",
  },
  {
    category: "Automation",
    title: "Topic: Where automation pays for itself",
    description:
      "Editorial placeholder — common workflows SMEs can automate first.",
    date: "Coming soon",
  },
  {
    category: "Technology",
    title: "Topic: Choosing the right build approach",
    description:
      "Editorial placeholder — web, mobile, software or ecommerce: making the call.",
    date: "Coming soon",
  },
];

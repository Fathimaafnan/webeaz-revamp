import type { MetadataRoute } from "next";
import { allServices, serviceCategories } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.webeaz.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/solutions`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.8 },
    ...serviceCategories.map((c) => ({
      url: `${base}/services/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...allServices.map(({ category, service }) => ({
      url: `${base}/services/${category.slug}/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${base}/digital`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/search-engine-optimization`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/search-engine-marketing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/social-media-promotion`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${base}/industries`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/our-work`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/company`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/insights`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
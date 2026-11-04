import type { MetadataRoute } from "next";
import { getPublishedPosts, getServiceTree } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.webeaz.com";
  const [{ categories, allServices }, posts] = await Promise.all([
    getServiceTree(),
    getPublishedPosts(),
  ]);
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/solutions`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${base}/services/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...allServices.map(({ category, service }) => ({
      url: `${base}/services/${category.slug}/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts
      .filter((post) => post.slug && post.content.trim())
      .map((post) => ({
        url: `${base}/insights/${post.slug}`,
        lastModified: post.publishedAt ?? undefined,
        changeFrequency: "monthly" as const,
        priority: 0.5,
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
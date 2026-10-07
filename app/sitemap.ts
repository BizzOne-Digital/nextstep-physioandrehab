import type { MetadataRoute } from "next";
import { getConditions, getGallery, getPublishedPosts, getServices, getTeam } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, team, gallery, conditions] = await Promise.all([getServices(), getPublishedPosts(), getTeam(), getGallery(), getConditions()]);
  const now = new Date();

  const pages: Array<{ url: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }> = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/book-appointment"), changeFrequency: "yearly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/conditions"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/our-team"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/testimonials"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.7 },
    ...(gallery.length ? [{ url: absoluteUrl("/gallery"), changeFrequency: "monthly" as const, priority: 0.4 }] : []),
  ];
  const staticPages: MetadataRoute.Sitemap = pages.map((p) => ({ ...p, lastModified: now }));

  return [
    ...staticPages,
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 })),
    ...conditions.map((c) => ({ url: absoluteUrl(`/conditions/${c.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.55 })),
    ...team.map((m) => ({ url: absoluteUrl(`/our-team/${m.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt || p.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}

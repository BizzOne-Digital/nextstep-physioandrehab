import "server-only";
import { cache } from "react";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import {
  BlogPost,
  Condition,
  FAQ,
  GalleryItem,
  Page,
  Service,
  SiteSetting,
  TeamMember,
  Testimonial,
} from "@/models";
import { defaultServices } from "@/content/services";
import { defaultConditions } from "@/content/conditions";
import { defaultFaqs } from "@/content/faqs";
import { defaultTeam } from "@/content/team";
import { defaultSettings } from "@/content/settings";
import { PAGE_DEFINITIONS, getPageDefinition } from "@/content/pages";
import defaultPostsJson from "@/content/blog-posts.json";
import type {
  BlogPostItem,
  ConditionItem,
  FAQItem,
  GalleryItemData,
  PageKey,
  ServiceItem,
  SiteSettings,
  TeamMemberItem,
  TestimonialItem,
} from "@/types";

const defaultPosts = defaultPostsJson as BlogPostItem[];

type DbState = "ready" | "unseeded" | "unavailable";

/**
 * "ready"       – database reachable and seeded: serve database content only.
 * "unseeded"    – database reachable but empty: serve migrated defaults.
 * "unavailable" – no MONGODB_URI or connection failed: serve migrated defaults.
 */
export const getDbState = cache(async (): Promise<DbState> => {
  if (!isDatabaseConfigured()) return "unavailable";
  try {
    await connectDB();
    const exists = await SiteSetting.exists({ key: "global" });
    return exists ? "ready" : "unseeded";
  } catch (error) {
    console.error("[data] database unavailable:", (error as Error).message);
    return "unavailable";
  }
});

function plain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function fromDb<T>(query: () => Promise<unknown>, fallback: T): Promise<T> {
  if ((await getDbState()) !== "ready") return fallback;
  try {
    return plain<T>(await query());
  } catch (error) {
    console.error("[data] query failed:", (error as Error).message);
    return fallback;
  }
}

/* -------------------------------- Settings -------------------------------- */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const stored = await fromDb<{ data?: Partial<SiteSettings> } | null>(
    () => SiteSetting.findOne({ key: "global" }).lean(),
    null,
  );
  const data = stored?.data ?? {};
  return {
    ...defaultSettings,
    ...data,
    address: { ...defaultSettings.address, ...(data.address ?? {}) },
    social: { ...defaultSettings.social, ...(data.social ?? {}) },
    hours: data.hours?.length ? data.hours : defaultSettings.hours,
    insurers: Array.isArray(data.insurers) ? data.insurers : defaultSettings.insurers,
  };
});

/* ---------------------------------- Pages --------------------------------- */
export interface ResolvedPage<T = Record<string, unknown>> {
  content: T;
  seoTitle: string;
  seoDescription: string;
}

export const getPageContent = cache(async <T = Record<string, string>>(key: PageKey): Promise<ResolvedPage<T>> => {
  const def = getPageDefinition(key) ?? PAGE_DEFINITIONS[0];
  const stored = await fromDb<{ content?: Record<string, unknown>; seoTitle?: string; seoDescription?: string } | null>(
    () => Page.findOne({ key }).lean(),
    null,
  );
  const merged: Record<string, unknown> = { ...def.defaults };
  for (const [k, v] of Object.entries(stored?.content ?? {})) {
    // Empty values fall back to defaults so a page never renders blank sections.
    if (v === "" || v === null || v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    merged[k] = v;
  }
  return {
    content: merged as T,
    seoTitle: stored?.seoTitle || def.seoTitle,
    seoDescription: stored?.seoDescription || def.seoDescription,
  };
});

/* -------------------------------- Services -------------------------------- */
export const getServices = cache(async (): Promise<ServiceItem[]> =>
  fromDb(() => Service.find({ published: true }).sort({ order: 1, title: 1 }).lean(), defaultServices),
);

export const getServiceBySlug = cache(async (slug: string): Promise<ServiceItem | null> => {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
});

/* ------------------------------- Conditions ------------------------------- */
export const getConditions = cache(async (): Promise<ConditionItem[]> =>
  fromDb(() => Condition.find({ published: true }).sort({ order: 1, name: 1 }).lean(), defaultConditions),
);

/* ---------------------------------- Team ---------------------------------- */
export const getTeam = cache(async (): Promise<TeamMemberItem[]> =>
  fromDb(() => TeamMember.find({ published: true }).sort({ order: 1, name: 1 }).lean(), defaultTeam),
);

export const getTeamMember = cache(async (slug: string): Promise<TeamMemberItem | null> => {
  const team = await getTeam();
  return team.find((m) => m.slug === slug) ?? null;
});

/* ------------------------------ Testimonials ------------------------------ */
export const getTestimonials = cache(async (): Promise<TestimonialItem[]> =>
  fromDb(() => Testimonial.find({ published: true }).sort({ createdAt: -1 }).select("-email").lean(), []),
);

/* ---------------------------------- FAQs ---------------------------------- */
export const getFaqs = cache(async (): Promise<FAQItem[]> =>
  fromDb(() => FAQ.find({ published: true }).sort({ order: 1 }).lean(), defaultFaqs),
);

/* ---------------------------------- Blog ---------------------------------- */
const sortPosts = (posts: BlogPostItem[]) =>
  [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const getPublishedPosts = cache(async (): Promise<BlogPostItem[]> =>
  fromDb(
    () =>
      BlogPost.find({ status: "published", publishedAt: { $lte: new Date() } })
        .sort({ publishedAt: -1 })
        .select("-content")
        .lean(),
    sortPosts(defaultPosts).map(({ content: _content, ...rest }) => ({ ...rest, content: "" })),
  ),
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPostItem | null> =>
  fromDb(
    () => BlogPost.findOne({ slug, status: "published", publishedAt: { $lte: new Date() } }).lean(),
    defaultPosts.find((p) => p.slug === slug) ?? null,
  ),
);

/* --------------------------------- Gallery -------------------------------- */
export const getGallery = cache(async (): Promise<GalleryItemData[]> =>
  fromDb(() => GalleryItem.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean(), []),
);

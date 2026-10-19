import "server-only";
import { z } from "zod";
import rawPosts from "@/content/blog-posts.json";
import { IMAGE_URL_RE } from "@/lib/schema-builder";
import type { BlogPostItem } from "@/types";

/**
 * Blog posts managed in content/blog-posts.json.
 * Each entry is validated; an invalid entry is skipped (and logged) so one
 * mistake in the file never breaks the site. See README → "Blog posts (JSON)".
 */
const postSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase-with-hyphens"),
  excerpt: z.string().trim().default(""),
  content: z.string().min(1),
  featuredImage: z
    .string()
    .trim()
    .default("")
    .refine((v) => v === "" || IMAGE_URL_RE.test(v), "featuredImage must be /images/..., /api/uploads/... or an images.unsplash.com URL"),
  category: z.string().trim().default("Physiotherapy"),
  author: z.string().trim().default("Next Step Physio & Rehab Clinic"),
  status: z.enum(["draft", "published"]).default("published"),
  publishedAt: z.string().refine((v) => !Number.isNaN(new Date(v).getTime()), "publishedAt must be a date like 2026-10-14"),
  updatedAt: z.string().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

function load(): BlogPostItem[] {
  const list = Array.isArray(rawPosts) ? (rawPosts as unknown[]) : [];
  const seen = new Set<string>();
  const valid: BlogPostItem[] = [];
  list.forEach((entry, i) => {
    const parsed = postSchema.safeParse(entry);
    if (!parsed.success) {
      const where = (entry as { slug?: string })?.slug ?? `#${i + 1}`;
      console.warn(`[blog-posts.json] skipped post ${where}: ${parsed.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join("; ")}`);
      return;
    }
    if (seen.has(parsed.data.slug)) {
      console.warn(`[blog-posts.json] skipped duplicate slug: ${parsed.data.slug}`);
      return;
    }
    seen.add(parsed.data.slug);
    valid.push({ ...parsed.data, publishedAt: new Date(parsed.data.publishedAt).toISOString() });
  });
  return valid;
}

const ALL = load();

/** Published JSON posts whose publish date has arrived, newest first. */
export function getJsonPosts(): BlogPostItem[] {
  const now = Date.now();
  return ALL.filter((p) => p.status === "published" && new Date(p.publishedAt).getTime() <= now).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Every slug defined in the JSON file (including drafts), so the database never shadows it. */
export const JSON_SLUGS = new Set(ALL.map((p) => p.slug));

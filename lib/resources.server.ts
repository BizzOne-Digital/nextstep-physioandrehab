import "server-only";
import type { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { BlogPost, Condition, FAQ, GalleryItem, Service, TeamMember, Testimonial } from "@/models";
import { RESOURCES, allFields, type ResourceKey } from "@/lib/resource-config";
import { buildObject } from "@/lib/schema-builder";
import { sanitizeRichText, stripHtml } from "@/lib/sanitize";
import { truncate } from "@/lib/utils";

type Doc = Record<string, unknown>;

interface ServerResource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  sort: Record<string, 1 | -1>;
  transform?: (data: Doc) => Doc;
}

export const SERVER_RESOURCES: Record<ResourceKey, ServerResource> = {
  services: { model: Service, sort: { order: 1, title: 1 } },
  conditions: { model: Condition, sort: { order: 1, name: 1 } },
  team: { model: TeamMember, sort: { order: 1, name: 1 } },
  testimonials: { model: Testimonial, sort: { createdAt: -1 } },
  faqs: { model: FAQ, sort: { order: 1 } },
  gallery: { model: GalleryItem, sort: { order: 1, createdAt: -1 } },
  blogs: {
    model: BlogPost,
    sort: { publishedAt: -1 },
    transform: (data) => {
      const content = sanitizeRichText(String(data.content ?? ""));
      const excerpt = String(data.excerpt ?? "").trim() || truncate(stripHtml(content), 220);
      const publishedAt = data.publishedAt ? new Date(String(data.publishedAt)) : new Date();
      return { ...data, content, excerpt, publishedAt };
    },
  },
};

export function getResourceSchema(key: ResourceKey) {
  return buildObject(allFields(RESOURCES[key].sections));
}

/** Validates and normalises an admin payload for a resource. */
export function parseResourcePayload(key: ResourceKey, body: unknown): Doc {
  const parsed = getResourceSchema(key).parse(body) as Doc;
  const transform = SERVER_RESOURCES[key].transform;
  return transform ? transform(parsed) : parsed;
}

/** Content is cached with ISR; refresh every public page after admin changes. */
export function revalidatePublicSite() {
  try {
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[revalidate] failed:", (error as Error).message);
  }
}

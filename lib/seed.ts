// Shared by `npm run seed` and the admin "Import default content" action.
// Intentionally free of `server-only` so the CLI script can import it.
import { Admin, Condition, FAQ, Page, Service, SiteSetting, TeamMember } from "@/models";
import { defaultServices } from "@/content/services";
import { defaultConditions } from "@/content/conditions";
import { defaultFaqs } from "@/content/faqs";
import { defaultTeam } from "@/content/team";
import { defaultSettings } from "@/content/settings";
import { PAGE_DEFINITIONS } from "@/content/pages";

export interface SeedResult {
  [collection: string]: string;
}

/**
 * Seeds content collections with the migrated website content.
 * Blog posts are not seeded: they are read directly from content/blog-posts.json.
 * Without `force`, a collection is only seeded when it is empty, so admin
 * edits are never overwritten. With `force`, content collections are reset
 * (submissions, uploads and admins are never touched).
 */
export async function seedDatabase({ force = false }: { force?: boolean } = {}): Promise<SeedResult> {
  const result: SeedResult = {};

  const collections = [
    { name: "services", model: Service, data: defaultServices },
    { name: "conditions", model: Condition, data: defaultConditions },
    { name: "faqs", model: FAQ, data: defaultFaqs },
    { name: "team", model: TeamMember, data: defaultTeam },
  ] as const;

  for (const { name, model, data } of collections) {
    if (force) await model.deleteMany({});
    const count = await model.estimatedDocumentCount();
    if (count > 0) {
      result[name] = `skipped (${count} existing)`;
      continue;
    }
    await model.insertMany(data as unknown[]);
    result[name] = `inserted ${data.length}`;
  }

  for (const page of PAGE_DEFINITIONS) {
    if (force) await Page.deleteOne({ key: page.key });
    const existing = await Page.exists({ key: page.key });
    if (!existing) {
      await Page.create({ key: page.key, content: page.defaults, seoTitle: page.seoTitle, seoDescription: page.seoDescription });
    }
  }
  result.pages = force ? `reset ${PAGE_DEFINITIONS.length}` : "ensured";

  if (force) await SiteSetting.deleteOne({ key: "global" });
  const hasSettings = await SiteSetting.exists({ key: "global" });
  if (!hasSettings) await SiteSetting.create({ key: "global", data: defaultSettings });
  result.settings = hasSettings ? "kept existing" : "created";

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (email && hash) {
    const admin = await Admin.exists({ email });
    if (!admin) await Admin.create({ email, passwordHash: hash, name: "Administrator" });
    result.admin = admin ? "kept existing" : `created ${email}`;
  } else {
    result.admin = "skipped (ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set)";
  }

  return result;
}

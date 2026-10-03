import type { FieldDef, FieldSection } from "@/lib/fields";
import { CONDITION_CATEGORIES } from "@/content/conditions";

// Client-safe admin resource definitions. Server-side behaviour (models,
// transforms, revalidation) lives in lib/resources.server.ts.

export type ResourceKey = "services" | "conditions" | "team" | "testimonials" | "faqs" | "blogs" | "gallery";

export interface ColumnDef {
  key: string;
  label: string;
  type?: "text" | "image" | "boolean" | "date" | "badge" | "rating";
  className?: string;
}

export interface ResourceConfig {
  key: ResourceKey;
  label: string;
  singular: string;
  description: string;
  sections: FieldSection[];
  columns: ColumnDef[];
  titleField: string;
  searchFields: string[];
  defaults: Record<string, unknown>;
  publicPath?: (item: Record<string, unknown>) => string | null;
}

export const SERVICE_ICONS = [
  "Activity", "HandHeart", "Bone", "Crosshair", "Flower2", "Car", "PersonStanding", "Footprints",
  "HardHat", "ShieldPlus", "MessageCircleHeart", "Waves", "Stethoscope", "HeartPulse", "Brain",
  "Baby", "Dumbbell", "Accessibility", "Sparkles", "Target", "Leaf", "HeartHandshake", "Bandage", "Wind",
];

const opt = (values: readonly string[]) => values.map((v) => ({ label: v, value: v }));

export const BLOG_CATEGORIES = ["Physiotherapy", "Massage Therapy", "Chiropractic", "Acupuncture", "Injury Recovery", "Counselling", "Clinic News"];
export const FAQ_CATEGORIES = ["Getting Started", "Billing & Insurance", "Treatment", "General"];
export const GALLERY_CATEGORIES = ["Clinic", "Treatment", "Team", "Events"];

const publishing = (extra: FieldDef[] = []): FieldSection => ({
  title: "Publishing",
  fields: [
    ...extra,
    { name: "order", label: "Display order", type: "number", help: "Lower numbers appear first." },
    { name: "published", label: "Published (visible on website)", type: "boolean" },
  ],
});

export const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  services: {
    key: "services",
    label: "Services",
    singular: "Service",
    description: "Treatments shown on the services pages, homepage and navigation.",
    titleField: "shortTitle",
    searchFields: ["title", "shortTitle", "slug"],
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "shortTitle", label: "Service" },
      { key: "slug", label: "URL", className: "hidden md:table-cell" },
      { key: "order", label: "Order", className: "hidden sm:table-cell" },
      { key: "published", label: "Status", type: "boolean" },
    ],
    publicPath: (i) => `/services/${i.slug}`,
    defaults: { layout: "clinical", icon: "Activity", published: true, order: 99, overview: [], benefits: [], whoItHelps: [], conditions: [], process: [], expectations: [], faqs: [], highlight: { title: "", body: [] } },
    sections: [
      {
        title: "Basics",
        fields: [
          { name: "title", label: "Page title (H1)", type: "text", required: true, wide: true, placeholder: "Physiotherapy in Brampton" },
          { name: "shortTitle", label: "Short name (menus & cards)", type: "text", required: true },
          { name: "slug", label: "URL slug", type: "slug", required: true, from: "shortTitle", help: "Appears as /services/your-slug" },
          { name: "tagline", label: "Tagline", type: "text", wide: true },
          { name: "excerpt", label: "Card summary", type: "textarea", rows: 3, wide: true },
          { name: "icon", label: "Icon", type: "icon", options: opt(SERVICE_ICONS) },
          {
            name: "layout",
            label: "Page layout",
            type: "select",
            required: true,
            options: [
              { label: "Clinical (assessment focused)", value: "clinical" },
              { label: "Wellness (relaxation focused)", value: "wellness" },
              { label: "Recovery (claims & injury)", value: "recovery" },
              { label: "Product (fitting & devices)", value: "product" },
            ],
          },
          { name: "image", label: "Main image", type: "image", folder: "services", wide: true },
        ],
      },
      {
        title: "Page content",
        fields: [
          { name: "overview", label: "Overview paragraphs", type: "list", rows: 4, wide: true },
          { name: "benefits", label: "Benefits / options", type: "repeater", wide: true, fields: [{ name: "title", label: "Title", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
          { name: "whoItHelps", label: "Who this treatment may help", type: "list", wide: true },
          { name: "conditions", label: "Conditions treated", type: "list", wide: true },
          { name: "process", label: "Treatment process steps", type: "repeater", wide: true, fields: [{ name: "title", label: "Step title", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
          { name: "expectations", label: "What to expect", type: "list", wide: true },
          { name: "highlight.title", label: "Highlight box title (optional)", type: "text", wide: true },
          { name: "highlight.body", label: "Highlight box paragraphs", type: "list", rows: 3, wide: true },
        ],
      },
      {
        title: "Service FAQs",
        fields: [{ name: "faqs", label: "Questions", type: "repeater", wide: true, fields: [{ name: "question", label: "Question", type: "text" }, { name: "answer", label: "Answer", type: "textarea", rows: 3 }] }],
      },
      {
        title: "SEO",
        fields: [
          { name: "seoTitle", label: "SEO title", type: "text", wide: true, help: "Aim for 50–60 characters." },
          { name: "seoDescription", label: "Meta description", type: "textarea", rows: 2, wide: true, help: "Aim for 140–160 characters." },
        ],
      },
      publishing(),
    ],
  },
  conditions: {
    key: "conditions",
    label: "Conditions",
    singular: "Condition",
    description: "Conditions listed on the Conditions We Treat page.",
    titleField: "name",
    searchFields: ["name", "category"],
    columns: [
      { key: "name", label: "Condition" },
      { key: "category", label: "Category", type: "badge", className: "hidden sm:table-cell" },
      { key: "featured", label: "Featured", type: "boolean", className: "hidden md:table-cell" },
      { key: "published", label: "Status", type: "boolean" },
    ],
    defaults: { category: CONDITION_CATEGORIES[0], featured: false, published: true, order: 99 },
    sections: [
      {
        title: "Details",
        fields: [
          { name: "name", label: "Condition name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug", required: true, from: "name" },
          { name: "category", label: "Category", type: "select", required: true, options: opt(CONDITION_CATEGORIES) },
          { name: "description", label: "Short description", type: "textarea", rows: 3, wide: true },
          { name: "featured", label: "Feature on homepage", type: "boolean" },
        ],
      },
      publishing(),
    ],
  },
  team: {
    key: "team",
    label: "Team",
    singular: "Team member",
    description: "Practitioners shown on Our Team and the homepage.",
    titleField: "name",
    searchFields: ["name", "title"],
    columns: [
      { key: "image", label: "Photo", type: "image" },
      { key: "name", label: "Name" },
      { key: "title", label: "Title", className: "hidden sm:table-cell" },
      { key: "published", label: "Status", type: "boolean" },
    ],
    publicPath: (i) => `/our-team/${i.slug}`,
    defaults: { published: true, order: 99, qualifications: [], specialties: [] },
    sections: [
      {
        title: "Profile",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Profile URL slug", type: "slug", required: true, from: "name" },
          { name: "title", label: "Professional title", type: "text", required: true, wide: true },
          { name: "image", label: "Photo", type: "image", folder: "team", wide: true },
          { name: "shortBio", label: "Short bio (cards)", type: "textarea", rows: 3, wide: true },
          { name: "fullBio", label: "Full bio", type: "textarea", rows: 8, wide: true, help: "Separate paragraphs with a blank line." },
          { name: "qualifications", label: "Qualifications", type: "list", wide: true },
          { name: "specialties", label: "Specialties", type: "list", wide: true },
        ],
      },
      publishing(),
    ],
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Patient reviews. Reviews submitted on the website arrive unpublished for approval.",
    titleField: "name",
    searchFields: ["name", "review", "location"],
    columns: [
      { key: "name", label: "Name" },
      { key: "rating", label: "Rating", type: "rating", className: "hidden sm:table-cell" },
      { key: "source", label: "Source", type: "badge", className: "hidden md:table-cell" },
      { key: "createdAt", label: "Received", type: "date", className: "hidden lg:table-cell" },
      { key: "published", label: "Status", type: "boolean" },
    ],
    defaults: { rating: 5, published: false },
    sections: [
      {
        title: "Review",
        fields: [
          { name: "name", label: "Patient name", type: "text", required: true },
          { name: "location", label: "Location", type: "text", placeholder: "Brampton, ON" },
          { name: "rating", label: "Rating", type: "select", required: true, options: ["5", "4", "3", "2", "1"].map((v) => ({ label: `${v} star${v === "1" ? "" : "s"}`, value: v })) },
          { name: "service", label: "Service received", type: "text" },
          { name: "review", label: "Review", type: "textarea", rows: 5, required: true, wide: true },
          { name: "image", label: "Photo (optional)", type: "image", folder: "testimonials", wide: true },
          { name: "published", label: "Published (visible on website)", type: "boolean" },
        ],
      },
    ],
  },
  faqs: {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions on the FAQ page and homepage.",
    titleField: "question",
    searchFields: ["question", "answer", "category"],
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category", type: "badge", className: "hidden md:table-cell" },
      { key: "showOnHome", label: "Homepage", type: "boolean", className: "hidden sm:table-cell" },
      { key: "published", label: "Status", type: "boolean" },
    ],
    defaults: { category: "General", showOnHome: false, published: true, order: 99 },
    sections: [
      {
        title: "Question",
        fields: [
          { name: "question", label: "Question", type: "text", required: true, wide: true },
          { name: "answer", label: "Answer", type: "textarea", rows: 5, required: true, wide: true },
          { name: "category", label: "Category", type: "select", required: true, options: opt(FAQ_CATEGORIES) },
          { name: "showOnHome", label: "Show on homepage", type: "boolean" },
        ],
      },
      publishing(),
    ],
  },
  blogs: {
    key: "blogs",
    label: "Blog Posts",
    singular: "Blog post",
    description: "Articles for the blog. Drafts are never shown publicly.",
    titleField: "title",
    searchFields: ["title", "slug", "category"],
    columns: [
      { key: "featuredImage", label: "Image", type: "image" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge", className: "hidden lg:table-cell" },
      { key: "publishedAt", label: "Date", type: "date", className: "hidden md:table-cell" },
      { key: "status", label: "Status", type: "badge" },
    ],
    publicPath: (i) => (i.status === "published" ? `/blog/${i.slug}` : null),
    defaults: { status: "draft", category: "Physiotherapy", author: "Next Step Physio & Rehab Clinic", content: "" },
    sections: [
      {
        title: "Post",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, wide: true },
          { name: "slug", label: "URL slug", type: "slug", required: true, from: "title", wide: true },
          { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, wide: true },
          { name: "featuredImage", label: "Featured image", type: "image", folder: "blogs", wide: true },
          { name: "content", label: "Content", type: "richtext", wide: true },
        ],
      },
      {
        title: "Publishing",
        fields: [
          { name: "status", label: "Status", type: "select", required: true, options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }] },
          { name: "publishedAt", label: "Publish date", type: "date" },
          { name: "category", label: "Category", type: "select", required: true, options: opt(BLOG_CATEGORIES) },
          { name: "author", label: "Author", type: "text" },
        ],
      },
      {
        title: "SEO",
        fields: [
          { name: "seoTitle", label: "SEO title", type: "text", wide: true, help: "Leave blank to use the post title." },
          { name: "seoDescription", label: "Meta description", type: "textarea", rows: 2, wide: true, help: "Leave blank to use the excerpt." },
        ],
      },
    ],
  },
  gallery: {
    key: "gallery",
    label: "Gallery",
    singular: "Gallery item",
    description: "Clinic photos shown on the gallery page.",
    titleField: "title",
    searchFields: ["title", "category"],
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge", className: "hidden sm:table-cell" },
      { key: "published", label: "Status", type: "boolean" },
    ],
    defaults: { category: "Clinic", published: true, order: 99 },
    sections: [
      {
        title: "Image",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "category", label: "Category", type: "select", required: true, options: opt(GALLERY_CATEGORIES) },
          { name: "image", label: "Image", type: "image", folder: "gallery", required: true, wide: true },
          { name: "alt", label: "Alt text (describe the image)", type: "text", wide: true },
        ],
      },
      publishing(),
    ],
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[];

export function getResourceConfig(key: string): ResourceConfig | undefined {
  return (RESOURCES as Record<string, ResourceConfig>)[key];
}

export function allFields(sections: FieldSection[]): FieldDef[] {
  return sections.flatMap((s) => s.fields);
}

/* --------------------------------- Settings -------------------------------- */
export const SETTINGS_SECTIONS: FieldSection[] = [
  {
    title: "Clinic",
    fields: [
      { name: "clinicName", label: "Clinic name", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "logo", label: "Logo (optional — replaces the built-in logo)", type: "image", folder: "settings", wide: true },
      { name: "announcement", label: "Announcement bar text (optional)", type: "text", wide: true },
      { name: "footerAbout", label: "Footer description", type: "textarea", rows: 3, wide: true },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "address.street", label: "Street address", type: "text", required: true },
      { name: "address.unit", label: "Unit / suite", type: "text" },
      { name: "address.city", label: "City", type: "text", required: true },
      { name: "address.province", label: "Province", type: "text", required: true },
      { name: "address.postalCode", label: "Postal code", type: "text", required: true },
      { name: "address.country", label: "Country", type: "text" },
      { name: "mapLink", label: "Google Maps link (directions)", type: "url", wide: true },
      { name: "mapEmbedUrl", label: "Google Maps embed URL", type: "url", wide: true, help: "Must start with https://www.google.com/maps/embed" },
    ],
  },
  {
    title: "Opening hours",
    fields: [
      {
        name: "hours",
        label: "Hours",
        type: "repeater",
        wide: true,
        fields: [
          { name: "day", label: "Day", type: "text" },
          { name: "open", label: "Opens", type: "time" },
          { name: "close", label: "Closes", type: "time" },
          { name: "closed", label: "Closed all day", type: "boolean" },
        ],
      },
    ],
  },
  {
    title: "Social media",
    description: "Leave blank to hide an icon.",
    fields: [
      { name: "social.facebook", label: "Facebook URL", type: "url" },
      { name: "social.instagram", label: "Instagram URL", type: "url" },
      { name: "social.linkedin", label: "LinkedIn URL", type: "url" },
      { name: "social.youtube", label: "YouTube URL", type: "url" },
      { name: "social.tiktok", label: "TikTok URL", type: "url" },
      { name: "social.google", label: "Google Business profile URL", type: "url" },
    ],
  },
  {
    title: "Direct billing partners",
    fields: [
      {
        name: "insurers",
        label: "Insurance providers",
        type: "repeater",
        wide: true,
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "logo", label: "Logo", type: "image", folder: "settings" },
        ],
      },
    ],
  },
  {
    title: "Default SEO",
    fields: [
      { name: "seoDefaultTitle", label: "Default title", type: "text", wide: true },
      { name: "seoDefaultDescription", label: "Default description", type: "textarea", rows: 2, wide: true },
      { name: "ogImage", label: "Default social sharing image", type: "image", folder: "settings", wide: true },
    ],
  },
];

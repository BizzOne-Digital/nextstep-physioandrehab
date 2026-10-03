import { z } from "zod";
import type { FieldDef } from "@/lib/fields";

export const IMAGE_URL_RE = /^(\/api\/uploads\/[a-z]+\/[A-Za-z0-9.-]+|\/images\/[A-Za-z0-9/_.-]+|https:\/\/images\.unsplash\.com\/[^\s"'<>]+)$/;

const imageField = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || IMAGE_URL_RE.test(v), "Use an uploaded image, a /images path or an images.unsplash.com URL");

function fieldSchema(field: FieldDef): z.ZodTypeAny {
  switch (field.type) {
    case "number": {
      let s = z.coerce.number({ message: "Must be a number" });
      if (field.min !== undefined) s = s.min(field.min);
      if (field.max !== undefined) s = s.max(field.max);
      return s.default(0);
    }
    case "boolean":
      return z.coerce.boolean().default(false);
    case "image":
      return field.required ? imageField.refine((v) => v !== "", "An image is required") : imageField.default("");
    case "list":
      return z.array(z.string().trim().max(5000)).max(100).default([]).transform((a) => a.filter(Boolean));
    case "repeater": {
      const shape = buildObject(field.fields ?? []);
      return z.array(shape).max(100).default([]);
    }
    case "select": {
      const values = (field.options ?? []).map((o) => o.value);
      const s = z.coerce.string().refine((v) => values.includes(v) || (!field.required && v === ""), "Choose a valid option");
      return field.required ? s : s.default("");
    }
    case "slug":
      return z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only")
        .max(120);
    case "email": {
      const s = z.string().trim().max(200);
      return field.required ? s.pipe(z.email("Enter a valid email")) : s.refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email").default("");
    }
    case "url": {
      const s = z.string().trim().max(2000).refine((v) => v === "" || /^https:\/\//.test(v), "Must start with https://");
      return field.required ? s.refine((v) => v !== "", "Required") : s.default("");
    }
    case "date":
      return z
        .string()
        .trim()
        .refine((v) => v === "" || !Number.isNaN(new Date(v).getTime()), "Enter a valid date")
        .default("");
    case "time":
      return z.string().trim().regex(/^$|^\d{2}:\d{2}$/, "Use HH:MM").default("");
    case "richtext":
      return z.string().max(300_000).default("");
    case "textarea":
    case "text":
    case "icon":
    default: {
      const max = field.type === "textarea" ? 20_000 : 500;
      const s = z.string().trim().max(max, `Must be ${max} characters or fewer`);
      return field.required ? s.min(1, `${field.label} is required`) : s.default("");
    }
  }
}

type Shape = Record<string, z.ZodTypeAny>;

/** Builds a Zod object from field definitions; dotted names become nested objects. */
export function buildObject(fields: FieldDef[]): z.ZodObject<Shape> {
  const root: Record<string, unknown> = {};
  for (const field of fields) {
    const parts = field.name.split(".");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] = (node[parts[i]] as Record<string, unknown>) ?? {};
      node = node[parts[i]] as Record<string, unknown>;
    }
    node[parts[parts.length - 1]] = fieldSchema(field);
  }
  const toZod = (obj: Record<string, unknown>): z.ZodObject<Shape> => {
    const shape: Shape = {};
    for (const [k, v] of Object.entries(obj)) {
      shape[k] = v instanceof z.ZodType ? v : toZod(v as Record<string, unknown>).default({} as never);
    }
    return z.object(shape);
  };
  return toZod(root);
}

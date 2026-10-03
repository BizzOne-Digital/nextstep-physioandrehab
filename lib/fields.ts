// Field definitions drive every admin form (resources, pages and settings).
// This module is shared by server and client code, so keep it dependency-free.

export const UPLOAD_FOLDERS = [
  "products",
  "gallery",
  "pages",
  "misc",
  "services",
  "team",
  "blogs",
  "testimonials",
  "settings",
] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "richtext"
  | "list"
  | "repeater"
  | "date"
  | "time"
  | "slug"
  | "icon";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: FieldOption[];
  folder?: UploadFolder;
  fields?: FieldDef[];
  rows?: number;
  /** For slug fields: the field the slug is generated from. */
  from?: string;
  /** Span both columns in the two-column form grid. */
  wide?: boolean;
  min?: number;
  max?: number;
}

export interface FieldSection {
  title: string;
  description?: string;
  fields: FieldDef[];
}

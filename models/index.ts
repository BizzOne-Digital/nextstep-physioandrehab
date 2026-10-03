/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, type Model } from "mongoose";

export { StoredUpload } from "./StoredUpload";

// `schema: unknown` avoids an exponential type comparison against Mongoose's Schema generics.
function getModel<T>(name: string, schema: unknown): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema as never);
}

const titled = { title: { type: String, default: "" }, description: { type: String, default: "" } };
const qa = { question: { type: String, default: "" }, answer: { type: String, default: "" } };

/* ---------------------------------- Admin --------------------------------- */
const AdminSchema = new Schema<any>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Administrator" },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);
export const Admin = getModel<any>("Admin", AdminSchema);

/* ---------------------------------- Page ---------------------------------- */
const PageSchema = new Schema<any>(
  {
    key: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed, default: {} },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true, minimize: false },
);
export const Page = getModel<any>("Page", PageSchema);

/* --------------------------------- Service -------------------------------- */
const ServiceSchema = new Schema<any>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    shortTitle: { type: String, required: true },
    tagline: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    icon: { type: String, default: "Activity" },
    image: { type: String, default: "" },
    overview: { type: [String], default: [] },
    benefits: { type: [titled], default: [] },
    whoItHelps: { type: [String], default: [] },
    conditions: { type: [String], default: [] },
    process: { type: [titled], default: [] },
    expectations: { type: [String], default: [] },
    highlight: { title: { type: String, default: "" }, body: { type: [String], default: [] } },
    faqs: { type: [qa], default: [] },
    layout: { type: String, enum: ["clinical", "wellness", "recovery", "product"], default: "clinical" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Service = getModel<any>("Service", ServiceSchema);

/* -------------------------------- Condition ------------------------------- */
const ConditionSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "General" },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Condition = getModel<any>("Condition", ConditionSchema);

/* ------------------------------- TeamMember ------------------------------- */
const TeamMemberSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    image: { type: String, default: "" },
    shortBio: { type: String, default: "" },
    fullBio: { type: String, default: "" },
    qualifications: { type: [String], default: [] },
    specialties: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const TeamMember = getModel<any>("TeamMember", TeamMemberSchema);

/* ------------------------------- Testimonial ------------------------------ */
const TestimonialSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    location: { type: String, default: "" },
    image: { type: String, default: "" },
    service: { type: String, default: "" },
    email: { type: String, default: "" },
    source: { type: String, enum: ["admin", "website"], default: "admin" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export const Testimonial = getModel<any>("Testimonial", TestimonialSchema);

/* ----------------------------------- FAQ ---------------------------------- */
const FAQSchema = new Schema<any>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    showOnHome: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const FAQ = getModel<any>("FAQ", FAQSchema);

/* -------------------------------- BlogPost -------------------------------- */
const BlogPostSchema = new Schema<any>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "Physiotherapy" },
    author: { type: String, default: "Next Step Physio & Rehab Clinic" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);
export const BlogPost = getModel<any>("BlogPost", BlogPostSchema);

/* ------------------------------- GalleryItem ------------------------------ */
const GalleryItemSchema = new Schema<any>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, default: "" },
    category: { type: String, default: "Clinic" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const GalleryItem = getModel<any>("GalleryItem", GalleryItemSchema);

/* ------------------------------- Appointment ------------------------------ */
const AppointmentSchema = new Schema<any>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, default: "" },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "scheduled", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    notes: { type: String, default: "" },
    ip: { type: String, default: "", select: false },
  },
  { timestamps: true },
);
export const Appointment = getModel<any>("Appointment", AppointmentSchema);

/* ---------------------------- ContactSubmission --------------------------- */
const ContactSubmissionSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new", index: true },
    ip: { type: String, default: "", select: false },
  },
  { timestamps: true },
);
export const ContactSubmission = getModel<any>("ContactSubmission", ContactSubmissionSchema);

/* ------------------------------- SiteSetting ------------------------------ */
const SiteSettingSchema = new Schema<any>(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);
export const SiteSetting = getModel<any>("SiteSetting", SiteSettingSchema);

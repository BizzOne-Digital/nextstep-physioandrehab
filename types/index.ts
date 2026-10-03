export type ServiceLayout = "clinical" | "wellness" | "recovery" | "product";

export interface TitledText {
  title: string;
  description: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface ServiceItem {
  _id?: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  excerpt: string;
  icon: string;
  image: string;
  overview: string[];
  benefits: TitledText[];
  whoItHelps: string[];
  conditions: string[];
  process: TitledText[];
  expectations: string[];
  highlight?: { title: string; body: string[] };
  faqs: QA[];
  layout: ServiceLayout;
  seoTitle: string;
  seoDescription: string;
  order: number;
  published: boolean;
}

export interface ConditionItem {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  featured: boolean;
  order: number;
  published: boolean;
}

export interface TeamMemberItem {
  _id?: string;
  name: string;
  slug: string;
  title: string;
  image: string;
  shortBio: string;
  fullBio: string;
  qualifications: string[];
  specialties: string[];
  order: number;
  published: boolean;
}

export interface TestimonialItem {
  _id?: string;
  name: string;
  review: string;
  rating: number;
  location?: string;
  image?: string;
  service?: string;
  published: boolean;
  createdAt?: string;
}

export interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  showOnHome: boolean;
  order: number;
  published: boolean;
}

export interface BlogPostItem {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  status: "draft" | "published";
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
}

export interface GalleryItemData {
  _id?: string;
  title: string;
  image: string;
  alt: string;
  category: string;
  order: number;
  published: boolean;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Insurer {
  name: string;
  logo: string;
}

export interface SiteSettings {
  clinicName: string;
  tagline: string;
  logo: string;
  phone: string;
  email: string;
  address: {
    street: string;
    unit: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  mapEmbedUrl: string;
  mapLink: string;
  hours: OpeningHour[];
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    google: string;
  };
  insurers: Insurer[];
  footerAbout: string;
  announcement: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  ogImage: string;
}

export type AppointmentStatus = "new" | "contacted" | "scheduled" | "completed" | "cancelled";
export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface AppointmentItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface ContactSubmissionItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "conditions"
  | "our-team"
  | "testimonials"
  | "blog"
  | "faq"
  | "contact"
  | "book-appointment";

export type PageContent = Record<string, unknown>;

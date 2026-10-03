import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import type { BlogPostItem, FAQItem, QA, ServiceItem, SiteSettings } from "@/types";

const DAY_MAP: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

export function clinicSchema(settings: SiteSettings, services: ServiceItem[] = []) {
  const a = settings.address;
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "MedicalBusiness"],
    "@id": `${SITE_URL}/#clinic`,
    name: settings.clinicName || SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/brand/logo.png"),
    image: absoluteUrl("/opengraph-image"),
    description: settings.seoDefaultDescription,
    telephone: settings.phone,
    email: settings.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: [a.street, a.unit].filter(Boolean).join(", "),
      addressLocality: a.city,
      addressRegion: a.province,
      postalCode: a.postalCode,
      addressCountry: "CA",
    },
    ...(settings.mapLink ? { hasMap: settings.mapLink } : {}),
    areaServed: { "@type": "City", name: "Brampton" },
    medicalSpecialty: ["Physiotherapy", "Chiropractic", "MassageTherapy"],
    openingHoursSpecification: settings.hours
      .filter((h) => !h.closed && h.open && h.close && DAY_MAP[h.day.toLowerCase()])
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAY_MAP[h.day.toLowerCase()],
        opens: h.open,
        closes: h.close,
      })),
    sameAs: Object.values(settings.social).filter(Boolean),
    ...(services.length
      ? {
          availableService: services.map((s) => ({
            "@type": "MedicalTherapy",
            name: s.shortTitle,
            url: absoluteUrl(`/services/${s.slug}`),
          })),
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(items: Array<FAQItem | QA>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(service: ServiceItem, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: service.shortTitle,
    description: service.seoDescription || service.excerpt,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${SITE_URL}/#clinic`, "@type": "MedicalClinic", name: settings.clinicName },
    areaServed: { "@type": "City", name: "Brampton" },
  };
}

export function articleSchema(post: BlogPostItem, image: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: [absoluteUrl(image)],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: post.author || SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/images/brand/logo.png") } },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    articleSection: post.category,
  };
}

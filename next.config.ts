import type { NextConfig } from "next";
import blogPosts from "./content/blog-posts.json";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // Admin uploads are served from MongoDB through /api/uploads and static assets from /images.
    localPatterns: [
      { pathname: "/api/uploads/**", search: "" },
      { pathname: "/images/**", search: "" },
    ],
  },
  serverExternalPackages: ["mongoose", "sanitize-html"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Preserve SEO value of the old WordPress URLs.
    const services: Record<string, string> = {
      "physiotherapy-in-brampton": "physiotherapy",
      "massage-therapy-in-brampton": "massage-therapy",
      "chiropractic-treatment-in-brampton": "chiropractic-treatment",
      "acupuncture-treatment-in-brampton": "acupuncture",
      "pelvic-floor-rehabilitation-in-brampton": "pelvic-floor-rehabilitation",
      "motor-vehicle-accident-treatment-in-brampton": "motor-vehicle-accident",
      "slip-and-fall-injury-treatment-in-brampton": "slip-and-fall-injury",
      "custom-orthotics-treatment-in-brampton": "custom-orthotics",
      "wsib-rehabilitation-in-brampton": "wsib-rehabilitation",
      "braces-clinic-in-brampton": "braces-clinic",
      "social-worker-counselling-in-brampton": "counselling",
      "compression-stockings-in-brampton": "compression-stockings",
    };
    return [
      ...Object.entries(services).map(([from, to]) => ({
        source: `/${from}`,
        destination: `/services/${to}`,
        permanent: true,
      })),
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/review-form", destination: "/testimonials#share-review", permanent: true },
      {
        source: "/team/priya-registered-physiotherapist-next-step-physio-rehab-clinic",
        destination: "/our-team/priya",
        permanent: true,
      },
      { source: "/team/:slug*", destination: "/our-team", permanent: true },
      // Old WordPress blog posts lived at the site root.
      ...(blogPosts as Array<{ slug: string }>).map((p) => ({
        source: `/${p.slug}`,
        destination: `/blog/${p.slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;

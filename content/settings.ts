import type { Insurer, SiteSettings } from "@/types";

const insurer = (name: string, file: string): Insurer => ({ name, logo: `/images/insurers/${file}.webp` });

// Approved facility / direct billing partners shown on the existing website.
export const defaultInsurers: Insurer[] = [
  insurer("Sun Life", "sunlife"),
  insurer("Manulife", "manulife-financial"),
  insurer("Canada Life", "canada-life"),
  insurer("Desjardins Insurance", "desjardins-insurance"),
  insurer("Medavie Blue Cross", "medavie-blue-cross"),
  insurer("Alberta Blue Cross", "abc-logo-package-abc-pantoneprocessblue-1"),
  insurer("Manitoba Blue Cross", "manitoba-blue-cross"),
  insurer("Beneva", "beneva"),
  insurer("Equitable Life", "equitable-life"),
  insurer("iA Industrial Alliance", "industrial-alliance"),
  insurer("TELUS AdjudiCare", "telus-adjudicare"),
  insurer("ClaimSecure", "new-cs-logo-with-slogan-en"),
  insurer("People Corporation", "pc-logo"),
  insurer("Cowan (Express Scripts Canada)", "cowan-express-scripts-canada"),
  insurer("GMS Carriers 49 & 50 (Express Scripts Canada)", "gms-carriers-49-and-50-express-scripts-canada"),
  insurer("Johnson (Express Scripts Canada)", "johnson-express-scripts-canada"),
  insurer("Johnston Group", "johnston-group"),
  insurer("Chambers of Commerce Group Insurance", "chambers-of-commerce-johnston-group"),
  insurer("CINUP (Johnston Group)", "cinup-johnston-group"),
  insurer("First Canadian (Johnston Group)", "first-canadian-johnston-group"),
  insurer("Maximum Benefit (Johnston Group)", "maximum-benefit-johnston-group"),
  insurer("GroupHEALTH", "grouphealth"),
  insurer("GroupSource", "groupsource"),
  insurer("BPA", "bpa-logo"),
  insurer("Coughlin & Associates", "coughlin-associates-ltd"),
  insurer("D.A. Townley", "d-a-townley"),
  insurer("Manion", "manion"),
  insurer("RWAM", "rwam"),
  insurer("Simply Benefits", "simply-benefits"),
  insurer("Union Benefits", "union-benefits"),
  insurer("UV Insurance", "uv-insurance"),
  insurer("Canadian Construction Workers Union (CCWU)", "canadian-construction-workers-union-c-c-w-u"),
  insurer("LiUNA Local 183", "liuna-local-183"),
  insurer("LiUNA Local 506", "liuna-local-506"),
];

export const defaultSettings: SiteSettings = {
  clinicName: "Next Step Physio & Rehab Clinic",
  tagline: "Your Next Step to Better Health",
  logo: "",
  phone: "+1 (647) 872-8105",
  email: "nextstepphysioandrehab@gmail.com",
  address: {
    street: "9886 Torbram Rd",
    unit: "Unit 109",
    city: "Brampton",
    province: "ON",
    postalCode: "L6S 3L9",
    country: "Canada",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.1357536570063!2d-79.73042502494147!3d43.74927764621311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3d244df3865f%3A0x1c9c11367529ea0!2sNext%20Step%20Physio%20%26%20Rehab%20Clinic!5e0!3m2!1sen!2sca!4v1784954054943!5m2!1sen!2sca",
  mapLink: "https://maps.app.goo.gl/2pxWRaQLJPgoirQN8",
  hours: [
    { day: "Monday", open: "11:00", close: "19:00", closed: false },
    { day: "Tuesday", open: "11:00", close: "19:00", closed: false },
    { day: "Wednesday", open: "11:00", close: "19:00", closed: false },
    { day: "Thursday", open: "11:00", close: "19:00", closed: false },
    { day: "Friday", open: "11:00", close: "19:00", closed: false },
    { day: "Saturday", open: "10:00", close: "14:00", closed: false },
    { day: "Sunday", open: "", close: "", closed: true },
  ],
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "", google: "" },
  insurers: defaultInsurers,
  footerAbout:
    "Compassionate, evidence-based physiotherapy and rehabilitation in Brampton. Personalized care to help you move better, feel stronger and live healthier.",
  announcement: "",
  seoDefaultTitle: "Next Step Physio & Rehab Clinic | Physiotherapy in Brampton",
  seoDefaultDescription:
    "Next Step Physio & Rehab Clinic offers physiotherapy, massage therapy, chiropractic care, acupuncture and rehabilitation in Brampton, ON. Direct billing available.",
  ogImage: "",
};

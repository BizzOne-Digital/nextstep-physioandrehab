import { IMAGES } from "@/lib/images";
import type { FieldDef, FieldSection } from "@/lib/fields";
import type { PageKey } from "@/types";

export interface PageDefinition {
  key: PageKey;
  label: string;
  path: string;
  sections: FieldSection[];
  defaults: Record<string, unknown>;
  seoTitle: string;
  seoDescription: string;
}

const heroFields = (folder: "pages" = "pages"): FieldDef[] => [
  { name: "heroEyebrow", label: "Eyebrow text", type: "text" },
  { name: "heroTitle", label: "Heading", type: "text", required: true, wide: true },
  { name: "heroSubtitle", label: "Supporting text", type: "textarea", rows: 3, wide: true },
  { name: "heroImage", label: "Hero image", type: "image", folder, wide: true },
];

const simplePage = (
  key: PageKey,
  label: string,
  path: string,
  defaults: Record<string, unknown>,
  seoTitle: string,
  seoDescription: string,
  extra: FieldSection[] = [],
): PageDefinition => ({
  key,
  label,
  path,
  sections: [{ title: "Page header", fields: heroFields() }, ...extra],
  defaults,
  seoTitle,
  seoDescription,
});

export const PAGE_DEFINITIONS: PageDefinition[] = [
  {
    key: "home",
    label: "Homepage",
    path: "/",
    seoTitle: "Next Step Physio & Rehab Clinic | Physiotherapy & Rehab in Brampton, ON",
    seoDescription:
      "Personalized physiotherapy, massage therapy, chiropractic care and rehabilitation in Brampton, ON. Experienced, caring team and direct billing available.",
    sections: [
      {
        title: "Hero",
        description: "The first section visitors see.",
        fields: [
          { name: "heroEyebrow", label: "Eyebrow text", type: "text", wide: true },
          { name: "heroTitle", label: "Heading (first line)", type: "text", required: true },
          { name: "heroHighlight", label: "Heading (highlighted line)", type: "text" },
          { name: "heroSubtitle", label: "Supporting text", type: "textarea", rows: 3, wide: true },
          { name: "heroPrimaryCta", label: "Primary button text", type: "text" },
          { name: "heroSecondaryCta", label: "Secondary button text", type: "text" },
          { name: "heroBadges", label: "Benefit points under buttons", type: "list", wide: true },
          { name: "heroImage", label: "Hero image", type: "image", folder: "pages", wide: true },
        ],
      },
      {
        title: "About section",
        fields: [
          { name: "aboutEyebrow", label: "Eyebrow text", type: "text" },
          { name: "aboutTitle", label: "Heading", type: "text" },
          { name: "aboutBody", label: "Body text", type: "textarea", rows: 5, wide: true, help: "Separate paragraphs with a blank line." },
          { name: "aboutPoints", label: "Key points", type: "list", wide: true },
          { name: "aboutImage", label: "Main image", type: "image", folder: "pages" },
          { name: "aboutSecondaryImage", label: "Secondary image", type: "image", folder: "pages" },
        ],
      },
      {
        title: "Call-to-action banner",
        fields: [
          { name: "ctaTitle", label: "Heading", type: "text", wide: true },
          { name: "ctaBody", label: "Body text", type: "textarea", rows: 3, wide: true },
          { name: "ctaImage", label: "Background image", type: "image", folder: "pages", wide: true },
        ],
      },
      {
        title: "Appointment section",
        fields: [
          { name: "appointmentTitle", label: "Heading", type: "text", wide: true },
          { name: "appointmentBody", label: "Body text", type: "textarea", rows: 3, wide: true },
        ],
      },
    ],
    defaults: {
      heroEyebrow: "Move Better • Feel Stronger • Live Healthier",
      heroTitle: "Your Next Step",
      heroHighlight: "to Better Health",
      heroSubtitle:
        "Personalized physiotherapy and rehabilitation care designed to help reduce pain, improve mobility, recover from injuries and live a healthier, more active life in Brampton.",
      heroPrimaryCta: "Book Appointment",
      heroSecondaryCta: "Our Services",
      heroBadges: ["Experienced & Caring Team", "Personalized Treatment Plans", "Direct Billing Available"],
      heroImage: IMAGES.hero,
      aboutEyebrow: "About Next Step",
      aboutTitle: "Care that looks at the whole picture",
      aboutBody:
        "Next Step Physio & Rehab Clinic is proud to serve the Brampton community with compassionate, patient-focused care. Our team combines advanced physiotherapy techniques with personalized treatment plans to support your recovery.\n\nWe take time to understand the full picture — including stress at work and at home, general health, posture, lifestyle and movement habits — so your treatment addresses the underlying cause, not just the symptoms.",
      aboutPoints: [
        "One-on-one attention in a welcoming environment",
        "Evidence-based, drug-free treatment",
        "Immediate appointments often available",
      ],
      aboutImage: "/images/about1.webp",
      aboutSecondaryImage: "/images/about2.webp",
      ctaTitle: "Injured at work, in a car accident or on the field? We're ready to help.",
      ctaBody:
        "Whatever caused your pain, our team will assess your needs and build a plan to get you moving again — with direct billing to help keep things simple.",
      ctaImage: IMAGES.exercise,
      appointmentTitle: "Ready to take your next step?",
      appointmentBody:
        "Request an appointment online and our team will contact you to confirm a time that works for you. Prefer to talk? Give us a call.",
    },
  },
  {
    key: "about",
    label: "About Us",
    path: "/about",
    seoTitle: "About Us | Next Step Physio & Rehab Clinic in Brampton",
    seoDescription:
      "Learn about Next Step Physio & Rehab Clinic — compassionate, evidence-based physiotherapy and rehabilitation for the Brampton community.",
    sections: [
      { title: "Page header", fields: heroFields() },
      {
        title: "Introduction",
        fields: [
          { name: "introTitle", label: "Heading", type: "text", wide: true },
          { name: "introBody", label: "Body text", type: "textarea", rows: 6, wide: true, help: "Separate paragraphs with a blank line." },
          { name: "introImage", label: "Image", type: "image", folder: "pages" },
          { name: "introSecondaryImage", label: "Secondary image", type: "image", folder: "pages" },
        ],
      },
      {
        title: "Mission",
        fields: [
          { name: "missionTitle", label: "Heading", type: "text", wide: true },
          { name: "missionPoints", label: "Mission statements", type: "list", wide: true },
          { name: "missionImage", label: "Image", type: "image", folder: "pages", wide: true },
        ],
      },
      {
        title: "What sets us apart",
        fields: [
          { name: "differentiatorsTitle", label: "Heading", type: "text", wide: true },
          {
            name: "differentiators",
            label: "Points",
            type: "repeater",
            wide: true,
            fields: [
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
    ],
    defaults: {
      heroEyebrow: "About Us",
      heroTitle: "Compassionate care for every step of your recovery",
      heroSubtitle:
        "We help the Brampton community restore mobility, reduce pain and improve long-term function through evidence-based practice.",
      heroImage: IMAGES.shoulderCare,
      introTitle: "Welcome to Next Step Physio & Rehab Clinic",
      introBody:
        "Next Step Physio & Rehab Clinic is proud to serve the Brampton community with compassionate, patient-focused care. Our team combines advanced physiotherapy techniques with personalized treatment plans to support your recovery journey.\n\nWe focus on restoring mobility, reducing pain and improving long-term function through evidence-based practice. Every patient receives one-on-one attention in a welcoming, supportive environment.\n\nYour next step toward better health starts here — and we're with you every step of the way.",
      introImage: "/images/about1.webp",
      introSecondaryImage: "/images/about2.webp",
      missionTitle: "Our mission",
      missionPoints: [
        "Provide compassionate, evidence-based care that empowers every patient to move with confidence.",
        "Deliver personalized treatment plans that support recovery, restore function and improve long-term quality of life.",
        "Create a welcoming, supportive environment where patients feel heard, respected and motivated.",
        "Work collaboratively to help you take the next step toward better health, mobility and overall well-being.",
      ],
      missionImage: IMAGES.resistanceBand,
      differentiatorsTitle: "What sets us apart",
      differentiators: [
        { title: "Patient-centred approach", description: "Treatment programs tailored to each patient, with a healing process that centres on you." },
        { title: "Skilled, committed team", description: "Qualified practitioners committed to lifelong learning and staying current in their fields." },
        { title: "Modern techniques", description: "Current, evidence-based methods across pain management and rehabilitation." },
        { title: "Holistic view of wellness", description: "We look beyond symptoms to address the underlying causes of your concerns." },
        { title: "Compassionate care", description: "Relationships built on trust, empathy and genuine concern for your well-being." },
      ],
    },
  },
  simplePage(
    "services",
    "Services",
    "/services",
    {
      heroEyebrow: "Our Services",
      heroTitle: "Treatment options tailored to your recovery",
      heroSubtitle:
        "From physiotherapy and massage to chiropractic care, acupuncture and specialized rehabilitation — everything you need under one roof in Brampton.",
      heroImage: IMAGES.physiotherapy,
    },
    "Physiotherapy & Rehabilitation Services in Brampton | Next Step",
    "Explore physiotherapy, massage therapy, chiropractic, acupuncture, pelvic floor, MVA, WSIB rehabilitation and more at Next Step Physio & Rehab Clinic in Brampton.",
  ),
  simplePage(
    "conditions",
    "Conditions We Treat",
    "/conditions",
    {
      heroEyebrow: "Conditions We Treat",
      heroTitle: "Helping you recover from a wide range of conditions",
      heroSubtitle:
        "From back pain and sports injuries to neurological conditions and post-surgical recovery, our team treats the whole person — not just the symptoms.",
      heroImage: IMAGES.backCare,
    },
    "Conditions We Treat in Brampton | Next Step Physio & Rehab Clinic",
    "Back pain, neck pain, sciatica, arthritis, sports injuries, concussion, plantar fasciitis and more — see the conditions treated at Next Step Physio & Rehab Clinic.",
  ),
  simplePage(
    "our-team",
    "Our Team",
    "/our-team",
    {
      heroEyebrow: "Our Team",
      heroTitle: "Meet the people behind your recovery",
      heroSubtitle:
        "Each member of our team brings unique skills, experience and a passion for helping you on your journey to recovery and better health.",
      heroImage: IMAGES.balance,
    },
    "Our Team | Registered Physiotherapists in Brampton | Next Step",
    "Meet the registered physiotherapists and practitioners at Next Step Physio & Rehab Clinic in Brampton.",
  ),
  simplePage(
    "testimonials",
    "Testimonials",
    "/testimonials",
    {
      heroEyebrow: "Testimonials",
      heroTitle: "What our patients say",
      heroSubtitle: "Real feedback from the people we care for. Your experience helps others take their next step.",
      heroImage: IMAGES.handsCare,
    },
    "Patient Testimonials | Next Step Physio & Rehab Clinic Brampton",
    "Read reviews from patients of Next Step Physio & Rehab Clinic in Brampton, and share your own experience.",
  ),
  simplePage(
    "blog",
    "Blog",
    "/blog",
    {
      heroEyebrow: "Latest News & Research",
      heroTitle: "Insights for a healthier, more active life",
      heroSubtitle:
        "Practical guides on physiotherapy, massage therapy, chiropractic care and recovery from our Brampton clinic.",
      heroImage: IMAGES.resistanceBand,
    },
    "Physiotherapy Blog & Health Tips | Next Step Physio & Rehab Clinic",
    "Health tips and guides on physiotherapy, massage therapy, chiropractic care, acupuncture and injury recovery from Next Step Physio & Rehab Clinic in Brampton.",
  ),
  simplePage(
    "faq",
    "FAQ",
    "/faq",
    {
      heroEyebrow: "FAQ",
      heroTitle: "Frequently asked questions",
      heroSubtitle: "Answers to common questions about physiotherapy, billing and what to expect at Next Step Physio & Rehab Clinic.",
      heroImage: IMAGES.consultation,
    },
    "Physiotherapy FAQ | Next Step Physio & Rehab Clinic Brampton",
    "Answers to common questions about physiotherapy, referrals, insurance coverage and appointments at Next Step Physio & Rehab Clinic in Brampton.",
  ),
  simplePage(
    "contact",
    "Contact",
    "/contact",
    {
      heroEyebrow: "Contact Us",
      heroTitle: "We're here to help",
      heroSubtitle:
        "Whether you have questions about our services, want to discuss your condition or need help booking, our team is happy to help.",
      heroImage: IMAGES.consultation,
      formTitle: "Send us a message",
      formIntro: "Fill out the form and a member of our team will get back to you as soon as possible.",
    },
    "Contact Next Step Physio & Rehab Clinic | Brampton, ON",
    "Contact Next Step Physio & Rehab Clinic at 9886 Torbram Rd Unit 109, Brampton. Call +1 (647) 872-8105 or send us a message.",
    [
      {
        title: "Contact form",
        fields: [
          { name: "formTitle", label: "Form heading", type: "text", wide: true },
          { name: "formIntro", label: "Form introduction", type: "textarea", rows: 2, wide: true },
        ],
      },
    ],
  ),
  simplePage(
    "book-appointment",
    "Book Appointment",
    "/book-appointment",
    {
      heroEyebrow: "Book an Appointment",
      heroTitle: "Request your appointment",
      heroSubtitle:
        "Tell us a little about what you need and your preferred time. Our team will contact you to confirm your appointment.",
      heroImage: IMAGES.physiotherapy,
      note: "Submitting this form is a request, not a confirmed booking. We will call or email you to confirm. For urgent medical concerns, please call 911 or visit your nearest emergency department.",
    },
    "Book a Physiotherapy Appointment in Brampton | Next Step Physio",
    "Request a physiotherapy, massage, chiropractic or acupuncture appointment at Next Step Physio & Rehab Clinic in Brampton. Direct billing available.",
    [
      {
        title: "Booking notes",
        fields: [{ name: "note", label: "Note shown under the form", type: "textarea", rows: 3, wide: true }],
      },
    ],
  ),
];

export function getPageDefinition(key: string): PageDefinition | undefined {
  return PAGE_DEFINITIONS.find((p) => p.key === key);
}

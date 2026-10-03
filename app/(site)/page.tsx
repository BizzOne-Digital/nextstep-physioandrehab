import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import {
  AboutPreview, AppointmentSection, BlogPreview, ConditionsPreview, FAQPreview, ServicesShowcase, TeamPreview, TestimonialsPreview,
} from "@/components/home/sections";
import { CTASection, ClinicInfo, HowItWorks, InsurersSection, TrustBar, WhyChoose } from "@/components/site/sections";
import {
  getConditions, getFaqs, getPageContent, getPublishedPosts, getServices, getSiteSettings, getTeam, getTestimonials,
} from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { resolveImage } from "@/lib/images";

export const revalidate = 300;

interface HomeContent {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBadges: string[];
  heroImage: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  aboutPoints: string[];
  aboutImage: string;
  aboutSecondaryImage: string;
  ctaTitle: string;
  ctaBody: string;
  ctaImage: string;
  appointmentTitle: string;
  appointmentBody: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<HomeContent>("home");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/", image: page.content.heroImage });
}

export default async function HomePage() {
  const [page, settings, services, conditions, team, testimonials, faqs, posts] = await Promise.all([
    getPageContent<HomeContent>("home"),
    getSiteSettings(),
    getServices(),
    getConditions(),
    getTeam(),
    getTestimonials(),
    getFaqs(),
    getPublishedPosts(),
  ]);
  const c = page.content;
  const openDays = settings.hours.filter((h) => !h.closed).length;
  const featuredConditions = conditions.filter((x) => x.featured).slice(0, 8);

  return (
    <>
      <HeroSection
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        highlight={c.heroHighlight}
        subtitle={c.heroSubtitle}
        primaryCta={c.heroPrimaryCta}
        secondaryCta={c.heroSecondaryCta}
        badges={c.heroBadges ?? []}
        image={resolveImage(c.heroImage)}
        openDaysLabel={`Open ${openDays} days a week`}
      />
      <TrustBar />
      <ServicesShowcase services={services} />
      <AboutPreview
        eyebrow={c.aboutEyebrow}
        title={c.aboutTitle}
        body={c.aboutBody}
        points={c.aboutPoints ?? []}
        image={c.aboutImage}
        secondaryImage={c.aboutSecondaryImage}
        stats={[
          { value: services.length, label: "Specialized services" },
          { value: Math.floor(conditions.length / 10) * 10, suffix: "+", label: "Conditions treated" },
          { value: settings.insurers.length, suffix: "+", label: "Direct billing partners" },
          { value: openDays, label: "Days open each week" },
        ]}
      />
      <WhyChoose />
      <ConditionsPreview conditions={featuredConditions.length ? featuredConditions : conditions.slice(0, 8)} total={Math.floor(conditions.length / 10) * 10} />
      <HowItWorks />
      <CTASection title={c.ctaTitle} body={c.ctaBody} image={c.ctaImage} phone={settings.phone} />
      <TeamPreview team={team} />
      <TestimonialsPreview testimonials={testimonials} />
      <FAQPreview faqs={faqs.filter((f) => f.showOnHome).slice(0, 5)} />
      <BlogPreview posts={posts} />
      <InsurersSection settings={settings} tone="tinted" />
      <AppointmentSection title={c.appointmentTitle} body={c.appointmentBody} settings={settings} services={services} />
      <ClinicInfo settings={settings} />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ConditionsExplorer } from "@/components/site/ConditionsExplorer";
import { AppointmentBanner, HowItWorks } from "@/components/site/sections";
import { ButtonLink } from "@/components/ui/Button";
import { CONDITION_CATEGORIES } from "@/content/conditions";
import { getConditions, getPageContent, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("conditions");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/conditions", image: page.content.heroImage });
}

export default async function ConditionsPage() {
  const [page, conditions, settings] = await Promise.all([getPageContent<Content>("conditions"), getConditions(), getSiteSettings()]);
  const c = page.content;

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        image={c.heroImage}
        imageAlt="Therapist treating a patient's back"
        crumbs={[{ label: "Conditions", href: "/conditions" }]}
      >
        <ButtonLink href="/book-appointment">Book an Assessment</ButtonLink>
      </PageHero>
      <section className="section pt-10" aria-label="Conditions list">
        <div className="container-site">
          <ConditionsExplorer conditions={conditions} categories={[...CONDITION_CATEGORIES]} />
        </div>
      </section>
      <HowItWorks />
      <AppointmentBanner
        title="Don't see your condition listed?"
        body="We treat many more concerns than we can list here. Contact us and our team will let you know how we can help."
        settings={settings}
      />
    </>
  );
}

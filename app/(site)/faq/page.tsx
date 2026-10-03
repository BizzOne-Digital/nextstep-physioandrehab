import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FAQAccordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { AppointmentBanner } from "@/components/site/sections";
import { getFaqs, getPageContent, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { faqSchema } from "@/lib/structured-data";
import { phoneHref } from "@/lib/utils";

export const revalidate = 300;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("faq");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/faq", image: page.content.heroImage });
}

export default async function FAQPage() {
  const [page, faqs, settings] = await Promise.all([getPageContent<Content>("faq"), getFaqs(), getSiteSettings()]);
  const c = page.content;
  const groups = [...new Set(faqs.map((f) => f.category || "General"))].map((cat) => ({
    cat,
    items: faqs.filter((f) => (f.category || "General") === cat),
  }));

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} subtitle={c.heroSubtitle} image={c.heroImage} imageAlt="Clinician answering a patient's questions" crumbs={[{ label: "FAQ", href: "/faq" }]} />
      <section className="section" aria-label="Questions and answers">
        <div className="container-site grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <nav aria-label="FAQ topics" className="rounded-[1.5rem] bg-sky-50 p-6 ring-1 ring-line">
              <p className="font-display font-bold text-navy-900">Topics</p>
              <ul className="mt-3 space-y-1">
                {groups.map((g) => (
                  <li key={g.cat}>
                    <a href={`#${g.cat.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="block rounded-xl px-3 py-2 text-sm font-medium text-navy-900 hover:bg-white hover:text-teal-700">
                      {g.cat}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-5 rounded-[1.5rem] bg-navy-900 p-6 text-white">
              <p className="font-display text-lg font-bold">Still have a question?</p>
              <p className="mt-2 text-sm text-white/70">Our front desk team can help with coverage, referrals and booking.</p>
              <a href={phoneHref(settings.phone)} className="mt-4 flex items-center gap-2 font-semibold text-teal-400 hover:text-white">
                <Phone className="size-4" aria-hidden="true" /> {settings.phone}
              </a>
              <ButtonLink href="/contact" size="sm" className="mt-4">
                Send a message
              </ButtonLink>
            </div>
          </aside>
          <div className="space-y-12">
            {groups.map((g) => (
              <Reveal key={g.cat}>
                <h2 id={g.cat.toLowerCase().replace(/[^a-z]+/g, "-")} className="mb-5 text-2xl font-bold">
                  {g.cat}
                </h2>
                <FAQAccordion items={g.items} defaultOpen={null} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <AppointmentBanner title="Ready to get started?" body="No referral is needed. Request an appointment and our team will contact you to confirm." settings={settings} />
    </>
  );
}

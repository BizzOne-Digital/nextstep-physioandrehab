import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/cards";
import { AppointmentBanner, HowItWorks, InsurersSection } from "@/components/site/sections";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ui/Icon";
import { getPageContent, getServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("services");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/services", image: page.content.heroImage });
}

export default async function ServicesPage() {
  const [page, services, settings] = await Promise.all([getPageContent<Content>("services"), getServices(), getSiteSettings()]);
  const c = page.content;

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        image={c.heroImage}
        imageAlt="Physiotherapist assessing a patient's knee"
        crumbs={[{ label: "Services", href: "/services" }]}
      >
        <nav aria-label="Jump to a service">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-navy-900 ring-1 ring-line transition-colors hover:text-teal-700 hover:ring-teal-500/40"
                >
                  <ServiceIcon name={s.icon} className="size-4 text-teal-600" />
                  {s.shortTitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section className="section" aria-label="All services">
        <div className="container-site">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 90} className="min-w-0">
                <div id={s.slug} className="h-full">
                  <ServiceCard service={s} priority={i < 3} />
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-14 flex flex-col items-center gap-4 rounded-[2rem] bg-sky-50 p-8 text-center ring-1 ring-line sm:p-10">
            <p className="font-display text-2xl font-bold text-navy-900">Not sure which service is right for you?</p>
            <p className="max-w-xl text-muted">
              Start with an assessment. Our team will look at the whole picture and recommend the treatment that fits your needs.
            </p>
            <ButtonLink href="/book-appointment">Book an Assessment</ButtonLink>
          </Reveal>
        </div>
      </section>

      <HowItWorks />
      <InsurersSection settings={settings} />
      <AppointmentBanner
        title="Ready to start your recovery?"
        body="Request an appointment online and our team will contact you to confirm a time that suits you."
        settings={settings}
      />
    </>
  );
}

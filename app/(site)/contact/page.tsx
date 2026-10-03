import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ClinicInfo } from "@/components/site/sections";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { getPageContent, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  formTitle: string;
  formIntro: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("contact");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/contact", image: page.content.heroImage });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPageContent<Content>("contact"), getSiteSettings()]);
  const c = page.content;

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} subtitle={c.heroSubtitle} image={c.heroImage} imageAlt="Clinician speaking with a patient" crumbs={[{ label: "Contact", href: "/contact" }]} />
      <section className="section" aria-labelledby="form-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <Reveal className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-10">
            <Eyebrow>Get in touch</Eyebrow>
            <h2 id="form-heading" className="display-md mt-4">
              {c.formTitle}
            </h2>
            <p className="mb-8 mt-3 text-muted">{c.formIntro}</p>
            <ContactForm />
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-5">
            <div className="rounded-[2rem] bg-gradient-to-br from-teal-700 to-navy-900 p-8 text-white">
              <CalendarCheck className="size-8 text-teal-400" aria-hidden="true" />
              <p className="mt-4 font-display text-2xl font-bold">Looking to book?</p>
              <p className="mt-2 leading-relaxed text-white/75">Use our appointment request form and we&apos;ll contact you to confirm a time.</p>
              <ButtonLink href="/book-appointment" variant="white" className="mt-6">
                Request an appointment
              </ButtonLink>
            </div>
            <div className="rounded-[2rem] bg-sky-50 p-8 ring-1 ring-line">
              <p className="font-display text-lg font-bold text-navy-900">Please note</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This form is not for medical emergencies. If you need urgent care, call 911 or visit your nearest emergency department.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <ClinicInfo settings={settings} />
    </>
  );
}

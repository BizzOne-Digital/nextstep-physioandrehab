import type { Metadata } from "next";
import { CheckCircle2, Clock, CreditCard, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { InsurersSection } from "@/components/site/sections";
import { Reveal } from "@/components/ui/Reveal";
import { getPageContent, getServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { formatTime, phoneHref } from "@/lib/utils";

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  note: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("book-appointment");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/book-appointment", image: page.content.heroImage });
}

export default async function BookAppointmentPage({ searchParams }: PageProps<"/book-appointment">) {
  const sp = await searchParams;
  const [page, services, settings] = await Promise.all([getPageContent<Content>("book-appointment"), getServices(), getSiteSettings()]);
  const c = page.content;
  const requested = typeof sp.service === "string" ? sp.service : "";
  const defaultService = services.find((s) => s.shortTitle === requested)?.shortTitle ?? "";

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} subtitle={c.heroSubtitle} crumbs={[{ label: "Book Appointment", href: "/book-appointment" }]} />
      <section className="pb-20 pt-4 lg:pb-28" aria-label="Appointment request">
        <div className="container-site grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
          <Reveal className="rounded-[2rem] border border-line bg-white p-6 shadow-lift sm:p-10">
            <h2 className="display-md">Your details</h2>
            <p className="mb-8 mt-2 text-muted">It only takes a minute. We&apos;ll call or email you to confirm.</p>
            <AppointmentForm services={services} defaultService={defaultService} phone={settings.phone} />
            {c.note && <p className="mt-8 rounded-2xl bg-sky-50 p-4 text-sm leading-relaxed text-muted">{c.note}</p>}
          </Reveal>
          <Reveal delay={100} as="aside" className="space-y-5 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[2rem] bg-navy-900 p-7 text-white">
              <p className="font-display text-xl font-bold">Prefer to call?</p>
              <a href={phoneHref(settings.phone)} className="mt-3 flex items-center gap-2 font-display text-2xl font-bold text-teal-400 hover:text-white">
                <Phone className="size-5" aria-hidden="true" /> {settings.phone}
              </a>
              <dl className="mt-6 space-y-1.5 border-t border-white/10 pt-5 text-sm">
                {settings.hours.map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <dt className="text-white/65">{h.day}</dt>
                    <dd>{h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className="space-y-3 rounded-[2rem] bg-sky-50 p-7 ring-1 ring-line">
              {[
                { icon: CheckCircle2, t: "No doctor's referral needed" },
                { icon: CreditCard, t: "Direct billing with many insurers" },
                { icon: Clock, t: "Immediate appointments often available" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 font-medium text-navy-900">
                  <Icon className="size-5 shrink-0 text-teal-600" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <InsurersSection settings={settings} tone="tinted" />
    </>
  );
}

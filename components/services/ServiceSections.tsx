import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, CheckCircle2, Info, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/Accordion";
import { ServiceIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ServiceTile } from "@/components/site/cards";
import { resolveImage } from "@/lib/images";
import { cn, phoneHref } from "@/lib/utils";
import type { ServiceItem } from "@/types";

export function ServiceHero({ service, phone }: { service: ServiceItem; phone: string }) {
  return (
    <section className="bg-soft-gradient relative overflow-hidden">
      <div className="container-site grid items-center gap-10 pb-14 pt-8 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-14">
        <div>
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.shortTitle, href: `/services/${service.slug}` }]} />
          <Reveal className="mt-6">
            <span className="inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-teal-800 shadow-soft ring-1 ring-line">
              <span className="grid size-8 place-items-center rounded-full bg-teal-700 text-white">
                <ServiceIcon name={service.icon} className="size-4" />
              </span>
              {service.tagline}
            </span>
            <h1 className="display-lg mt-5 text-balance">{service.title}</h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{service.excerpt}</p>
          </Reveal>
          <Reveal delay={120} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/book-appointment?service=${encodeURIComponent(service.shortTitle)}`} size="lg">
              <CalendarCheck className="size-5" aria-hidden="true" /> Book {service.shortTitle}
            </ButtonLink>
            <a
              href={phoneHref(phone)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-navy-900/15 bg-white px-8 font-semibold text-navy-900 transition-colors hover:border-teal-500 hover:text-teal-700"
            >
              <Phone className="size-5" aria-hidden="true" /> {phone}
            </a>
          </Reveal>
        </div>
        <div className="relative">
          <div className="absolute -bottom-5 -left-5 hidden size-36 rounded-[2rem] bg-gradient-to-br from-teal-500 to-teal-700 sm:block" aria-hidden="true" />
          <Reveal imageReveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
            <Image src={resolveImage(service.image)} alt={`${service.shortTitle} at Next Step Physio & Rehab Clinic`} fill priority sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function OverviewSplit({ service, reverse = false }: { service: ServiceItem; reverse?: boolean }) {
  return (
    <section className="section" aria-labelledby="overview-heading">
      <div className={cn("container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16", reverse && "lg:grid-cols-[0.8fr_1.2fr]")}>
        <Reveal className={reverse ? "lg:order-2" : undefined}>
          <Eyebrow>Overview</Eyebrow>
          <h2 id="overview-heading" className="display-md mt-4 text-balance">
            {service.tagline}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {service.overview.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className={cn("self-start rounded-[1.75rem] bg-navy-900 p-7 text-white lg:sticky lg:top-32", reverse && "lg:order-1")}>
          <h3 className="font-display text-lg font-bold text-white">What to expect</h3>
          <ul className="mt-5 space-y-3.5">
            {service.expectations.map((e) => (
              <li key={e} className="flex gap-3 text-white/85">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-400" aria-hidden="true" />
                {e}
              </li>
            ))}
          </ul>
          <ButtonLink href="/book-appointment" className="mt-7 w-full">
            Book an assessment
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function OverviewFeature({ service }: { service: ServiceItem }) {
  return (
    <section className="section" aria-labelledby="overview-heading">
      <div className="container-site">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Overview</Eyebrow>
          <h2 id="overview-heading" className="display-md mt-4 text-balance">
            {service.tagline}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {service.overview.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function BenefitsGrid({ service, title, eyebrow = "Benefits", tone = "tinted" }: { service: ServiceItem; title: string; eyebrow?: string; tone?: "tinted" | "white" }) {
  if (!service.benefits.length) return null;
  return (
    <section className={cn("section", tone === "tinted" && "bg-sky-50")} aria-labelledby="benefits-heading">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} title={<span id="benefits-heading">{title}</span>} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={(i % 3) * 90} className="group rounded-[1.75rem] border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <span className="font-display text-sm font-bold text-teal-600">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{b.description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BenefitsList({ service, title }: { service: ServiceItem; title: string }) {
  if (!service.benefits.length) return null;
  return (
    <section className="section bg-gradient-to-b from-aqua-50 to-white" aria-labelledby="benefits-heading">
      <div className="container-site grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32">
          <SectionHeading align="left" eyebrow="Key Benefits" title={<span id="benefits-heading">{title}</span>} />
          <Reveal delay={100} className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card lg:block">
            <Image src={resolveImage(service.image)} alt="" fill sizes="480px" className="object-cover" />
          </Reveal>
        </div>
        <ul className="space-y-4">
          {service.benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 60} className="flex gap-5 rounded-[1.5rem] bg-white p-6 shadow-card ring-1 ring-line">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white">
                <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span>
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{b.description}</p>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProductOptions({ service }: { service: ServiceItem }) {
  if (!service.benefits.length) return null;
  return (
    <section className="section bg-sky-50" aria-labelledby="options-heading">
      <div className="container-site">
        <SectionHeading
          eyebrow={service.layout === "product" && service.slug === "braces-clinic" ? "Bracing Options" : "How It Helps"}
          title={<span id="options-heading">{service.slug === "braces-clinic" ? "Support for every joint" : `Why choose ${service.shortTitle.toLowerCase()}`}</span>}
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={(i % 3) * 90} className="relative overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-card ring-1 ring-line">
              <div className="absolute -right-8 -top-8 size-28 rounded-full bg-mint-100" aria-hidden="true" />
              <span className="relative grid size-12 place-items-center rounded-2xl bg-navy-900 text-teal-400">
                <ServiceIcon name={service.icon} className="size-5" />
              </span>
              <h3 className="relative mt-5 text-lg font-bold">{b.title}</h3>
              <p className="relative mt-2 leading-relaxed text-muted">{b.description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhoAndConditions({ service }: { service: ServiceItem }) {
  return (
    <section className="section" aria-label="Who this treatment may help">
      <div className="container-site grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-[2rem] bg-gradient-to-br from-mint-100 to-aqua-50 p-8 ring-1 ring-teal-500/15 sm:p-10">
          <h2 className="display-md">Who this treatment may help</h2>
          <ul className="mt-7 space-y-4">
            {service.whoItHelps.map((w) => (
              <li key={w} className="flex gap-3 font-medium text-navy-900">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120} className="rounded-[2rem] border border-line bg-white p-8 shadow-card sm:p-10">
          <h2 className="display-md">Conditions treated</h2>
          <p className="mt-3 text-muted">Common concerns we help with through {service.shortTitle.toLowerCase()}:</p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {service.conditions.map((c) => (
              <li key={c} className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-navy-800 ring-1 ring-line">
                {c}
              </li>
            ))}
          </ul>
          <Link href="/conditions" className="mt-7 inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-800">
            See all conditions we treat <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ProcessTimeline({ service, title = "Your treatment process" }: { service: ServiceItem; title?: string }) {
  if (!service.process.length) return null;
  return (
    <section className="section bg-navy-900" aria-labelledby="process-heading">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading light align="left" eyebrow="Step by Step" title={<span id="process-heading">{title}</span>} description="A clear, collaborative process from your first visit to your recovery goals." />
        <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-7 before:top-6 before:w-px before:bg-white/15">
          {service.process.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90} className="relative flex gap-5">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 font-display text-lg font-bold text-white ring-8 ring-navy-900">
                {i + 1}
              </span>
              <div className="flex-1 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 leading-relaxed text-white/70">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProcessSteps({ service, title }: { service: ServiceItem; title: string }) {
  if (!service.process.length) return null;
  return (
    <section className="section" aria-labelledby="steps-heading">
      <div className="container-site">
        <SectionHeading eyebrow="The Process" title={<span id="steps-heading">{title}</span>} />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90} className="relative rounded-[1.75rem] border border-line bg-white p-7 shadow-card">
              <span className="font-display text-5xl font-extrabold text-mint-100">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.description}</p>
              {i < service.process.length - 1 && (
                <ArrowRight className="absolute -right-4 top-1/2 hidden size-7 -translate-y-1/2 rounded-full bg-white p-1.5 text-teal-600 shadow-soft ring-1 ring-line lg:block" aria-hidden="true" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HighlightBox({ service, emphasis = false }: { service: ServiceItem; emphasis?: boolean }) {
  if (!service.highlight?.title || !service.highlight.body?.length) return null;
  return (
    <section className={cn(emphasis ? "pb-4 pt-16" : "py-10")} aria-labelledby="highlight-heading">
      <div className="container-site">
        <Reveal className={cn("flex flex-col gap-5 rounded-[2rem] p-8 sm:flex-row sm:p-10", emphasis ? "bg-gradient-to-br from-teal-700 to-navy-900 text-white" : "bg-mint-100")}>
          <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl", emphasis ? "bg-white/10 text-teal-400" : "bg-white text-teal-700")}>
            <Info className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 id="highlight-heading" className={cn("text-2xl font-bold", emphasis && "text-white")}>
              {service.highlight.title}
            </h2>
            <div className={cn("mt-3 space-y-3 leading-relaxed", emphasis ? "text-white/80" : "text-navy-800")}>
              {service.highlight.body.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ExpectationCards({ service }: { service: ServiceItem }) {
  if (!service.expectations.length) return null;
  return (
    <section className="section bg-sky-50" aria-labelledby="expect-heading">
      <div className="container-site">
        <SectionHeading eyebrow="Your Visit" title={<span id="expect-heading">What to expect</span>} />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {service.expectations.map((e, i) => (
            <Reveal as="li" key={e} delay={i * 70} className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
              <CheckCircle2 className="size-6 shrink-0 text-teal-600" aria-hidden="true" />
              <span className="font-medium text-navy-900">{e}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceFAQ({ service }: { service: ServiceItem }) {
  if (!service.faqs.length) return null;
  return (
    <section className="section" aria-labelledby="service-faq-heading">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading align="left" eyebrow="FAQ" title={<span id="service-faq-heading">{service.shortTitle} questions</span>} description="Can't find your answer? Call us — we're happy to help." />
        <Reveal delay={80}>
          <FAQAccordion items={service.faqs} tone="tinted" />
        </Reveal>
      </div>
    </section>
  );
}

export function RelatedServices({ services }: { services: ServiceItem[] }) {
  if (!services.length) return null;
  return (
    <section className="section bg-sky-50" aria-labelledby="related-heading">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading align="left" eyebrow="Related Services" title={<span id="related-heading">Care that works together</span>} />
          <ButtonLink href="/services" variant="outline">
            All services <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 70} className="min-w-0">
              <ServiceTile service={s} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

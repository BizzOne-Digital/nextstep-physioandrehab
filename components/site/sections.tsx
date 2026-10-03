import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight, BadgeCheck, Building2, CalendarCheck, ClipboardCheck, Clock, CreditCard, HeartHandshake,
  Mail, MapPin, MessageSquare, Phone, ShieldCheck, Smile, Sparkles, Target, UserRound, Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { MapEmbed } from "@/components/site/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveImage } from "@/lib/images";
import { cn, formatTime, phoneHref } from "@/lib/utils";
import type { SiteSettings } from "@/types";

/* -------------------------------- CTA banner -------------------------------- */
export function CTASection({
  title,
  body,
  image,
  phone,
}: {
  title: string;
  body: string;
  image: string;
  phone: string;
}) {
  return (
    <section className="container-site py-8 sm:py-12" aria-labelledby="cta-heading">
      <Reveal direction="zoom" className="relative isolate overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-14 sm:px-12 lg:rounded-[2.5rem] lg:px-16 lg:py-20">
        <Image src={resolveImage(image)} alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-900/40" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-teal-400/25 blur-3xl" aria-hidden="true" />
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="display-md text-balance text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book-appointment" size="lg">
              <CalendarCheck className="size-5" aria-hidden="true" /> Schedule an Appointment
            </ButtonLink>
            <a
              href={phoneHref(phone)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-8 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Phone className="size-5" aria-hidden="true" /> {phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ Direct billing ------------------------------ */
export function InsurersSection({ settings, tone = "white" }: { settings: SiteSettings; tone?: "white" | "tinted" }) {
  const insurers = settings.insurers.filter((i) => i.name);
  if (!insurers.length) return null;
  const loop = [...insurers, ...insurers];
  return (
    <section className={cn("section overflow-hidden", tone === "tinted" && "bg-sky-50")} aria-labelledby="billing-heading">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0">
          <SectionHeading
            align="left"
            eyebrow="Approved Facility"
            title={<span id="billing-heading">Direct billing to your insurance</span>}
            description="We are an approved facility and bill many insurance providers directly, so you can focus on your recovery rather than paperwork."
          />
          <Reveal delay={100}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { icon: CreditCard, text: "Direct billing with many providers" },
                { icon: ShieldCheck, text: "Motor vehicle accident claims" },
                { icon: Building2, text: "WSIB workplace injury claims" },
                { icon: ClipboardCheck, text: "Help checking your coverage" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-sm font-medium text-navy-900 ring-1 ring-line">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-teal-700">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">
              Coverage varies by plan. Contact us and we will help confirm your benefits before your visit.
            </p>
          </Reveal>
        </div>
        <Reveal delay={150} className="relative min-w-0">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white p-4 shadow-card sm:p-6">
            <p className="sr-only">Insurance providers we direct bill: {insurers.map((i) => i.name).join(", ")}.</p>
            <div className="flex overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" aria-hidden="true">
                <ul className="flex w-max shrink-0 gap-4 animate-marquee hover:[animation-play-state:paused]">
                  {loop.map((ins, i) => (
                    <li key={`${ins.name}-${i}`} className="grid h-20 w-40 shrink-0 place-items-center rounded-2xl border border-line bg-white px-4">
                      {ins.logo ? (
                        <Image src={resolveImage(ins.logo)} alt="" width={128} height={56} className="max-h-12 w-auto object-contain" />
                      ) : (
                        <span className="text-center text-sm font-semibold text-navy-800">{ins.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
            </div>
            <p className="mt-3 text-center text-xs text-muted">{insurers.length}+ insurance providers and benefit plans</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ How it works -------------------------------- */
const STEPS = [
  { icon: CalendarCheck, title: "Book Appointment", text: "Reach out by phone or request an appointment through our website." },
  { icon: MessageSquare, title: "Get Consultation", text: "Talk with our team about your concerns and schedule your assessment." },
  { icon: UserRound, title: "Meet Your Therapist", text: "Visit us for a one-on-one assessment and a personalized treatment plan." },
  { icon: Sparkles, title: "Begin Your Recovery", text: "Start treatment, track your progress and enjoy a life of well-being." },
];

export function HowItWorks() {
  return (
    <section className="section relative overflow-hidden bg-navy-900" aria-labelledby="how-heading">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-[0.07] invert" aria-hidden="true" />
      <div className="absolute -left-32 top-1/2 size-96 -translate-y-1/2 rounded-full bg-teal-500/15 blur-3xl" aria-hidden="true" />
      <div className="container-site relative">
        <SectionHeading
          light
          eyebrow="How It Works"
          title={<span id="how-heading">Easy steps to start your care</span>}
          description="Getting started is simple. We put your health first, from easy booking to a treatment plan built around you."
        />
        <div className="relative mt-14">
        <div className="absolute left-[12%] right-[12%] top-[4.25rem] hidden h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent lg:block" aria-hidden="true" />
        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 110} className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
              <div className="flex items-center justify-between">
                <span className="relative grid size-20 place-items-center rounded-full bg-navy-800 ring-8 ring-navy-900">
                  <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white">
                    <step.icon className="size-6" aria-hidden="true" />
                  </span>
                </span>
                <span className="font-display text-4xl font-extrabold text-white/10">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-white/70">{step.text}</p>
            </Reveal>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Why choose -------------------------------- */
const REASONS = [
  { icon: Target, title: "Personalized Treatment", text: "Tailored care that considers your unique needs and circumstances for an effective, targeted recovery." },
  { icon: BadgeCheck, title: "Licensed Therapists", text: "Registered professionals who bring training, skill and genuine care to every session." },
  { icon: ClipboardCheck, title: "Goal-Oriented Care", text: "Clear therapy goals set with you, with progress reviewed and plans adjusted as you improve." },
  { icon: Building2, title: "Modern, Comfortable Clinic", text: "A welcoming space with modern tools and technology to support your treatment." },
  { icon: CreditCard, title: "Direct Billing", text: "We bill many insurance providers directly to keep things simple for you." },
  { icon: HeartHandshake, title: "Patient-Centred Approach", text: "Honest, compassionate care built on trust, with time to listen and explain." },
];

export function WhyChoose({ tone = "white" }: { tone?: "white" | "tinted" }) {
  return (
    <section className={cn("section", tone === "tinted" && "bg-sky-50")} aria-labelledby="why-heading">
      <div className="container-site">
        <SectionHeading
          eyebrow="Why Choose Next Step"
          title={<span id="why-heading">We don&apos;t just help you feel good. We help you get better.</span>}
          description="Our commitment goes beyond short-term relief — we focus on your long-term health, function and quality of life."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal as="li" key={r.title} delay={(i % 3) * 100} className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-card">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-mint-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-50 text-teal-700 ring-1 ring-teal-500/15">
                <r.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 text-lg font-bold">{r.title}</h3>
              <p className="relative mt-2 leading-relaxed text-muted">{r.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------ Trust benefits ------------------------------ */
const TRUST = [
  { icon: Users, title: "Experienced Therapists", text: "Licensed, skilled and caring" },
  { icon: Smile, title: "Personalized Care", text: "Plans built around your goals" },
  { icon: CreditCard, title: "Direct Billing", text: "With many insurance providers" },
  { icon: Building2, title: "Modern Facility", text: "Comfortable, well-equipped clinic" },
];

export function TrustBar() {
  return (
    <section aria-label="Key benefits" className="relative z-10 -mt-10 sm:-mt-14">
      <div className="container-site">
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-line shadow-lift ring-1 ring-line lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex flex-col items-start gap-3 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mint-100 text-teal-700">
                <t.icon className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display font-bold text-navy-900">{t.title}</span>
                <span className="block text-sm text-muted">{t.text}</span>
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- Clinic info ------------------------------- */
export function ClinicInfo({ settings, heading = true }: { settings: SiteSettings; heading?: boolean }) {
  const a = settings.address;
  const cards = [
    {
      icon: MapPin,
      title: "Visit our clinic",
      body: (
        <address className="not-italic">
          {a.street}
          {a.unit ? `, ${a.unit}` : ""}
          <br />
          {a.city}, {a.province} {a.postalCode}, {a.country}
        </address>
      ),
      action: settings.mapLink ? { href: settings.mapLink, label: "Get directions", external: true } : null,
    },
    {
      icon: Phone,
      title: "Give us a call",
      body: <p>{settings.phone}</p>,
      action: { href: phoneHref(settings.phone), label: "Call now", external: false },
    },
    {
      icon: Mail,
      title: "Send us an email",
      body: <p className="break-all">{settings.email}</p>,
      action: { href: `mailto:${settings.email}`, label: "Email us", external: false },
    },
  ];
  const mapOk = settings.mapEmbedUrl.startsWith("https://www.google.com/maps/embed");

  return (
    <section className="section bg-soft-gradient" aria-labelledby={heading ? "visit-heading" : undefined}>
      <div className="container-site">
        {heading && (
          <SectionHeading
            eyebrow="Clinic Information"
            title={<span id="visit-heading">Visit us in Brampton</span>}
            description="Conveniently located on Torbram Road with immediate appointments often available."
          />
        )}
        <div className={cn("grid gap-6 lg:grid-cols-[1fr_1.15fr]", heading && "mt-14")}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 80} className="flex flex-col rounded-[1.5rem] border border-line bg-white p-6 shadow-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-mint-100 text-teal-700">
                  <c.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                <div className="mt-1.5 flex-1 leading-relaxed text-muted">{c.body}</div>
                {c.action && (
                  <a
                    href={c.action.href}
                    {...(c.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800"
                  >
                    {c.action.label} <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                )}
              </Reveal>
            ))}
            <Reveal delay={240} className="rounded-[1.5rem] bg-navy-900 p-6 text-white shadow-card">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-teal-400">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">Opening hours</h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                {settings.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4 border-b border-white/10 pb-1.5 last:border-0">
                    <dt className="text-white/70">{h.day}</dt>
                    <dd className={h.closed ? "text-white/65" : "font-medium"}>
                      {h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal direction="zoom" className="min-h-[360px] overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card">
            {mapOk ? (
              <MapEmbed
                src={settings.mapEmbedUrl}
                title={`Map showing ${settings.clinicName}`}
                address={`${a.street}, ${a.unit ? a.unit + ", " : ""}${a.city}, ${a.province} ${a.postalCode}`}
                directionsUrl={settings.mapLink}
              />
            ) : (
              <div className="grid h-full place-items-center p-8 text-center text-muted">Map unavailable</div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Appointment ------------------------------- */
export function AppointmentBanner({ title, body, settings }: { title: string; body: string; settings: SiteSettings }) {
  return (
    <section className="section" aria-labelledby="appointment-heading">
      <div className="container-site">
        <Reveal className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-100 via-aqua-50 to-sky-50 p-8 ring-1 ring-teal-500/10 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:p-14">
          <div>
            <h2 id="appointment-heading" className="display-md text-balance">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{body}</p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/book-appointment" size="lg" className="w-full">
              <CalendarCheck className="size-5" aria-hidden="true" /> Book Appointment
            </ButtonLink>
            <a
              href={phoneHref(settings.phone)}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-8 font-semibold text-navy-900 shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <Phone className="size-5 text-teal-700" aria-hidden="true" /> {settings.phone}
            </a>
            <p className="text-center text-sm text-muted">
              No referral needed ·{" "}
              <Link href="/faq" className="font-medium text-teal-700 underline-offset-2 hover:underline">
                Questions?
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

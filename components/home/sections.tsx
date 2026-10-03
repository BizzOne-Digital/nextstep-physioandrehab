import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, MessageSquareHeart, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/Accordion";
import { BlogCard, ServiceCard, ServiceTile, TeamCard, TestimonialCard } from "@/components/site/cards";
import { StatsBand } from "@/components/home/StatsBand";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { resolveImage } from "@/lib/images";
import { formatTime, paragraphs, phoneHref } from "@/lib/utils";
import type { BlogPostItem, ConditionItem, FAQItem, ServiceItem, SiteSettings, TeamMemberItem, TestimonialItem } from "@/types";

export function ServicesShowcase({ services }: { services: ServiceItem[] }) {
  const featured = services.slice(0, 6);
  const rest = services.slice(6);
  return (
    <section className="section" aria-labelledby="services-heading">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our Services"
            title={<span id="services-heading">Care for every stage of your recovery</span>}
            description="A full range of physiotherapy and rehabilitation services, tailored to your goals — whether that's pain relief, injury recovery or better performance."
          />
          <Reveal delay={100}>
            <ButtonLink href="/services" variant="outline">
              View all services <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 100}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </ul>
        {rest.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 80} className="min-w-0">
                <ServiceTile service={s} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function AboutPreview({
  eyebrow,
  title,
  body,
  points,
  image,
  secondaryImage,
  stats,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  image: string;
  secondaryImage: string;
  stats: { value: number; suffix?: string; label: string }[];
}) {
  return (
    <section className="section bg-soft-gradient relative overflow-hidden" aria-labelledby="about-heading">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <Reveal imageReveal className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-[2rem] shadow-lift">
            <Image src={resolveImage(image)} alt="Clinician consulting with a patient" fill sizes="(min-width: 1024px) 460px, 80vw" className="object-cover" />
          </Reveal>
          <Reveal direction="right" delay={200} className="absolute -bottom-8 right-0 w-[55%]">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border-8 border-white shadow-lift">
              <Image src={resolveImage(secondaryImage)} alt="Therapist assessing a patient's shoulder" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="absolute -left-5 top-10 hidden rounded-2xl bg-white p-4 shadow-lift ring-1 ring-line sm:block">
            <p className="font-display text-sm font-bold text-navy-900">Drug-free, natural treatment</p>
            <p className="text-xs text-muted">Evidence-based, hands-on care</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="about-heading" className="display-lg mt-4 text-balance">
              {title}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {paragraphs(body).map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </Reveal>
          {points.length > 0 && (
            <Reveal delay={100}>
              <ul className="mt-7 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 font-medium text-navy-900">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          <Reveal delay={150} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/about">More about us</ButtonLink>
            <ButtonLink href="/our-team" variant="outline">
              Meet the team
            </ButtonLink>
          </Reveal>
        </div>
      </div>
      <div className="container-site mt-20">
        <StatsBand stats={stats} />
      </div>
    </section>
  );
}

export function ConditionsPreview({ conditions, total }: { conditions: ConditionItem[]; total: number }) {
  return (
    <section className="section" aria-labelledby="conditions-heading">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Conditions We Treat"
            title={<span id="conditions-heading">Whatever is holding you back, we can help</span>}
            description="Whether your condition came from a sports injury, a workplace accident or everyday wear and tear, our team is ready to assess and treat it."
          />
          <Reveal delay={100} className="mt-8">
            <ButtonLink href="/conditions">
              View all {total}+ conditions <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {conditions.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={(i % 2) * 90}>
              <Link
                href={`/conditions?q=${encodeURIComponent(c.name)}`}
                className="group flex h-full gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-card"
              >
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-mint-100 font-display text-sm font-bold text-teal-800 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{c.name}</span>
                  {c.description && <span className="mt-1 block text-sm leading-relaxed text-muted">{c.description}</span>}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TeamPreview({ team }: { team: TeamMemberItem[] }) {
  if (!team.length) return null;
  const single = team.length === 1;
  return (
    <section className="section bg-sky-50" aria-labelledby="team-heading">
      <div className="container-site">
        {single ? (
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal className="mx-auto w-full max-w-sm lg:max-w-md">
              <TeamCard member={team[0]} />
            </Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Meet the Team"
                title={<span id="team-heading">Care from people who listen</span>}
                description="Each member of our team brings a unique set of skills, experience and a passion for helping you on your journey to recovery and better health."
              />
              <Reveal delay={120}>
                <blockquote className="mt-8 rounded-[1.5rem] border-l-4 border-teal-500 bg-white p-6 text-lg leading-relaxed text-navy-800 shadow-card">
                  {team[0].shortBio}
                </blockquote>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={`/our-team/${team[0].slug}`}>Read {team[0].name}&apos;s profile</ButtonLink>
                  <ButtonLink href="/our-team" variant="outline">
                    Our team
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        ) : (
          <>
            <SectionHeading eyebrow="Meet the Team" title={<span id="team-heading">Care from people who listen</span>} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.slice(0, 3).map((m, i) => (
                <Reveal as="li" key={m.slug} delay={i * 100}>
                  <TeamCard member={m} />
                </Reveal>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

export function TestimonialsPreview({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section className="section" aria-labelledby="testimonials-heading">
      <div className="container-site">
        <SectionHeading
          eyebrow="Client Testimonials"
          title={<span id="testimonials-heading">Stories from our patients</span>}
          description="Your experience helps others take their next step toward better health."
        />
        {testimonials.length > 0 ? (
          <>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal as="li" key={t._id ?? i} delay={i * 100}>
                  <TestimonialCard testimonial={t} featured={i === 1} />
                </Reveal>
              ))}
            </ul>
            <div className="mt-10 flex justify-center gap-3">
              <ButtonLink href="/testimonials" variant="outline">
                Read all reviews
              </ButtonLink>
              <ButtonLink href="/testimonials#share-review">Add a review</ButtonLink>
            </div>
          </>
        ) : (
          <Reveal className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-br from-mint-100 to-aqua-50 p-10 text-center ring-1 ring-teal-500/15 sm:p-14">
            <span className="grid size-16 place-items-center rounded-2xl bg-white text-teal-700 shadow-soft">
              <MessageSquareHeart className="size-8" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-2xl font-bold">Have you visited us?</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted">
                We&apos;d love to hear about your experience. Share a review to help others in Brampton find the care they need.
              </p>
            </div>
            <ButtonLink href="/testimonials#share-review">Share your experience</ButtonLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function FAQPreview({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs.length) return null;
  return (
    <section className="section bg-sky-50" aria-labelledby="faq-heading">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title={<span id="faq-heading">Frequently asked questions</span>}
            description="Answers to common questions about physiotherapy, insurance and your first visit."
          />
          <Reveal delay={100} className="mt-8 rounded-[1.5rem] bg-navy-900 p-7 text-white">
            <p className="font-display text-lg font-bold">Still have questions?</p>
            <p className="mt-2 text-white/70">Our team is happy to help you understand your options and coverage.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="sm">
                Contact us
              </ButtonLink>
              <ButtonLink href="/faq" size="sm" variant="white">
                All FAQs
              </ButtonLink>
            </div>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <FAQAccordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}

export function BlogPreview({ posts }: { posts: BlogPostItem[] }) {
  if (!posts.length) return null;
  return (
    <section className="section" aria-labelledby="blog-heading">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Latest News & Research"
            title={<span id="blog-heading">Health tips from our clinic</span>}
            description="Stay informed with practical guides on recovery, pain management and staying active."
          />
          <Reveal delay={100}>
            <ButtonLink href="/blog" variant="outline">
              Read all articles <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 100} className={i === 2 ? "md:hidden lg:block" : undefined}>
              <BlogCard post={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AppointmentSection({
  title,
  body,
  settings,
  services,
}: {
  title: string;
  body: string;
  settings: SiteSettings;
  services: ServiceItem[];
}) {
  const weekday = settings.hours.find((h) => h.day === "Monday" && !h.closed);
  const saturday = settings.hours.find((h) => h.day === "Saturday" && !h.closed);
  return (
    <section className="section relative overflow-hidden bg-navy-900" id="book" aria-labelledby="book-heading">
      <div className="absolute -right-40 top-0 size-[520px] rounded-full bg-teal-500/15 blur-3xl" aria-hidden="true" />
      <div className="container-site relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="text-white">
          <SectionHeading light align="left" eyebrow="Book an Appointment" title={<span id="book-heading">{title}</span>} description={body} />
          <Reveal delay={100} as="ul" className="mt-10 space-y-5">
            <li className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-teal-400">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-white/60">Call us</span>
                <a href={phoneHref(settings.phone)} className="font-display text-xl font-bold hover:text-teal-400">
                  {settings.phone}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-teal-400">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-white/60">Email us</span>
                <a href={`mailto:${settings.email}`} className="break-all font-semibold hover:text-teal-400">
                  {settings.email}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-teal-400">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-white/60">Visit us</span>
                <span className="font-semibold">
                  {settings.address.street}, {settings.address.unit}, {settings.address.city}
                </span>
              </span>
            </li>
            {weekday && (
              <li className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-teal-400">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-white/60">Hours</span>
                  <span className="font-semibold">
                    Mon–Fri {formatTime(weekday.open)} – {formatTime(weekday.close)}
                    {saturday && (
                      <>
                        <br />
                        Sat {formatTime(saturday.open)} – {formatTime(saturday.close)}
                      </>
                    )}
                  </span>
                </span>
              </li>
            )}
          </Reveal>
        </div>
        <Reveal delay={120} className="rounded-[2rem] bg-white p-6 shadow-lift sm:p-10">
          <AppointmentForm services={services} phone={settings.phone} />
        </Reveal>
      </div>
    </section>
  );
}

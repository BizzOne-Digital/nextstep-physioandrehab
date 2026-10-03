import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2, Target, Users, Sparkles, HeartHandshake, Award } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection, InsurersSection, WhyChoose } from "@/components/site/sections";
import { TeamPreview } from "@/components/home/sections";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { getPageContent, getSiteSettings, getTeam } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { resolveImage } from "@/lib/images";
import { paragraphs } from "@/lib/utils";
import type { TitledText } from "@/types";

export const revalidate = 300;

interface AboutContent {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  introTitle: string;
  introBody: string;
  introImage: string;
  introSecondaryImage: string;
  missionTitle: string;
  missionPoints: string[];
  missionImage: string;
  differentiatorsTitle: string;
  differentiators: TitledText[];
}

const DIFF_ICONS = [Users, Award, Sparkles, Target, HeartHandshake];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<AboutContent>("about");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/about", image: page.content.heroImage });
}

export default async function AboutPage() {
  const [page, settings, team] = await Promise.all([getPageContent<AboutContent>("about"), getSiteSettings(), getTeam()]);
  const c = page.content;

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        image={c.heroImage}
        imageAlt="Physiotherapist assisting a patient with shoulder movement"
        crumbs={[{ label: "About Us", href: "/about" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book-appointment">Book Appointment</ButtonLink>
          <ButtonLink href="/our-team" variant="outline">
            Meet our team
          </ButtonLink>
        </div>
      </PageHero>

      {/* Introduction */}
      <section className="section" aria-labelledby="intro-heading">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Who we are</Eyebrow>
              <h2 id="intro-heading" className="display-lg mt-4 text-balance">
                {c.introTitle}
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                {paragraphs(c.introBody).map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100} className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { t: "Immediate appointments", d: "Often available, with no referral needed" },
                { t: "Drug-free, natural care", d: "Evidence-based and hands-on" },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl bg-sky-50 p-5 ring-1 ring-line">
                  <p className="font-display font-bold text-navy-900">{x.t}</p>
                  <p className="mt-1 text-sm text-muted">{x.d}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <Reveal imageReveal className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[2rem] shadow-lift sm:col-span-1 sm:row-span-2 sm:aspect-auto">
              <Image src={resolveImage(c.introImage)} alt="Clinician consulting with a patient" fill sizes="(min-width: 1024px) 300px, 100vw" className="object-cover" />
            </Reveal>
            <Reveal delay={150} className="relative hidden aspect-square overflow-hidden rounded-[2rem] shadow-card sm:block">
              <Image src={resolveImage(c.introSecondaryImage)} alt="Therapist assessing a patient's shoulder" fill sizes="300px" className="object-cover" />
            </Reveal>
            <Reveal delay={250} className="hidden flex-col justify-center rounded-[2rem] bg-gradient-to-br from-teal-600 to-teal-800 p-6 text-white sm:flex">
              <p className="font-display text-4xl font-extrabold">1:1</p>
              <p className="mt-1 text-sm text-white/80">One-on-one attention in every session</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section relative overflow-hidden bg-navy-900" aria-labelledby="mission-heading">
        <div className="absolute -left-40 top-0 size-[480px] rounded-full bg-teal-500/15 blur-3xl" aria-hidden="true" />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal imageReveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src={resolveImage(c.missionImage)} alt="Therapist supporting a patient's resistance band exercise" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </Reveal>
          <div>
            <SectionHeading light align="left" eyebrow="Our Mission" title={<span id="mission-heading">{c.missionTitle}</span>} />
            <ul className="mt-8 space-y-4">
              {(c.missionPoints ?? []).map((p, i) => (
                <Reveal as="li" key={p} delay={i * 80} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-teal-400" aria-hidden="true" />
                  <span className="leading-relaxed text-white/85">{p}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What sets us apart */}
      <section className="section" aria-labelledby="apart-heading">
        <div className="container-site">
          <SectionHeading
            eyebrow="Our Difference"
            title={<span id="apart-heading">{c.differentiatorsTitle}</span>}
            description="Individualized treatment, a knowledgeable team, modern methods, a holistic view of wellness and genuine compassion."
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {(c.differentiators ?? []).map((d, i) => {
              const Icon = DIFF_ICONS[i % DIFF_ICONS.length];
              return (
                <Reveal as="li" key={d.title} delay={i * 80} className="rounded-[1.75rem] border border-line bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1">
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-mint-100 text-teal-700">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d.description}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <WhyChoose tone="tinted" />
      <TeamPreview team={team} />
      <InsurersSection settings={settings} />
      <CTASection
        title="Your next step toward better health starts here"
        body="Book an assessment and we'll build a plan around your goals — we're with you every step of the way."
        image={c.heroImage}
        phone={settings.phone}
      />
    </>
  );
}

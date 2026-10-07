import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ServiceTile } from "@/components/site/cards";
import { AppointmentBanner } from "@/components/site/sections";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONDITION_CATEGORY_INFO, DEFAULT_CATEGORY_INFO } from "@/content/condition-categories";
import { defaultConditions } from "@/content/conditions";
import { getConditions, getServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { IMAGES } from "@/lib/images";

export const revalidate = 300;

export async function generateStaticParams() {
  const conditions = await getConditions().catch(() => defaultConditions);
  return conditions.map((c) => ({ slug: c.slug }));
}

async function load(slug: string) {
  const conditions = await getConditions();
  return { condition: conditions.find((c) => c.slug === slug) ?? null, conditions };
}

export async function generateMetadata({ params }: PageProps<"/conditions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { condition } = await load(slug);
  if (!condition) return { title: "Condition not found" };
  const info = CONDITION_CATEGORY_INFO[condition.category] ?? DEFAULT_CATEGORY_INFO;
  return buildMetadata({
    title: `${condition.name} Treatment in Brampton | Next Step Physio & Rehab`,
    description: (condition.description || info.intro).slice(0, 158),
    path: `/conditions/${condition.slug}`,
  });
}

export default async function ConditionPage({ params }: PageProps<"/conditions/[slug]">) {
  const { slug } = await params;
  const [{ condition, conditions }, services, settings] = await Promise.all([load(slug), getServices(), getSiteSettings()]);
  if (!condition) notFound();

  const info = CONDITION_CATEGORY_INFO[condition.category] ?? DEFAULT_CATEGORY_INFO;
  const related = info.services.map((s) => services.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const siblings = conditions.filter((c) => c.category === condition.category && c.slug !== condition.slug).slice(0, 8);
  const name = condition.name;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: `${name} treatment in Brampton`,
          url: absoluteUrl(`/conditions/${condition.slug}`),
          about: { "@type": "MedicalCondition", name },
          audience: { "@type": "Patient" },
          provider: { "@type": "MedicalClinic", name: settings.clinicName },
        }}
      />
      <PageHero
        eyebrow={condition.category}
        title={`${name} treatment in Brampton`}
        subtitle={condition.description || info.intro}
        image={related[0]?.image || IMAGES.physiotherapy}
        imageAlt={`${name} treatment at Next Step Physio & Rehab Clinic`}
        crumbs={[{ label: "Conditions", href: "/conditions" }, { label: name, href: `/conditions/${condition.slug}` }]}
      />

      <section className="section" aria-labelledby="approach-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <h2 id="approach-heading" className="display-md">
              How we can help with {name.toLowerCase()}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{info.intro}</p>
            <ul className="mt-8 space-y-3">
              {info.approach.map((a) => (
                <li key={a} className="flex gap-3 font-medium text-navy-900">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl bg-sky-50 p-5 text-sm leading-relaxed text-muted">
              Every plan starts with an individual assessment. This page is general information, not a diagnosis. For sudden, severe or worsening symptoms, seek medical care right away.
            </p>
          </Reveal>
          <Reveal delay={100} className="self-start rounded-[2rem] bg-navy-900 p-7 text-white">
            <h2 className="text-xl font-bold text-white">Services that may help</h2>
            <ul className="mt-5 space-y-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <ServiceTile service={s} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="section bg-sky-50" aria-labelledby="related-conditions">
          <div className="container-site">
            <h2 id="related-conditions" className="display-md">
              Related conditions
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {siblings.map((c) => (
                <li key={c.slug}>
                  <Link href={`/conditions/${c.slug}`} className="flex h-full items-center justify-between gap-2 rounded-2xl bg-white p-4 font-semibold text-navy-900 ring-1 ring-line hover:text-teal-700">
                    {c.name} <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <AppointmentBanner title={`Get help with ${name.toLowerCase()}`} body="Book an assessment with our Brampton team. No referral is needed and direct billing is available." settings={settings} />
    </>
  );
}

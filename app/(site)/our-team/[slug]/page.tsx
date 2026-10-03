import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AppointmentBanner } from "@/components/site/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings, getTeam, getTeamMember } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { resolveImage } from "@/lib/images";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { paragraphs } from "@/lib/utils";
import { defaultTeam } from "@/content/team";

export const revalidate = 300;

export async function generateStaticParams() {
  const team = await getTeam().catch(() => defaultTeam);
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/our-team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) return { title: "Team member not found" };
  return buildMetadata({
    title: `${member.name} — ${member.title} | Next Step Physio & Rehab Clinic`,
    description: member.shortBio,
    path: `/our-team/${member.slug}`,
    image: member.image,
  });
}

export default async function TeamMemberPage({ params }: PageProps<"/our-team/[slug]">) {
  const { slug } = await params;
  const [member, settings] = await Promise.all([getTeamMember(slug), getSiteSettings()]);
  if (!member) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: member.name,
          jobTitle: member.title,
          image: absoluteUrl(resolveImage(member.image)),
          worksFor: { "@type": "MedicalClinic", "@id": `${SITE_URL}/#clinic`, name: settings.clinicName },
        }}
      />
      <section className="bg-soft-gradient">
        <div className="container-site pb-16 pt-8 sm:pt-10 lg:pb-24 lg:pt-14">
          <Breadcrumbs items={[{ label: "Our Team", href: "/our-team" }, { label: member.name, href: `/our-team/${member.slug}` }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Reveal imageReveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift lg:sticky lg:top-32">
                <Image src={resolveImage(member.image)} alt={`${member.name}, ${member.title}`} fill priority sizes="(min-width: 1024px) 440px, 100vw" className="object-cover" />
              </Reveal>
            </div>
            <div>
              <Reveal>
                <p className="font-semibold text-teal-700">{member.title}</p>
                <h1 className="display-lg mt-2">{member.name}</h1>
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
                  {paragraphs(member.fullBio || member.shortBio).map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </Reveal>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {member.qualifications.length > 0 && (
                  <Reveal className="rounded-[1.5rem] bg-white p-6 shadow-card ring-1 ring-line">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      <Award className="size-5 text-teal-600" aria-hidden="true" /> Qualifications
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {member.qualifications.map((q) => (
                        <li key={q} className="flex gap-2.5 text-navy-900">
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden="true" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}
                {member.specialties.length > 0 && (
                  <Reveal delay={100} className="rounded-[1.5rem] bg-white p-6 shadow-card ring-1 ring-line">
                    <h2 className="text-lg font-bold">Areas of focus</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {member.specialties.map((s) => (
                        <li key={s} className="rounded-full bg-mint-100 px-3 py-1.5 text-sm font-medium text-teal-800">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}
              </div>
              <Reveal delay={150} className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/book-appointment" size="lg">
                  <CalendarCheck className="size-5" aria-hidden="true" /> Book an appointment
                </ButtonLink>
                <ButtonLink href="/our-team" size="lg" variant="outline">
                  Back to team
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <AppointmentBanner title="Start your recovery with our team" body="Request an appointment online and we'll contact you to confirm a time." settings={settings} />
    </>
  );
}

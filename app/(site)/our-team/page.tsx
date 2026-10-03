import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { TeamCard } from "@/components/site/cards";
import { AppointmentBanner, WhyChoose } from "@/components/site/sections";
import { Reveal } from "@/components/ui/Reveal";
import { getPageContent, getSiteSettings, getTeam } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("our-team");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/our-team", image: page.content.heroImage });
}

export default async function TeamPage() {
  const [page, team, settings] = await Promise.all([getPageContent<Content>("our-team"), getTeam(), getSiteSettings()]);
  const c = page.content;

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} subtitle={c.heroSubtitle} image={c.heroImage} imageAlt="Therapist guiding a patient through an exercise" crumbs={[{ label: "Our Team", href: "/our-team" }]} />
      <section className="section" aria-label="Team members">
        <div className="container-site">
          {team.length ? (
            <ul className={team.length === 1 ? "mx-auto grid max-w-md" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
              {team.map((m, i) => (
                <Reveal as="li" key={m.slug} delay={(i % 3) * 100}>
                  <TeamCard member={m} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted">Team profiles are coming soon.</p>
          )}
        </div>
      </section>
      <WhyChoose tone="tinted" />
      <AppointmentBanner title="Book with our team" body="Request an appointment and we'll match you with the right practitioner for your needs." settings={settings} />
    </>
  );
}

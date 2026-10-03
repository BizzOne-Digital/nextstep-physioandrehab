import type { Metadata } from "next";
import { MessageSquareHeart } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Stars, TestimonialCard } from "@/components/site/cards";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPageContent, getServices, getTestimonials } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent<Content>("testimonials");
  return buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/testimonials", image: page.content.heroImage });
}

export default async function TestimonialsPage() {
  const [page, testimonials, services] = await Promise.all([getPageContent<Content>("testimonials"), getTestimonials(), getServices()]);
  const c = page.content;
  const average = testimonials.length ? testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length : 0;

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} subtitle={c.heroSubtitle} image={c.heroImage} imageAlt="Therapist providing hands-on care" crumbs={[{ label: "Testimonials", href: "/testimonials" }]}>
        {testimonials.length > 0 && (
          <div className="inline-flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
            <span className="font-display text-4xl font-extrabold text-navy-900">{average.toFixed(1)}</span>
            <span>
              <Stars rating={Math.round(average)} />
              <span className="mt-1 block text-sm text-muted">
                Based on {testimonials.length} review{testimonials.length === 1 ? "" : "s"}
              </span>
            </span>
          </div>
        )}
      </PageHero>

      <section className="section" aria-label="Patient reviews">
        <div className="container-site">
          {testimonials.length > 0 ? (
            <ul className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>li]:mb-6 [&>li]:break-inside-avoid">
              {testimonials.map((t, i) => (
                <Reveal as="li" key={t._id ?? i} delay={(i % 3) * 80}>
                  <TestimonialCard testimonial={t} featured={i % 5 === 1} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] bg-sky-50 p-10 text-center ring-1 ring-line">
              <span className="grid size-16 place-items-center rounded-2xl bg-white text-teal-700 shadow-soft">
                <MessageSquareHeart className="size-8" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-bold">Be one of the first to share your experience</h2>
              <p className="mt-3 text-muted">Patient reviews will appear here once they have been shared and approved.</p>
            </Reveal>
          )}
        </div>
      </section>

      <section id="share-review" className="section bg-sky-50" aria-labelledby="review-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="Add a Review"
            title={<span id="review-heading">Share your experience</span>}
            description="Tell us about your visit. Your feedback helps us improve and helps others in Brampton find the care they need. Reviews are approved by our team before being published."
          />
          <Reveal delay={80} className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-line sm:p-10">
            <ReviewForm services={services.map((s) => s.shortTitle)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

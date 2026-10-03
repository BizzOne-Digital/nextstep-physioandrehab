import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, Quote, Star } from "lucide-react";
import { ServiceIcon } from "@/components/ui/Icon";
import { resolveImage } from "@/lib/images";
import { cn, formatDate, readingTime } from "@/lib/utils";
import type { BlogPostItem, ServiceItem, TeamMemberItem, TestimonialItem } from "@/types";

export function ServiceCard({ service, priority = false }: { service: ServiceItem; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-teal-500/30 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={resolveImage(service.image)}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
      </div>
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-9">
        <span className="absolute -top-7 left-6 grid size-14 place-items-center rounded-2xl bg-white text-teal-700 shadow-soft ring-1 ring-line transition-colors duration-300 group-hover:bg-teal-700 group-hover:text-white">
          <ServiceIcon name={service.icon} className="size-6" />
        </span>
        <h3 className="text-xl font-bold">
          <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0">
            {service.shortTitle}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 flex-1 leading-relaxed text-muted">{service.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
          Learn more
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export function ServiceTile({ service }: { service: ServiceItem }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-card"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mint-100 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
        <ServiceIcon name={service.icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-navy-900">{service.shortTitle}</span>
        <span className="block truncate text-sm text-muted">{service.tagline}</span>
      </span>
      <ArrowUpRight className="size-5 shrink-0 text-muted transition-colors group-hover:text-teal-700" aria-hidden="true" />
    </Link>
  );
}

export function TeamCard({ member }: { member: TeamMemberItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-sky-50">
        <Image
          src={resolveImage(member.image)}
          alt={`${member.name}, ${member.title}`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 className="text-2xl font-bold text-white">
            <Link href={`/our-team/${member.slug}`} className="after:absolute after:inset-0">
              {member.name}
            </Link>
          </h3>
          <p className="mt-1 font-medium text-teal-400">{member.title}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="line-clamp-3 leading-relaxed text-muted">{member.shortBio}</p>
        {member.specialties.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {member.specialties.slice(0, 3).map((s) => (
              <li key={s} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-navy-800">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("size-4", i < rating ? "fill-amber-400 text-amber-400" : "fill-line text-line")} aria-hidden="true" />
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial, featured = false }: { testimonial: TestimonialItem; featured?: boolean }) {
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] p-7 transition-all duration-300",
        featured ? "bg-navy-900 text-white shadow-lift" : "border border-line bg-white shadow-card hover:-translate-y-1",
      )}
    >
      <Quote className={cn("size-9", featured ? "text-teal-400" : "text-teal-500/30")} aria-hidden="true" />
      <Stars rating={testimonial.rating} className="mt-4" />
      <blockquote className={cn("mt-4 flex-1 leading-relaxed", featured ? "text-white/85" : "text-ink")}>
        “{testimonial.review}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {testimonial.image ? (
          <Image src={resolveImage(testimonial.image)} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
        ) : (
          <span
            className={cn(
              "grid size-12 place-items-center rounded-full font-display text-lg font-bold",
              featured ? "bg-white/10 text-teal-400" : "bg-mint-100 text-teal-800",
            )}
            aria-hidden="true"
          >
            {testimonial.name.charAt(0).toUpperCase()}
          </span>
        )}
        <span>
          <span className={cn("block font-semibold", featured ? "text-white" : "text-navy-900")}>{testimonial.name}</span>
          {(testimonial.location || testimonial.service) && (
            <span className={cn("block text-sm", featured ? "text-white/60" : "text-muted")}>
              {[testimonial.service, testimonial.location].filter(Boolean).join(" · ")}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export function BlogCard({ post, priority = false }: { post: BlogPostItem; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={resolveImage(post.featuredImage)}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-800 backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 text-xs font-medium text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, { month: "short", day: "numeric", year: "numeric" })}</time>
          </span>
          {post.content && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {readingTime(post.content)} min read
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
          Read article
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

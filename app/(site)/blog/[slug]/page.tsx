import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, CalendarDays, Clock, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/site/cards";
import { ShareLinks } from "@/components/site/ShareLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getPublishedPosts, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { resolveImage } from "@/lib/images";
import { sanitizeRichText } from "@/lib/sanitize";
import { absoluteUrl } from "@/lib/site";
import { articleSchema } from "@/lib/structured-data";
import { formatDate, phoneHref, readingTime } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return buildMetadata({
    title: post.seoTitle || `${post.title} | Next Step Physio & Rehab Clinic`,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getPostBySlug(slug), getPublishedPosts(), getSiteSettings()]);
  if (!post) notFound();

  const image = resolveImage(post.featuredImage);
  const html = sanitizeRichText(post.content);
  const others = posts.filter((p) => p.slug !== post.slug);
  const related = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  const recent = others.slice(0, 4);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <JsonLd data={articleSchema(post, image)} />
      <article>
        <header className="bg-soft-gradient">
          <div className="container-site pb-10 pt-8 sm:pt-10 lg:pt-14">
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }]} className="[&_li:last-child]:hidden sm:[&_li:last-child]:flex" />
            <Reveal className="mt-6 max-w-4xl">
              <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="inline-flex rounded-full bg-mint-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 hover:bg-teal-700 hover:text-white">
                {post.category}
              </Link>
              <h1 className="display-lg mt-5 text-balance">{post.title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <span className="font-semibold text-navy-900">{post.author}</span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden="true" />
                  {readingTime(post.content)} min read
                </span>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="container-site">
          <Reveal imageReveal className="relative -mt-2 aspect-[16/8] overflow-hidden rounded-[2rem] shadow-lift">
            <Image src={image} alt="" fill priority sizes="(min-width: 1280px) 1176px, 100vw" className="object-cover" />
          </Reveal>
        </div>

        <div className="container-site grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:gap-16 lg:py-20">
          <div className="min-w-0">
            {post.excerpt && <p className="mb-8 border-l-4 border-teal-500 pl-5 text-xl leading-relaxed text-navy-800">{post.excerpt}</p>}
            <div className="prose-clinic" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <ShareLinks url={url} title={post.title} />
              <Link href="/blog" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
                ← Back to all articles
              </Link>
            </div>
            <p className="mt-8 rounded-2xl bg-sky-50 p-5 text-sm leading-relaxed text-muted">
              This article is for general education only and is not a substitute for individual medical advice. Please speak with a qualified healthcare professional about your situation.
            </p>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[1.75rem] bg-navy-900 p-7 text-white">
              <p className="font-display text-xl font-bold">Need help with your recovery?</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Book an assessment with our Brampton team. No referral needed.</p>
              <ButtonLink href="/book-appointment" className="mt-5 w-full">
                <CalendarCheck className="size-4" aria-hidden="true" /> Book Appointment
              </ButtonLink>
              <a href={phoneHref(settings.phone)} className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-teal-400 hover:text-white">
                <Phone className="size-4" aria-hidden="true" /> {settings.phone}
              </a>
            </div>
            {recent.length > 0 && (
              <div className="rounded-[1.75rem] border border-line bg-white p-6">
                <p className="font-display text-lg font-bold text-navy-900">Recent posts</p>
                <ul className="mt-4 space-y-4">
                  {recent.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="group flex gap-3">
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                          <Image src={resolveImage(p.featuredImage)} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <span>
                          <span className="line-clamp-2 text-sm font-semibold leading-snug text-navy-900 group-hover:text-teal-700">{p.title}</span>
                          <span className="mt-1 block text-xs text-muted">{formatDate(p.publishedAt, { month: "short", day: "numeric", year: "numeric" })}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-sky-50" aria-labelledby="related-heading">
          <div className="container-site">
            <h2 id="related-heading" className="display-md">
              Related articles
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 80}>
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

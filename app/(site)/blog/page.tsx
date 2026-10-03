import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { BlogCard } from "@/components/site/cards";
import { Reveal } from "@/components/ui/Reveal";
import { getPageContent, getPublishedPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { resolveImage } from "@/lib/images";
import { cn, formatDate } from "@/lib/utils";

const PER_PAGE = 9;

interface Content {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export async function generateMetadata({ searchParams }: PageProps<"/blog">): Promise<Metadata> {
  const page = await getPageContent<Content>("blog");
  const sp = await searchParams;
  const filtered = Boolean(sp.category || (sp.page && sp.page !== "1"));
  return {
    ...buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/blog", image: page.content.heroImage }),
    // Filtered/paginated views point search engines back to the main listing.
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  };
}

function href(category: string, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const q = params.toString();
  return q ? `/blog?${q}` : "/blog";
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const [page, posts] = await Promise.all([getPageContent<Content>("blog"), getPublishedPosts()]);
  const c = page.content;

  const categories = [...new Set(posts.map((p) => p.category))].sort();
  const category = typeof sp.category === "string" && categories.includes(sp.category) ? sp.category : "";
  const list = category ? posts.filter((p) => p.category === category) : posts;
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const current = Math.min(totalPages, Math.max(1, Number(sp.page) || 1));
  const showFeatured = !category && current === 1 && list.length > 0;
  const featured = showFeatured ? list[0] : null;
  const pageItems = list.slice((current - 1) * PER_PAGE + (showFeatured ? 1 : 0), current * PER_PAGE);

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} subtitle={c.heroSubtitle} image={c.heroImage} imageAlt="Therapist supporting a resistance exercise" crumbs={[{ label: "Blog", href: "/blog" }]} />

      <section className="section pt-12" aria-label="Articles">
        <div className="container-site">
          <nav aria-label="Blog categories" className="-mx-4 overflow-x-auto px-4">
            <ul className="flex w-max gap-2">
              {["", ...categories].map((cat) => (
                <li key={cat || "all"}>
                  <Link
                    href={href(cat, 1)}
                    aria-current={category === cat ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      category === cat ? "bg-teal-700 text-white" : "bg-sky-50 text-navy-900 hover:bg-mint-100",
                    )}
                  >
                    {cat || "All articles"}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {featured && (
            <Reveal className="mt-10">
              <article className="group relative grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-card lg:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
                  <Image src={resolveImage(featured.featuredImage)} alt="" fill priority sizes="(min-width: 1024px) 620px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <span className="text-sm font-semibold text-teal-700">
                    Latest · {featured.category} · <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                  </span>
                  <h2 className="display-md mt-3 text-balance">
                    <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted">{featured.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-teal-700">
                    Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </Reveal>
          )}

          {pageItems.length > 0 ? (
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </ul>
          ) : (
            !featured && <p className="mt-12 rounded-[1.5rem] bg-sky-50 p-10 text-center text-muted">No articles have been published yet. Check back soon.</p>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
              <Link
                href={href(category, current - 1)}
                aria-disabled={current === 1}
                className={cn("grid size-11 place-items-center rounded-full ring-1 ring-line", current === 1 ? "pointer-events-none opacity-40" : "hover:bg-sky-50")}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={href(category, n)}
                  aria-current={n === current ? "page" : undefined}
                  className={cn("grid size-11 place-items-center rounded-full text-sm font-semibold", n === current ? "bg-teal-700 text-white" : "ring-1 ring-line hover:bg-sky-50")}
                >
                  {n}
                </Link>
              ))}
              <Link
                href={href(category, current + 1)}
                aria-disabled={current === totalPages}
                className={cn("grid size-11 place-items-center rounded-full ring-1 ring-line", current === totalPages ? "pointer-events-none opacity-40" : "hover:bg-sky-50")}
                aria-label="Next page"
              >
                <ChevronRight className="size-5" />
              </Link>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

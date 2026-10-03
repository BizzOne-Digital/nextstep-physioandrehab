import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { resolveImage } from "@/lib/images";

/** Consistent hero for inner pages: soft gradient, breadcrumb, copy and a framed image. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
  crumbs,
  children,
  aside,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const src = image ? resolveImage(image) : "";
  return (
    <section className="bg-soft-gradient relative overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 opacity-40 [mask-image:linear-gradient(to_left,black,transparent)] lg:block" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-10 pb-14 pt-8 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-20 lg:pt-14">
        <div>
          <Breadcrumbs items={crumbs} />
          <Reveal className="mt-6">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="display-lg mt-4 text-balance">{title}</h1>
            {subtitle && <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{subtitle}</p>}
          </Reveal>
          {children && (
            <Reveal delay={120} className="mt-8">
              {children}
            </Reveal>
          )}
        </div>
        {src && (
          <div className="relative">
            <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-3xl bg-mint-100 sm:block" aria-hidden="true" />
            <div className="absolute -bottom-5 -right-3 hidden h-32 w-32 rounded-full border-[10px] border-teal-400/20 sm:block" aria-hidden="true" />
            <Reveal imageReveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift lg:aspect-[5/4]">
              <Image src={src} alt={imageAlt} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
            </Reveal>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

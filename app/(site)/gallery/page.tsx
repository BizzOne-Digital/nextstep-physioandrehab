import Image from "next/image";
import type { Metadata } from "next";
import { Images } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getGallery } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { resolveImage } from "@/lib/images";
import { IMAGES } from "@/lib/images";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Clinic Gallery | Next Step Physio & Rehab Clinic Brampton",
  description: "Take a look inside Next Step Physio & Rehab Clinic in Brampton.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside our clinic"
        subtitle="A welcoming, modern space designed for your comfort and recovery."
        image={items[0]?.image || IMAGES.exercise}
        crumbs={[{ label: "Gallery", href: "/gallery" }]}
      />
      <section className="section" aria-label="Photos">
        <div className="container-site">
          {items.length ? (
            <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid">
              {items.map((g, i) => (
                <Reveal as="li" key={g._id ?? i} delay={(i % 3) * 80}>
                  <figure className="overflow-hidden rounded-[1.5rem] bg-sky-50 shadow-card">
                    <Image src={resolveImage(g.image)} alt={g.alt || g.title} width={800} height={600} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="h-auto w-full object-cover" />
                    <figcaption className="px-5 py-3 text-sm font-medium text-navy-900">{g.title}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] bg-sky-50 p-10 text-center">
              <Images className="size-10 text-teal-600" aria-hidden="true" />
              <p className="mt-4 font-display text-xl font-bold text-navy-900">Photos coming soon</p>
              <p className="mt-2 text-muted">We&apos;re preparing photos of our clinic. Visit us at any time to see it in person.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

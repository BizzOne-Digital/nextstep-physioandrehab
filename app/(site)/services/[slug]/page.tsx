import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BenefitsGrid, BenefitsList, ExpectationCards, HighlightBox, OverviewFeature, OverviewSplit, ProcessSteps, ProcessTimeline,
  ProductOptions, RelatedServices, ServiceFAQ, ServiceHero, WhoAndConditions,
} from "@/components/services/ServiceSections";
import { AppointmentBanner, InsurersSection, WhyChoose } from "@/components/site/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServiceBySlug, getServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { faqSchema, serviceSchema } from "@/lib/structured-data";
import { defaultServices } from "@/content/services";
import type { ServiceItem } from "@/types";

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await getServices().catch(() => defaultServices);
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return buildMetadata({
    title: service.seoTitle || `${service.title} | Next Step Physio & Rehab Clinic`,
    description: service.seoDescription || service.excerpt,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

function related(all: ServiceItem[], current: ServiceItem): ServiceItem[] {
  const others = all.filter((s) => s.slug !== current.slug);
  const sameLayout = others.filter((s) => s.layout === current.layout);
  return [...sameLayout, ...others.filter((s) => s.layout !== current.layout)].slice(0, 3);
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([getServiceBySlug(slug), getServices(), getSiteSettings()]);
  if (!service) notFound();

  const relatedServices = related(services, service);
  const name = service.shortTitle.toLowerCase();

  // Each layout keeps the shared design system but tells its own story.
  const body = (() => {
    switch (service.layout) {
      case "wellness":
        return (
          <>
            <OverviewFeature service={service} />
            <BenefitsList service={service} title={`The benefits of ${name}`} />
            <ProcessSteps service={service} title="How your sessions work" />
            <WhoAndConditions service={service} />
            <ExpectationCards service={service} />
          </>
        );
      case "recovery":
        return (
          <>
            <HighlightBox service={service} emphasis />
            <OverviewSplit service={service} />
            <ProcessTimeline service={service} title="Your path to recovery" />
            <BenefitsGrid service={service} title={`How ${name} treatment helps`} tone="white" />
            <WhoAndConditions service={service} />
            <InsurersSection settings={settings} tone="tinted" />
          </>
        );
      case "product":
        return (
          <>
            <OverviewSplit service={service} reverse />
            <ProductOptions service={service} />
            <ProcessSteps service={service} title="Our fitting process" />
            <WhoAndConditions service={service} />
            <HighlightBox service={service} />
          </>
        );
      case "clinical":
      default:
        return (
          <>
            <OverviewSplit service={service} />
            <BenefitsGrid service={service} title={`What ${name} at Next Step includes`} />
            <WhoAndConditions service={service} />
            <ProcessTimeline service={service} />
            <HighlightBox service={service} />
          </>
        );
    }
  })();

  return (
    <>
      <JsonLd data={serviceSchema(service, settings)} />
      {service.faqs.length > 0 && <JsonLd data={faqSchema(service.faqs)} />}
      <ServiceHero service={service} phone={settings.phone} />
      {body}
      <WhyChoose tone={service.layout === "wellness" ? "tinted" : "white"} />
      <ServiceFAQ service={service} />
      <RelatedServices services={relatedServices} />
      <AppointmentBanner
        title={`Book ${name} in Brampton`}
        body="Request an appointment online and our team will contact you to confirm your visit. Direct billing is available with many insurers."
        settings={settings}
      />
    </>
  );
}

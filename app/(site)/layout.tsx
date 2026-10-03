import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getSiteSettings } from "@/lib/data";
import { clinicSchema } from "@/lib/structured-data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  return (
    <>
      <JsonLd data={clinicSchema(settings, services)} />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}

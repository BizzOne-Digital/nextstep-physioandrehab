import { getServices, getSiteSettings } from "@/lib/data";
import { HeaderClient } from "@/components/site/HeaderClient";
import { formatTime, phoneHref } from "@/lib/utils";

export async function Header() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  const weekday = settings.hours.find((h) => !h.closed && h.day === "Monday");
  const hoursLabel = weekday ? `Mon–Fri ${formatTime(weekday.open)} – ${formatTime(weekday.close)}` : "";

  return (
    <HeaderClient
      services={services.map((s) => ({ slug: s.slug, shortTitle: s.shortTitle, icon: s.icon, tagline: s.tagline }))}
      phone={settings.phone}
      phoneLink={phoneHref(settings.phone)}
      email={settings.email}
      address={`${settings.address.street}, ${settings.address.city}`}
      hoursLabel={hoursLabel}
      logo={settings.logo}
      announcement={settings.announcement}
    />
  );
}

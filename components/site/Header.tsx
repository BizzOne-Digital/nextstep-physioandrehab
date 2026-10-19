import { getConditions, getServices, getSiteSettings } from "@/lib/data";
import { CONDITION_CATEGORIES } from "@/content/conditions";
import { HeaderClient } from "@/components/site/HeaderClient";
import { formatTime, phoneHref } from "@/lib/utils";

export async function Header() {
  const [settings, services, conditions] = await Promise.all([getSiteSettings(), getServices(), getConditions()]);
  // Menu groups: up to 5 conditions per category, featured ones first.
  const conditionGroups = [...CONDITION_CATEGORIES, ...new Set(conditions.map((c) => c.category))]
    .filter((cat, i, all) => all.indexOf(cat) === i)
    .map((category) => ({
      category,
      items: conditions
        .filter((c) => c.category === category)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
        .slice(0, 5)
        .map((c) => ({ name: c.name, slug: c.slug })),
    }))
    .filter((g) => g.items.length);
  const weekday = settings.hours.find((h) => !h.closed && h.day === "Monday");
  const hoursLabel = weekday ? `Mon–Fri ${formatTime(weekday.open)} – ${formatTime(weekday.close)}` : "";

  return (
    <HeaderClient
      services={services.map((s) => ({ slug: s.slug, shortTitle: s.shortTitle, icon: s.icon, tagline: s.tagline }))}
      conditionGroups={conditionGroups}
      conditionTotal={conditions.length}
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

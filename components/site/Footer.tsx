import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { getGallery, getServices, getSiteSettings } from "@/lib/data";
import { Logo } from "@/components/ui/Logo";
import { SOCIAL_LABELS, SocialIcon } from "@/components/ui/SocialIcon";
import { buttonClasses } from "@/components/ui/Button";
import { formatTime, phoneHref } from "@/lib/utils";

export async function Footer() {
  const [settings, services, gallery] = await Promise.all([getSiteSettings(), getServices(), getGallery()]);
  const socials = Object.entries(settings.social).filter(([, url]) => Boolean(url));
  const a = settings.address;

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Conditions We Treat", href: "/conditions" },
    { label: "Our Team", href: "/our-team" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    ...(gallery.length ? [{ label: "Gallery", href: "/gallery" }] : []),
    { label: "Contact", href: "/contact" },
    { label: "Book Appointment", href: "/book-appointment" },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/75">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[480px] rounded-full bg-teal-400/10 blur-3xl" aria-hidden="true" />

      <div className="container-site relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <Logo variant="light" className="h-20" />
          <p className="mt-5 max-w-sm leading-relaxed">{settings.footerAbout}</p>
          <Link href="/book-appointment" className={buttonClasses("primary", "md", "mt-6")}>
            Book an Appointment
          </Link>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[key] ?? key}
                    className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-teal-700"
                  >
                    <SocialIcon name={key} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Our Services</h2>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition-colors hover:text-teal-400">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Quick Links</h2>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-teal-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Visit Us</h2>
          <ul className="mt-5 space-y-4 text-[0.95rem]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-teal-400" aria-hidden="true" />
              <address className="not-italic">
                {a.street}
                {a.unit ? `, ${a.unit}` : ""}
                <br />
                {a.city}, {a.province} {a.postalCode}
                {settings.mapLink && (
                  <a
                    href={settings.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm font-semibold text-teal-400 hover:text-white"
                  >
                    Get directions <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                )}
              </address>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-teal-400" aria-hidden="true" />
              <a href={phoneHref(settings.phone)} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-teal-400" aria-hidden="true" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-teal-400" aria-hidden="true" />
              <dl className="grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {settings.hours.map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-white/60">{h.day.slice(0, 3)}</dt>
                    <dd className={h.closed ? "text-white/65" : "text-white/90"}>
                      {h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-sm text-white/65 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.clinicName}. All rights reserved.
          </p>
          <p>Physiotherapy &amp; rehabilitation in Brampton, Ontario</p>
        </div>
      </div>
    </footer>
  );
}

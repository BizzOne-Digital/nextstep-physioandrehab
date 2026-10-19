"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarCheck, ChevronDown, Clock, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ServiceIcon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { NAV_ITEMS, type NavService } from "@/components/site/nav";
import { cn } from "@/lib/utils";
import { ConditionsMenu, MobileConditionsMenu, type ConditionGroup } from "@/components/site/ConditionsMenu";

interface Props {
  services: NavService[];
  conditionGroups: ConditionGroup[];
  conditionTotal: number;
  phone: string;
  phoneLink: string;
  email: string;
  address: string;
  hoursLabel: string;
  logo?: string;
  announcement?: string;
}

export function HeaderClient({ services, conditionGroups, conditionTotal, phone, phoneLink, email, address, hoursLabel, logo, announcement }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaRef = useRef<HTMLLIElement>(null);
  const moreRef = useRef<HTMLLIElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every menu after navigation (state adjusted during render, per React guidance).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMoreOpen(false);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      setMoreOpen(false);
      if (drawerOpen) {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerOpen) closeButtonRef.current?.focus();
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Remembers a hover-open so the following click doesn't immediately close the menu.
  const openedByHover = useRef(false);
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!megaOpen) openedByHover.current = true;
    setMegaOpen(true);
  };
  const toggleMega = () => {
    if (openedByHover.current) {
      openedByHover.current = false;
      setMegaOpen(true);
      return;
    }
    setMegaOpen((v) => !v);
  };
  const scheduleClose = () => {
    openedByHover.current = false;
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  const linkCls = (href: string) =>
    cn(
      "relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.93rem] font-medium transition-colors 2xl:px-3",
      isActive(href) ? "text-teal-700" : "text-navy-900 hover:text-teal-700",
    );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-navy-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {announcement && (
        <div className="bg-teal-700 px-4 py-2 text-center text-sm font-medium text-white">{announcement}</div>
      )}

      {/* Utility bar */}
      <div className="hidden bg-navy-900 text-white/80 lg:block">
        <div className="container-site flex h-10 items-center justify-between text-[0.8rem]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-teal-400" aria-hidden="true" />
              {address}
            </span>
            {hoursLabel && (
              <span className="flex items-center gap-2">
                <Clock className="size-3.5 text-teal-400" aria-hidden="true" />
                {hoursLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="size-3.5 text-teal-400" aria-hidden="true" />
              {email}
            </a>
            <a href={phoneLink} className="flex items-center gap-2 font-semibold text-white transition-colors hover:text-teal-400">
              <Phone className="size-3.5 text-teal-400" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/90 shadow-[0_8px_30px_-12px_rgb(10_45_80/0.18)] backdrop-blur-xl" : "bg-white",
        )}
      >
        <div className={cn("container-site flex items-center justify-between gap-4 transition-all duration-300", scrolled ? "h-[72px]" : "h-20 lg:h-[88px]")}>
          <Link href="/" aria-label="Next Step Physio & Rehab Clinic — home" className="shrink-0">
            <Logo src={logo} priority className={cn("w-auto transition-all duration-300", scrolled ? "h-12" : "h-14 lg:h-[4.25rem]")} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) =>
                item.href === "/services" ? (
                  <li key={item.href} ref={megaRef} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <div className="flex items-center">
                      <Link href="/services" className={cn(linkCls("/services"), "pr-1")}>
                        Services
                      </Link>
                      <button
                        type="button"
                        aria-expanded={megaOpen}
                        aria-controls="services-menu"
                        aria-label="Show services menu"
                        onClick={toggleMega}
                        className="rounded-full p-1.5 text-navy-900 hover:text-teal-700"
                      >
                        <ChevronDown className={cn("size-4 transition-transform", megaOpen && "rotate-180")} />
                      </button>
                    </div>
                    {megaOpen && (
                        <div
                          id="services-menu"
                          className="absolute inset-x-0 top-full flex justify-center px-4"
                        >
                          <div className="grid w-full max-w-[980px] grid-cols-[1fr_260px] overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                            <ul className="grid grid-cols-2 gap-1 p-4 xl:grid-cols-3">
                              {services.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    href={`/services/${s.slug}`}
                                    className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-sky-50"
                                  >
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint-100 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                                      <ServiceIcon name={s.icon} className="size-5" />
                                    </span>
                                    <span>
                                      <span className="block text-sm font-semibold text-navy-900">{s.shortTitle}</span>
                                      <span className="mt-0.5 line-clamp-1 block text-xs text-muted">{s.tagline}</span>
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-col justify-between bg-gradient-to-br from-navy-900 to-navy-800 p-6 text-white">
                              <div>
                                <p className="font-display text-lg font-bold">Not sure where to start?</p>
                                <p className="mt-2 text-sm leading-relaxed text-white/75">
                                  Book an assessment and our team will recommend the right treatment for you.
                                </p>
                              </div>
                              <div className="mt-6 space-y-3">
                                <Link href="/book-appointment" className={buttonClasses("primary", "sm", "w-full")}>
                                  Book Appointment
                                </Link>
                                <Link href="/services" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-white">
                                  View all services <ArrowRight className="size-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </li>
                ) : item.href === "/conditions" ? (
                  <ConditionsMenu key={item.href} groups={conditionGroups} total={conditionTotal} linkClassName={linkCls("/conditions")} />
                ) : (
                  <li key={item.href} className={cn(item.secondary && "hidden xl:block")}>
                    <Link href={item.href} className={linkCls(item.href)} aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li ref={moreRef} className="relative xl:hidden">
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls="more-menu"
                  onClick={() => setMoreOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-[0.93rem] font-medium text-navy-900 hover:text-teal-700"
                >
                  More <ChevronDown className={cn("size-4 transition-transform", moreOpen && "rotate-180")} />
                </button>
                {moreOpen && (
                  <ul id="more-menu" className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-line bg-white p-2 shadow-lift">
                    {NAV_ITEMS.filter((i) => i.secondary).map((i) => (
                      <li key={i.href}>
                        <Link href={i.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-navy-900 hover:bg-sky-50 hover:text-teal-700">
                          {i.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/book-appointment" className={buttonClasses("primary", "md", "max-sm:hidden")}>
              <CalendarCheck className="size-4" aria-hidden="true" />
              Book Appointment
            </Link>
            <a
              href={phoneLink}
              aria-label={`Call ${phone}`}
              className="grid size-11 place-items-center rounded-full bg-mint-100 text-teal-800 sm:hidden"
            >
              <Phone className="size-5" />
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              className="grid size-11 place-items-center rounded-full bg-navy-900 text-white lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {/* Always mounted so it can animate out; inert while closed. */}
      <div
        className={cn("fixed inset-0 z-[60] lg:hidden", !drawerOpen && "pointer-events-none")}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              className={cn("absolute inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300", drawerOpen ? "opacity-100" : "opacity-0")}
              onClick={() => setDrawerOpen(false)}
            />
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                drawerOpen ? "translate-x-0" : "translate-x-full",
              )}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo src={logo} className="h-12" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="grid size-11 place-items-center rounded-full bg-sky-50 text-navy-900"
                  aria-label="Close menu"
                  ref={closeButtonRef}
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item, i) => (
                    <li
                      key={item.href}
                      className={cn("transition-all duration-500", drawerOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0")}
                      style={{ transitionDelay: drawerOpen ? `${80 + i * 30}ms` : "0ms" }}
                    >
                      {item.href === "/services" ? (
                        <>
                          <div className="flex items-center">
                            <Link
                              href="/services"
                              className={cn(
                                "flex-1 rounded-xl px-4 py-3 text-base font-semibold",
                                isActive("/services") ? "bg-mint-100 text-teal-800" : "text-navy-900",
                              )}
                            >
                              Services
                            </Link>
                            <button
                              type="button"
                              onClick={() => setMobileServicesOpen((v) => !v)}
                              aria-expanded={mobileServicesOpen}
                              aria-label="Show services"
                              className="grid size-11 place-items-center rounded-xl text-navy-900"
                            >
                              <ChevronDown className={cn("size-5 transition-transform", mobileServicesOpen && "rotate-180")} />
                            </button>
                          </div>
                          {mobileServicesOpen && (
                            <ul className="mb-2 ml-4 space-y-0.5 border-l-2 border-mint-100 pl-3">
                              {services.map((s) => (
                                <li key={s.slug}>
                                  <Link href={`/services/${s.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-navy-900">
                                    <ServiceIcon name={s.icon} className="size-4 text-teal-600" />
                                    {s.shortTitle}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : item.href === "/conditions" ? (
                        <MobileConditionsMenu groups={conditionGroups} active={isActive("/conditions")} />
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-xl px-4 py-3 text-base font-semibold",
                            isActive(item.href) ? "bg-mint-100 text-teal-800" : "text-navy-900",
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-3 border-t border-line p-5">
                <Link href="/book-appointment" className={buttonClasses("primary", "lg", "w-full")}>
                  <CalendarCheck className="size-5" aria-hidden="true" /> Book Appointment
                </Link>
                <a href={phoneLink} className={buttonClasses("outline", "lg", "w-full")}>
                  <Phone className="size-5" aria-hidden="true" /> {phone}
                </a>
              </div>
            </div>
      </div>
    </>
  );
}

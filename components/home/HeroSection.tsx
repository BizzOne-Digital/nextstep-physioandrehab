"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

interface HeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  badges: string[];
  image: string;
  openDaysLabel: string;
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Entrance animations are CSS (see globals.css) so the heading and image paint
 * on first render. A tiny rAF scroll handler adds a subtle parallax.
 */
export function HeroSection({ eyebrow, title, highlight, subtitle, primaryCta, secondaryCta, badges, image, openDaysLabel }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = ref.current;
      if (!section) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / section.offsetHeight));
      if (imageRef.current) imageRef.current.style.translate = `0 ${progress * 70}px`;
      if (blobRef.current) blobRef.current.style.translate = `0 ${progress * -50}px`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className="bg-soft-gradient relative overflow-hidden" aria-labelledby="hero-heading">
      <div ref={blobRef} className="pointer-events-none absolute -right-32 -top-40 size-[560px] rounded-full bg-gradient-to-br from-teal-400/20 to-mint-100/0 blur-2xl" aria-hidden="true" />
      <div className="bg-dots pointer-events-none absolute left-0 top-24 h-64 w-64 opacity-40 [mask-image:radial-gradient(circle,black,transparent_70%)]" aria-hidden="true" />
      <svg className="pointer-events-none absolute bottom-0 left-0 h-12 w-full text-white sm:h-20" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 80h1440V40c-180 28-420 40-720 40S180 68 0 40v40Z" />
      </svg>

      <div className="container-site relative grid items-center gap-12 pb-24 pt-10 sm:pb-28 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-36 lg:pt-16">
        <div className="relative z-10">
          <p className="hero-in inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-white/80 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-teal-800 shadow-soft sm:tracking-[0.18em] ring-1 ring-teal-500/15 backdrop-blur sm:text-xs">
            <span className="hidden size-1.5 rounded-full bg-teal-500 sm:block" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 id="hero-heading" className="hero-in display-xl mt-6 text-balance" style={delay(80)}>
            {title}
            {highlight && (
              <>
                <br className="hidden sm:block" /> <span className="text-gradient">{highlight}</span>
              </>
            )}
          </h1>

          <p className="hero-in mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl" style={delay(160)}>
            {subtitle}
          </p>

          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={delay(240)}>
            <Link href="/book-appointment" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
              <CalendarCheck className="size-5" aria-hidden="true" />
              {primaryCta}
            </Link>
            <Link href="/services" className={buttonClasses("outline", "lg", "w-full sm:w-auto")}>
              {secondaryCta}
              <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {badges.length > 0 && (
            <ul className="hero-in mt-9 grid gap-3 sm:flex sm:flex-wrap sm:gap-x-6" style={delay(320)}>
              {badges.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <CheckCircle2 className="size-5 text-teal-600" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div className="absolute -right-6 -top-6 size-40 rounded-full border-[14px] border-teal-400/20 sm:size-56" aria-hidden="true" />
          <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-teal-700 opacity-90 sm:h-56 sm:w-56" aria-hidden="true" />

          <div
            ref={imageRef}
            className="hero-reveal relative aspect-[4/3.4] overflow-hidden rounded-[2.5rem] shadow-lift sm:aspect-[4/4.2] lg:aspect-[4/4.6]"
          >
            <div className="hero-zoom absolute inset-0">
              <Image
                src={image}
                alt="Physiotherapist guiding a patient through a knee and hip mobility exercise"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent" />
          </div>

          <div className="hero-left absolute -left-2 bottom-8 sm:-left-10 sm:bottom-16" style={delay(600)}>
            <div className="animate-float flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-lift ring-1 ring-line backdrop-blur sm:p-4 sm:pr-6">
              <span className="grid size-10 place-items-center rounded-xl bg-mint-100 text-teal-700 sm:size-12">
                <ShieldCheck className="size-5 sm:size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-navy-900 sm:text-base">Direct Billing</span>
                <span className="block text-xs text-muted">Many insurers accepted</span>
              </span>
            </div>
          </div>

          <div className="hero-right absolute -right-3 -top-5 sm:-right-12 sm:-top-7 xl:-right-16" style={delay(750)}>
            <div className="animate-float-slow flex items-center gap-3 rounded-2xl bg-navy-900 p-3 pr-5 text-white shadow-lift sm:p-4 sm:pr-6">
              <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-teal-400 sm:size-12">
                <Clock className="size-5 sm:size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-sm font-bold sm:text-base">{openDaysLabel}</span>
                <span className="block text-xs text-white/70">Appointments available</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

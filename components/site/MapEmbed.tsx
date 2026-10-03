"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

/**
 * Click-to-load Google Map. Avoids ~400 KB of third-party JavaScript (and
 * Google cookies) until the visitor actually wants the map.
 */
export function MapEmbed({ src, title, address, directionsUrl }: { src: string; title: string; address: string; directionsUrl?: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return <iframe src={src} title={title} className="h-full min-h-[360px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />;
  }

  return (
    <div className="bg-dots relative flex h-full min-h-[360px] flex-col items-center justify-center gap-5 bg-sky-50 p-8 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-mint-100/80 via-white/40 to-aqua-50/80" aria-hidden="true" />
      <span className="relative grid size-16 place-items-center rounded-full bg-teal-700 text-white shadow-lift ring-8 ring-teal-500/15">
        <MapPin className="size-7" aria-hidden="true" />
      </span>
      <div className="relative">
        <p className="font-display text-lg font-bold text-navy-900">Next Step Physio &amp; Rehab Clinic</p>
        <p className="mt-1 text-sm text-muted">{address}</p>
      </div>
      <div className="relative flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => setLoaded(true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800">
          <MapPin className="size-4" aria-hidden="true" /> Show map
        </button>
        {directionsUrl && (
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-navy-900 ring-1 ring-line hover:text-teal-700">
            <Navigation className="size-4" aria-hidden="true" /> Get directions
          </a>
        )}
      </div>
      <p className="relative text-xs text-muted">The map is provided by Google and loads when you click Show map.</p>
    </div>
  );
}

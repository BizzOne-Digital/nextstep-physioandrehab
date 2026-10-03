"use client";

import { useState } from "react";
import { Check, Link2, Mail } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const btn = "grid size-10 place-items-center rounded-full bg-sky-50 text-navy-900 ring-1 ring-line transition-colors hover:bg-teal-700 hover:text-white";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-navy-900">Share</span>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
        <SocialIcon name="facebook" className="size-4" />
      </a>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <SocialIcon name="linkedin" className="size-4" />
      </a>
      <a className={btn} href={`mailto:?subject=${t}&body=${u}`} aria-label="Share by email">
        <Mail className="size-4" />
      </a>
      <button type="button" onClick={copy} className={btn} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}

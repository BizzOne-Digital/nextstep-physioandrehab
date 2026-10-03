export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nextstepphysioandrehab.com").replace(/\/+$/, "");

export const SITE_NAME = "Next Step Physio & Rehab Clinic";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

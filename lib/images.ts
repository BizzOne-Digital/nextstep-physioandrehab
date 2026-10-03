/**
 * Development imagery (Unsplash, free licence). Admin uploads replace these
 * per record; uploaded files are served from /api/uploads/{folder}/{filename}.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: "/images/hero.webp",
  physiotherapy: u("photo-1649751361457-01d3a696c7e6"),
  massage: u("photo-1650044252595-cacd425982ff"),
  massageHands: u("photo-1519823551278-64ac92734fb1"),
  chiropractic: u("photo-1768507423533-b87b62769758"),
  acupuncture: u("photo-1598555763574-dca77e10427e"),
  cupping: u("photo-1598555748505-ccca0d9b9f7b"),
  pelvicFloor: u("photo-1758599878949-4c612c619219"),
  pregnancy: u("photo-1710897869539-a48e3d69a8d7"),
  mva: u("photo-1615997380705-504484cd99c4"),
  slipFall: u("photo-1545463913-5083aa7359a6"),
  orthotics: u("photo-1763198302090-76a6ca09ebd3"),
  wsib: u("photo-1645005513709-77336f075dc8"),
  braces: u("photo-1619684736572-cf0a43823d87"),
  counselling: u("photo-1758273240360-76b908e7582a"),
  compression: u("photo-1746806942505-7215c07810ae"),
  consultation: u("photo-1758691462878-6edc3d3da1be"),
  shoulderCare: u("photo-1645005512968-0c1fe99f0093"),
  exercise: u("photo-1645005513713-9e2b92a687d3"),
  resistanceBand: u("photo-1645005512942-a17817fb7c11"),
  balance: u("photo-1645005513751-e22717a66ae6"),
  backCare: u("photo-1540205895360-4ad4cffb3aa8"),
  legCare: u("photo-1746806942507-a7e93fdd6dd4"),
  kneeModel: u("photo-1748407407936-2aeffd8428dd"),
  spineChart: u("photo-1539815208687-a0f05e15d601"),
  handsCare: u("photo-1699523229199-fce5aa6b0ec3"),
  massageBack: u("photo-1699523229212-c25a2fadeb12"),
} as const;

export const PLACEHOLDER_IMAGE = "/images/placeholder.webp";

/**
 * Normalises any stored image reference for rendering.
 * Legacy WordPress-style `/uploads/...` paths never survive a serverless
 * deploy, so they resolve to the placeholder instead of a broken image.
 */
export function resolveImage(src: string | null | undefined, fallback: string = PLACEHOLDER_IMAGE): string {
  if (!src || typeof src !== "string") return fallback;
  const value = src.trim();
  if (!value) return fallback;
  if (value.startsWith("/uploads/")) return PLACEHOLDER_IMAGE;
  if (value.startsWith("/") || value.startsWith("https://")) return value;
  return fallback;
}

/** True for images served from MongoDB through the upload API. */
export function isStoredUpload(src: string | null | undefined): src is string {
  return typeof src === "string" && src.startsWith("/api/uploads/");
}

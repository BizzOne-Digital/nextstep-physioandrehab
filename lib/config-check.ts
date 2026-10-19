import "server-only";

/**
 * Lists required environment settings that are missing or malformed.
 * Returns setting NAMES only, never values, so it is safe to show on screen.
 */
export function getConfigIssues(): string[] {
  const issues: string[] = [];
  if (!process.env.MONGODB_URI) issues.push("MONGODB_URI is not set");
  const secret = process.env.AUTH_SECRET ?? "";
  if (secret.length < 32) issues.push(secret ? "AUTH_SECRET is shorter than 32 characters" : "AUTH_SECRET is not set");
  if (!process.env.ADMIN_EMAIL) issues.push("ADMIN_EMAIL is not set");
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!hash) issues.push("ADMIN_PASSWORD_HASH is not set");
  else if (hash.includes("\\$")) issues.push("ADMIN_PASSWORD_HASH still contains \\$ (on Vercel, paste the hash without backslashes)");
  else if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(hash)) issues.push("ADMIN_PASSWORD_HASH is not a valid bcrypt hash");
  return issues;
}

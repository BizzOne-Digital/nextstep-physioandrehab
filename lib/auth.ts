import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { Admin } from "@/models";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "@/lib/session";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export class AuthError extends Error {
  status = 401;
}

/** Use at the top of every admin route handler. Throws AuthError when not signed in. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new AuthError("Authentication required");
  return session;
}

// A fixed bcrypt hash so failed lookups take the same time as real comparisons.
const DUMMY_HASH = "$2b$12$6TArvadjZC2mLbdFtp1tr.ScCZJATLwQx50daLFhmMC4MZ5AbZTrS";

/**
 * Verifies admin credentials. Admins stored in MongoDB take precedence;
 * ADMIN_EMAIL + ADMIN_PASSWORD_HASH act as the bootstrap account.
 */
export async function verifyCredentials(email: string, password: string): Promise<SessionPayload | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;

  if (isDatabaseConfigured()) {
    try {
      await connectDB();
      const admin = await Admin.findOne({ email: normalized });
      if (admin) {
        const ok = await bcrypt.compare(password, admin.passwordHash);
        if (!ok) return null;
        admin.lastLoginAt = new Date();
        await admin.save();
        return { sub: String(admin._id), email: admin.email, name: admin.name };
      }
    } catch (error) {
      console.error("[auth] database lookup failed:", (error as Error).message);
    }
  }

  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (envEmail && envHash && normalized === envEmail) {
    const ok = await bcrypt.compare(password, envHash);
    return ok ? { sub: "env-admin", email: envEmail, name: "Administrator" } : null;
  }

  await bcrypt.compare(password, DUMMY_HASH);
  return null;
}

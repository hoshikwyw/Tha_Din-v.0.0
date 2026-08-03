import "server-only";

import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Admin allowlist, read from ADMIN_GMAIL. Accepts a single address or a
 * comma-separated list so additional editors can be added without a code change.
 */
const adminEmails = (): string[] =>
  (process.env.ADMIN_GMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;

  const allowed = adminEmails();
  // Fail closed. The previous inline check was `session.user.email === process.env.ADMIN_GMAIL`,
  // which granted admin to any user with no email whenever ADMIN_GMAIL was unset
  // (undefined === undefined).
  if (allowed.length === 0) return false;

  return allowed.includes(email.toLowerCase());
};

/** Session plus its admin flag, for rendering decisions in server components. */
export const getSessionWithRole = async () => {
  const session = await auth();
  return { session, isAdmin: isAdminEmail(session?.user?.email) };
};

/**
 * Authorization gate for anything that writes content. Returns the session only
 * when the caller is a signed-in admin, otherwise null.
 */
export const requireAdmin = async (): Promise<Session | null> => {
  const session = await auth();
  if (!session?.user || !isAdminEmail(session.user.email)) return null;
  return session;
};

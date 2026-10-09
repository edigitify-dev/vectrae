import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, readSessionToken, type AdminRole } from "./session";

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

/**
 * The single source of truth for "who is making this request".
 *
 * Every admin page and every mutation calls through here rather than trusting
 * the cookie alone: the token is re-checked against the database so a deleted
 * user, or one whose `session_version` was bumped, loses access immediately.
 * `cache` keeps that to one query per request.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const cookieStore = await cookies();
  const session = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  return {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  };
});

/** Redirects to the login screen instead of returning when there is no valid session. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

/** Throws for roles that may read the panel but not change anything. */
export async function requireWriteAccess(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();

  if (admin.role === "editor") {
    throw new Error("Your account has read-only access.");
  }

  return admin;
}

import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lte } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";
import { isSessionToken, SESSION_MAX_AGE_SECONDS, type AdminRole } from "./session-cookie";

export { SESSION_COOKIE, sessionCookieOptions, type AdminRole } from "./session-cookie";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  sessionVersion: number;
};

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const now = new Date();

  await withRetry(() => getDb().delete(adminSessions).where(lte(adminSessions.expiresAt, now)));
  await withRetry(() => getDb().insert(adminSessions).values({
    tokenHash: tokenHash(token),
    userId: payload.userId,
    sessionVersion: payload.sessionVersion,
    expiresAt: new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000),
  }));

  return token;
}

/** Validate the random token, expiry, account and password version in one query. */
export async function readSessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!isSessionToken(token)) {
    return null;
  }

  try {
    const [user] = await withRetry(() => getDb()
      .select({
        userId: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
        sessionVersion: adminUsers.sessionVersion,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
      .where(and(
        eq(adminSessions.tokenHash, tokenHash(token)),
        gt(adminSessions.expiresAt, new Date()),
        eq(adminSessions.sessionVersion, adminUsers.sessionVersion),
      ))
      .limit(1));

    if (!user) {
      return null;
    }

    const role = user.role === "owner" || user.role === "editor" ? user.role : "admin";
    return { ...user, role };
  } catch (error) {
    console.error("[admin/session] Failed to load session:", error);
    return null;
  }
}

export async function deleteSessionToken(token: string | undefined): Promise<void> {
  if (isSessionToken(token)) {
    await withRetry(() => getDb().delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash(token))));
  }
}

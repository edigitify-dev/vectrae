import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { lte, sql } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { requestLimits } from "@/db/schema";

export const AUTH_WINDOW_MS = 15 * 60 * 1000;

/** Only trust a client IP header supplied by the hosting platform. */
export function trustedClientIp(headers: Pick<Headers, "get">): string | null {
  if (process.env.VERCEL !== "1") return null;
  const value = headers.get("x-vercel-forwarded-for")?.trim();
  return value && isIP(value) ? value : null;
}

/** Atomic fixed-window counter. Database failures propagate and deny the operation. */
export async function takeRateLimit(scope: string, identifier: string, maximum: number, windowMs = AUTH_WINDOW_MS): Promise<boolean> {
  const key = createHash("sha256").update(`${scope}\0${identifier}`).digest("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const db = getDb();
  const result = await withRetry(() => db.batch([
    db.delete(requestLimits).where(lte(requestLimits.expiresAt, now)),
    db.insert(requestLimits).values({ key, attempts: 1, expiresAt }).onConflictDoUpdate({
      target: requestLimits.key,
      set: {
        attempts: sql`least(${requestLimits.attempts} + 1, 1000000)`,
      },
    }).returning({ attempts: requestLimits.attempts }),
  ]));
  return result[1][0].attempts <= maximum;
}

import "server-only";

import { asc } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { leadershipMembers } from "@/db/schema";
import { defaultLeadership, type LeadershipProfile } from "@/data/leadership";

export async function getLeadershipMembers(): Promise<LeadershipProfile[]> {
  try {
    return await withRetry(() => getDb().select().from(leadershipMembers)
      .orderBy(asc(leadershipMembers.sortOrder), asc(leadershipMembers.createdAt)));
  } catch (error) {
    console.error("[leadership] Could not load members:", error);
    return defaultLeadership;
  }
}

import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { leadershipMembers } from "../src/db/schema";
import { defaultLeadership } from "../src/data/leadership";
import { withRetry } from "../src/db";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  const sql = neon(process.env.DATABASE_URL);
  const migration = await readFile("drizzle/0002_leadership.sql", "utf8");
  const statements = migration.split("--> statement-breakpoint").map((statement) => statement.trim()).filter(Boolean);
  await withRetry(() => sql.transaction(statements.map((statement) => sql.query(statement))));
  console.log("Leadership schema is ready.");

  const db = drizzle(sql);
  const existing = await withRetry(() => db.select({ id: leadershipMembers.id }).from(leadershipMembers).limit(1));
  if (existing.length) {
    console.log("Existing leadership content kept; no profiles changed.");
    return;
  }
  await withRetry(() => db.insert(leadershipMembers).values(defaultLeadership).onConflictDoNothing());
  console.log(`Imported ${defaultLeadership.length} existing leadership profiles.`);
}

main().catch(() => {
  console.error("Leadership setup failed. Check the database connection and rerun npm run db:setup-leadership.");
  process.exitCode = 1;
});

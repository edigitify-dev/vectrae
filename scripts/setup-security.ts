import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { withRetry } from "../src/db";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  const sql = neon(process.env.DATABASE_URL);
  const migration = await readFile("drizzle/0004_security_rate_limits.sql", "utf8");
  const statements = migration.split("--> statement-breakpoint").map((value) => value.trim()).filter(Boolean);
  await withRetry(() => sql.transaction(statements.map((statement) => sql.query(statement))));
  console.log("Security rate-limit storage is ready. No accounts or business records were changed.");
}

main().catch(() => {
  console.error("Security setup failed. Check the database connection and rerun npm run db:setup-security.");
  process.exitCode = 1;
});

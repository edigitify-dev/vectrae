import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { and, eq, isNull } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { getDb, withRetry } from "../src/db";
import { adminUsers } from "../src/db/schema";
import { isAdminUsername, normalizeUsername } from "../src/lib/admin/username";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const id = arg("id");
  const requested = arg("username");
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Pass the existing account ID with --id.");
  }
  if (requested !== undefined && !isAdminUsername(normalizeUsername(requested))) {
    throw new Error("Pass a valid username of 3–64 letters, numbers, dots, underscores or hyphens.");
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");

  const db = getDb();
  const [target] = await withRetry(() => db.select({ id: adminUsers.id }).from(adminUsers)
    .where(eq(adminUsers.id, id)).limit(1));
  if (!target) throw new Error("Admin account not found; nothing changed.");

  const migration = await readFile("drizzle/0003_admin_usernames.sql", "utf8");
  const statements = migration.split("--> statement-breakpoint").map((value) => value.trim()).filter(Boolean);
  const sql = neon(process.env.DATABASE_URL);
  await withRetry(() => sql.transaction(statements.map((statement) => sql.query(statement))));

  const [before] = await withRetry(() => db.select({ username: adminUsers.username }).from(adminUsers)
    .where(eq(adminUsers.id, id)).limit(1));
  if (!before) throw new Error("Admin account no longer exists.");
  const username = requested !== undefined
    ? normalizeUsername(requested)
    : before.username ?? `vectrae-admin-${randomBytes(3).toString("hex")}`;

  const [updated] = await withRetry(() => db.update(adminUsers).set({ username }).where(and(
    eq(adminUsers.id, id),
    before.username === null ? isNull(adminUsers.username) : eq(adminUsers.username, before.username),
  )).returning({ username: adminUsers.username, name: adminUsers.name }));
  if (!updated) throw new Error("Account changed during setup; rerun to check its current username.");

  const [saved] = await withRetry(() => db.select({ username: adminUsers.username }).from(adminUsers)
    .where(eq(adminUsers.id, id)).limit(1));
  if (saved?.username !== username) throw new Error("Username verification failed.");

  console.log(`Display name: ${updated.name}`);
  console.log(`Username: ${saved.username}`);
  console.log("Verified. Sign in with this username and your existing admin password.");
}

main().catch(() => {
  console.error("Username setup failed. Check the account ID, username availability and database connection, then rerun.");
  process.exitCode = 1;
});

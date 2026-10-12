/**
 * Creates (or updates the password of) an admin panel user.
 *
 *   npm run admin:create -- --email you@vectrae.com --name "Vectrae Admin" --username vectrae-admin --role owner
 *
 * Omit --password to have a strong one generated and printed once. Re-running
 * for an existing email resets that user's password and revokes their sessions.
 */
import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { adminUsers } from "../src/db/schema";
import { describePasswordProblem, hashPassword } from "../src/lib/admin/password";
import { isAdminUsername, normalizeUsername } from "../src/lib/admin/username";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function generatePassword(): string {
  // base64url of 18 bytes: 24 chars, mixed case + digits, satisfies the policy.
  return `${randomBytes(18).toString("base64url")}Aa1`;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
  }

  const email = arg("email")?.trim().toLowerCase();
  const name = arg("name")?.trim();
  const role = (arg("role") ?? "owner").trim();
  const requestedUsername = arg("username");
  if (requestedUsername !== undefined && !isAdminUsername(normalizeUsername(requestedUsername))) {
    throw new Error("Username must be 3–64 letters, numbers, dots, underscores or hyphens, starting with a letter or number.");
  }

  if (!email || !name) {
    throw new Error('Usage: npm run admin:create -- --email you@vectrae.com --name "Vectrae Admin" [--username ...] [--role owner|admin|editor] [--password ...]');
  }

  if (!["owner", "admin", "editor"].includes(role)) {
    throw new Error(`Invalid role "${role}". Use owner, admin, or editor.`);
  }

  const provided = arg("password");
  const password = provided ?? generatePassword();
  const problem = describePasswordProblem(password);

  if (problem) {
    throw new Error(problem);
  }

  const db = drizzle(neon(connectionString));
  const [existing] = await db.select({ username: adminUsers.username }).from(adminUsers)
    .where(eq(adminUsers.email, email)).limit(1);
  const username = requestedUsername !== undefined
    ? normalizeUsername(requestedUsername)
    : existing?.username ?? `vectrae-admin-${randomBytes(3).toString("hex")}`;
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(adminUsers)
    .values({ email, username, name, role, passwordHash })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: {
        name,
        username,
        role,
        passwordHash,
        // Invalidate any session issued against the old password.
        sessionVersion: sql`${adminUsers.sessionVersion} + 1`,
      },
    })
    .returning({ id: adminUsers.id, username: adminUsers.username, role: adminUsers.role });

  console.log(`\n✓ Admin user ready: ${user.username} (${user.role})`);

  if (!provided) {
    console.log(`\n  Password: ${password}`);
    console.log("  Save it now — it is not stored anywhere in readable form.\n");
  }

  console.log("Sign in at /admin/login\n");
}

main().catch((error) => {
  console.error("\nFailed to create admin user:", error instanceof Error ? error.message : error);
  process.exit(1);
});

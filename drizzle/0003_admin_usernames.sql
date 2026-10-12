ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "username" text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users" USING btree ("username");

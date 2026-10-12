CREATE TABLE IF NOT EXISTS "request_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"attempts" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "request_limits_expiry_idx" ON "request_limits" USING btree ("expires_at");

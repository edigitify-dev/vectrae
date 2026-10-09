-- Includes tables previously provisioned with db:push; keep their existing data.
CREATE TABLE IF NOT EXISTS "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"issuing_org" text DEFAULT '' NOT NULL,
	"issue_date" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"file_url" text DEFAULT '' NOT NULL,
	"thumbnail_url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gallery_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"department" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"type" text DEFAULT 'Full-time' NOT NULL,
	"experience" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"responsibilities" text[] DEFAULT '{}' NOT NULL,
	"requirements" text[] DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leadership_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"linkedin_url" text DEFAULT '' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'gallery_images_category_id_gallery_categories_id_fk'
      AND conrelid = 'public.gallery_images'::regclass
  ) THEN
    ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_category_id_gallery_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "certifications_sort_order_idx" ON "certifications" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "gallery_categories_slug_key" ON "gallery_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_images_category_id_idx" ON "gallery_images" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_images_sort_order_idx" ON "gallery_images" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_openings_slug_key" ON "job_openings" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_openings_status_idx" ON "job_openings" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leadership_members_sort_order_idx" ON "leadership_members" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "leadership_members_one_featured_idx" ON "leadership_members" USING btree ("is_featured") WHERE "leadership_members"."is_featured" = true;

/**
 * Seeds the gallery categories, gallery images, and certifications tables from
 * the existing static data on the About page.
 *
 * Gallery: 37 images split across two categories — "Events" (imgs 1-18) and
 * "Projects" (imgs 19-37) — mirroring the two groups the client mentioned.
 *
 * Certifications: the four placeholder entries currently hard-coded in
 * AboutCertifications.tsx are inserted with no image (fileUrl left empty)
 * so the admin can upload the real logos/PDFs afterwards.
 *
 * Safe to re-run: existing slugs / duplicate urls are skipped by default.
 * Pass --force to clear and re-insert everything from scratch.
 *
 *   npm run db:seed-about
 *   npm run db:seed-about -- --force
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import {
  certifications as certificationsTable,
  galleryCategories as galleryCategoriesTable,
  galleryImages as galleryImagesTable,
} from "../src/db/schema";

const force = process.argv.includes("--force");

// ─────────────────────────────────────────────────────────────────────────────
// Source data
// ─────────────────────────────────────────────────────────────────────────────

const GALLERY_CATEGORIES: { name: string; slug: string; images: string[] }[] = [
  {
    name: "Events",
    slug: "events",
    images: Array.from({ length: 18 }, (_, i) => `/images/gallery/img (${i + 1}).png`),
  },
  {
    name: "Projects",
    slug: "projects",
    images: Array.from({ length: 19 }, (_, i) => `/images/gallery/img (${i + 19}).png`),
  },
];

const CERTIFICATIONS: { name: string; issuingOrg: string; description: string }[] = [
  { name: "ISO Certification",       issuingOrg: "", description: "Quality Management" },
  { name: "OEM Certification",       issuingOrg: "", description: "Technology Partner" },
  { name: "Industry Certification",  issuingOrg: "", description: "Enterprise Technology" },
  { name: "Industry Recognition",    issuingOrg: "", description: "Excellence & Innovation" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — retry on transient Neon fetch failures
// ─────────────────────────────────────────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let last: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      const msg = `${err instanceof Error ? err.message : err} ${err instanceof Error && err.cause ? err.cause : ""}`;
      const transient = ["fetch failed", "ETIMEDOUT", "ECONNRESET", "socket hang up", "network"].some(
        (s) => msg.includes(s),
      );
      if (!transient || i === attempts) throw err;
      const delay = 300 * 2 ** (i - 1);
      console.log(`  ⟳ Transient error, retry ${i}/${attempts} in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw last;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");

  const db = drizzle(neon(connectionString));

  // ── 1. Gallery ────────────────────────────────────────────────────────────

  console.log("\n── Gallery categories & images ─────────────────────────────────");

  if (force) {
    await withRetry(() => db.delete(galleryCategoriesTable));
    console.log("  ✓ Cleared existing gallery data (--force)");
  }

  let imgInserted = 0;
  let imgSkipped = 0;

  for (let catIndex = 0; catIndex < GALLERY_CATEGORIES.length; catIndex++) {
    const { name, slug, images } = GALLERY_CATEGORIES[catIndex];

    // Upsert category (idempotent by slug).
    const [catRow] = await withRetry(() =>
      db
        .insert(galleryCategoriesTable)
        .values({ name, slug, sortOrder: catIndex })
        .onConflictDoUpdate({
          target: galleryCategoriesTable.slug,
          set: { name, sortOrder: catIndex, updatedAt: new Date() },
        })
        .returning({ id: galleryCategoriesTable.id }),
    );

    if (!catRow) {
      console.warn(`  ! Failed to upsert category "${name}", skipping.`);
      continue;
    }

    console.log(`  + Category "${name}" (id: ${catRow.id})`);

    // Fetch urls already linked to this category to skip duplicates.
    const existing = await withRetry(() =>
      db
        .select({ url: galleryImagesTable.url })
        .from(galleryImagesTable)
        .where(eq(galleryImagesTable.categoryId, catRow.id)),
    );
    const existingUrls = new Set(existing.map((r) => r.url));

    for (let imgIndex = 0; imgIndex < images.length; imgIndex++) {
      const url = images[imgIndex];

      if (!force && existingUrls.has(url)) {
        imgSkipped++;
        continue;
      }

      await withRetry(() =>
        db.insert(galleryImagesTable).values({
          categoryId: catRow.id,
          url,
          alt: `Vectrae ${name.toLowerCase()} photo ${imgIndex + 1}`,
          caption: "",
          sortOrder: imgIndex,
        }),
      );

      imgInserted++;
      console.log(`      + ${url}`);
    }
  }

  console.log(`\n  Gallery done: ${imgInserted} images written, ${imgSkipped} skipped.`);

  // ── 2. Certifications ─────────────────────────────────────────────────────

  console.log("\n── Certifications ───────────────────────────────────────────────");

  if (force) {
    await withRetry(() => db.delete(certificationsTable));
    console.log("  ✓ Cleared existing certifications (--force)");
  }

  const existingCerts = await withRetry(() =>
    db.select({ name: certificationsTable.name }).from(certificationsTable),
  );
  const existingNames = new Set(existingCerts.map((r) => r.name));

  let certInserted = 0;
  let certSkipped = 0;

  for (let i = 0; i < CERTIFICATIONS.length; i++) {
    const { name, issuingOrg, description } = CERTIFICATIONS[i];

    if (!force && existingNames.has(name)) {
      certSkipped++;
      console.log(`  = "${name}" (already present)`);
      continue;
    }

    await withRetry(() =>
      db.insert(certificationsTable).values({
        name,
        issuingOrg,
        description,
        fileUrl: "",
        thumbnailUrl: "",
        sortOrder: i,
      }),
    );

    certInserted++;
    console.log(`  + "${name}"`);
  }

  console.log(`\n  Certifications done: ${certInserted} written, ${certSkipped} skipped.`);
  console.log("\n✓ All done.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error);
  process.exit(1);
});

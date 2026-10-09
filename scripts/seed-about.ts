/**
 * Seeds the gallery categories, gallery images, and certifications tables from
 * the existing static data on the About page.
 *
 * Uses the current category folders and the same public R2 assets as the site.
 * Repairs legacy flat gallery paths and replaces untouched empty certificate
 * placeholders with the actual certificate images. Uploaded content is kept.
 *
 * Safe to re-run: existing slugs / duplicate urls are skipped by default.
 * Pass --force to clear and re-insert everything from scratch.
 *
 *   npm run db:seed-about
 *   npm run db:seed-about -- --force
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import { r2Asset } from "../src/lib/site-images";
import {
  certifications as certificationsTable,
  galleryCategories as galleryCategoriesTable,
  galleryImages as galleryImagesTable,
} from "../src/db/schema";

const force = process.argv.includes("--force");

// ─────────────────────────────────────────────────────────────────────────────
// Source data
// ─────────────────────────────────────────────────────────────────────────────

const GALLERY_CATEGORIES = [
  {
    name: "Events",
    slug: "events",
    images: Array.from({ length: 19 }, (_, i) => ({
      url: r2Asset(encodeURI(`/images/gallery/events/img (${i + 1}).png`)),
      legacyUrl: `/images/gallery/img (${i + 1}).png`,
    })),
  },
  {
    name: "Projects",
    slug: "projects",
    images: Array.from({ length: 18 }, (_, i) => ({
      url: r2Asset(encodeURI(`/images/gallery/projects/img (${i + 1}).png`)),
      legacyUrl: `/images/gallery/img (${i + 20}).png`,
    })),
  },
];

const LEGACY_CERTIFICATIONS = [
  { name: "ISO Certification",       issuingOrg: "", description: "Quality Management" },
  { name: "OEM Certification",       issuingOrg: "", description: "Technology Partner" },
  { name: "Industry Certification",  issuingOrg: "", description: "Enterprise Technology" },
  { name: "Industry Recognition",    issuingOrg: "", description: "Excellence & Innovation" },
];

// The image files don't provide reliable titles; admins can name them after
// inspecting the documents rather than inheriting the old placeholder labels.
const CERTIFICATIONS = Array.from({ length: 17 }, (_, i) => ({
  name: `Certificate ${i + 1}`,
  fileUrl: r2Asset(`/images/certificates/${i === 0 ? "img" : `img${i}`}.${i === 16 ? "jpg" : "webp"}`),
}));

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
  let imgRepaired = 0;
  const existingImages = await withRetry(() => db.select().from(galleryImagesTable));

  for (let catIndex = 0; catIndex < GALLERY_CATEGORIES.length; catIndex++) {
    const { name, slug, images } = GALLERY_CATEGORIES[catIndex];

    // Keep existing category names and ordering when re-running the seed.
    await withRetry(() =>
      db
        .insert(galleryCategoriesTable)
        .values({ name, slug, sortOrder: catIndex })
        .onConflictDoNothing({ target: galleryCategoriesTable.slug }),
    );

    const [catRow] = await withRetry(() =>
      db.select({ id: galleryCategoriesTable.id }).from(galleryCategoriesTable)
        .where(eq(galleryCategoriesTable.slug, slug)),
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
      const { url, legacyUrl } = images[imgIndex];
      const legacyImages = existingImages.filter((image) => image.url === legacyUrl);

      // Repair in place, retaining IDs, captions and any edited alt text.
      for (const image of legacyImages) {
        await withRetry(() => db.update(galleryImagesTable)
          .set({ url, categoryId: catRow.id, sortOrder: imgIndex })
          .where(and(eq(galleryImagesTable.id, image.id), eq(galleryImagesTable.url, legacyUrl))));
        imgRepaired++;
      }

      if (legacyImages.length > 0) existingUrls.add(url);

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

  console.log(`\n  Gallery done: ${imgInserted} images written, ${imgRepaired} repaired, ${imgSkipped} skipped.`);

  // ── 2. Certifications ─────────────────────────────────────────────────────

  console.log("\n── Certifications ───────────────────────────────────────────────");

  if (force) {
    await withRetry(() => db.delete(certificationsTable));
    console.log("  ✓ Cleared existing certifications (--force)");
  }

  const existingCerts = await withRetry(() =>
    db.select().from(certificationsTable),
  );
  const existingFiles = new Set(existingCerts.map((r) => r.fileUrl));

  let certInserted = 0;
  let certSkipped = 0;
  let certRepaired = 0;

  for (let i = 0; i < CERTIFICATIONS.length; i++) {
    const { name, fileUrl } = CERTIFICATIONS[i];

    if (!force && existingFiles.has(fileUrl)) {
      certSkipped++;
      console.log(`  = "${name}" (already present)`);
      continue;
    }

    const legacy = LEGACY_CERTIFICATIONS[i];
    const placeholder = legacy && existingCerts.find((cert) =>
      cert.name === legacy.name && cert.description === legacy.description &&
      !cert.fileUrl && !cert.thumbnailUrl && !cert.issuingOrg && !cert.issueDate,
    );

    if (placeholder) {
      await withRetry(() => db.update(certificationsTable)
        .set({ name, description: "", fileUrl, thumbnailUrl: fileUrl, updatedAt: new Date() })
        .where(and(
          eq(certificationsTable.id, placeholder.id),
          eq(certificationsTable.fileUrl, ""),
          eq(certificationsTable.thumbnailUrl, ""),
        )));
      existingFiles.add(fileUrl);
      certRepaired++;
      console.log(`  ✓ "${name}" (linked image to empty placeholder)`);
      continue;
    }

    await withRetry(() =>
      db.insert(certificationsTable).values({
        name,
        fileUrl,
        thumbnailUrl: fileUrl,
        sortOrder: i,
      }),
    );

    certInserted++;
    existingFiles.add(fileUrl);
    console.log(`  + "${name}"`);
  }

  console.log(`\n  Certifications done: ${certInserted} written, ${certRepaired} repaired, ${certSkipped} skipped.`);
  console.log("\n✓ All done.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error);
  process.exit(1);
});

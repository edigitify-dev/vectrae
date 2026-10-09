import "server-only";

import { asc } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { galleryCategories, galleryImages } from "@/db/schema";

export type ShowcaseImage = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  categoryName: string;
  categorySlug: string;
};

/**
 * Fetches a flat list of gallery images (with their category name) for the
 * homepage "Our Work" showcase. Falls back to an empty array on any DB error
 * so a transient Neon blip never takes down the marketing page.
 */
export async function getGalleryShowcaseImages(limit = 7): Promise<ShowcaseImage[]> {
  try {
    const db = getDb();

    const [cats, imgs] = await withRetry(() =>
      db.batch([
        db.select().from(galleryCategories).orderBy(asc(galleryCategories.sortOrder), asc(galleryCategories.createdAt)),
        db
          .select()
          .from(galleryImages)
          .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt))
          .limit(limit),
      ]),
    );

    const catMap = new Map(cats.map((c) => [c.id, c]));

    return imgs.map((img) => {
      const cat = catMap.get(img.categoryId);
      return {
        id: img.id,
        url: img.url,
        alt: img.alt || cat?.name || "Project image",
        caption: img.caption,
        categoryName: cat?.name ?? "Project",
        categorySlug: cat?.slug ?? "",
      };
    });
  } catch (error) {
    console.error("[gallery] Failed to load showcase images:", error);
    return [];
  }
}

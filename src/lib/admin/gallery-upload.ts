export const GALLERY_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const ALLOWED_TYPES = new Set(GALLERY_IMAGE_ACCEPT.split(","));

export function galleryImageError(file: Pick<File, "size" | "type">): string | undefined {
  if (file.size === 0) return "Choose a non-empty image.";
  if (file.size > 8 * 1024 * 1024) return "Image must be 8 MB or smaller.";
  if (!ALLOWED_TYPES.has(file.type)) return "Image must be a JPG, PNG, WebP, or AVIF.";
}

export type GalleryUploadEntry = {
  id: string;
  file: File;
  previewUrl: string;
  alt: string;
  caption: string;
  url?: string;
  status: "ready" | "uploading" | "saving" | "saved" | "error";
  error?: string;
};

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/admin/upload-gallery", { method: "POST", body: form });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.error || typeof result?.url !== "string" || !result.url) {
    throw new Error(result?.error || "Upload failed. Please try again.");
  }
  return result.url;
}

/** Keep each request within the upload limit and retain URLs when saving fails. */
export async function uploadGalleryImages({
  entries,
  categoryId,
  onUpdate,
  saveImage,
  upload = uploadImage,
}: {
  entries: GalleryUploadEntry[];
  categoryId: string;
  onUpdate: (id: string, update: Partial<GalleryUploadEntry>) => void;
  saveImage: (form: FormData) => Promise<{ success?: string; error?: string }>;
  upload?: (file: File) => Promise<string>;
}): Promise<{ saved: number; failed: number }> {
  let saved = 0;
  let failed = 0;

  for (const entry of entries) {
    if (entry.status === "saved") continue;
    try {
      const validationError = galleryImageError(entry.file);
      if (validationError) throw new Error(validationError);

      let url = entry.url;
      if (!url) {
        onUpdate(entry.id, { status: "uploading", error: undefined });
        url = await upload(entry.file);
      }
      onUpdate(entry.id, { url, status: "saving", error: undefined });

      const form = new FormData();
      form.set("categoryId", categoryId);
      form.set("url", url);
      form.set("alt", entry.alt);
      form.set("caption", entry.caption);
      const result = await saveImage(form);
      if (result.error || !result.success) {
        throw new Error(result.error || "Couldn't add the image. Please try again.");
      }
      onUpdate(entry.id, { status: "saved" });
      saved++;
    } catch (error) {
      onUpdate(entry.id, {
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed. Please try again.",
      });
      failed++;
    }
  }
  return { saved, failed };
}

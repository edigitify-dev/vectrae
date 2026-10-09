import { getCurrentAdmin } from "@/lib/admin/auth";
import { uploadImageToR2 } from "@/lib/r2";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Certificates can be uploaded as images (JPG, PNG, WebP) or PDF thumbnails.
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);

/**
 * Uploads a certificate file to Cloudflare R2 under about/certifications.
 * PDFs are stored as-is; images are stored and their public URL is used as both
 * fileUrl and (optionally) thumbnailUrl in the certifications table.
 */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (admin.role === "editor") {
    return Response.json({ error: "Your account has read-only access." }, { status: 403 });
  }

  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose a file to upload." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File must be 10 MB or smaller." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "File must be a JPG, PNG, WebP, AVIF, or PDF." }, { status: 400 });
  }

  try {
    // uploadImageToR2 accepts any file — the extension in the key is taken from content type.
    const url = await uploadImageToR2(file, "about/certifications");
    return Response.json({ url });
  } catch (error) {
    console.error("[admin/upload-cert] Upload failed:", error);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

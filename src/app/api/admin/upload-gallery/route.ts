import { getCurrentAdmin } from "@/lib/admin/auth";
import { uploadImageToR2 } from "@/lib/r2";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

/** Uploads a gallery image to Cloudflare R2 under the gallery/images prefix. */
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
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image must be 8 MB or smaller." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "Image must be a JPG, PNG, WebP, or AVIF." }, { status: 400 });
  }

  try {
    const url = await uploadImageToR2(file, "about/gallery");
    return Response.json({ url });
  } catch (error) {
    console.error("[admin/upload-gallery] Upload failed:", error);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

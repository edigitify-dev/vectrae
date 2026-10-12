import { canWriteAdmin } from "@/lib/admin/security";
import { isSameOriginRequest } from "@/lib/security";
import { fileHasExpectedSignature } from "@/lib/file-signature";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { uploadImageToR2 } from "@/lib/r2";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

/** Uploads a blog cover image to Cloudflare R2. Public, since it renders on the live site. */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canWriteAdmin(admin.role)) {
    return Response.json({ error: "Your account has read-only access." }, { status: 403 });
  }

  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Upload must come from this site." }, { status: 403 });
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

  if (!(await fileHasExpectedSignature(file))) {
    return Response.json({ error: "File content does not match its selected type." }, { status: 400 });
  }

  try {
    const url = await uploadImageToR2(file, "blog/covers");
    return Response.json({ url });
  } catch (error) {
    console.error("[admin/upload] Cover upload failed:", error);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

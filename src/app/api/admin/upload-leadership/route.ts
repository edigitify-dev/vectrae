import { canWriteAdmin } from "@/lib/admin/security";
import { isSameOriginRequest } from "@/lib/security";
import { fileHasExpectedSignature } from "@/lib/file-signature";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { galleryImageError } from "@/lib/admin/gallery-upload";
import { uploadImageToR2 } from "@/lib/r2";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWriteAdmin(admin.role)) return Response.json({ error: "Your account has read-only access." }, { status: 403 });
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Upload must come from this site." }, { status: 403 });
  }

  let form: FormData;
  try { form = await request.formData(); }
  catch { return Response.json({ error: "Invalid upload." }, { status: 400 }); }
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose a photo to upload." }, { status: 400 });
  const error = galleryImageError(file);
  if (error) return Response.json({ error }, { status: 400 });
  if (!(await fileHasExpectedSignature(file))) {
    return Response.json({ error: "File content does not match its selected type." }, { status: 400 });
  }

  try {
    const url = await uploadImageToR2(file, "about/leadership");
    return Response.json({ url });
  } catch (error) {
    console.error("[admin/upload-leadership] Upload failed:", error);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

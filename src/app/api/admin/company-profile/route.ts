import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { canWriteAdmin } from "@/lib/admin/security";
import { isSameOriginRequest } from "@/lib/security";
import { validateCompanyProfile } from "@/lib/company-profile-file";
import { uploadCompanyProfile } from "@/lib/r2";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
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
  const error = await validateCompanyProfile(file);
  if (error || !(file instanceof File)) {
    return Response.json({ error: error ?? "Choose a PDF to upload." }, { status: 400 });
  }
  try {
    const profile = await uploadCompanyProfile(file);
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return Response.json({ profile });
  } catch (error) {
    console.error("[admin/company-profile] Upload failed:", error);
    return Response.json({ error: "Couldn't update the company profile. Please try again." }, { status: 500 });
  }
}

import { downloadCompanyProfile } from "@/lib/r2";
import { COMPANY_PROFILE_DOWNLOAD_NAME } from "@/lib/company-profile-file";

export async function GET() {
  try {
    const object = await downloadCompanyProfile();
    if (!object?.Body) {
      return new Response("The company profile is not available yet.", { status: 404 });
    }
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${COMPANY_PROFILE_DOWNLOAD_NAME}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[company-profile] Download failed:", error);
    return new Response("Couldn't download the company profile. Please try again.", { status: 503 });
  }
}

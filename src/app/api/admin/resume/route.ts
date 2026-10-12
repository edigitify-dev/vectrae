import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { jobApplications } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { readResume } from "@/lib/resume";
import { isUuid } from "@/lib/security";

/**
 * Streams a candidate's CV back to a signed-in admin.
 *
 * Resumes live in private Blob storage and are never publicly addressable, so
 * this route is the only way to read one — and it re-checks the session itself
 * rather than relying on the proxy.
 */
export async function GET(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!isUuid(id)) {
    return new Response("Invalid application id", { status: 400 });
  }

  let row: { resumeUrl: string | null; resumeFilename: string | null } | undefined;

  try {
    [row] = await getDb()
      .select({
        resumeUrl: jobApplications.resumeUrl,
        resumeFilename: jobApplications.resumeFilename,
      })
      .from(jobApplications)
      .where(eq(jobApplications.id, id))
      .limit(1);
  } catch (error) {
    console.error("[admin/resume] Lookup failed:", error);
    return new Response("Could not read the application", { status: 500 });
  }

  if (!row?.resumeUrl) {
    return new Response("No resume on file for this application", { status: 404 });
  }

  try {
    const result = await readResume(row.resumeUrl);

    if (!result || result.statusCode !== 200 || !result.stream) {
      return new Response("Resume file is no longer available", { status: 404 });
    }

    // Quote-escape the filename so a comma or quote can't break the header.
    const filename = (row.resumeFilename ?? "resume").replace(/[^\x20-\x7e]|["\\/;]/g, "_").slice(0, 180) || "resume";

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[admin/resume] Download failed:", error);
    return new Response("Could not download the resume", { status: 500 });
  }
}

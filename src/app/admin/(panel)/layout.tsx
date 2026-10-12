import { count, eq } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { contactEnquiries, jobApplications } from "@/db/schema";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

/**
 * Every page under this layout is behind `requireAdmin()`. The proxy also
 * bounces signed-out traffic, but this is the boundary that actually enforces
 * access — it re-checks the session against the database on each request.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  // Unread counts drive the sidebar badges.
  let enquiries = 0;
  let applications = 0;

  try {
    const db = getDb();

    // Batched into a single round trip to Neon.
    const [[enquiryRow], [applicationRow]] = await withRetry(() =>
      db.batch([
        db.select({ value: count() }).from(contactEnquiries).where(eq(contactEnquiries.status, "new")),
        db.select({ value: count() }).from(jobApplications).where(eq(jobApplications.status, "new")),
      ]),
    );

    enquiries = enquiryRow?.value ?? 0;
    applications = applicationRow?.value ?? 0;
  } catch (error) {
    console.error("[admin] Failed to load sidebar counts:", error);
  }

  return (
    <AdminShell
      user={{ name: admin.name, role: admin.role }}
      counts={{ enquiries, applications }}
    >
      {children}
    </AdminShell>
  );
}

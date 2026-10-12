import { cache, Suspense } from "react";
import { count, eq } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { contactEnquiries, jobApplications } from "@/db/schema";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/admin/AdminSkeleton";
import { requireAdmin } from "@/lib/admin/auth";

// Both streamed badges share one database batch for this render.
const loadCounts = cache(async () => {
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

  return { enquiries, applications };
});

async function UnreadBadge({ kind }: { kind: "enquiries" | "applications" }) {
  const counts = await loadCounts();
  const value = counts[kind];
  if (!value) return null;
  return (
    <span className="rounded-full bg-[#29B9F2]/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#7bd4f7]">
      {value > 99 ? "99+" : value}
      <span className="sr-only"> new</span>
    </span>
  );
}

function BadgeSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading unread count…</span>
      <Skeleton className="h-5 w-7 rounded-full" />
    </div>
  );
}

/** Verify access before streaming the shell or its independent count requests. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <AdminShell
      user={{ name: admin.name, role: admin.role }}
      counts={{
        enquiries: <Suspense fallback={<BadgeSkeleton />}><UnreadBadge kind="enquiries" /></Suspense>,
        applications: <Suspense fallback={<BadgeSkeleton />}><UnreadBadge kind="applications" /></Suspense>,
      }}
    >
      {children}
    </AdminShell>
  );
}

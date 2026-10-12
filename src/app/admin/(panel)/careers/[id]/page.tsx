import { isUuid } from "@/lib/security";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Check } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { jobOpenings } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import JobEditor, { type JobDraft } from "@/components/admin/JobEditor";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";
import { postStatusMeta } from "@/lib/admin/statuses";
import { isDepartment, isJobType, departments, jobTypes } from "@/lib/careers-types";
import { formatDateTime } from "@/lib/admin/format";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditJobPage({ params, searchParams }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { saved } = await searchParams;

  let row: typeof jobOpenings.$inferSelect | undefined;

  try {
    [row] = await withRetry(() =>
      getDb().select().from(jobOpenings).where(eq(jobOpenings.id, id)).limit(1),
    );
  } catch (error) {
    console.error("[admin/careers] Load failed:", error);
  }

  if (!row) {
    notFound();
  }

  const draft: JobDraft = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    // Data predates a department/type rename, or was edited outside the
    // panel — fall back to a valid default rather than rendering a <select>
    // with no matching option.
    department: isDepartment(row.department) ? row.department : departments[0],
    location: row.location,
    type: isJobType(row.type) ? row.type : jobTypes[0],
    experience: row.experience,
    summary: row.summary,
    responsibilities: row.responsibilities,
    requirements: row.requirements,
    status: row.status === "published" ? "published" : "draft",
  };

  return (
    <div className="space-y-7">
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All job openings
      </Link>

      {saved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[#84D96C]/30 bg-[#84D96C]/10 px-4 py-3 text-sm text-[#b6e8a5]"
        >
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Posting created.
        </p>
      )}

      <PageHeader
        eyebrow={`Last edited ${formatDateTime(row.updatedAt)}`}
        title={row.title || "Untitled posting"}
        actions={<StatusBadge meta={postStatusMeta(row.status)} />}
      />

      <JobEditor draft={draft} readOnly={readOnly} />
    </div>
  );
}

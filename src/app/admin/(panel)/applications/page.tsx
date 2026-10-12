import { safeExternalUrl } from "@/lib/security";
import { adminPageNumber } from "@/lib/admin/security";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Briefcase, ChevronRight, FileText, LinkIcon } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { jobApplications } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminListView from "@/components/admin/AdminListView";
import Pagination from "@/components/admin/Pagination";
import { SURFACE, TABLE_CELL, TABLE_HEAD } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin/auth";
import {
  APPLICATION_STATUSES,
  applicationStatusMeta,
  isApplicationStatus,
} from "@/lib/admin/statuses";
import { timeAgo } from "@/lib/admin/format";

const PAGE_SIZE = 25;

const FILTER_OPTIONS = APPLICATION_STATUSES.map((status) => ({
  value: status,
  label: applicationStatusMeta(status).label,
}));

type Props = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

export default async function ApplicationsPage({ searchParams }: Props) {
  await requireAdmin();

  const { status, q, page } = await searchParams;
  const currentPage = adminPageNumber(page);
  const search = typeof q === "string" ? q.trim().slice(0, 200) : "";

  const conditions: SQL[] = [];

  if (status && isApplicationStatus(status)) {
    conditions.push(eq(jobApplications.status, status));
  }

  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(jobApplications.fullName, term),
      ilike(jobApplications.email, term),
      ilike(jobApplications.phone, term),
      ilike(jobApplications.roleApplyingFor, term),
    );

    if (match) {
      conditions.push(match);
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let rows: (typeof jobApplications.$inferSelect)[] = [];
  let total = 0;
  let failed = false;

  try {
    const db = getDb();

    // Rows and total in a single batched round trip.
    const [data, [totalRow]] = await withRetry(() =>
      db.batch([
        db
          .select()
          .from(jobApplications)
          .where(where)
          .orderBy(desc(jobApplications.createdAt))
          .limit(PAGE_SIZE)
          .offset((currentPage - 1) * PAGE_SIZE),
        db.select({ value: count() }).from(jobApplications).where(where),
      ]),
    );

    rows = data;
    total = totalRow?.value ?? 0;
  } catch (error) {
    console.error("[admin/applications] Query failed:", error);
    failed = true;
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Careers page"
        title="Applications"
        description="Candidates who applied through a job opening on the site."
      />

      <AdminListView filters={<AdminFilters options={FILTER_OPTIONS} placeholder="Search name, email, phone, or role" />}>
        {failed ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            We couldn&apos;t load applications. Check the database connection and refresh.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={hasFilters ? "No matching applications" : "No applications yet"}
            description={
              hasFilters
                ? "Try a different search term, or clear the status filter."
                : "Applications submitted from any job opening will land here."
            }
            action={
              hasFilters ? (
                <Link
                  href="/admin/applications"
                  className="text-sm font-semibold text-[#7bd4f7] hover:opacity-80"
                >
                  Clear filters
                </Link>
              ) : null
            }
          />
        ) : (
          <>
            <div className={`${SURFACE} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-4xl border-collapse">
                  <caption className="sr-only">
                    Job applications, newest first. {total} in total.
                  </caption>
                  <thead className="border-b border-white/10 bg-white/[0.02]">
                    <tr>
                      <th scope="col" className={TABLE_HEAD}>
                        Candidate
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Role
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Experience
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Resume
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Status
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Applied
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        <span className="sr-only">Open</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {rows.map((row) => (
                      <tr key={row.id} className="transition-colors duration-200 hover:bg-white/[0.03]">
                        <td className={TABLE_CELL}>
                          <Link
                            href={`/admin/applications/${row.id}`}
                            className="font-medium text-white underline-offset-4 transition-colors hover:text-[#7bd4f7] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                          >
                            {row.fullName}
                          </Link>
                          <p className="mt-0.5 text-xs text-white/45">{row.email}</p>
                        </td>
                        <td className={TABLE_CELL}>{row.roleApplyingFor}</td>
                        <td className={`${TABLE_CELL} whitespace-nowrap text-white/60`}>
                          {row.experience || "—"}
                        </td>
                        <td className={TABLE_CELL}>
                          {row.resumeUrl ? (
                            <a
                              href={`/api/admin/resume?id=${row.id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7bd4f7] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                            >
                              <FileText className="h-3.5 w-3.5" aria-hidden />
                              Download
                            </a>
                          ) : safeExternalUrl(row.resumeLink) ? (
                            <a
                              href={safeExternalUrl(row.resumeLink)!}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                            >
                              <LinkIcon className="h-3.5 w-3.5" aria-hidden />
                              External link
                            </a>
                          ) : (
                            <span className="text-white/30">—</span>
                          )}
                        </td>
                        <td className={TABLE_CELL}>
                          <StatusBadge meta={applicationStatusMeta(row.status)} />
                        </td>
                        <td className={`${TABLE_CELL} whitespace-nowrap tabular-nums text-white/50`}>
                          {timeAgo(row.createdAt)}
                        </td>
                        <td className={TABLE_CELL}>
                          <Link
                            href={`/admin/applications/${row.id}`}
                            aria-label={`Open application from ${row.fullName}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                          >
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination currentPage={currentPage} total={total} pageSize={PAGE_SIZE} />
          </>
        )}
      </AdminListView>
    </div>
  );
}

import { adminPageNumber } from "@/lib/admin/security";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { ChevronRight, Mail } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { contactEnquiries } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminListView from "@/components/admin/AdminListView";
import Pagination from "@/components/admin/Pagination";
import { SURFACE, TABLE_CELL, TABLE_HEAD } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin/auth";
import { ENQUIRY_STATUSES, enquiryStatusMeta, isEnquiryStatus } from "@/lib/admin/statuses";
import { timeAgo } from "@/lib/admin/format";

const PAGE_SIZE = 25;

const FILTER_OPTIONS = ENQUIRY_STATUSES.map((status) => ({
  value: status,
  label: enquiryStatusMeta(status).label,
}));

type Props = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

export default async function EnquiriesPage({ searchParams }: Props) {
  await requireAdmin();

  const { status, q, page } = await searchParams;
  const currentPage = adminPageNumber(page);
  const search = typeof q === "string" ? q.trim().slice(0, 200) : "";

  const conditions: SQL[] = [];

  if (status && isEnquiryStatus(status)) {
    conditions.push(eq(contactEnquiries.status, status));
  }

  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(contactEnquiries.fullName, term),
      ilike(contactEnquiries.companyName, term),
      ilike(contactEnquiries.workEmail, term),
      ilike(contactEnquiries.phone, term),
    );

    if (match) {
      conditions.push(match);
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let rows: (typeof contactEnquiries.$inferSelect)[] = [];
  let total = 0;
  let failed = false;

  try {
    const db = getDb();

    // Rows and total in a single batched round trip.
    const [data, [totalRow]] = await withRetry(() =>
      db.batch([
        db
          .select()
          .from(contactEnquiries)
          .where(where)
          .orderBy(desc(contactEnquiries.createdAt))
          .limit(PAGE_SIZE)
          .offset((currentPage - 1) * PAGE_SIZE),
        db.select({ value: count() }).from(contactEnquiries).where(where),
      ]),
    );

    rows = data;
    total = totalRow?.value ?? 0;
  } catch (error) {
    console.error("[admin/enquiries] Query failed:", error);
    failed = true;
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Contact page"
        title="Enquiries"
        description="Every enquiry submitted through the website contact form."
      />

      <AdminListView filters={<AdminFilters options={FILTER_OPTIONS} placeholder="Search name, company, email, or phone" />}>
        {failed ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            We couldn&apos;t load enquiries. Check the database connection and refresh.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Mail}
            title={hasFilters ? "No matching enquiries" : "No enquiries yet"}
            description={
              hasFilters
                ? "Try a different search term, or clear the status filter."
                : "New submissions from the contact page will appear here automatically."
            }
            action={
              hasFilters ? (
                <Link
                  href="/admin/enquiries"
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
              {/* Table scrolls inside its own container so the page never does. */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-4xl border-collapse">
                  <caption className="sr-only">
                    Contact enquiries, newest first. {total} in total.
                  </caption>
                  <thead className="border-b border-white/10 bg-white/[0.02]">
                    <tr>
                      <th scope="col" className={TABLE_HEAD}>
                        Contact
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Company
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Interested in
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Status
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Received
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        <span className="sr-only">Open</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors duration-200 hover:bg-white/[0.03]"
                      >
                        <td className={TABLE_CELL}>
                          <Link
                            href={`/admin/enquiries/${row.id}`}
                            className="font-medium text-white underline-offset-4 transition-colors hover:text-[#7bd4f7] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                          >
                            {row.fullName}
                          </Link>
                          <p className="mt-0.5 text-xs text-white/45">{row.workEmail}</p>
                        </td>
                        <td className={TABLE_CELL}>
                          <p className="text-white/80">{row.companyName}</p>
                          {row.designation && (
                            <p className="mt-0.5 text-xs text-white/40">{row.designation}</p>
                          )}
                        </td>
                        <td className={`${TABLE_CELL} max-w-xs`}>
                          {row.solutionInterest.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {row.solutionInterest.slice(0, 2).map((item) => (
                                <span
                                  key={item}
                                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60"
                                >
                                  {item}
                                </span>
                              ))}
                              {row.solutionInterest.length > 2 && (
                                <span className="px-1 py-0.5 text-[11px] text-white/40">
                                  +{row.solutionInterest.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-white/30">—</span>
                          )}
                        </td>
                        <td className={TABLE_CELL}>
                          <StatusBadge meta={enquiryStatusMeta(row.status)} />
                        </td>
                        <td className={`${TABLE_CELL} whitespace-nowrap tabular-nums text-white/50`}>
                          {timeAgo(row.createdAt)}
                        </td>
                        <td className={TABLE_CELL}>
                          <Link
                            href={`/admin/enquiries/${row.id}`}
                            aria-label={`Open enquiry from ${row.fullName}`}
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

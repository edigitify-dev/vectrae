import { adminPageNumber } from "@/lib/admin/security";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Briefcase, ExternalLink, MapPin, Plus } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { jobOpenings } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminListView from "@/components/admin/AdminListView";
import Pagination from "@/components/admin/Pagination";
import { BUTTON_PRIMARY, SURFACE, TABLE_CELL, TABLE_HEAD } from "@/components/admin/tokens";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";
import { postStatusMeta } from "@/lib/admin/statuses";
import { departmentIcons, type Department } from "@/lib/careers-types";
import { timeAgo } from "@/lib/admin/format";
import { BRAND_GRADIENT } from "@/lib/brand";

const PAGE_SIZE = 20;

const FILTER_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

type Props = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

export default async function CareersListPage({ searchParams }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { status, q, page } = await searchParams;
  const currentPage = adminPageNumber(page);
  const search = typeof q === "string" ? q.trim().slice(0, 200) : "";

  const conditions: SQL[] = [];

  if (status === "published" || status === "draft") {
    conditions.push(eq(jobOpenings.status, status));
  }

  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(jobOpenings.title, term),
      ilike(jobOpenings.slug, term),
      ilike(jobOpenings.department, term),
      ilike(jobOpenings.location, term),
    );

    if (match) {
      conditions.push(match);
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let rows: (typeof jobOpenings.$inferSelect)[] = [];
  let total = 0;
  let failed = false;

  try {
    const db = getDb();

    const [data, [totalRow]] = await withRetry(() =>
      db.batch([
        db
          .select()
          .from(jobOpenings)
          .where(where)
          .orderBy(desc(jobOpenings.updatedAt))
          .limit(PAGE_SIZE)
          .offset((currentPage - 1) * PAGE_SIZE),
        db.select({ value: count() }).from(jobOpenings).where(where),
      ]),
    );

    rows = data;
    total = totalRow?.value ?? 0;
  } catch (error) {
    console.error("[admin/careers] Query failed:", error);
    failed = true;
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Careers page"
        title="Job openings"
        description="Write, edit, and publish roles. Published postings go live on the careers page immediately."
        actions={
          !readOnly && (
            <Link
              href="/admin/careers/new"
              style={{ backgroundImage: BRAND_GRADIENT }}
              className={BUTTON_PRIMARY}
            >
              <Plus className="h-4 w-4" aria-hidden />
              New posting
            </Link>
          )
        }
      />

      <AdminListView filters={<AdminFilters options={FILTER_OPTIONS} placeholder="Search title, slug, department, or location" />}>
        {failed ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            We couldn&apos;t load job openings. Check the database connection and refresh.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={hasFilters ? "No matching postings" : "No job openings yet"}
            description={
              hasFilters
                ? "Try a different search term, or clear the status filter."
                : "Import the existing roles with `npm run db:seed-careers`, or create your first posting here."
            }
            action={
              hasFilters ? (
                <Link href="/admin/careers" className="text-sm font-semibold text-[#7bd4f7] hover:opacity-80">
                  Clear filters
                </Link>
              ) : (
                !readOnly && (
                  <Link
                    href="/admin/careers/new"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                    className={BUTTON_PRIMARY}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    New posting
                  </Link>
                )
              )
            }
          />
        ) : (
          <>
            <div className={`${SURFACE} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-4xl border-collapse">
                  <caption className="sr-only">Job openings, most recently edited first.</caption>
                  <thead className="border-b border-white/10 bg-white/[0.02]">
                    <tr>
                      <th scope="col" className={TABLE_HEAD}>
                        Role
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Department
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Location
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Status
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Edited
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        <span className="sr-only">View live</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {rows.map((row) => {
                      const Icon = departmentIcons[row.department as Department] ?? Briefcase;

                      return (
                        <tr key={row.id} className="relative transition-colors duration-200 hover:bg-white/[0.03]">
                          <td className={TABLE_CELL}>
                            <div className="flex items-start gap-3">
                              <span
                                aria-hidden
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[#29B9F2]"
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <Link
                                  href={`/admin/careers/${row.id}`}
                                  className="font-medium text-white underline-offset-4 transition-colors after:absolute after:inset-0 hover:text-[#7bd4f7] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                                >
                                  <span className="line-clamp-1">{row.title}</span>
                                </Link>
                                <p className="mt-0.5 truncate text-xs text-white/40">/careers/{row.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className={`${TABLE_CELL} whitespace-nowrap text-white/60`}>{row.department}</td>
                          <td className={`${TABLE_CELL} whitespace-nowrap text-white/60`}>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-white/30" aria-hidden />
                              {row.location || "—"}
                            </span>
                          </td>
                          <td className={TABLE_CELL}>
                            <StatusBadge meta={postStatusMeta(row.status)} />
                          </td>
                          <td className={`${TABLE_CELL} whitespace-nowrap tabular-nums text-white/50`}>
                            {timeAgo(row.updatedAt)}
                          </td>
                          <td className={TABLE_CELL}>
                            {row.status === "published" ? (
                              <a
                                href={`/careers/${row.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`View "${row.title}" on the live site`}
                                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                              >
                                <ExternalLink className="h-4 w-4" aria-hidden />
                              </a>
                            ) : (
                              <span className="block h-9 w-9" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
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

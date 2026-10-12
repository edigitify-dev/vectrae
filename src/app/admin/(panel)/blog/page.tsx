import { adminPageNumber } from "@/lib/admin/security";
import Link from "next/link";
import Image from "next/image";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { ExternalLink, FileText, Plus, Star } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { blogPosts } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminListView from "@/components/admin/AdminListView";
import Pagination from "@/components/admin/Pagination";
import { BUTTON_PRIMARY, SURFACE, TABLE_CELL, TABLE_HEAD } from "@/components/admin/tokens";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";
import { postStatusMeta } from "@/lib/admin/statuses";
import { formatDate, timeAgo } from "@/lib/admin/format";
import { BRAND_GRADIENT } from "@/lib/brand";

const PAGE_SIZE = 20;

const FILTER_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

type Props = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

export default async function BlogListPage({ searchParams }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { status, q, page } = await searchParams;
  const currentPage = adminPageNumber(page);
  const search = typeof q === "string" ? q.trim().slice(0, 200) : "";

  const conditions: SQL[] = [];

  if (status === "published" || status === "draft") {
    conditions.push(eq(blogPosts.status, status));
  }

  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(blogPosts.title, term),
      ilike(blogPosts.slug, term),
      ilike(blogPosts.category, term),
      ilike(blogPosts.authorName, term),
    );

    if (match) {
      conditions.push(match);
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let rows: (typeof blogPosts.$inferSelect)[] = [];
  let total = 0;
  let failed = false;

  try {
    const db = getDb();

    // Rows and total in a single batched round trip.
    const [data, [totalRow]] = await withRetry(() =>
      db.batch([
        db
          .select()
          .from(blogPosts)
          .where(where)
          .orderBy(desc(blogPosts.updatedAt))
          .limit(PAGE_SIZE)
          .offset((currentPage - 1) * PAGE_SIZE),
        db.select({ value: count() }).from(blogPosts).where(where),
      ]),
    );

    rows = data;
    total = totalRow?.value ?? 0;
  } catch (error) {
    console.error("[admin/blog] Query failed:", error);
    failed = true;
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Content"
        title="Blog"
        description="Write, edit, and publish articles. Published posts go live on the site immediately."
        actions={
          !readOnly && (
            <Link href="/admin/blog/new" style={{ backgroundImage: BRAND_GRADIENT }} className={BUTTON_PRIMARY}>
              <Plus className="h-4 w-4" aria-hidden />
              New post
            </Link>
          )
        }
      />

      <AdminListView filters={<AdminFilters options={FILTER_OPTIONS} placeholder="Search title, slug, category, or author" />}>
        {failed ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            We couldn&apos;t load posts. Check the database connection and refresh.
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={hasFilters ? "No matching posts" : "No posts yet"}
            description={
              hasFilters
                ? "Try a different search term, or clear the status filter."
                : "Import the existing articles with `npm run db:seed`, or write your first post here."
            }
            action={
              hasFilters ? (
                <Link href="/admin/blog" className="text-sm font-semibold text-[#7bd4f7] hover:opacity-80">
                  Clear filters
                </Link>
              ) : (
                !readOnly && (
                  <Link
                    href="/admin/blog/new"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                    className={BUTTON_PRIMARY}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    New post
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
                  <caption className="sr-only">Blog posts, most recently edited first.</caption>
                  <thead className="border-b border-white/10 bg-white/[0.02]">
                    <tr>
                      <th scope="col" className={TABLE_HEAD}>
                        Post
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Category
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Author
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Status
                      </th>
                      <th scope="col" className={TABLE_HEAD}>
                        Published
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
                    {rows.map((row) => (
                      <tr key={row.id} className="transition-colors duration-200 hover:bg-white/[0.03]">
                        <td className={TABLE_CELL}>
                          <div className="flex items-start gap-3">
                            {row.image ? (
                              <Image
                                src={row.image}
                                alt=""
                                width={56}
                                height={40}
                                unoptimized
                                className="h-10 w-14 shrink-0 rounded-md border border-white/10 object-cover"
                              />
                            ) : (
                              <span
                                aria-hidden
                                className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/25"
                              >
                                <FileText className="h-4 w-4" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <Link
                                href={`/admin/blog/${row.id}`}
                                className="flex items-center gap-1.5 font-medium text-white underline-offset-4 transition-colors hover:text-[#7bd4f7] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                              >
                                <span className="line-clamp-1">{row.title}</span>
                                {row.featured && (
                                  <Star
                                    className="h-3.5 w-3.5 shrink-0 fill-[#B6D93B] text-[#B6D93B]"
                                    aria-label="Featured"
                                  />
                                )}
                              </Link>
                              <p className="mt-0.5 truncate text-xs text-white/40">/blog/{row.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`${TABLE_CELL} whitespace-nowrap`}>
                          <span
                            className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
                            style={{
                              color: row.color,
                              borderColor: `${row.color}45`,
                              backgroundColor: `${row.color}14`,
                            }}
                          >
                            {row.category}
                          </span>
                        </td>
                        <td className={`${TABLE_CELL} whitespace-nowrap text-white/60`}>
                          {row.authorName || "—"}
                        </td>
                        <td className={TABLE_CELL}>
                          <StatusBadge meta={postStatusMeta(row.status)} />
                        </td>
                        <td className={`${TABLE_CELL} whitespace-nowrap tabular-nums text-white/50`}>
                          {formatDate(row.publishedAt)}
                        </td>
                        <td className={`${TABLE_CELL} whitespace-nowrap tabular-nums text-white/50`}>
                          {timeAgo(row.updatedAt)}
                        </td>
                        <td className={TABLE_CELL}>
                          {row.status === "published" ? (
                            <a
                              href={`/blog/${row.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`View "${row.title}" on the live site`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                            >
                              <ExternalLink className="h-4 w-4" aria-hidden />
                            </a>
                          ) : (
                            <span className="block h-9 w-9" />
                          )}
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

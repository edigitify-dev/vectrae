import Link from "next/link";
import { count, desc, eq, gte } from "drizzle-orm";
import { Briefcase, ClipboardList, FileText, Inbox, Mail, PenSquare, TrendingUp } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { blogPosts, contactEnquiries, jobApplications, jobOpenings } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import { SURFACE } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin/auth";
import { applicationStatusMeta, enquiryStatusMeta, postStatusMeta } from "@/lib/admin/statuses";
import { timeAgo } from "@/lib/admin/format";

type Overview = {
  newEnquiries: number;
  newApplications: number;
  publishedPosts: number;
  draftPosts: number;
  openJobs: number;
  draftJobs: number;
  enquiriesThisWeek: number;
  applicationsThisWeek: number;
  recentEnquiries: {
    id: string;
    fullName: string;
    companyName: string;
    status: string;
    createdAt: Date;
  }[];
  recentApplications: {
    id: string;
    fullName: string;
    roleApplyingFor: string;
    status: string;
    createdAt: Date;
  }[];
  recentPosts: { id: string; title: string; status: string; updatedAt: Date }[];
  recentJobs: { id: string; title: string; status: string; updatedAt: Date }[];
};

const EMPTY: Overview = {
  newEnquiries: 0,
  newApplications: 0,
  publishedPosts: 0,
  draftPosts: 0,
  openJobs: 0,
  draftJobs: 0,
  enquiriesThisWeek: 0,
  applicationsThisWeek: 0,
  recentEnquiries: [],
  recentApplications: [],
  recentPosts: [],
  recentJobs: [],
};

async function loadOverview(): Promise<{ data: Overview; failed: boolean }> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const db = getDb();

    // One batched round trip rather than nine separate ones: fewer network
    // hops to Neon, and far less exposure to a transient connection drop.
    const [
      [newEnquiries],
      [newApplications],
      [publishedPosts],
      [draftPosts],
      [openJobs],
      [draftJobs],
      [enquiriesThisWeek],
      [applicationsThisWeek],
      recentEnquiries,
      recentApplications,
      recentPosts,
      recentJobs,
    ] = await withRetry(() =>
      db.batch([
        db.select({ value: count() }).from(contactEnquiries).where(eq(contactEnquiries.status, "new")),
        db.select({ value: count() }).from(jobApplications).where(eq(jobApplications.status, "new")),
        db.select({ value: count() }).from(blogPosts).where(eq(blogPosts.status, "published")),
        db.select({ value: count() }).from(blogPosts).where(eq(blogPosts.status, "draft")),
        db.select({ value: count() }).from(jobOpenings).where(eq(jobOpenings.status, "published")),
        db.select({ value: count() }).from(jobOpenings).where(eq(jobOpenings.status, "draft")),
        db.select({ value: count() }).from(contactEnquiries).where(gte(contactEnquiries.createdAt, weekAgo)),
        db.select({ value: count() }).from(jobApplications).where(gte(jobApplications.createdAt, weekAgo)),
        db
          .select({
            id: contactEnquiries.id,
            fullName: contactEnquiries.fullName,
            companyName: contactEnquiries.companyName,
            status: contactEnquiries.status,
            createdAt: contactEnquiries.createdAt,
          })
          .from(contactEnquiries)
          .orderBy(desc(contactEnquiries.createdAt))
          .limit(5),
        db
          .select({
            id: jobApplications.id,
            fullName: jobApplications.fullName,
            roleApplyingFor: jobApplications.roleApplyingFor,
            status: jobApplications.status,
            createdAt: jobApplications.createdAt,
          })
          .from(jobApplications)
          .orderBy(desc(jobApplications.createdAt))
          .limit(5),
        db
          .select({
            id: blogPosts.id,
            title: blogPosts.title,
            status: blogPosts.status,
            updatedAt: blogPosts.updatedAt,
          })
          .from(blogPosts)
          .orderBy(desc(blogPosts.updatedAt))
          .limit(5),
        db
          .select({
            id: jobOpenings.id,
            title: jobOpenings.title,
            status: jobOpenings.status,
            updatedAt: jobOpenings.updatedAt,
          })
          .from(jobOpenings)
          .orderBy(desc(jobOpenings.updatedAt))
          .limit(5),
      ]),
    );

    return {
      failed: false,
      data: {
        newEnquiries: newEnquiries?.value ?? 0,
        newApplications: newApplications?.value ?? 0,
        publishedPosts: publishedPosts?.value ?? 0,
        draftPosts: draftPosts?.value ?? 0,
        openJobs: openJobs?.value ?? 0,
        draftJobs: draftJobs?.value ?? 0,
        enquiriesThisWeek: enquiriesThisWeek?.value ?? 0,
        applicationsThisWeek: applicationsThisWeek?.value ?? 0,
        recentEnquiries,
        recentApplications,
        recentPosts,
        recentJobs,
      },
    };
  } catch (error) {
    console.error("[admin/overview] Failed to load dashboard:", error);
    return { failed: true, data: EMPTY };
  }
}

function greeting(): string {
  // Hour of day in IST, where the team is.
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(
      new Date(),
    ),
  );

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const { data, failed } = await loadOverview();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`${greeting()}, ${admin.name}`}
        description="Everything waiting on the team, in one place."
      />

      {failed && (
        <p
          role="alert"
          className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
        >
          Couldn&apos;t reach the database, so these figures may be incomplete. Try refreshing.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="New enquiries"
          value={data.newEnquiries}
          hint={`${data.enquiriesThisWeek} in the last 7 days`}
          icon={Mail}
          href="/admin/enquiries?status=new"
          accent="#29B9F2"
        />
        <StatCard
          label="New applications"
          value={data.newApplications}
          hint={`${data.applicationsThisWeek} in the last 7 days`}
          icon={Briefcase}
          href="/admin/applications?status=new"
          accent="#25D9C7"
        />
        <StatCard
          label="Published posts"
          value={data.publishedPosts}
          hint="Live on the blog"
          icon={FileText}
          href="/admin/blog?status=published"
          accent="#84D96C"
        />
        <StatCard
          label="Drafts"
          value={data.draftPosts}
          hint="Not yet visible publicly"
          icon={PenSquare}
          href="/admin/blog?status=draft"
          accent="#B6D93B"
        />
        <StatCard
          label="Open positions"
          value={data.openJobs}
          hint="Live on the careers page"
          icon={ClipboardList}
          href="/admin/careers?status=published"
          accent="#29B9F2"
        />
        <StatCard
          label="Draft postings"
          value={data.draftJobs}
          hint="Not yet visible publicly"
          icon={ClipboardList}
          href="/admin/careers?status=draft"
          accent="#25D9C7"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className={`${SURFACE} overflow-hidden`} aria-labelledby="recent-enquiries">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 id="recent-enquiries" className="text-sm font-semibold text-white">
              Latest enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#7bd4f7] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
            >
              View all
            </Link>
          </header>

          {data.recentEnquiries.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-white/40">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-white/8">
              {data.recentEnquiries.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/enquiries/${row.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29B9F2]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{row.fullName}</p>
                      <p className="truncate text-xs text-white/45">{row.companyName}</p>
                    </div>
                    <StatusBadge meta={enquiryStatusMeta(row.status)} />
                    <span className="shrink-0 text-xs tabular-nums text-white/35">
                      {timeAgo(row.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${SURFACE} overflow-hidden`} aria-labelledby="recent-applications">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 id="recent-applications" className="text-sm font-semibold text-white">
              Latest applications
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs font-semibold text-[#7bd4f7] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
            >
              View all
            </Link>
          </header>

          {data.recentApplications.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-white/40">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-white/8">
              {data.recentApplications.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/applications/${row.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29B9F2]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{row.fullName}</p>
                      <p className="truncate text-xs text-white/45">{row.roleApplyingFor}</p>
                    </div>
                    <StatusBadge meta={applicationStatusMeta(row.status)} />
                    <span className="shrink-0 text-xs tabular-nums text-white/35">
                      {timeAgo(row.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className={`${SURFACE} overflow-hidden`} aria-labelledby="recent-posts">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 id="recent-posts" className="text-sm font-semibold text-white">
            Recently edited posts
          </h2>
          <Link
            href="/admin/blog"
            className="text-xs font-semibold text-[#7bd4f7] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
          >
            Manage blog
          </Link>
        </header>

        {data.recentPosts.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No posts yet"
            description="Run the seed script to import the existing articles, or write a new post from scratch."
          />
        ) : (
          <ul className="divide-y divide-white/8">
            {data.recentPosts.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/blog/${row.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29B9F2]"
                >
                  <TrendingUp className="h-4 w-4 shrink-0 text-white/25" aria-hidden />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">{row.title}</p>
                  <StatusBadge meta={postStatusMeta(row.status)} />
                  <span className="shrink-0 text-xs tabular-nums text-white/35">
                    {timeAgo(row.updatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${SURFACE} overflow-hidden`} aria-labelledby="recent-jobs">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 id="recent-jobs" className="text-sm font-semibold text-white">
            Recently edited postings
          </h2>
          <Link
            href="/admin/careers"
            className="text-xs font-semibold text-[#7bd4f7] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
          >
            Manage careers
          </Link>
        </header>

        {data.recentJobs.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No job openings yet"
            description="Run the seed script to import the existing roles, or create a new posting from scratch."
          />
        ) : (
          <ul className="divide-y divide-white/8">
            {data.recentJobs.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/careers/${row.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29B9F2]"
                >
                  <ClipboardList className="h-4 w-4 shrink-0 text-white/25" aria-hidden />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">{row.title}</p>
                  <StatusBadge meta={postStatusMeta(row.status)} />
                  <span className="shrink-0 text-xs tabular-nums text-white/35">
                    {timeAgo(row.updatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

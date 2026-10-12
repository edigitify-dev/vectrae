import { isUuid, safeExternalUrl } from "@/lib/security";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  Briefcase,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { getDb, withRetry } from "@/db";
import { jobApplications } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusSelect from "@/components/admin/StatusSelect";
import NotesEditor from "@/components/admin/NotesEditor";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { BUTTON_DANGER, CARD, SURFACE } from "@/components/admin/tokens";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";
import { APPLICATION_STATUSES, applicationStatusMeta } from "@/lib/admin/statuses";
import {
  deleteApplication,
  saveApplicationNotes,
  updateApplicationStatus,
} from "@/lib/admin/actions";
import { formatBytes, formatDateTime } from "@/lib/admin/format";

type Props = { params: Promise<{ id: string }> };

const STATUS_OPTIONS = APPLICATION_STATUSES.map((status) => ({
  value: status,
  meta: applicationStatusMeta(status),
}));

export default async function ApplicationDetailPage({ params }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { id } = await params;
  if (!isUuid(id)) notFound();

  let row: typeof jobApplications.$inferSelect | undefined;

  try {
    [row] = await withRetry(() =>
      getDb().select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1),
    );
  } catch (error) {
    console.error("[admin/application] Load failed:", error);
  }

  if (!row) {
    notFound();
  }

  return (
    <div className="space-y-7">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All applications
      </Link>

      <PageHeader
        eyebrow={`Applied ${formatDateTime(row.createdAt)}`}
        title={row.fullName}
        description={row.roleApplyingFor}
        actions={
          <a
            href={`mailto:${row.email}?subject=${encodeURIComponent(`Your application for ${row.roleApplyingFor}`)}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-5 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Email candidate
          </a>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <section className={CARD} aria-labelledby="candidate-details">
            <h2 id="candidate-details" className="text-sm font-semibold text-white">
              Candidate details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Email</p>
                <a
                  href={`mailto:${row.email}`}
                  className="mt-1.5 inline-flex items-center gap-2 text-sm text-[#7bd4f7] underline-offset-4 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {row.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Phone</p>
                <a
                  href={`tel:${row.phone}`}
                  className="mt-1.5 inline-flex items-center gap-2 text-sm text-[#7bd4f7] underline-offset-4 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {row.phone}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Experience
                </p>
                <p className="mt-1.5 text-sm text-white/85">{row.experience || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Opening
                </p>
                {row.jobSlug ? (
                  <Link
                    href={`/careers/${row.jobSlug}`}
                    target="_blank"
                    className="mt-1.5 inline-flex items-center gap-2 text-sm text-[#7bd4f7] underline-offset-4 hover:underline"
                  >
                    <Briefcase className="h-3.5 w-3.5" aria-hidden />
                    {row.roleApplyingFor}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </Link>
                ) : (
                  <p className="mt-1.5 text-sm text-white/85">{row.roleApplyingFor}</p>
                )}
              </div>
            </div>
          </section>

          <section className={CARD} aria-labelledby="candidate-resume">
            <h2 id="candidate-resume" className="text-sm font-semibold text-white">
              Resume
            </h2>

            {row.resumeUrl ? (
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#29B9F2]/30 bg-[#29B9F2]/10 text-[#7bd4f7]"
                >
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {row.resumeFilename ?? "resume"}
                  </p>
                  <p className="text-xs tabular-nums text-white/45">{formatBytes(row.resumeSize)}</p>
                </div>
                <a
                  href={`/api/admin/resume?id=${row.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-4 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download
                </a>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/40">No file was uploaded.</p>
            )}

            {safeExternalUrl(row.resumeLink) && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Portfolio / external link
                </p>
                <a
                  href={safeExternalUrl(row.resumeLink)!}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1.5 inline-flex max-w-full items-center gap-2 truncate text-sm text-[#7bd4f7] underline-offset-4 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{row.resumeLink}</span>
                </a>
              </div>
            )}
          </section>

          <section className={CARD} aria-labelledby="candidate-message">
            <h2 id="candidate-message" className="text-sm font-semibold text-white">
              Cover note
            </h2>
            {row.message ? (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {row.message}
              </p>
            ) : (
              <p className="mt-4 text-sm text-white/40">No cover note was included.</p>
            )}
          </section>

          <section className={CARD} aria-labelledby="candidate-notes">
            <h2 id="candidate-notes" className="text-sm font-semibold text-white">
              Interview notes
            </h2>
            <p className="mt-1 text-xs text-white/40">
              Visible to the hiring team only, never to the candidate.
            </p>
            <div className="mt-4">
              <NotesEditor
                id={row.id}
                initialValue={row.internalNotes ?? ""}
                action={saveApplicationNotes}
                disabled={readOnly}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className={CARD} aria-labelledby="candidate-stage">
            <h2 id="candidate-stage" className="text-sm font-semibold text-white">
              Hiring stage
            </h2>
            <div className="mt-4">
              <StatusSelect
                id={row.id}
                current={row.status}
                options={STATUS_OPTIONS}
                action={updateApplicationStatus}
                disabled={readOnly}
              />
            </div>
            <dl className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-white/40">Applied</dt>
                <dd className="text-right tabular-nums text-white/70">
                  {formatDateTime(row.createdAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/40">Last updated</dt>
                <dd className="text-right tabular-nums text-white/70">
                  {formatDateTime(row.updatedAt)}
                </dd>
              </div>
            </dl>
          </section>

          {!readOnly && (
            <form action={deleteApplication} className={`${SURFACE} p-5`}>
              <input type="hidden" name="id" value={row.id} />
              <h2 className="text-sm font-semibold text-white">Danger zone</h2>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                Deleting removes the application and its stored resume permanently.
              </p>
              <div className="mt-4">
                <ConfirmSubmit
                  label="Delete application"
                  confirmLabel="Yes, delete permanently"
                  pendingLabel="Deleting…"
                  icon={<Trash2 className="h-4 w-4" aria-hidden />}
                  className={BUTTON_DANGER}
                />
              </div>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

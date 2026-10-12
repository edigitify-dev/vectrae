import { isUuid } from "@/lib/security";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Building2, Mail, Phone, Trash2, Users } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { contactEnquiries } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import StatusSelect from "@/components/admin/StatusSelect";
import NotesEditor from "@/components/admin/NotesEditor";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { BUTTON_DANGER, CARD, SURFACE } from "@/components/admin/tokens";
import { getCurrentAdmin, requireAdmin } from "@/lib/admin/auth";
import { ENQUIRY_STATUSES, enquiryStatusMeta } from "@/lib/admin/statuses";
import { deleteEnquiry, saveEnquiryNotes, updateEnquiryStatus } from "@/lib/admin/actions";
import { formatDateTime } from "@/lib/admin/format";

type Props = { params: Promise<{ id: string }> };

const STATUS_OPTIONS = ENQUIRY_STATUSES.map((status) => ({
  value: status,
  meta: enquiryStatusMeta(status),
}));

function Field({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | null;
  href?: string;
  icon?: typeof Mail;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{label}</p>
      {value ? (
        href ? (
          <a
            href={href}
            className="mt-1.5 inline-flex items-center gap-2 text-sm text-[#7bd4f7] underline-offset-4 transition-opacity hover:underline hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
            {value}
          </a>
        ) : (
          <p className="mt-1.5 text-sm text-white/85">{value}</p>
        )
      ) : (
        <p className="mt-1.5 text-sm text-white/30">Not provided</p>
      )}
    </div>
  );
}

export default async function EnquiryDetailPage({ params }: Props) {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  const readOnly = admin?.role === "editor";

  const { id } = await params;
  if (!isUuid(id)) notFound();

  let row: typeof contactEnquiries.$inferSelect | undefined;

  try {
    [row] = await withRetry(() =>
      getDb().select().from(contactEnquiries).where(eq(contactEnquiries.id, id)).limit(1),
    );
  } catch (error) {
    console.error("[admin/enquiry] Load failed:", error);
  }

  if (!row) {
    notFound();
  }

  return (
    <div className="space-y-7">
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All enquiries
      </Link>

      <PageHeader
        eyebrow={`Received ${formatDateTime(row.createdAt)}`}
        title={row.fullName}
        description={`${row.companyName}${row.designation ? ` · ${row.designation}` : ""}`}
        actions={
          <a
            href={`mailto:${row.workEmail}?subject=${encodeURIComponent(`Re: your enquiry to Vectrae`)}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-5 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Reply by email
          </a>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <section className={CARD} aria-labelledby="enquiry-details">
            <h2 id="enquiry-details" className="text-sm font-semibold text-white">
              Contact details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Work email" value={row.workEmail} href={`mailto:${row.workEmail}`} icon={Mail} />
              <Field label="Phone" value={row.phone} href={`tel:${row.phone}`} icon={Phone} />
              <Field label="Company" value={row.companyName} />
              <Field label="Designation" value={row.designation} />
              <Field label="Company size" value={row.companySize} />
              <Field label="How they heard of us" value={row.howHeard} />
            </div>
          </section>

          <section className={CARD} aria-labelledby="enquiry-interest">
            <h2 id="enquiry-interest" className="text-sm font-semibold text-white">
              Solutions of interest
            </h2>

            {row.solutionInterest.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {row.solutionInterest.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#29B9F2]/30 bg-[#29B9F2]/10 px-3 py-1.5 text-xs font-medium text-[#7bd4f7]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/40">None selected.</p>
            )}
          </section>

          <section className={CARD} aria-labelledby="enquiry-message">
            <h2 id="enquiry-message" className="text-sm font-semibold text-white">
              Message
            </h2>
            {row.message ? (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {row.message}
              </p>
            ) : (
              <p className="mt-4 text-sm text-white/40">No message was included.</p>
            )}
          </section>

          <section className={CARD} aria-labelledby="enquiry-notes">
            <h2 id="enquiry-notes" className="text-sm font-semibold text-white">
              Internal notes
            </h2>
            <p className="mt-1 text-xs text-white/40">Visible to the team only, never to the sender.</p>
            <div className="mt-4">
              <NotesEditor
                id={row.id}
                initialValue={row.internalNotes ?? ""}
                action={saveEnquiryNotes}
                disabled={readOnly}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className={CARD} aria-labelledby="enquiry-status">
            <h2 id="enquiry-status" className="text-sm font-semibold text-white">
              Status
            </h2>
            <div className="mt-4">
              <StatusSelect
                id={row.id}
                current={row.status}
                options={STATUS_OPTIONS}
                action={updateEnquiryStatus}
                disabled={readOnly}
              />
            </div>
            <dl className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-white/40">Received</dt>
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

          <section className={`${SURFACE} p-5`} aria-labelledby="enquiry-quick">
            <h2 id="enquiry-quick" className="text-sm font-semibold text-white">
              Quick actions
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <a
                href={`mailto:${row.workEmail}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Email {row.fullName.split(" ")[0]}
              </a>
              <a
                href={`tel:${row.phone}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call {row.phone}
              </a>
              <p className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/50">
                <Building2 className="h-4 w-4" aria-hidden />
                {row.companyName}
              </p>
              {row.companySize && (
                <p className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/50">
                  <Users className="h-4 w-4" aria-hidden />
                  {row.companySize}
                </p>
              )}
            </div>
          </section>

          {!readOnly && (
            <form action={deleteEnquiry} className={`${SURFACE} p-5`}>
              <input type="hidden" name="id" value={row.id} />
              <h2 className="text-sm font-semibold text-white">Danger zone</h2>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                Deleting removes this enquiry permanently. This cannot be undone.
              </p>
              <div className="mt-4">
                <ConfirmSubmit
                  label="Delete enquiry"
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

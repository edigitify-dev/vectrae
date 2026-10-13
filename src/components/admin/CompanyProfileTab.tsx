"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Loader2, Upload } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { validateCompanyProfile, type CompanyProfile } from "@/lib/company-profile-file";
import { BUTTON_GHOST, BUTTON_PRIMARY, INPUT, LABEL, SURFACE } from "./tokens";

export default function CompanyProfileTab({
  profile: initialProfile,
  loadError,
  readOnly,
}: {
  profile: CompanyProfile | null;
  loadError: boolean;
  readOnly: boolean;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");
    setSuccess("");
    setPending(true);
    try {
      const validationError = await validateCompanyProfile(data.get("file"));
      if (validationError) {
        setError(validationError);
        return;
      }
      const response = await fetch("/api/admin/company-profile", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.profile) throw new Error(result.error ?? "Upload failed. Please try again.");
      setProfile(result.profile);
      setSuccess("Company profile updated. Visitors can now download it from the About page.");
      form.reset();
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`${SURFACE} space-y-6 p-5 sm:p-6`}>
      <div>
        <h2 className="text-base font-semibold text-white">Company Profile</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Upload the PDF visitors can download from the About page. A new upload replaces the current profile immediately.
        </p>
      </div>

      {loadError && !success && <p role="alert" className="text-sm text-red-300">Couldn&apos;t load the current profile. Please refresh the page.</p>}
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
      {success && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</p>}

      {profile ? (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <FileText className="h-8 w-8 shrink-0 text-[#29B9F2]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="break-all text-sm font-medium text-white">{profile.filename}</p>
            <p className="mt-1 text-xs text-white/50">
              PDF · {(profile.size / (1024 * 1024)).toFixed(2)} MB
              {profile.updatedAt && ` · Updated ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(profile.updatedAt))}`}
            </p>
          </div>
          <a href="/company-profile" download className={BUTTON_GHOST}>
            <Download className="h-4 w-4" aria-hidden /> Download current PDF
          </a>
        </div>
      ) : !loadError && (
        <p className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/60">
          No company profile uploaded yet. The download button will appear on the About page after your first upload.
        </p>
      )}

      {readOnly ? (
        <p className="text-sm text-white/50">Your account has read-only access.</p>
      ) : (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="company-profile-file" className={LABEL}>{profile ? "Replace company profile" : "Company profile PDF"}</label>
            <input id="company-profile-file" name="file" type="file" accept=".pdf,application/pdf" required disabled={pending} aria-describedby="company-profile-help" className={`${INPUT} file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-white`} />
            <p id="company-profile-help" className="text-xs text-white/50">PDF only, up to 10 MB. Choose a file, then upload to publish it.</p>
          </div>
          <button type="submit" disabled={pending} style={{ backgroundImage: BRAND_GRADIENT }} className={BUTTON_PRIMARY}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
            {pending ? "Uploading…" : profile ? "Replace PDF" : "Upload PDF"}
          </button>
        </form>
      )}
    </div>
  );
}

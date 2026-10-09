"use client";

import { useRef, useState, useTransition, useActionState } from "react";
import Image from "next/image";
import {
  Award,
  ChevronDown,
  Edit2,
  FolderPlus,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  addGalleryImage,
  createCertification,
  createGalleryCategory,
  deleteCertification,
  deleteGalleryCategory,
  deleteGalleryImage,
  renameGalleryCategory,
  updateCertification,
  type ActionState,
} from "@/lib/admin/actions";
import {
  BUTTON_DANGER,
  BUTTON_GHOST,
  BUTTON_PRIMARY,
  INPUT,
  LABEL,
  SURFACE,
} from "@/components/admin/tokens";
import { BRAND_GRADIENT } from "@/lib/brand";
import type { Certification, GalleryCategory, GalleryImage } from "@/db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type CategoryWithImages = GalleryCategory & { images: GalleryImage[] };

type Props = {
  categories: CategoryWithImages[];
  certifications: Certification[];
  readOnly: boolean;
  tab: "gallery" | "certifications";
};

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {msg}
    </p>
  );
}

function SuccessBanner({ msg }: { msg: string }) {
  return (
    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
      {msg}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image upload button (calls the API route, returns a URL)
// ─────────────────────────────────────────────────────────────────────────────

function ImageUploadButton({
  onUploaded,
  endpoint,
  accept = "image/jpeg,image/png,image/webp,image/avif",
  label = "Upload image",
}: {
  onUploaded: (url: string) => void;
  endpoint: string;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error ?? "Upload failed.");
      } else {
        onUploaded(json.url as string);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`${BUTTON_GHOST} text-xs`}
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <ImagePlus className="h-3.5 w-3.5" aria-hidden />
        )}
        {uploading ? "Uploading…" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Category Modal
// ─────────────────────────────────────────────────────────────────────────────

function CreateCategoryModal({ onClose }: { onClose: () => void }) {
  const [state, action] = useActionState<ActionState, FormData>(createGalleryCategory, {});
  const [pending, startTransition] = useTransition();

  const success = state?.success;

  if (success) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-sm ${SURFACE} p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">New gallery category</h2>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {state?.error && <ErrorBanner msg={state.error} />}

        <form
          action={(fd) => startTransition(() => action(fd))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label htmlFor="cat-name" className={LABEL}>
              Category name
            </label>
            <input id="cat-name" name="name" className={INPUT} placeholder="e.g. Office Life" required />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              style={{ backgroundImage: BRAND_GRADIENT }}
              className={`${BUTTON_PRIMARY} flex-1`}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Create
            </button>
            <button type="button" onClick={onClose} className={BUTTON_GHOST}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rename Category Modal
// ─────────────────────────────────────────────────────────────────────────────

function RenameCategoryModal({ cat, onClose }: { cat: GalleryCategory; onClose: () => void }) {
  const [state, action] = useActionState<ActionState, FormData>(renameGalleryCategory, {});
  const [pending, startTransition] = useTransition();

  const success = state?.success;

  if (success) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-sm ${SURFACE} p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Rename category</h2>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {state?.error && <ErrorBanner msg={state.error} />}

        <form action={(fd) => startTransition(() => action(fd))} className="space-y-4">
          <input type="hidden" name="id" value={cat.id} />
          <div className="space-y-1.5">
            <label htmlFor="rename-cat" className={LABEL}>
              Name
            </label>
            <input
              id="rename-cat"
              name="name"
              defaultValue={cat.name}
              className={INPUT}
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              style={{ backgroundImage: BRAND_GRADIENT }}
              className={`${BUTTON_PRIMARY} flex-1`}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Rename
            </button>
            <button type="button" onClick={onClose} className={BUTTON_GHOST}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add Image Modal
// ─────────────────────────────────────────────────────────────────────────────

function AddImageModal({
  categories,
  defaultCategoryId,
  onClose,
}: {
  categories: GalleryCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
}) {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [state, action] = useActionState<ActionState, FormData>(addGalleryImage, {});
  const [pending, startTransition] = useTransition();

  if (state?.success) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md ${SURFACE} p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Add image</h2>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {state?.error && <ErrorBanner msg={state.error} />}

        <form action={(fd) => startTransition(() => action(fd))} className="space-y-4">
          <input type="hidden" name="url" value={uploadedUrl} />

          {/* Category picker */}
          <div className="space-y-1.5">
            <label htmlFor="img-cat" className={LABEL}>
              Category
            </label>
            <div className="relative">
              <select
                id="img-cat"
                name="categoryId"
                defaultValue={defaultCategoryId ?? ""}
                className={`${INPUT} appearance-none pr-8`}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                aria-hidden
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <span className={LABEL}>Image file</span>
            <ImageUploadButton
              onUploaded={setUploadedUrl}
              endpoint="/api/admin/upload-gallery"
              label="Upload image"
            />
            {uploadedUrl && (
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10">
                <Image src={uploadedUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>

          {/* Alt text */}
          <div className="space-y-1.5">
            <label htmlFor="img-alt" className={LABEL}>
              Alt text
            </label>
            <input
              id="img-alt"
              name="alt"
              className={INPUT}
              placeholder="Describe the image for screen readers"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label htmlFor="img-caption" className={LABEL}>
              Caption (optional)
            </label>
            <input id="img-caption" name="caption" className={INPUT} placeholder="Short caption" />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending || !uploadedUrl}
              style={{ backgroundImage: BRAND_GRADIENT }}
              className={`${BUTTON_PRIMARY} flex-1`}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Add image
            </button>
            <button type="button" onClick={onClose} className={BUTTON_GHOST}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery tab
// ─────────────────────────────────────────────────────────────────────────────

function GalleryTab({
  categories,
  readOnly,
}: {
  categories: CategoryWithImages[];
  readOnly: boolean;
}) {
  const [showCreateCat, setShowCreateCat] = useState(false);
  const [renamingCat, setRenamingCat] = useState<GalleryCategory | null>(null);
  const [addingImageToCat, setAddingImageToCat] = useState<string | null>(null);
  const [deletingImage, startDeleteImg] = useTransition();
  const [deletingCat, startDeleteCat] = useTransition();

  return (
    <div className="space-y-6">
      {/* Header bar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCreateCat(true)}
            style={{ backgroundImage: BRAND_GRADIENT }}
            className={BUTTON_PRIMARY}
          >
            <FolderPlus className="h-4 w-4" aria-hidden />
            New category
          </button>
          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setAddingImageToCat(categories[0].id)}
              className={BUTTON_GHOST}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add image
            </button>
          )}
        </div>
      )}

      {categories.length === 0 ? (
        <div className={`${SURFACE} py-16 text-center`}>
          <FolderPlus className="mx-auto mb-3 h-8 w-8 text-white/20" aria-hidden />
          <p className="text-sm font-medium text-white/50">No gallery categories yet.</p>
          {!readOnly && (
            <p className="mt-1 text-xs text-white/30">Create a category, then add images to it.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <section key={cat.id} className="space-y-4">
              {/* Category header */}
              <div className="flex items-center gap-3">
                <h3 className="flex-1 text-sm font-semibold text-white">{cat.name}</h3>
                <span className="text-xs text-white/35">{cat.images.length} image{cat.images.length !== 1 ? "s" : ""}</span>
                {!readOnly && (
                  <>
                    <button
                      type="button"
                      title="Rename category"
                      onClick={() => setRenamingCat(cat)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      title="Add image to this category"
                      onClick={() => setAddingImageToCat(cat.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <ImagePlus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <form
                      action={(fd) => {
                        if (!confirm(`Delete category "${cat.name}" and all its images? This cannot be undone.`)) return;
                        startDeleteCat(() => deleteGalleryCategory(fd));
                      }}
                    >
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        title="Delete category"
                        disabled={deletingCat}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Image grid */}
              {cat.images.length === 0 ? (
                <div className={`${SURFACE} py-10 text-center`}>
                  <p className="text-xs text-white/30">No images in this category yet.</p>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => setAddingImageToCat(cat.id)}
                      className="mt-2 text-xs text-[#7bd4f7] hover:opacity-75"
                    >
                      Add an image →
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {cat.images.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-xl border border-white/10">
                      <div className="relative aspect-square">
                        <Image
                          src={img.url}
                          alt={img.alt || "Gallery image"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      {img.caption && (
                        <p className="px-2 py-1.5 text-[11px] text-white/55 line-clamp-1">{img.caption}</p>
                      )}
                      {!readOnly && (
                        <form
                          className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                          action={(fd) => startDeleteImg(() => deleteGalleryImage(fd))}
                        >
                          <input type="hidden" name="id" value={img.id} />
                          <button
                            type="submit"
                            aria-label="Delete image"
                            disabled={deletingImage}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white/60 backdrop-blur-sm transition-colors hover:bg-red-500/80 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden />
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateCat && <CreateCategoryModal onClose={() => setShowCreateCat(false)} />}
      {renamingCat && (
        <RenameCategoryModal cat={renamingCat} onClose={() => setRenamingCat(null)} />
      )}
      {addingImageToCat && (
        <AddImageModal
          categories={categories}
          defaultCategoryId={addingImageToCat}
          onClose={() => setAddingImageToCat(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Certification form (create or edit)
// ─────────────────────────────────────────────────────────────────────────────

function CertificationForm({
  cert,
  onClose,
}: {
  cert?: Certification;
  onClose: () => void;
}) {
  const isEdit = Boolean(cert);
  const action = isEdit ? updateCertification : createCertification;

  const [fileUrl, setFileUrl] = useState(cert?.fileUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(cert?.thumbnailUrl ?? "");
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});
  const [pending, startTransition] = useTransition();

  if (state?.success && !isEdit) {
    onClose();
    return null;
  }

  const isImage = fileUrl && !fileUrl.endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-lg ${SURFACE} p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            {isEdit ? "Edit certification" : "Add certification"}
          </h2>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {state?.error && <ErrorBanner msg={state.error} />}
        {state?.success && isEdit && <SuccessBanner msg="Saved successfully." />}

        <form
          action={(fd) => startTransition(() => formAction(fd))}
          className="space-y-4"
        >
          {isEdit && <input type="hidden" name="id" value={cert!.id} />}
          <input type="hidden" name="fileUrl" value={fileUrl} />
          <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="cert-name" className={LABEL}>
                Certification name *
              </label>
              <input
                id="cert-name"
                name="name"
                defaultValue={cert?.name}
                className={INPUT}
                placeholder="ISO 9001:2015"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cert-org" className={LABEL}>
                Issuing organisation
              </label>
              <input
                id="cert-org"
                name="issuingOrg"
                defaultValue={cert?.issuingOrg}
                className={INPUT}
                placeholder="Bureau Veritas"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cert-date" className={LABEL}>
                Issue date
              </label>
              <input
                id="cert-date"
                name="issueDate"
                defaultValue={cert?.issueDate}
                className={INPUT}
                placeholder="January 2024"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="cert-desc" className={LABEL}>
                Description
              </label>
              <textarea
                id="cert-desc"
                name="description"
                defaultValue={cert?.description}
                rows={3}
                className={`${INPUT} resize-none`}
                placeholder="Brief description of what this certification covers…"
              />
            </div>
          </div>

          {/* Certificate file upload */}
          <div className="space-y-2">
            <span className={LABEL}>Certificate file *</span>
            <p className="text-xs text-white/40">Upload a JPG, PNG, WebP, AVIF, or PDF (max 10 MB).</p>
            <ImageUploadButton
              onUploaded={(url) => {
                setFileUrl(url);
                // If it's an image, also set as thumbnail
                if (!url.endsWith(".pdf")) setThumbnailUrl(url);
              }}
              endpoint="/api/admin/upload-cert"
              accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
              label="Upload certificate"
            />
            {fileUrl && (
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <Award className="h-4 w-4 shrink-0 text-[#25D9C7]" aria-hidden />
                <p className="flex-1 truncate text-xs text-white/60">{fileUrl.split("/").pop()}</p>
                <button
                  type="button"
                  onClick={() => { setFileUrl(""); setThumbnailUrl(""); }}
                  className="text-white/30 hover:text-red-300"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail — only shown if the cert is a PDF (can't render PDF inline) */}
          {fileUrl.endsWith(".pdf") && (
            <div className="space-y-2">
              <span className={LABEL}>Thumbnail image (optional)</span>
              <p className="text-xs text-white/40">Shown on the About page when the cert is a PDF.</p>
              <ImageUploadButton
                onUploaded={setThumbnailUrl}
                endpoint="/api/admin/upload-cert"
                label="Upload thumbnail"
              />
              {thumbnailUrl && (
                <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/10">
                  <Image src={thumbnailUrl} alt="" fill className="object-contain" unoptimized />
                </div>
              )}
            </div>
          )}

          {/* Preview for image certs */}
          {isImage && (
            <div className="space-y-1.5">
              <span className={LABEL}>Preview</span>
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10">
                <Image src={fileUrl} alt="Certificate preview" fill className="object-contain" unoptimized />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending || !fileUrl}
              style={{ backgroundImage: BRAND_GRADIENT }}
              className={`${BUTTON_PRIMARY} flex-1`}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {isEdit ? "Save changes" : "Add certification"}
            </button>
            <button type="button" onClick={onClose} className={BUTTON_GHOST}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Certifications tab
// ─────────────────────────────────────────────────────────────────────────────

function CertificationsTab({
  certifications,
  readOnly,
}: {
  certifications: Certification[];
  readOnly: boolean;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deleting, startDelete] = useTransition();

  return (
    <div className="space-y-6">
      {!readOnly && (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          style={{ backgroundImage: BRAND_GRADIENT }}
          className={BUTTON_PRIMARY}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add certification
        </button>
      )}

      {certifications.length === 0 ? (
        <div className={`${SURFACE} py-16 text-center`}>
          <Award className="mx-auto mb-3 h-8 w-8 text-white/20" aria-hidden />
          <p className="text-sm font-medium text-white/50">No certifications yet.</p>
          {!readOnly && (
            <p className="mt-1 text-xs text-white/30">
              Click &quot;Add certification&quot; to upload your first certificate.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => {
            const isImage = cert.fileUrl && !cert.fileUrl.endsWith(".pdf");
            const thumb = cert.thumbnailUrl || (isImage ? cert.fileUrl : null);

            return (
              <div
                key={cert.id}
                className={`${SURFACE} flex flex-col overflow-hidden`}
              >
                {/* Thumbnail */}
                {thumb ? (
                  <div className="relative h-44 w-full overflow-hidden bg-white/[0.02]">
                    <Image
                      src={thumb}
                      alt={cert.name}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-white/[0.02]">
                    <Award className="h-10 w-10 text-white/15" aria-hidden />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <p className="font-semibold text-white line-clamp-2">{cert.name}</p>
                  {cert.issuingOrg && (
                    <p className="text-xs text-white/50">{cert.issuingOrg}</p>
                  )}
                  {cert.issueDate && (
                    <p className="text-xs text-white/35">{cert.issueDate}</p>
                  )}
                  {cert.description && (
                    <p className="mt-1 text-xs text-white/45 line-clamp-3">{cert.description}</p>
                  )}

                  {!readOnly && (
                    <div className="mt-auto flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingCert(cert)}
                        className={`${BUTTON_GHOST} flex-1 text-xs`}
                      >
                        <Edit2 className="h-3.5 w-3.5" aria-hidden />
                        Edit
                      </button>
                      <form
                        action={(fd) => {
                          if (!confirm(`Delete "${cert.name}"? This cannot be undone.`)) return;
                          startDelete(() => deleteCertification(fd));
                        }}
                      >
                        <input type="hidden" name="id" value={cert.id} />
                        <button
                          type="submit"
                          disabled={deleting}
                          className={`${BUTTON_DANGER} text-xs`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <CertificationForm onClose={() => setShowAdd(false)} />}
      {editingCert && (
        <CertificationForm cert={editingCert} onClose={() => setEditingCert(null)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root client component
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPageClient({ categories, certifications, readOnly, tab }: Props) {
  const [activeTab, setActiveTab] = useState<"gallery" | "certifications">(tab);

  return (
    <div className="space-y-7">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.025] p-1">
        {(["gallery", "certifications"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${
              activeTab === t
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/45 hover:text-white/75"
            }`}
          >
            {t === "gallery" ? "Gallery" : "Certifications"}
          </button>
        ))}
      </div>

      {activeTab === "gallery" ? (
        <GalleryTab categories={categories} readOnly={readOnly} />
      ) : (
        <CertificationsTab certifications={certifications} readOnly={readOnly} />
      )}
    </div>
  );
}

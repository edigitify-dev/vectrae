"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Check, ChevronDown, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { addGalleryImage } from "@/lib/admin/actions";
import {
  GALLERY_IMAGE_ACCEPT,
  galleryImageError,
  uploadGalleryImages,
  type GalleryUploadEntry,
} from "@/lib/admin/gallery-upload";
import type { GalleryCategory } from "@/db/schema";
import { BRAND_GRADIENT } from "@/lib/brand";
import { BUTTON_GHOST, BUTTON_PRIMARY, INPUT, LABEL, SURFACE } from "./tokens";

export default function GalleryUploadModal({
  categories,
  defaultCategoryId,
  onClose,
}: {
  categories: GalleryCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
}) {
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? "");
  const [entries, setEntries] = useState<GalleryUploadEntry[]>([]);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);
  const previewUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = previewUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, []);

  function updateEntry(id: string, update: Partial<GalleryUploadEntry>) {
    setEntries((current) => current.map((entry) => entry.id === id ? { ...entry, ...update } : entry));
  }

  function selectFiles(files: FileList | null) {
    if (!files || inFlight.current) return;
    const selected: GalleryUploadEntry[] = [];
    for (const file of Array.from(files)) {
      if ([...entries, ...selected].some((entry) => entry.file.name === file.name &&
        entry.file.size === file.size && entry.file.lastModified === file.lastModified)) continue;
      const error = galleryImageError(file);
      const previewUrl = error ? "" : URL.createObjectURL(file);
      if (previewUrl) previewUrls.current.add(previewUrl);
      selected.push({ id: crypto.randomUUID(), file, previewUrl, alt: "", caption: "",
        status: error ? "error" : "ready", error });
    }
    setEntries((current) => [...current, ...selected]);
    setError(undefined);
  }

  function removeEntry(entry: GalleryUploadEntry) {
    URL.revokeObjectURL(entry.previewUrl);
    previewUrls.current.delete(entry.previewUrl);
    setEntries((current) => current.filter((item) => item.id !== entry.id));
  }

  function handleUpload() {
    if (inFlight.current) return;
    if (!categoryId) {
      setError("Choose a category.");
      return;
    }
    inFlight.current = true;
    setError(undefined);
    startTransition(async () => {
      try {
        const result = await uploadGalleryImages({
          entries, categoryId, onUpdate: updateEntry,
          saveImage: (form) => addGalleryImage({}, form),
        });
        if (result.failed === 0) onClose();
        else setError("Some images couldn't be added. Retry them or remove them from the selection.");
      } finally {
        inFlight.current = false;
      }
    });
  }

  const savedCount = entries.filter((entry) => entry.status === "saved").length;
  const remainingCount = entries.length - savedCount;
  const canUpload = entries.some((entry) => entry.status !== "saved" && !galleryImageError(entry.file));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" disabled={pending}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="gallery-upload-title"
        className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto ${SURFACE} p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <h2 id="gallery-upload-title" className="text-sm font-semibold text-white">Add images</h2>
          <button type="button" aria-label="Close" disabled={pending} onClick={onClose}
            className="text-white/40 hover:text-white disabled:opacity-40">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <form onSubmit={(event) => { event.preventDefault(); handleUpload(); }} className="space-y-4">
          <fieldset disabled={pending} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="gallery-upload-category" className={LABEL}>Category</label>
              <div className="relative">
                <select id="gallery-upload-category" value={categoryId} required
                  disabled={pending || savedCount > 0}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={`${INPUT} appearance-none pr-8`}>
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
              </div>
            </div>

            <div className="space-y-2">
              <button type="button" onClick={() => inputRef.current?.click()} className={BUTTON_GHOST}>
                <ImagePlus className="h-4 w-4" aria-hidden />
                {entries.length ? "Select more images" : "Select images"}
              </button>
              <input ref={inputRef} type="file" multiple accept={GALLERY_IMAGE_ACCEPT}
                aria-label="Select gallery images" className="sr-only"
                onChange={(event) => { selectFiles(event.target.files); event.target.value = ""; }} />
              <p className="text-xs text-white/40">Select one or more JPG, PNG, WebP, or AVIF images. Up to 8 MB each.</p>
            </div>

            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="space-y-3 rounded-xl border border-white/10 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      {entry.previewUrl ? <Image src={entry.previewUrl} alt="" fill className="object-cover" unoptimized /> :
                        <ImagePlus className="m-5 h-6 w-6 text-white/30" aria-hidden />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white" title={entry.file.name}>{entry.file.name}</p>
                      <p aria-live="polite" className={`mt-1 text-xs ${entry.error ? "text-red-400" : "text-white/45"}`}>
                        {entry.error || ({ ready: "Ready to upload", uploading: "Uploading…", saving: "Adding to gallery…", saved: "Added to gallery", error: "Upload failed" })[entry.status]}
                      </p>
                    </div>
                    {entry.status === "saved" ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> :
                      <button type="button" aria-label={`Remove ${entry.file.name} from selection`}
                        onClick={() => removeEntry(entry)} className="p-2 text-white/40 hover:text-red-400">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor={`gallery-alt-${entry.id}`} className={LABEL}>Alt text (optional)</label>
                      <input id={`gallery-alt-${entry.id}`} value={entry.alt} disabled={entry.status === "saved"}
                        onChange={(event) => updateEntry(entry.id, { alt: event.target.value })}
                        className={INPUT} placeholder="Describe this image" />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor={`gallery-caption-${entry.id}`} className={LABEL}>Caption (optional)</label>
                      <input id={`gallery-caption-${entry.id}`} value={entry.caption} disabled={entry.status === "saved"}
                        onChange={(event) => updateEntry(entry.id, { caption: event.target.value })}
                        className={INPUT} placeholder="Short caption" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {entries.length > 0 && <p role="status" className="text-xs text-white/50">
            {savedCount} of {entries.length} images added
          </p>}
          <div className="flex gap-3">
            <button type="submit" disabled={pending || !canUpload}
              style={{ backgroundImage: BRAND_GRADIENT }} className={`${BUTTON_PRIMARY} flex-1`}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {pending ? "Uploading images…" : entries.some((entry) => entry.status === "error" && !galleryImageError(entry.file)) ?
                "Retry remaining images" : `Upload & add ${remainingCount || ""} image${remainingCount === 1 ? "" : "s"}`}
            </button>
            <button type="button" disabled={pending} onClick={onClose} className={BUTTON_GHOST}>
              {savedCount > 0 ? "Done" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

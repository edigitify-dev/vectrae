"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  AlertCircle,
  Check,
  ExternalLink,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import BlockEditor from "./BlockEditor";
import ConfirmSubmit from "./ConfirmSubmit";
import { BUTTON_DANGER, BUTTON_PRIMARY, CARD, INPUT, LABEL, SURFACE } from "./tokens";
import { createPost, deletePost, updatePost, type ActionState } from "@/lib/admin/actions";
import { estimateReadTime, slugifyTitle, type BlogBlock } from "@/lib/blog-types";
import { BRAND_GRADIENT } from "@/lib/brand";

export type PostDraft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  color: string;
  image: string;
  featured: boolean;
  status: "draft" | "published";
  authorName: string;
  authorRole: string;
  authorInitials: string;
  tags: string[];
  content: BlogBlock[];
};

const ACCENT_PRESETS = ["#29B9F2", "#25D9C7", "#84D96C", "#B6D93B", "#E8500A", "#A855F7"];

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{ backgroundImage: BRAND_GRADIENT }}
      className={BUTTON_PRIMARY}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Saving…
        </>
      ) : (
        <>
          <Save className="h-4 w-4" aria-hidden />
          {label}
        </>
      )}
    </button>
  );
}

export default function BlogEditor({
  draft,
  categories,
  readOnly,
}: {
  draft: PostDraft;
  categories: string[];
  readOnly?: boolean;
}) {
  const isNew = !draft.id;
  const action = isNew ? createPost : updatePost;
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState<BlogBlock[]>(draft.content);
  const [image, setImage] = useState(draft.image);
  const [color, setColor] = useState(draft.color);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // The slug is the public URL and the read time is a word count: both follow
  // the content until someone types over them, after which the manual value
  // wins. Storing only the override keeps them derived during render rather
  // than synced through an effect.
  const [slugOverride, setSlugOverride] = useState<string | null>(draft.slug || null);
  const [readTimeOverride, setReadTimeOverride] = useState<string | null>(draft.readTime || null);

  const slug = slugOverride ?? slugifyTitle(title);
  const readTime = readTimeOverride ?? estimateReadTime(content);

  async function uploadCover(file: File) {
    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "Upload failed.");
      }

      setImage(data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {draft.id && <input type="hidden" name="id" value={draft.id} />}
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="color" value={color} />

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      )}

      {state.success && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl border border-[#84D96C]/30 bg-[#84D96C]/10 px-4 py-3 text-sm text-[#b6e8a5]"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {state.success}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <section className={CARD}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className={LABEL} htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  disabled={readOnly}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={`${INPUT} text-base font-medium`}
                  placeholder="Top 10 AV technologies for enterprise meeting rooms"
                />
              </div>

              <div className="space-y-2">
                <label className={LABEL} htmlFor="slug">
                  URL slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-sm text-white/35">/blog/</span>
                  <input
                    id="slug"
                    name="slug"
                    disabled={readOnly}
                    value={slug}
                    onChange={(event) => setSlugOverride(event.target.value)}
                    className={INPUT}
                    placeholder="av-tech-2026"
                  />
                </div>
                <p className="text-xs text-white/40">
                  Changing this on a published post breaks any existing links to it.
                </p>
              </div>

              <div className="space-y-2">
                <label className={LABEL} htmlFor="excerpt">
                  Short Description
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  disabled={readOnly}
                  defaultValue={draft.excerpt}
                  className={`${INPUT} resize-y leading-relaxed`}
                  placeholder="One or two sentences shown on the blog listing and in search results."
                />
              </div>
            </div>
          </section>

          <section className={CARD} aria-labelledby="post-content">
            <h2 id="post-content" className="text-sm font-semibold text-white">
              Content
            </h2>
            <p className="mt-1 text-xs text-white/40">
              Blocks render on the live site exactly in this order.
            </p>
            <div className="mt-5">
              <BlockEditor blocks={content} onChange={setContent} disabled={readOnly} />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className={CARD}>
            <h2 className="text-sm font-semibold text-white">Publishing</h2>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className={LABEL} htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  disabled={readOnly}
                  defaultValue={draft.status}
                  className={`${INPUT} appearance-none`}
                >
                  <option value="draft" className="bg-[#0B0D0E]">
                    Draft — not visible publicly
                  </option>
                  <option value="published" className="bg-[#0B0D0E]">
                    Published — live on the site
                  </option>
                </select>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-3.5">
                <input
                  type="checkbox"
                  name="featured"
                  disabled={readOnly}
                  defaultChecked={draft.featured}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/25 bg-black/50 accent-[#29B9F2]"
                />
                <span>
                  <span className="block text-sm font-medium text-white">Feature this post</span>
                  <span className="mt-0.5 block text-xs text-white/45">
                    Shown large at the top of the blog listing.
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              {!readOnly && <SaveButton label={isNew ? "Create post" : "Save changes"} />}
              {draft.id && draft.status === "published" && (
                <a
                  href={`/blog/${draft.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#7bd4f7] transition-opacity hover:opacity-80"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  View live
                </a>
              )}
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold text-white">Cover image</h2>

            <div className="mt-4">
              {image ? (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={image}
                    alt="Cover preview"
                    width={480}
                    height={270}
                    className="h-36 w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-white/12 text-white/30">
                  <ImageIcon className="h-6 w-6" aria-hidden />
                </div>
              )}

              <input
                ref={fileRef}
                id="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={readOnly || uploading}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadCover(file);
                }}
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label
                  htmlFor="cover"
                  className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-white/12 px-3 text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white ${
                    readOnly || uploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" aria-hidden />
                      Upload
                    </>
                  )}
                </label>

                {image && !readOnly && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-white/50 transition-colors hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                )}
              </div>

              {uploadError && (
                <p role="alert" className="mt-2 text-xs text-red-300">
                  {uploadError}
                </p>
              )}

              <div className="mt-3 space-y-2">
                <label className={LABEL} htmlFor="image-path">
                  Or use a path from /public
                </label>
                <input
                  id="image-path"
                  disabled={readOnly}
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  className={INPUT}
                  placeholder="/images/blog/av-tech.png"
                />
              </div>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold text-white">Metadata</h2>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className={LABEL} htmlFor="category">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  list="admin-blog-categories"
                  disabled={readOnly}
                  defaultValue={draft.category}
                  className={INPUT}
                  placeholder="Audio Visual"
                />
                <datalist id="admin-blog-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <span className={LABEL}>Accent colour</span>
                <div className="flex flex-wrap items-center gap-2">
                  {ACCENT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={readOnly}
                      onClick={() => setColor(preset)}
                      aria-label={`Use accent ${preset}`}
                      aria-pressed={color.toLowerCase() === preset.toLowerCase()}
                      className={`h-9 w-9 rounded-lg border-2 transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        color.toLowerCase() === preset.toLowerCase()
                          ? "border-white"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                  <input
                    type="text"
                    value={color}
                    disabled={readOnly}
                    onChange={(event) => setColor(event.target.value)}
                    aria-label="Accent colour hex"
                    className="min-h-9 w-24 rounded-lg border border-white/12 bg-black/40 px-2.5 text-xs tabular-nums text-white outline-none focus:border-[#29B9F2]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL} htmlFor="readTime">
                  Read time
                </label>
                <input
                  id="readTime"
                  name="readTime"
                  disabled={readOnly}
                  value={readTime}
                  onChange={(event) => setReadTimeOverride(event.target.value)}
                  className={INPUT}
                  placeholder="6 min read"
                />
                <p className="text-xs text-white/40">Estimated from the content until you edit it.</p>
              </div>

              <div className="space-y-2">
                <label className={LABEL} htmlFor="tags">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  disabled={readOnly}
                  defaultValue={draft.tags.join(", ")}
                  className={INPUT}
                  placeholder="Audio Visual, Hybrid Work"
                />
                <p className="text-xs text-white/40">Comma separated.</p>
              </div>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold text-white">Author</h2>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className={LABEL} htmlFor="authorName">
                  Name
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  disabled={readOnly}
                  defaultValue={draft.authorName}
                  className={INPUT}
                  placeholder="Rohan Mehta"
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL} htmlFor="authorRole">
                  Role
                </label>
                <input
                  id="authorRole"
                  name="authorRole"
                  disabled={readOnly}
                  defaultValue={draft.authorRole}
                  className={INPUT}
                  placeholder="Practice Lead, Audio Visual"
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL} htmlFor="authorInitials">
                  Initials
                </label>
                <input
                  id="authorInitials"
                  name="authorInitials"
                  maxLength={3}
                  disabled={readOnly}
                  defaultValue={draft.authorInitials}
                  className={`${INPUT} uppercase`}
                  placeholder="RM"
                />
              </div>
            </div>
          </section>
        </aside>
      </div>

      {draft.id && !readOnly && (
        <div className={`${SURFACE} p-5`}>
          <h2 className="text-sm font-semibold text-white">Danger zone</h2>
          <p className="mt-1 text-xs leading-relaxed text-white/45">
            Deleting removes the post permanently and takes it off the live site.
          </p>
          <div className="mt-4">
            {/* A nested <form> is invalid HTML, so delete overrides the action here. */}
            <ConfirmSubmit
              label="Delete post"
              confirmLabel="Yes, delete permanently"
              pendingLabel="Deleting…"
              icon={<Trash2 className="h-4 w-4" aria-hidden />}
              className={BUTTON_DANGER}
              formAction={deletePost}
            />
          </div>
        </div>
      )}
    </form>
  );
}

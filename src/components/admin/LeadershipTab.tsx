"use client";

import { useEffect, useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { Edit2, Loader2, Plus, Star, Trash2, Users, X } from "lucide-react";
import type { LeadershipMember } from "@/db/schema";
import { saveLeadershipMember, deleteLeadershipMember } from "@/lib/admin/leadership-actions";
import { BRAND_GRADIENT } from "@/lib/brand";
import { BUTTON_DANGER, BUTTON_GHOST, BUTTON_PRIMARY, INPUT, LABEL, SURFACE } from "./tokens";
import ImageUploadButton from "./ImageUploadButton";

function MemberForm({ member, nextOrder, onClose }: {
  member?: LeadershipMember;
  nextOrder: number;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(saveLeadershipMember, {});
  const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const busy = pending || uploading;
  useEffect(() => { if (state.success) onClose(); }, [state.success, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" disabled={busy} onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div role="dialog" aria-modal="true" aria-labelledby="leadership-form-title"
        className={`relative max-h-[90vh] w-full max-w-xl overflow-y-auto ${SURFACE} p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <h2 id="leadership-form-title" className="text-sm font-semibold text-white">
            {member ? "Edit member" : "Add member"}
          </h2>
          <button type="button" aria-label="Close" disabled={busy} onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        {state.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={member?.id ?? ""} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <fieldset disabled={pending} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="leader-name" className={LABEL}>Name</label>
              <input id="leader-name" name="name" required maxLength={120} defaultValue={member?.name} className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="leader-designation" className={LABEL}>Role / designation</label>
              <input id="leader-designation" name="designation" required maxLength={180} defaultValue={member?.designation} className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="leader-bio" className={LABEL}>Biography (optional)</label>
              <textarea id="leader-bio" name="bio" rows={4} maxLength={5000} defaultValue={member?.bio} className={INPUT} />
            </div>
            <div className="space-y-2">
              <span className={LABEL}>Photo</span>
              <ImageUploadButton endpoint="/api/admin/upload-leadership" label={imageUrl ? "Change photo" : "Upload photo"}
                disabled={pending} onUploaded={setImageUrl} onUploadingChange={setUploading} />
              <p className="text-xs text-white/40">JPG, PNG, WebP, or AVIF. Up to 8 MB.</p>
              {imageUrl && <div className="flex items-start gap-3">
                <div className="relative h-36 w-28 overflow-hidden rounded-xl border border-white/10">
                  <Image src={imageUrl} alt="Member photo preview" fill className="object-cover" unoptimized />
                </div>
                <button type="button" disabled={busy} onClick={() => setImageUrl("")} className={`${BUTTON_GHOST} text-xs`}>Remove photo</button>
              </div>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="leader-linkedin" className={LABEL}>LinkedIn URL (optional)</label>
              <input id="leader-linkedin" name="linkedinUrl" type="url" maxLength={2048}
                defaultValue={member?.linkedinUrl} placeholder="https://www.linkedin.com/in/…" className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="leader-order" className={LABEL}>Display order</label>
              <input id="leader-order" name="sortOrder" type="number" min={0} max={10000} step={1}
                defaultValue={member?.sortOrder ?? nextOrder} required className={INPUT} />
              <p className="text-xs text-white/40">Lower numbers appear first in the team carousel.</p>
            </div>
            <label className="flex items-start gap-3 text-sm text-white/75">
              <input type="checkbox" name="isFeatured" defaultChecked={member?.isFeatured} className="mt-0.5 accent-[#29B9F2]" />
              <span>Featured member<span className="mt-1 block text-xs text-white/40">Show in the large leadership card. Replaces the current featured member.</span></span>
            </label>
          </fieldset>
          <p className="text-xs text-white/40">Saved changes appear on the public About page.</p>
          <div className="flex gap-3">
            <button type="submit" disabled={busy} style={{ backgroundImage: BRAND_GRADIENT }} className={`${BUTTON_PRIMARY} flex-1`}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {pending ? "Saving…" : "Save member"}
            </button>
            <button type="button" disabled={busy} onClick={onClose} className={BUTTON_GHOST}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeadershipTab({ members, readOnly }: { members: LeadershipMember[]; readOnly: boolean }) {
  const [editing, setEditing] = useState<LeadershipMember | "new" | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const nextOrder = Math.min(10000, members.reduce((max, member) => Math.max(max, member.sortOrder), -1) + 1);

  function removeMember(member: LeadershipMember) {
    if (!confirm(`Remove ${member.name} from the leadership section?`)) return;
    setError(undefined);
    startTransition(async () => {
      try {
        const form = new FormData();
        form.set("id", member.id);
        const result = await deleteLeadershipMember({}, form);
        if (result.error) setError(result.error);
      } catch { setError("Couldn't remove the member. Please try again."); }
    });
  }

  return (
    <div className="space-y-5">
      {!readOnly && <button type="button" onClick={() => setEditing("new")}
        style={{ backgroundImage: BRAND_GRADIENT }} className={BUTTON_PRIMARY}>
        <Plus className="h-4 w-4" aria-hidden /> Add member
      </button>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {members.length === 0 ? <div className={`${SURFACE} py-12 text-center`}>
        <Users className="mx-auto mb-3 h-8 w-8 text-white/20" aria-hidden />
        <p className="text-sm text-white/50">No leadership members yet.</p>
      </div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => <article key={member.id} className={`${SURFACE} overflow-hidden`}>
          <div className="relative h-52 bg-white/5">
            {member.imageUrl ? <Image src={member.imageUrl} alt={member.name} fill className="object-cover object-top" unoptimized /> :
              <div className="flex h-full items-center justify-center"><Users className="h-12 w-12 text-white/15" aria-hidden /></div>}
          </div>
          <div className="space-y-3 p-4">
            {member.isFeatured && <span className="inline-flex items-center gap-1 text-xs text-[#7bd4f7]"><Star className="h-3 w-3" aria-hidden /> Featured</span>}
            <h3 className="font-semibold text-white">{member.name}</h3>
            <p className="text-sm text-white/55">{member.designation}</p>
            <p className="text-xs text-white/35">Display order: {member.sortOrder}</p>
            {!readOnly && <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(member)} className={`${BUTTON_GHOST} flex-1 text-xs`}>
                <Edit2 className="h-3.5 w-3.5" aria-hidden /> Edit
              </button>
              <button type="button" disabled={pending} onClick={() => removeMember(member)}
                aria-label={`Remove ${member.name}`} className={`${BUTTON_DANGER} text-xs`}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>}
          </div>
        </article>)}
      </div>}
      {editing && <MemberForm member={editing === "new" ? undefined : editing} nextOrder={nextOrder} onClose={() => setEditing(null)} />}
    </div>
  );
}

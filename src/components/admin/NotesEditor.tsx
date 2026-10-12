"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { BUTTON_GHOST, INPUT } from "./tokens";

export default function NotesEditor({
  id,
  initialValue,
  action,
  disabled,
}: {
  id: string;
  initialValue: string;
  action: (id: string, notes: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = value !== savedValue;

  function save() {
    setError(null);

    startTransition(async () => {
      try {
        await action(id, value);
        setSavedValue(value);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch {
        setError("Couldn't save your notes. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <label htmlFor={`notes-${id}`} className="sr-only">
        Internal notes
      </label>
      <textarea
        id={`notes-${id}`}
        rows={5}
        value={value}
        disabled={disabled || pending}
        onChange={(event) => { setValue(event.target.value); setSaved(false); }}
        placeholder="Internal notes — who followed up, what was agreed, next step…"
        className={`${INPUT} resize-y leading-relaxed`}
      />

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={disabled || pending || !dirty} className={BUTTON_GHOST}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden />
              Save notes
            </>
          )}
        </button>

        <p aria-live="polite" className="text-xs text-white/45">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-[#b6e8a5]">
              <Check className="h-3.5 w-3.5" aria-hidden />
              Saved
            </span>
          ) : dirty ? (
            "Unsaved changes"
          ) : (
            ""
          )}
        </p>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

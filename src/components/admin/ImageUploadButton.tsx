"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { BUTTON_GHOST } from "./tokens";

export default function ImageUploadButton({
  onUploaded,
  endpoint,
  accept = "image/jpeg,image/png,image/webp,image/avif",
  label = "Upload image",
  disabled = false,
  onUploadingChange,
}: {
  onUploaded: (url: string) => void;
  endpoint: string;
  accept?: string;
  label?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    onUploadingChange?.(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error || typeof json.url !== "string" || !json.url) {
        setError(json.error ?? "Upload failed.");
      } else {
        onUploaded(json.url as string);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || disabled}
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
        disabled={uploading || disabled}
        aria-label={label}
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

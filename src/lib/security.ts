export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048 || /[\u0000-\u0020\\]/.test(value)) return null;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function isSafeAssetUrl(value: string): boolean {
  if (!value || value.length > 2048 || /[\u0000-\u0020\\]/.test(value)) return false;
  return (value.startsWith("/") && !value.startsWith("//")) || safeExternalUrl(value)?.startsWith("https:") === true;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

/** API uploads use cookies, so check Origin as well as authentication. */
export function isSameOriginRequest(request: Request): boolean {
  try {
    const origin = request.headers.get("origin");
    return !!origin && new URL(origin).origin === new URL(request.url).origin &&
      request.headers.get("sec-fetch-site") !== "cross-site";
  } catch { return false; }
}

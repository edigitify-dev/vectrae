import type { AdminRole } from "./session-cookie";

export function isAdminRole(role: unknown): role is AdminRole {
  return role === "owner" || role === "admin" || role === "editor";
}

export function canWriteAdmin(role: unknown): boolean {
  return role === "owner" || role === "admin";
}

export function safeAdminPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || /[\u0000-\u0020\\]/.test(value)) return "/admin";
  try {
    const url = new URL(value, "https://vectrae.invalid");
    if (url.origin !== "https://vectrae.invalid" ||
      (url.pathname !== "/admin" && !url.pathname.startsWith("/admin/")) ||
      url.pathname === "/admin/login") return "/admin";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return "/admin"; }
}

export function adminPageNumber(value: unknown): number {
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) return 1;
  return Math.min(Number(value), 100_000);
}

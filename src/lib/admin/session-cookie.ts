export const SESSION_COOKIE = "vectrae_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AdminRole = "owner" | "admin" | "editor";

/** Only a format check; authorisation always checks the database. */
export function isSessionToken(token: string | undefined): token is string {
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const;

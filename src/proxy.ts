import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isSessionToken } from "@/lib/admin/session-cookie";

/**
 * A cheap first gate for the admin panel: it bounces obviously-signed-out
 * requests before they ever render. It is *not* the authorisation boundary —
 * every admin page and mutation independently re-verifies the session against
 * the database via `getCurrentAdmin()`.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The login page decides for itself whether to bounce an already-signed-in
  // visitor onward — it re-checks against the database (see its `page.tsx`).
  // A token can have the right format but be expired or revoked. Redirecting
  // from login here would cause a loop with the database authorisation check.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!isSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    const loginUrl = new URL("/admin/login", request.url);
    const target = `${pathname}${search}`;

    if (target !== "/admin") {
      loginUrl.searchParams.set("next", target);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!api/).*)"],
};

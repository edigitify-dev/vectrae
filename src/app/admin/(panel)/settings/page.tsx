import { desc } from "drizzle-orm";
import { ShieldCheck, User } from "lucide-react";
import { getDb, withRetry } from "@/db";
import { adminUsers } from "@/db/schema";
import PageHeader from "@/components/admin/PageHeader";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { CARD, SURFACE } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateTime } from "@/lib/admin/format";
import { BRAND_GRADIENT } from "@/lib/brand";

const ROLE_DESCRIPTIONS: Record<string, string> = {
  owner: "Full access, including managing other admin users.",
  admin: "Full access to enquiries, applications, and the blog.",
  editor: "Read-only. Can view everything but change nothing.",
};

export default async function SettingsPage() {
  const admin = await requireAdmin();

  let team: Pick<typeof adminUsers.$inferSelect, "id" | "name" | "username" | "email" | "role" | "createdAt" | "lastLoginAt">[] = [];

  if (admin.role === "owner") {
    try {
      team = await withRetry(() =>
        getDb().select({ id: adminUsers.id, name: adminUsers.name, username: adminUsers.username,
          email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt,
          lastLoginAt: adminUsers.lastLoginAt }).from(adminUsers).orderBy(desc(adminUsers.createdAt)),
      );
    } catch (error) {
      console.error("[admin/settings] Failed to load team:", error);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your account and, if you're an owner, everyone else with access."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={CARD} aria-labelledby="your-account">
          <h2 id="your-account" className="text-sm font-semibold text-white">
            Your account
          </h2>

          <div className="mt-5 flex items-center gap-4">
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              {admin.name
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("")}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">{admin.name}</p>
              <p className="truncate text-sm text-white/50">{admin.username ?? admin.email}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="flex items-center gap-2 text-sm font-medium capitalize text-white">
              <ShieldCheck className="h-4 w-4 text-[#84D96C]" aria-hidden />
              {admin.role}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/50">
              {ROLE_DESCRIPTIONS[admin.role]}
            </p>
          </div>
        </section>

        <section className={CARD} aria-labelledby="change-password">
          <h2 id="change-password" className="text-sm font-semibold text-white">
            Change password
          </h2>
          <ChangePasswordForm />
        </section>
      </div>

      {admin.role === "owner" && (
        <section className={`${SURFACE} overflow-hidden`} aria-labelledby="team">
          <header className="border-b border-white/10 px-5 py-4">
            <h2 id="team" className="text-sm font-semibold text-white">
              Admin users
            </h2>
            <p className="mt-1 text-xs text-white/45">
              Add or reset accounts from the terminal:{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-white/70">
                npm run admin:create -- --email … --name … --username … --role …
              </code>
            </p>
          </header>

          {team.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-white/40">
              Couldn&apos;t load the user list.
            </p>
          ) : (
            <ul className="divide-y divide-white/8">
              {team.map((user) => (
                <li key={user.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <User className="h-4 w-4 shrink-0 text-white/30" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name}
                      {user.id === admin.id && (
                        <span className="ml-2 text-xs font-normal text-white/40">you</span>
                      )}
                    </p>
                    <p className="truncate text-xs text-white/45">{user.username ?? user.email}</p>
                  </div>
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] font-semibold capitalize text-white/60">
                    {user.role}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-white/35">
                    {user.lastLoginAt ? `Last in ${formatDateTime(user.lastLoginAt)}` : "Never signed in"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

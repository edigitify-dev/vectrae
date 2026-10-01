"use client";
import { r2Asset } from "@/lib/site-images";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/lib/admin/actions";
import { BRAND_GRADIENT } from "@/lib/brand";

export type ShellCounts = {
  enquiries: number;
  applications: number;
};

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export type ShellUser = {
  name: string;
  email: string;
  role: string;
};

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A"
  );
}

export default function AdminShell({
  user,
  counts,
  children,
}: {
  user: ShellUser;
  counts: ShellCounts;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // A drawer that survives navigation would cover the page the user just chose.
  // Resetting during render (rather than in an effect) avoids a second pass.
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  const items: NavItem[] = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/enquiries", label: "Enquiries", icon: Mail, badge: counts.enquiries },
    { href: "/admin/applications", label: "Applications", icon: Briefcase, badge: counts.applications },
    { href: "/admin/careers", label: "Careers", icon: ClipboardList },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const nav = (
    <nav aria-label="Admin sections" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2] ${
              active
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white/90"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-[#29B9F2]/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#7bd4f7]">
                {item.badge > 99 ? "99+" : item.badge}
                <span className="sr-only"> new</span>
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-3 py-1">
        <Image src={r2Asset("/logo.png")} alt="" width={96} height={24} className="h-6 w-auto" />
        <span className="rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
          Admin
        </span>
      </Link>

      <div className="mt-7 flex-1">{nav}</div>

      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition-colors duration-200 hover:bg-white/5 hover:text-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View live site
        </Link>

        <div className="flex items-center gap-3 rounded-xl px-3 py-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            {initialsOf(user.name)}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs capitalize text-white/45">{user.role}</p>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-white/10 bg-white/[0.015] p-4 lg:block">
        {sidebarBody}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-white/10 bg-[#0B0D0E] p-4">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-[#08090A]/85 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 text-white/70 transition-colors hover:text-white"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <Image src={r2Asset("/logo.png")} alt="Vectrae Admin" width={88} height={22} className="h-5 w-auto" />
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

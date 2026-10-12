import type { ReactNode } from "react";
import { CARD, SURFACE } from "./tokens";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`motion-safe:animate-pulse rounded-md bg-white/[0.08] ${className}`} />;
}

function LoadingRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-busy="true" className="space-y-7">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-7">{children}</div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="w-full space-y-3 sm:w-2/3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-3/4 max-w-sm" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <Skeleton className="h-11 w-28 rounded-full" />
    </div>
  );
}

function FieldsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function RowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={`${SURFACE} overflow-hidden`}>
      <div className="flex justify-between gap-4 border-b border-white/10 p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="divide-y divide-white/8">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-5 px-5 py-5">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className={`h-4 ${i % 2 ? "w-2/3" : "w-1/2"}`} />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ label = "Loading records…" }: { label?: string }) {
  return (
    <LoadingRegion label={label}>
      <RowsSkeleton rows={6} />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
    </LoadingRegion>
  );
}

export function AdminOverviewSkeleton() {
  return (
    <LoadingRegion label="Loading dashboard…">
      <HeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${CARD} space-y-4`}>
            <div className="flex justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <RowsSkeleton /><RowsSkeleton />
      </div>
      <RowsSkeleton rows={3} />
      <RowsSkeleton rows={3} />
    </LoadingRegion>
  );
}

export function AdminListSkeleton({ label }: { label: string }) {
  return (
    <LoadingRegion label={`Loading ${label}…`}>
      <HeaderSkeleton />
      <div className="flex flex-wrap justify-between gap-3">
        <Skeleton className="h-11 w-full rounded-xl lg:w-80" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-9 w-20 rounded-full" />)}
        </div>
      </div>
      <RowsSkeleton rows={6} />
      <Skeleton className="h-9 w-40" />
    </LoadingRegion>
  );
}

export function AdminDetailSkeleton({ label }: { label: string }) {
  return (
    <LoadingRegion label={`Loading ${label}…`}>
      <Skeleton className="h-5 w-36" />
      <HeaderSkeleton />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <div className={`${CARD} space-y-5`}>
            <Skeleton className="h-4 w-32" />
            <div className="grid gap-5 sm:grid-cols-2"><FieldsSkeleton count={2} /><FieldsSkeleton count={2} /></div>
          </div>
          <div className={`${CARD} space-y-4`}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-5">
          <div className={CARD}><FieldsSkeleton count={1} /></div>
          <div className={`${CARD} space-y-4`}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}

export function AdminEditorSkeleton({ label }: { label: string }) {
  return (
    <LoadingRegion label={`Loading ${label}…`}>
      <Skeleton className="h-5 w-28" />
      <HeaderSkeleton />
      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <div className={CARD}><FieldsSkeleton count={3} /></div>
          <div className={`${CARD} space-y-4`}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-5">
          <div className={CARD}><FieldsSkeleton count={2} /></div>
          <div className={`${CARD} space-y-4`}>
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}

export function AdminAboutSkeleton() {
  return (
    <LoadingRegion label="Loading gallery, certifications and leadership…">
      <HeaderSkeleton />
      <div className={`${SURFACE} flex gap-2 p-1`}>
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-11 flex-1 rounded-lg" />)}
      </div>
      <Skeleton className="h-11 w-36 rounded-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${SURFACE} overflow-hidden`}>
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-3 p-4"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}

export function AdminSettingsSkeleton() {
  return (
    <LoadingRegion label="Loading account settings…">
      <HeaderSkeleton />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className={`${CARD} space-y-6`}>
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-3"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-28" /></div>
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className={`${CARD} space-y-5`}>
          <Skeleton className="h-4 w-36" />
          <FieldsSkeleton count={3} />
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </div>
      <RowsSkeleton rows={3} />
    </LoadingRegion>
  );
}

export function AdminShellSkeleton() {
  return (
    <div className="flex min-h-dvh">
      <aside aria-hidden="true" className="hidden w-64 shrink-0 space-y-7 border-r border-white/10 bg-white/[0.015] p-6 lg:block">
        <Skeleton className="h-7 w-28" />
        <div className="space-y-3">{Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-11 w-full rounded-xl" />)}</div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10"><AdminOverviewSkeleton /></main>
    </div>
  );
}

export function AdminLoginSkeleton() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <LoadingRegion label="Loading admin sign in…">
          <Skeleton className="h-7 w-28" />
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <FieldsSkeleton count={2} />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </LoadingRegion>
      </div>
    </main>
  );
}

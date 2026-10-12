"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminListTransition } from "./AdminListView";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

export type FilterOption = { value: string; label: string };

/**
 * Search + status filter that live in the URL, so a filtered view is
 * shareable, survives a refresh, and restores on back-navigation.
 */
export default function AdminFilters({
  options,
  placeholder,
}: {
  options: FilterOption[];
  placeholder: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pending, startTransition } = useAdminListTransition();

  const activeStatus = searchParams.get("status") ?? "all";
  const activeQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(activeQuery);

  // Keep the box in sync when the URL changes from elsewhere (back button, a
  // "clear" link) without fighting the user mid-type.
  const lastPushed = useRef(activeQuery);
  useEffect(() => {
    if (activeQuery !== lastPushed.current) {
      lastPushed.current = activeQuery;
      setQuery(activeQuery);
    }
  }, [activeQuery]);

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // Debounced so a search doesn't fire a query per keystroke.
  useEffect(() => {
    if (query === activeQuery) {
      return;
    }

    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        next.set("q", query.trim());
      } else {
        next.delete("q");
      }

      lastPushed.current = query.trim();
      push(next);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function selectStatus(value: string) {
    const next = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      next.delete("status");
    } else {
      next.set("status", value);
    }

    push(next);
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <label htmlFor="admin-search" className="sr-only">
          {placeholder}
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
        />
        <input
          id="admin-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-xl border border-white/12 bg-black/40 pl-10 pr-10 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-200 focus:border-[#29B9F2] focus:ring-2 focus:ring-[#29B9F2]/25"
        />
        {pending ? (
          <Loader2
            aria-hidden
            className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/40"
          />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
        {[{ value: "all", label: "All" }, ...options].map((option) => {
          const active = activeStatus === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => selectStatus(option.value)}
              aria-pressed={active}
              className={`min-h-9 rounded-full px-3.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2] ${
                active
                  ? "bg-white text-black"
                  : "border border-white/12 text-white/60 hover:border-white/25 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminListTransition } from "./AdminListView";

export default function Pagination({
  currentPage,
  total,
  pageSize,
}: {
  currentPage: number;
  total: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pending, startTransition } = useAdminListTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) {
    return (
      <p className="text-xs tabular-nums text-white/40">
        {total} {total === 1 ? "record" : "records"}
      </p>
    );
  }

  const first = (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, total);

  function goTo(page: number) {
    const next = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(page));
    }

    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
    });
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/50"
    >
      <p className="tabular-nums">
        Showing {first}–{last} of {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={pending || currentPage <= 1}
          className="flex min-h-9 items-center gap-1.5 rounded-lg border border-white/12 px-3 font-semibold text-white/70 transition-colors duration-200 hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Previous
        </button>

        <span className="tabular-nums text-white/45">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={pending || currentPage >= totalPages}
          className="flex min-h-9 items-center gap-1.5 rounded-lg border border-white/12 px-3 font-semibold text-white/70 transition-colors duration-200 hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29B9F2]"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </nav>
  );
}

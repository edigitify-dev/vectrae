"use client";

import {
  Handshake,
  Layers,
  MapPin,
  ShieldCheck,
  Workflow,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { whyChooseUs } from "@/data/whyChooseUs";

const icons = [Layers, Workflow, Handshake, MapPin, ShieldCheck];

const palette = [
  {
    text: "text-emerald-600",
    chipBg: "bg-emerald-50",
    chipBorder: "border-emerald-200",
    dot: "bg-emerald-500",
    line: "bg-emerald-500",
    glow: "from-emerald-50",
  },
  {
    text: "text-orange-600",
    chipBg: "bg-orange-50",
    chipBorder: "border-orange-200",
    dot: "bg-orange-500",
    line: "bg-orange-500",
    glow: "from-orange-50",
  },
  {
    text: "text-rose-600",
    chipBg: "bg-rose-50",
    chipBorder: "border-rose-200",
    dot: "bg-rose-500",
    line: "bg-rose-500",
    glow: "from-rose-50",
  },
  {
    text: "text-sky-600",
    chipBg: "bg-sky-50",
    chipBorder: "border-sky-200",
    dot: "bg-sky-500",
    line: "bg-sky-500",
    glow: "from-sky-50",
  },
  {
    text: "text-violet-600",
    chipBg: "bg-violet-50",
    chipBorder: "border-violet-200",
    dot: "bg-violet-500",
    line: "bg-violet-500",
    glow: "from-violet-50",
  },
];

function ReasonCard({
  item,
  index,
  Icon,
}: {
  item: (typeof whyChooseUs)[number] & {
    points?: string[];
    highlight?: string;
  };
  index: number;
  Icon: (typeof icons)[number];
}) {
  const accent = palette[index % palette.length];
  const points = item.points?.length
    ? item.points
    : ([item.highlight, item.description].filter(Boolean) as string[]);

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${accent.glow} to-transparent blur-2xl`}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`font-mono text-4xl font-extrabold tracking-tight ${accent.text}`}
        >
          0{index + 1}
        </span>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${accent.chipBorder} ${accent.chipBg}`}
        >
          <Icon className={`h-5 w-5 ${accent.text}`} />
        </div>
      </div>

      <div className={`relative mt-4 h-1 w-10 rounded-full ${accent.line}`} />

      <h3 className="relative mt-4 text-xl font-bold tracking-tight text-neutral-900">
        {item.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-neutral-500">
        {item.description}
      </p>

      <ul className="relative mt-5 space-y-3">
        {points.map((point, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-sm text-neutral-700"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${accent.chipBorder} ${accent.chipBg}`}
            >
              <Check className={`h-3 w-3 ${accent.text}`} strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <button
        className={`relative mt-6 flex items-center gap-1.5 text-sm font-semibold ${accent.text} transition-opacity hover:opacity-70`}
      >
        Explore
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function WhyChooseUs() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotCount, setDotCount] = useState<number>(whyChooseUs.length);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // Reachable scroll positions (px). One dot per position.
  const positionsRef = useRef<number[]>([]);

  const getCards = () =>
    trackRef.current
      ? (Array.from(trackRef.current.children) as HTMLElement[])
      : [];

  // Card offsets relative to the first card, clamped to the max scroll,
  // de-duplicated. Cards that can't reach the left edge collapse into the
  // last position, so we never show dots that can't be reached.
  const computePositions = useCallback(() => {
    const el = trackRef.current;
    if (!el) return [] as number[];
    const cards = getCards();
    if (cards.length === 0) return [] as number[];

    const base = cards[0].offsetLeft;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const result: number[] = [];

    cards.forEach((card) => {
      const pos = Math.min(card.offsetLeft - base, maxScroll);
      if (!result.some((p) => Math.abs(p - pos) < 4)) result.push(pos);
    });

    return result;
  }, []);

  const closestIndex = useCallback(() => {
    const el = trackRef.current;
    const positions = positionsRef.current;
    if (!el || positions.length === 0) return 0;

    let closest = 0;
    let closestDist = Infinity;
    positions.forEach((pos, i) => {
      const dist = Math.abs(pos - el.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }, []);

  // Recalculate positions on mount/resize and track the active dot on scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      positionsRef.current = computePositions();
      setDotCount(positionsRef.current.length);
      setActiveIndex(closestIndex());
    };

    const onScroll = () => setActiveIndex(closestIndex());

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [computePositions, closestIndex]);

  const scrollToPosition = useCallback((index: number) => {
    const el = trackRef.current;
    const pos = positionsRef.current[index];
    if (!el || pos === undefined) return;
    el.scrollTo({ left: pos, behavior: "smooth" });
  }, []);

  const pauseAutoplay = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 6000);
  }, []);

  const handleDotClick = (index: number) => {
    scrollToPosition(index);
    pauseAutoplay();
  };

  // Autoplay — advances by 2 positions on desktop (lg+), 1 on smaller screens,
  // always visits the last position, then loops back to the start
  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;

      const positions = positionsRef.current;
      if (positions.length <= 1) return;

      const last = positions.length - 1;
      const current = closestIndex();
      const advanceBy = window.innerWidth >= 1024 ? 2 : 1;

      if (current >= last) {
        scrollToPosition(0);
      } else {
        scrollToPosition(Math.min(current + advanceBy, last));
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [closestIndex, scrollToPosition]);

  return (
    <section
      className="relative bg-neutral-50 py-16 sm:py-20 lg:py-24"
      onMouseEnter={pauseAutoplay}
      onTouchStart={pauseAutoplay}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
        <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]">
          Why Choose Us
        </p>

        <h2 className="mt-5 sm:mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          Five Reasons Enterprises Choose{" "}
          <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 bg-clip-text text-transparent">
            Vectrae
          </span>
        </h2>
      </div>

      <div className="relative z-10 mt-10 sm:mt-14 w-full">
        <div
          ref={trackRef}
          onWheel={pauseAutoplay}
          className="mx-auto flex max-w-6xl items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scroll-pl-6 px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {whyChooseUs.map((item, i) => (
            <div
              key={item.title}
              className="w-[85vw] max-w-[380px] shrink-0 snap-start sm:w-[calc(50%-12px)] sm:max-w-none lg:w-[calc(33.333%-16px)]"
            >
              <ReasonCard item={item} index={i} Icon={icons[i]} />
            </div>
          ))}
        </div>
      </div>

      {dotCount > 1 && (
        <div className="relative z-10 mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => {
            const accent = palette[i % palette.length];
            return (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeIndex === i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? `w-6 ${accent.dot}`
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

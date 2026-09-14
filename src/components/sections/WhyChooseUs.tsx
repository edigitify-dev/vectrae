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
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const getCards = () =>
    trackRef.current
      ? (Array.from(trackRef.current.children) as HTMLElement[])
      : [];

  // Track which card is leftmost/active for the dot indicator
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = getCards();
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - el.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const el = trackRef.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  const pauseAutoplay = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 6000);
  }, []);

  const handleDotClick = (index: number) => {
    scrollToCard(index);
    pauseAutoplay();
  };

  // Autoplay — advances by 2 cards on desktop (lg+), 1 card on smaller screens, loops at the end
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (pausedRef.current || !el) return;

      const cards = getCards();
      if (cards.length === 0) return;

      const advanceBy = window.innerWidth >= 1024 ? 2 : 1;
      const maxScroll = el.scrollWidth - el.clientWidth;

      let currentIndex = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - el.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          currentIndex = i;
        }
      });

      const nextIndex = currentIndex + advanceBy;

      if (nextIndex >= cards.length || el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: cards[nextIndex].offsetLeft, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative bg-neutral-50 py-16 sm:py-20 lg:py-24"
      onMouseEnter={pauseAutoplay}
      onTouchStart={pauseAutoplay}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-500 shadow-sm">
          Why Choose Us
        </div>

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
          className="mx-auto flex max-w-6xl items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      <div className="relative z-10 mt-6 flex items-center justify-center gap-2">
        {whyChooseUs.map((_, i) => {
          const accent = palette[i % palette.length];
          return (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to reason ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? `w-6 ${accent.dot}`
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

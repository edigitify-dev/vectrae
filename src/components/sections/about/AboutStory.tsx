"use client";
import { r2Asset } from "@/lib/site-images";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Globe2,
  Sparkles,
  CalendarDays,
  Users,
  Layers,
} from "lucide-react";

// Drop your images in /public/about/ (names below). If one is missing,
// the card falls back to a soft tinted block instead of breaking.
const chapters = [
  {
    n: "01",
    year: "2014",
    kicker: "The Foundation",
    title: "A simple premise.",
    body: "Founded in 2014 on the belief that businesses don't want to think about their IT infrastructure, as long as it works, we're an IT infrastructure company based in Delhi, built to source, deploy, secure, and maintain the technology that forms the backbone of the enterprises we serve.",
    icon: Building2,
    image: r2Asset("/images/about/img_1.png"),
    accent: "#0F9D8A",
    wash: "rgba(15,157,138,0.10)",
  },
  // {
  //   n: "02",
  //   year: "2017",
  //   kicker: "The Growth",
  //   title: "From Nehru Place, outward.",
  //   body: "The start-up team has grown from a small unit based out of Nehru Place to a full-fledged organization, partnering with some of the world's most recognizable tech brands to get things done, while staying accessible and reactive to client demands.",
  //   icon: TrendingUp,
  //   image: r2Asset("/images/about/img_2.png"),
  //   accent: "#2563EB",
  //   wash: "rgba(37,99,235,0.10)",
  // },
  {
    n: "02",
    year: "2020",
    kicker: "The Reach",
    title: "One partner, every layer.",
    body: "From end-devices to data centers, our verticals are built around the full lifecycle of enterprise IT infrastructure, so our clients don't have to deal with the fragmented ecosystem that comes with working with multiple vendors.",
    icon: Globe2,
    image: r2Asset("/images/about/img_3.png"),
    accent: "#7C3AED",
    wash: "rgba(124,58,237,0.10)",
  },
  {
    n: "03",
    year: "2024",
    kicker: "Today",
    title: "A full-spectrum partner.",
    body: "More than a decade later, the philosophy remains the same: a deep, hands-on, client-centric approach to infrastructure, backed by a team of 300+ professionals and an annual turnover of over ₹500 crores.",
    icon: Sparkles,
    image: r2Asset("/images/about/img_4.png"),
    accent: "#F59E0B",
    wash: "rgba(245,158,11,0.12)",
  },
];

const stats = [
  {
    icon: CalendarDays,
    value: "2014",
    label: "Year of Foundation",
    accent: "#0F9D8A",
    art: "building",
    image: r2Asset("/images/about/stats/img_1.png"),
  },
  {
    icon: Users,
    value: "300+",
    label: "Experts",
    accent: "#2563EB",
    art: "people",
    image: r2Asset("/images/about/stats/img_2.png"),
  },
  {
    icon: Building2,
    value: "400+",
    label: "Enterprise Clients",
    accent: "#7C3AED",
    art: "city",
    image: r2Asset("/images/about/stats/img_3.png"),
  },
  {
    icon: Layers,
    value: "₹500 Cr+",
    label: "Revenue",
    accent: "#F59E0B",
    art: "growth",
    image: r2Asset("/images/about/stats/img_4.png"),
  },
] as const;

const AUTOPLAY_MS = 4500;

type Chapter = (typeof chapters)[number];
type Stat = (typeof stats)[number];

function ChapterCard({
  chapter,
  side = "right",
  className = "",
}: {
  chapter: Chapter;
  side?: "left" | "right";
  className?: string;
}) {
  const Icon = chapter.icon;
  const [imgFailed, setImgFailed] = useState(false);

  // Image always sits on the side facing the center line (desktop)
  const imageOnLeft = side === "right";

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white/80 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur ${
        imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      } ${className}`}
      style={{
        borderColor: `${chapter.accent}26`,
        backgroundImage: `radial-gradient(120% 100% at ${
          imageOnLeft ? "100%" : "0%"
        } 0%, ${chapter.wash}, transparent 65%)`,
      }}
    >
      {/* Big faded chapter number */}
      <span
        className="pointer-events-none absolute right-6 top-3 z-0 select-none text-7xl font-bold leading-none"
        style={{ color: chapter.accent, opacity: 0.12 }}
      >
        {chapter.n}
      </span>

      {/* Image */}
      <div
        className={`relative h-44 w-full shrink-0 lg:h-auto lg:w-[25%] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${
          imageOnLeft
            ? "lg:[mask-image:linear-gradient(to_right,black_55%,transparent)]"
            : "lg:[mask-image:linear-gradient(to_left,black_55%,transparent)]"
        }`}
      >
        {imgFailed ? (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${chapter.wash}, transparent)`,
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={chapter.image}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex items-center gap-3">
          {/* <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white"
            style={{
              borderColor: `${chapter.accent}33`,
              color: chapter.accent,
            }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span> */}
          {/* Year badge (mobile only, desktop shows it on the timeline) */}
          <span
            className="text-sm font-semibold lg:hidden"
            style={{ color: chapter.accent }}
          >
            {chapter.year}
          </span>
        </div>

        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-neutral-900">
          {chapter.title}
        </h3>

        <p className="mt-3 text-[14.5px] leading-relaxed text-neutral-500">
          {chapter.body}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <span
            className="h-[2px] w-6 rounded-full"
            style={{ backgroundColor: chapter.accent }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: chapter.accent }}
          >
            {chapter.kicker}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineDot({ color }: { color: string }) {
  return (
    <span className="absolute left-1/2 top-1/2 z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.8),0_4px_14px_rgba(15,23,42,0.15)]">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}99` }}
      />
    </span>
  );
}

function Header() {
  return (
    <div className="max-w-md">
      <span
        className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700"
        data-aos="fade-up"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Our Journey
      </span>
      <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl lg:text-[42px]">
        From a Simple Premise to a{" "}
        <span className="text-[#0F9D8A]">National Partner</span>
      </h2>
      <p className="mt-5 text-[15px] leading-relaxed text-neutral-500">
        A journey of relentless execution, long-term partnerships and a belief
        that technology infrastructure can quietly power extraordinary
        businesses.
      </p>
    </div>
  );
}

/* Faded decorative artwork on the right side of each stat cell */
function StatArt({
  kind,
  accent,
  image,
}: {
  kind: Stat["art"];
  accent: string;
  image: string;
}) {
  const [failed, setFailed] = useState(false);

  // Photo first (same treatment for all 4 stats)
  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="pointer-events-none absolute bottom-3 right-0 hidden h-[50%] w-[46%] object-cover opacity-90 sm:block [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_72%)]"
      />
    );
  }

  // Fallback if the image is missing
  if (kind === "building") return null;

  const cls =
    "pointer-events-none absolute bottom-4 right-3 hidden h-28 w-28 sm:block";

  if (kind === "people") {
    return (
      <svg viewBox="0 0 120 120" className={cls} style={{ color: accent }}>
        <circle cx="28" cy="56" r="11" fill="currentColor" opacity=".18" />
        <circle cx="92" cy="56" r="11" fill="currentColor" opacity=".18" />
        <path
          d="M10 108c0-16 8-26 18-26s18 10 18 26z"
          fill="currentColor"
          opacity=".14"
        />
        <path
          d="M74 108c0-16 8-26 18-26s18 10 18 26z"
          fill="currentColor"
          opacity=".14"
        />
        <circle cx="60" cy="40" r="16" fill="currentColor" opacity=".3" />
        <path
          d="M30 110c0-22 13-36 30-36s30 14 30 36z"
          fill="currentColor"
          opacity=".22"
        />
      </svg>
    );
  }

  if (kind === "city") {
    return (
      <svg viewBox="0 0 120 120" className={cls} style={{ color: accent }}>
        <rect
          x="8"
          y="66"
          width="18"
          height="44"
          rx="2"
          fill="currentColor"
          opacity=".16"
        />
        <rect
          x="32"
          y="36"
          width="20"
          height="74"
          rx="2"
          fill="currentColor"
          opacity=".24"
        />
        <rect
          x="58"
          y="14"
          width="22"
          height="96"
          rx="2"
          fill="currentColor"
          opacity=".3"
        />
        <rect
          x="86"
          y="48"
          width="18"
          height="62"
          rx="2"
          fill="currentColor"
          opacity=".2"
        />
      </svg>
    );
  }

  // growth
  return (
    <svg viewBox="0 0 120 120" className={cls} style={{ color: accent }}>
      <rect
        x="8"
        y="92"
        width="14"
        height="18"
        rx="2"
        fill="currentColor"
        opacity=".14"
      />
      <rect
        x="28"
        y="78"
        width="14"
        height="32"
        rx="2"
        fill="currentColor"
        opacity=".18"
      />
      <rect
        x="48"
        y="62"
        width="14"
        height="48"
        rx="2"
        fill="currentColor"
        opacity=".22"
      />
      <rect
        x="68"
        y="44"
        width="14"
        height="66"
        rx="2"
        fill="currentColor"
        opacity=".26"
      />
      <rect
        x="88"
        y="26"
        width="14"
        height="84"
        rx="2"
        fill="currentColor"
        opacity=".3"
      />
      <path
        d="M10 66 Q58 56 104 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".55"
      />
      <path
        d="M92 12 L106 12 L106 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".55"
      />
    </svg>
  );
}

function StatsStrip() {
  return (
    <div className="relative mt-14 overflow-hidden rounded-[32px] border border-black/5 bg-white/80 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.18)] backdrop-blur">
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`relative min-h-[120px] overflow-hidden px-7 py-8 sm:px-8 ${
                i > 0 ? "lg:border-l lg:border-black/5" : ""
              }`}
              style={{
                backgroundImage: `radial-gradient(90% 90% at 100% 100%, ${s.accent}14, transparent 70%)`,
              }}
            >
              <StatArt kind={s.art} accent={s.accent} image={s.image} />

              <div className="relative z-10">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${s.accent}1A`, color: s.accent }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>

                <p
                  className="mt-5 text-3xl font-bold leading-none tracking-tight"
                  style={{ color: s.accent }}
                >
                  {s.value}
                </p>

                <p className="mt-3 max-w-[8rem] text-[10px] font-medium uppercase leading-snug tracking-[0.2em] text-neutral-500">
                  {s.label}
                </p>

                <span
                  className="mt-4 block h-[2px] w-8 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${s.accent}, ${s.accent}55)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AboutStory() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % chapters.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  const goTo = (i: number) => {
    setActive(i);
    setPaused(true);
    window.setTimeout(() => setPaused(false), AUTOPLAY_MS * 2);
  };

  return (
    <section
      id="story"
      className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* ───────── Desktop: center-line timeline ───────── */}
        <div className="relative hidden lg:block">
          {/* vertical line */}
          <div
            className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, #0F9D8A, #2563EB, #7C3AED, #F59E0B)",
              opacity: 0.45,
            }}
          />

          <div className="space-y-10">
            {chapters.map((c, i) => {
              const cardRight = i % 2 === 0;

              const yearLabel = (
                <span
                  className={`absolute top-1/2 -translate-y-1/2 text-xl font-bold ${
                    cardRight ? "right-0" : "left-0"
                  }`}
                  style={{ color: c.accent }}
                >
                  {c.year}
                </span>
              );

              const card = (
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ChapterCard
                    chapter={c}
                    side={cardRight ? "right" : "left"}
                    className="min-h-[240px]"
                  />
                </motion.div>
              );

              return (
                <div
                  key={c.n}
                  className="relative grid grid-cols-2 items-center gap-x-16"
                >
                  <TimelineDot color={c.accent} />

                  {/* Left cell */}
                  <div className="relative">
                    {cardRight ? (
                      <>
                        {i === 0 && (
                          <div className="pr-24">
                            <Header />
                          </div>
                        )}
                        {yearLabel}
                      </>
                    ) : (
                      card
                    )}
                  </div>

                  {/* Right cell */}
                  <div className="relative">{cardRight ? card : yearLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────── Mobile / tablet: header + carousel ───────── */}
        <div className="lg:hidden">
          <Header />

          <div className="mt-10">
            <div
              className="relative overflow-hidden"
              onTouchStart={(e) => {
                dragStartX.current = e.touches[0].clientX;
                setPaused(true);
              }}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - dragStartX.current;
                if (delta > 40) {
                  goTo((active - 1 + chapters.length) % chapters.length);
                } else if (delta < -40) {
                  goTo((active + 1) % chapters.length);
                } else {
                  setPaused(false);
                }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapters[active].n}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <ChapterCard
                    chapter={chapters[active]}
                    className="min-h-[420px]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {chapters.map((c, i) => (
                <button
                  key={c.n}
                  aria-label={`Go to chapter ${c.n}`}
                  onClick={() => goTo(i)}
                  className="relative flex h-3 w-3 items-center justify-center"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        i === active ? chapters[i].accent : "#D4D4D4",
                      transform: i === active ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ───────── Stats strip ───────── */}
        <StatsStrip />
      </div>
    </section>
  );
}

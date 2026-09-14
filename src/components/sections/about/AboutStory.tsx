"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, TrendingUp, Globe2, Sparkles } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

const chapters = [
  {
    n: "01",
    kicker: "The Foundation",
    title: "A simple premise.",
    body: "Founded in 2014 on the belief that businesses don't want to think about their IT infrastructure, as long as it works, we're an IT infrastructure company based in Delhi, built to source, deploy, secure, and maintain the technology that forms the backbone of the enterprises we serve.",
    icon: Building2,
    accent: "#2DD4BF",
    wash: "rgba(45,212,191,0.10)",
  },
  {
    n: "02",
    kicker: "The Growth",
    title: "From Nehru Place, outward.",
    body: "The start-up team has grown from a small unit based out of Nehru Place to a full-fledged organization, partnering with some of the world's most recognizable tech brands to get things done, while staying accessible and reactive to client demands.",
    icon: TrendingUp,
    accent: "#3B82F6",
    wash: "rgba(59,130,246,0.10)",
  },
  {
    n: "03",
    kicker: "The Reach",
    title: "One partner, every layer.",
    body: "From end-devices to data centers, our verticals are built around the full lifecycle of enterprise IT infrastructure, so our clients don't have to deal with the fragmented ecosystem that comes with working with multiple vendors.",
    icon: Globe2,
    accent: "#A855F7",
    wash: "rgba(168,85,247,0.10)",
  },
  {
    n: "04",
    kicker: "Today",
    title: "A full-spectrum partner.",
    body: "More than a decade later, the philosophy remains the same: a deep, hands-on, client-centric approach to infrastructure, backed by a team of 250+ professionals and an annual turnover of over ₹400 crores.",
    icon: Sparkles,
    accent: "#F59E0B",
    wash: "rgba(245,158,11,0.10)",
  },
];

const AUTOPLAY_MS = 4500;

function ChapterCard({
  chapter,
  className = "",
}: {
  chapter: (typeof chapters)[number];
  className?: string;
}) {
  const Icon = chapter.icon;
  return (
    <div
      className={`relative flex h-full flex-col rounded-[28px] border border-black/5 bg-white p-8 ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 0% 0%, ${chapter.wash}, transparent 60%)`,
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-5xl font-bold leading-none tracking-tight sm:text-6xl"
          style={{ color: chapter.accent }}
        >
          {chapter.n}
        </span>
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
          style={{ borderColor: `${chapter.accent}33`, color: chapter.accent }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>

      <span
        className="mt-5 block h-[3px] w-10 rounded-full"
        style={{ backgroundColor: chapter.accent }}
      />

      <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-[28px]">
        {chapter.title}
      </h3>

      <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
        {chapter.body}
      </p>

      <span className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {chapter.kicker}
      </span>
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
    <section id="story" className="relative bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Our Story
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              A decade, in four chapters.
            </h2>
          </div>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 sm:block">
            {String(chapters.length).padStart(2, "0")} Chapters
          </p>
        </div>

        {/* Desktop / tablet: 2 cards per row */}
        <div className="hidden gap-10 sm:grid sm:grid-cols-2">
          {chapters.map((c) => (
            <ChapterCard key={c.n} chapter={c} />
          ))}
        </div>

        {/* Mobile: auto-advancing carousel with dots */}
        <div className="sm:hidden">
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
                  className="min-h-[360px]"
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
    </section>
  );
}

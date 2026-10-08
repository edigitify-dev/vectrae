"use client";
import { r2Asset } from "@/lib/site-images";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { BRAND_GRADIENT } from "@/lib/brand";

/**
 * ============================================================
 * LEADERSHIP DATA
 * ============================================================
 *
 * Replace these values when Vectrae HR/Marketing provides:
 * - Photo
 * - Name
 * - Designation
 * - Bio
 * - LinkedIn URL (if available)
 *
 * Do not invent leadership information.
 *
 * To add more people to the carousel, just push another object
 * into the `team` array. The carousel adapts automatically.
 */

type Leader = {
  name: string;
  designation: string;
  bio: string;
  image: string;
  linkedin?: string;
};

/* ---------- Featured founder (big card) ---------- */
const founder: Leader = {
  name: "Dinesh Kamra",
  designation: "Founder / Managing Director",
  bio: "Founder profile content will be provided by Vectrae HR/Marketing. This space is reserved for his professional background, vision and expertise.",
  image: r2Asset("/images/team/dineshKamra.jpeg"),
  linkedin: "", // add URL when available
};

/* ---------- Team (auto-swiping carousel) ---------- */
const team: Leader[] = [
  {
    name: "Rajesh Suri",
    designation: "Director, Unified Collaboration",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: r2Asset("/images/team/rajeshSuri.jpeg"),
  },
  {
    name: "Swarup Nag",
    designation: "Business Head, Data Center",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: r2Asset("/images/team/swarup.jpeg"),
  },
  {
    name: "Kapil",
    designation: "Business Head, Delhi",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: r2Asset(""),
  },
  {
    name: "Madhu Sudhan Sharma",
    designation: "Business Head, Bangalore",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: r2Asset("/images/team/madhuSudhanSharma.jpeg"),
  },
  {
    name: "Awanish Singh",
    designation: "Business Head, Mumbai",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: r2Asset("/images/team/awanishSingh.png"),
  },
  {
    name: "Sagar Ahuja",
    designation: "Business Head - IT Infrastructure and Data Center solutions",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: r2Asset("/images/team/sagar.jpeg"),
  },
];

/* Carousel tuning */
const AUTOPLAY_MS = 3000; // time between swipes
const SLIDE_DURATION = 0.7; // seconds for the slide animation
const GAP = 20; // px gap between cards
const SWIPE_THRESHOLD = 50; // px of touch movement to count as a swipe

/* ============================================================
   TEAM CARD (used inside the carousel)
============================================================ */
function TeamCard({
  leader,
  index,
  width,
  hidden = false,
}: {
  leader: Leader;
  index: number;
  width: number;
  hidden?: boolean;
}) {
  return (
    <article
      aria-hidden={hidden || undefined}
      style={{ width }}
      className="group relative shrink-0 overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.025] transition-colors duration-500 hover:border-black/[0.15] hover:bg-black/[0.04]"
    >
      {/* IMAGE AREA */}
      <div className="relative aspect-[4/4.6] overflow-hidden bg-[#071014]">
        {leader.image ? (
          <Image
            src={leader.image}
            alt={hidden ? "" : leader.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-56 w-56 rounded-full border border-white/[0.05]" />
            <div className="absolute h-40 w-40 rounded-full border border-dashed border-white/[0.06]" />
            <div className="absolute h-24 w-24 rounded-full border border-[#29B9F2]/10 bg-[#29B9F2]/[0.025]" />

            <div className="relative text-center">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/20">
                Vectrae
              </span>
              <span className="mt-3 block text-4xl font-semibold text-white/[0.08]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-[8px] uppercase tracking-[0.25em] text-white/15">
                Leadership
              </span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black via-white/10 to-transparent" />

        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 backdrop-blur-md">
            Leadership
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative p-6 sm:p-7">
        <h3 className="text-xl font-semibold tracking-[-0.025em] text-black sm:text-2xl">
          {leader.name}
        </h3>

        <p
          className="mt-2 bg-clip-text text-xs font-semibold uppercase tracking-[0.12em] text-transparent sm:text-sm"
          style={{ backgroundImage: BRAND_GRADIENT }}
        >
          {leader.designation}
        </p>

        {/* <p className="mt-4 line-clamp-4 text-sm leading-6 text-black/40">
          {leader.bio}
        </p> */}

        {/* <div className="mt-6 flex items-center justify-between border-t border-black/[0.07] pt-5">
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/20">
            Vectrae
          </span>

          {leader.linkedin ? (
            <a
              href={leader.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={hidden ? -1 : undefined}
              aria-label={`${leader.name} LinkedIn profile`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/35 transition-all duration-300 hover:border-[#29B9F2]/40 hover:bg-[#29B9F2]/10 hover:text-[#29B9F2]"
            >
              <FaLinkedinIn className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/20 transition-all duration-300 group-hover:border-[#29B9F2]/30 group-hover:text-[#29B9F2]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div> */}

        <div
          className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
          style={{ backgroundImage: BRAND_GRADIENT }}
        />
      </div>
    </article>
  );
}

/* ============================================================
   TEAM CAROUSEL (auto-swipe every 3s, infinite loop)
============================================================ */
function TeamCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const [visible, setVisible] = useState(1);
  const [cardW, setCardW] = useState(0);
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false); // used for the invisible loop reset
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const count = team.length;
  const canSlide = count > 1;

  // Clones of the first `visible` cards at the end make the loop seamless
  const clones = Array.from({ length: visible }, (_, i) => team[i % count]);
  const items = [...team, ...clones];

  /* Measure container -> cards per view + card width */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const v = w < 560 ? 1 : w < 900 ? 2 : 3;
      setVisible(v);
      setCardW((w - GAP * (v - 1)) / v);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Respect reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (!canSlide || paused || reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, count));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [canSlide, paused, reduceMotion, count]);

  /* After sliding onto the clones, silently jump back to the real start */
  const handleAnimationComplete = () => {
    if (index >= count) {
      setInstant(true);
      setIndex(0);
    } else if (instant) {
      setInstant(false);
    }
  };

  const next = () => setIndex((i) => Math.min(i + 1, count));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (delta < -SWIPE_THRESHOLD) next();
      else if (delta > SWIPE_THRESHOLD) prev();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  const activeDot = index % count;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={{ x: -index * (cardW + GAP) }}
          transition={
            instant
              ? { duration: 0 }
              : { duration: SLIDE_DURATION, ease: [0.16, 1, 0.3, 1] }
          }
          onAnimationComplete={handleAnimationComplete}
        >
          {items.map((leader, i) => (
            <TeamCard
              key={i}
              leader={leader}
              index={i % count}
              width={cardW || 300}
              hidden={i >= count}
            />
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      {canSlide && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {team.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="group flex h-4 items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === activeDot
                    ? "w-8 bg-[#29B9F2]"
                    : "w-1.5 bg-black/15 group-hover:bg-black/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN SECTION
============================================================ */
export default function AboutLeadership() {
  return (
    <section
      id="leadership"
      className="relative isolate overflow-hidden bg-white py-20 sm:py-28 lg:py-40"
    >
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 top-1/4 h-150 w-150 rounded-full bg-[#29B9F2]/7 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 bottom-1/4 h-125 w-125 rounded-full bg-[#25D9C7]/6 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ========================================================
          MAIN CONTAINER
      ======================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end lg:gap-10"
        >
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />
              <span className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Leadership
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-black sm:mt-8 sm:text-5xl md:text-6xl lg:text-[5.5rem]">
              The people
              <br />
              behind the
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                vision.
              </span>
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md text-sm leading-7 text-black/40 sm:text-base lg:mb-2"
          >
            Experienced leadership driving Vectrae&apos;s vision, building
            trusted partnerships, and delivering enterprise technology outcomes
            at scale.
          </motion.p>
        </motion.div>

        {/* ======================================================
            FEATURED FOUNDER CARD  (30% image / 70% content)
        ====================================================== */}

        <motion.article
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mt-14 grid w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.025] transition-colors duration-500 hover:border-black/[0.15] hover:bg-black/[0.04] sm:mt-20 lg:mt-24 lg:grid-cols-[30%_70%]"
        >
          {/* Image (left) */}
          <div className="relative aspect-[4/4.6] overflow-hidden bg-[#071014] max-lg:max-h-[520px] max-lg:w-full lg:aspect-auto lg:min-h-[460px]">
            {founder.image ? (
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute h-64 w-64 rounded-full border border-white/[0.05]" />
                <div className="absolute h-44 w-44 rounded-full border border-dashed border-white/[0.06]" />
                <div className="absolute h-28 w-28 rounded-full border border-[#29B9F2]/10 bg-[#29B9F2]/[0.025]" />
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          </div>

          {/* Content (right) */}
          <div className="relative flex flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div>
              <div className="flex items-center justify-end gap-4">
                <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-black/40">
                  Founder
                </span>
              </div>

              <h3 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-black sm:text-4xl lg:text-5xl">
                {founder.name}
              </h3>

              <p
                className="mt-3 bg-clip-text text-xs font-semibold uppercase tracking-[0.14em] text-transparent sm:text-sm"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                {founder.designation}
              </p>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-black/45 sm:mt-8 sm:text-base sm:leading-8">
                {founder.bio}
              </p>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-black/[0.07] pt-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/20">
                Vectrae
              </span>

              {founder.linkedin ? (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${founder.name} LinkedIn profile`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/35 transition-all duration-300 hover:border-[#29B9F2]/40 hover:bg-[#29B9F2]/10 hover:text-[#29B9F2]"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </a>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/20 transition-all duration-300 group-hover:border-[#29B9F2]/30 group-hover:text-[#29B9F2]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              )}
            </div>

            <div
              className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
              style={{ backgroundImage: BRAND_GRADIENT }}
            />
          </div>
        </motion.article>

        {/* ======================================================
            TEAM CAROUSEL (auto-swipes every 3s)
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-16"
        >
          <div className="mb-8 flex items-center gap-3">
            <span
              className="h-px w-10"
              style={{ backgroundImage: BRAND_GRADIENT }}
            />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              Our Team
            </span>
          </div>

          <TeamCarousel />
        </motion.div>
      </div>

      {/* SECTION DIVIDER */}
      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-black/[0.06]" />
    </section>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { solutions, type Solution } from "@/data/solutions";

const PALETTES = [
  {
    // 01 — Audio Visual
    bg: "from-teal-50 via-white to-white",
    accent: "text-teal-700",
    accentBg: "bg-teal-600",
    border: "border-teal-200",
    glow: "37, 217, 199",
  },
  {
    // 02 — Networking & Security
    bg: "from-blue-50 via-white to-white",
    accent: "text-blue-700",
    accentBg: "bg-blue-600",
    border: "border-blue-200",
    glow: "37, 99, 235",
  },
  {
    // 03 — Data Center
    bg: "from-fuchsia-50 via-white to-white",
    accent: "text-fuchsia-700",
    accentBg: "bg-fuchsia-600",
    border: "border-fuchsia-200",
    glow: "192, 38, 211",
  },
  {
    // 04 — End Computing
    bg: "from-amber-50 via-white to-white",
    accent: "text-amber-700",
    accentBg: "bg-amber-500",
    border: "border-amber-200",
    glow: "245, 158, 11",
  },
  {
    // 05 — IT Spares & Accessories
    bg: "from-emerald-50 via-white to-white",
    accent: "text-emerald-700",
    accentBg: "bg-emerald-600",
    border: "border-emerald-200",
    glow: "16, 185, 129",
  },
  {
    // 06 — Power Solutions
    bg: "from-orange-50 via-white to-white",
    accent: "text-orange-700",
    accentBg: "bg-orange-600",
    border: "border-orange-200",
    glow: "234, 88, 12",
  },
  {
    // 07 — Managed IT Services
    bg: "from-rose-50 via-white to-white",
    accent: "text-rose-700",
    accentBg: "bg-rose-600",
    border: "border-rose-200",
    glow: "225, 29, 72",
  },
];

function ServiceHoloCard({
  service,
  index,
}: {
  service: Solution;
  index: number;
}) {
  const Icon = service.icon;
  const palette = PALETTES[index % PALETTES.length];

  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.08 * (index % 4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full w-full"
    >
      <Link
        ref={cardRef}
        href={`/solutions/${service.slug}`}
        onMouseMove={handleMove}
        style={
          {
            "--mx": "50%",
            "--my": "50%",
            "--glow": palette.glow,
          } as React.CSSProperties
        }
        className={`
  group
  relative
  isolate
  flex
  h-[400px]
  w-full
  overflow-hidden
  rounded-[28px]
  border
  ${palette.border}
  bg-gradient-to-br
  ${palette.bg}
  shadow-[0_12px_35px_rgba(0,0,0,0.07)]
  transition-all
  duration-500
  ease-out
  hover:shadow-[0_22px_50px_rgba(0,0,0,0.18)]
  will-change-transform
`}
      >
        {/* =====================================================
          BACKGROUND IMAGE

          Hidden normally.
          Covers the ENTIRE card on hover.
      ===================================================== */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
        >
          <div
            className="
            absolute
            inset-0
            bg-cover
            bg-center
            scale-100
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
          "
            style={{
              backgroundImage: `url(${service.cardImage})`,
            }}
          />
        </div>

        {/* =====================================================
          DARK GRADIENT

          Dark on the LEFT for text readability.
          Gradually fades towards the right.
      ===================================================== */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.68) 30%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.08) 78%, transparent 100%)",
          }}
        />

        {/* =====================================================
          NORMAL CARD BACKGROUND

          No polygon.
          No clip-path.
          No diagonal shape.

          Just a normal full rectangular background.
      ===================================================== */}
        <div
          className={`
          pointer-events-none
          absolute
          inset-0
          z-[2]
          bg-gradient-to-br
          ${palette.bg}
          opacity-100
          transition-opacity
          duration-500
          group-hover:opacity-0
        `}
        />

        {/* =====================================================
          MOUSE GLOW

          Subtle glow while the card is in its normal state.
      ===================================================== */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-[3]
          opacity-100
          transition-opacity
          duration-500
          group-hover:opacity-0
        "
          style={{
            background: `
            radial-gradient(
              circle 170px at var(--mx) var(--my),
              rgba(${palette.glow}, 0.18),
              rgba(${palette.glow}, 0.08) 35%,
              transparent 72%
            )
          `,
          }}
        />

        {/* =====================================================
          CONTENT

          Full width now.
          No diagonal panel.
      ===================================================== */}
        <div
          className="
          relative
          z-10
          flex
          h-full
          w-full
          flex-col
          p-7
          lg:p-8
        "
        >
          {/* ===================================================
            TOP
        =================================================== */}
          <div className="flex items-start justify-between">
            {/* Number */}
            <span
              className={`
              font-mono
              text-[42px]
              font-bold
              leading-none
              tracking-[0.06em]
              ${palette.accent}
              opacity-55
              transition-colors
              duration-500
              group-hover:text-white
            `}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Icon */}
            <span
              className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              ${palette.border}
              bg-white/90
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:border-white/30
              group-hover:bg-white/15
              group-hover:shadow-lg
            `}
            >
              <Icon
                size={19}
                strokeWidth={1.7}
                className={`
                ${palette.accent}
                transition-colors
                duration-500
                group-hover:text-white
              `}
              />
            </span>
          </div>

          {/* ===================================================
            MAIN CONTENT
        =================================================== */}
          <div className="mt-auto max-w-[320px]">
            {/* Accent line */}
            <div
              className={`
              mb-4
              h-[3px]
              w-7
              rounded-full
              ${palette.accentBg}
              transition-all
              duration-300
              group-hover:w-11
              group-hover:bg-white
            `}
            />

            {/* Title */}
            <h3
              className="
              text-[26px]
              font-semibold
              leading-[0.98]
              tracking-[-0.035em]
              text-black
              transition-colors
              duration-500
              group-hover:text-white
            "
            >
              {service.title}
            </h3>

            {/* Description */}
            <p
              className="
              mt-4
              text-[14px]
              leading-[1.6]
              text-black/60
              transition-colors
              duration-500
              group-hover:text-white/80
            "
            >
              {service.tagline}
            </p>

            {/* Capabilities */}
            <ul className="mt-4 space-y-2.5">
              {service.capabilities.slice(0, 3).map((cap) => (
                <li
                  key={cap.title}
                  className="
                  flex
                  items-center
                  gap-2.5
                  text-[14px]
                  leading-tight
                  text-black/75
                  transition-colors
                  duration-500
                  group-hover:text-white/90
                "
                >
                  <span
                    className={`
                    flex
                    h-[19px]
                    w-[19px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${palette.accentBg}
                    transition-colors
                    duration-500
                    group-hover:bg-white
                  `}
                  >
                    <CheckCircle2
                      className="
                      h-[13px]
                      w-[13px]
                      text-white
                      transition-colors
                      duration-500
                      group-hover:text-black
                    "
                      strokeWidth={2.2}
                    />
                  </span>

                  <span>{cap.title}</span>
                </li>
              ))}
            </ul>

            {/* Explore */}
            <span
              className={`
              mt-6
              inline-flex
              items-center
              gap-2
              text-[15px]
              font-semibold
              ${palette.accent}
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:text-white
            `}
            >
              Explore
              <ArrowUpRight
                className="
                h-[17px]
                w-[17px]
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
              />
            </span>
          </div>
        </div>

        {/* =====================================================
          HOVER BORDER
      ===================================================== */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-20
          rounded-[28px]
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
          style={{
            boxShadow: `inset 0 0 0 1px rgba(var(--glow), 0.45)`,
          }}
        />
      </Link>
    </motion.div>
  );
}

export default function SolutionsCards() {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const handleMobileScroll = useCallback(() => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    mobileItemRefs.current.forEach((item, i) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setMobileActiveIndex(closestIndex);
  }, []);

  const goToMobileIndex = (i: number) => {
    mobileItemRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <>
      {/* =====================================================
          DESKTOP / TABLET GRID
      ===================================================== */}
      <div className="mt-6 hidden md:block">
        {/* First row — 4 cards */}
        <div className="grid grid-cols-2 gap-7 lg:grid-cols-4">
          {solutions.slice(0, 4).map((service, i) => (
            <ServiceHoloCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        {/* Second row — 3 centered cards */}
        <div className="mt-7 flex justify-center gap-7">
          {solutions.slice(4, 7).map((service, i) => (
            <div key={service.slug} className="w-[calc((100%-3.5rem)/4)]">
              <ServiceHoloCard service={service} index={i + 4} />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          MOBILE CAROUSEL
      ===================================================== */}
      <div className="mt-5 md:hidden">
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="
            -mx-6
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            scroll-smooth
            px-6
            pb-4
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {solutions.slice(0, 7).map((service, i) => (
            <div
              key={service.slug}
              ref={(el) => {
                mobileItemRefs.current[i] = el;
              }}
              className="
                w-[95%]
                max-w-[420px]
                shrink-0
                snap-center
              "
            >
              <ServiceHoloCard service={service} index={i} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="mt-5 flex justify-center gap-1.5">
          {solutions.slice(0, 7).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to ${solutions[i].title}`}
              onClick={() => goToMobileIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === mobileActiveIndex
                  ? "w-4 bg-black/60"
                  : "w-1.5 bg-black/15"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

"use client";
import { r2Asset } from "@/lib/site-images";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Box,
  Laptop,
  MonitorPlay,
  Network,
  Plus,
  Server,
  Settings,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { siteImages } from "@/lib/site-images";

/* ------------------------------------------------------------------ */
/* Set to true while placing pins: click anywhere on the stage and the */
/* x% / y% is shown + logged, so you can paste it into `pin` below.    */
/* ------------------------------------------------------------------ */
const CALIBRATE = false;

/* Time each solution stays on screen before auto-switching (ms) */
const AUTO_SWITCH_MS = 5000;

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Point = [number, number]; // x%, y% of the stage

type Pin = {
  dot: Point | Point[]; // ONE dot, or SEVERAL dots sharing the same label
  pill: Point; // label anchor
  side?: "right" | "left"; // which side of the anchor the label grows to (default "right")
};

/* Normalises a pin's dot(s) into an array of points */
const getDots = (pin: Pin): Point[] =>
  Array.isArray(pin.dot[0]) ? (pin.dot as Point[]) : [pin.dot as Point];

type Item = {
  id: string;
  name: string;
  description: string;
  image?: string;
  pin: Pin; // coordinates are relative to THIS vertical's stage image
};

type Vertical = {
  id: string;
  label: string;
  short: string;
  href: string;
  icon: LucideIcon;
  stage: string; // background image for this vertical
  items: Item[];
};

const verticals: Vertical[] = [
  {
    id: "audio-visual",
    label: "Audio Visual Solutions",
    short: "Audio Visual",
    icon: MonitorPlay,
    href: "/solutions/av-solutions",
    stage: r2Asset("/images/solutions/av_sol.png"),
    items: [
      {
        id: "collaboration-displays",
        name: "Collaboration Displays",
        description: "Interactive screens for brainstorming and presentations.",
        pin: { dot: [70, 35], pill: [75, 20] },
      },
      {
        id: "digital-signage",
        name: "Digital Signage",
        description:
          "Large-format displays that turn every wall into a canvas.",
        pin: { dot: [45, 30], pill: [43, 20], side: "left" },
      },
      {
        id: "room-control",
        name: "Room Control",
        description: "One-touch control of lighting, scheduling and AV.",
        pin: { dot: [57, 78], pill: [60, 86] },
      },
      {
        id: "audio-systems",
        name: "Audio Systems",
        description: "Clear, echo-free sound for rooms of every size.",
        pin: { dot: [58, 19], pill: [62, 10] },
      },
      {
        id: "video-conferencing",
        name: "Video Conferencing",
        description:
          "Zoom, Teams and Cisco-certified rooms for hybrid meetings.",
        pin: { dot: [20, 55], pill: [8, 75] },
      },
    ],
  },
  {
    id: "end-computing",
    label: "End Computing Solutions",
    short: "End Computing",
    icon: Laptop,
    href: "/solutions/end-computing",
    stage: r2Asset("/images/solutions/end_com.png"),
    items: [
      {
        id: "laptops",
        name: "Laptops",
        description: "High-performance laptops for modern enterprises.",
        pin: { dot: [15, 52.7], pill: [18, 20] },
      },
      {
        id: "desktops",
        name: "Desktops",
        description: "Reliable desktops for everyday productivity.",
        pin: { dot: [30, 39], pill: [37, 24] },
      },
      // {
      //   id: "thin-clients",
      //   name: "Thin Clients",
      //   description: "Secure and efficient virtual workspaces.",
      //   href: "/products",
      //   pin: { dot: [87.9, 43.7], pill: [86.3, 46.2], side: "left" },
      // },
      {
        id: "monitors",
        name: "Monitors",
        description: "High-resolution displays for better collaboration.",
        pin: { dot: [50.8, 58], pill: [60, 75], side: "left" },
      },
      {
        id: "printers",
        name: "Printers",
        description: "Smart printing solutions for enterprise workflows.",
        pin: { dot: [78, 52.5], pill: [80, 35] },
      },
      {
        id: "accessories",
        name: "Accessories",
        description: "Complete your workspace with essential accessories.",
        // Example of MULTIPLE dots -> one label
        pin: {
          dot: [
            [25, 85],
            // [38, 88],
            // [48, 82],
          ],
          pill: [30, 94],
        },
      },
    ],
  },
  {
    id: "data-center",
    label: "Data Center Solutions",
    short: "Data Center",
    icon: Server,
    href: "/solutions/data-center",
    stage: r2Asset("/images/solutions/data_center.png"),
    items: [
      {
        id: "motherboard",
        name: "Server Motherboards",
        description: "Dual-socket boards built for virtualization.",
        image: siteImages.products.motherboard,
        pin: { dot: [30, 40], pill: [35, 20] },
      },
      {
        id: "server-ram",
        name: "Server RAM",
        description: "High-speed ECC memory for intensive computing.",
        image: siteImages.products.serverRam,
        pin: { dot: [70, 70], pill: [75, 60] },
      },
    ],
  },
  {
    id: "networking",
    label: "Cyber Security & Networking",
    short: "Networking",
    icon: Network,
    href: "/solutions/networking-security",
    stage: r2Asset("/images/solutions/net_sec.png"),
    items: [
      {
        id: "router",
        name: "Enterprise WiFi",
        description: "WiFi 7 access points for dense environments.",
        image: siteImages.products.router,
        pin: { dot: [45, 45], pill: [52, 66] },
      },
    ],
  },
  {
    id: "power",
    label: "Power Solutions",
    short: "Power",
    icon: Zap,
    href: "/solutions/power-solutions",
    stage: r2Asset("/images/solutions/power_sol.png"),
    items: [
      {
        id: "psu",
        name: "Power Supplies",
        description: "Efficient hot-swappable units for 24/7 operation.",
        image: siteImages.products.powerSupply,
        pin: { dot: [60, 45], pill: [62, 41] },
      },
    ],
  },
  {
    id: "spares",
    label: "IT Spares & Accessories",
    short: "Spares",
    href: "/solutions/it-spares-accessories",
    icon: Box,
    stage: r2Asset("/images/solutions/it_spares.png"),
    items: [
      {
        id: "memory",
        name: "Memory",
        description: "Genuine memory modules and upgrade kits.",
        image: siteImages.products.serverRam,
        pin: { dot: [20, 80], pill: [25, 70] },
      },
      {
        id: "tablet",
        name: "Peripherals",
        description: "Docks, tablets and desk-side essentials.",
        // MULTIPLE dots -> one "Peripherals" label
        pin: {
          dot: [
            [38, 25],
            [90, 60],
            [95, 70],
            [80, 75],
          ],
          pill: [73.4, 54],
          side: "left",
        },
      },
    ],
  },
  {
    id: "managed",
    label: "Managed IT Services",
    short: "Managed IT",
    icon: Settings,
    href: "/solutions/managed-it-services",
    stage: r2Asset("/images/solutions/managed_it.png"),
    items: [
      {
        id: "monitoring",
        name: "Monitoring",
        description: "24/7 infrastructure monitoring and response.",
        pin: {
          dot: [
            [30, 35],
            [60, 35],
            [85, 30],
          ],
          pill: [60, 18],
          side: "left",
        },
      },
    ],
  },
];

const stats = [
  { value: "250+", label: "Enterprise Clients" },
  { value: "7+", label: "Solution Verticals" },
  { value: "15+", label: "Years of Expertise" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ProductShowcase() {
  const [verticalId, setVerticalId] = useState(verticals[0].id);
  const vertical = verticals.find((v) => v.id === verticalId) ?? verticals[0];
  const [activeId, setActiveId] = useState<string>(vertical.items[0].id);
  const [picked, setPicked] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const selectVertical = (v: Vertical) => {
    if (v.id === verticalId) return;
    setVerticalId(v.id);
    setActiveId(v.items[0].id);
  };

  /* Auto-switch to the next solution every AUTO_SWITCH_MS.
     Restarts whenever the vertical changes (including manual clicks),
     and stops while the pointer/focus is inside the card. */
  useEffect(() => {
    if (paused || CALIBRATE) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(() => {
      const i = verticals.findIndex((v) => v.id === verticalId);
      const next = verticals[(i + 1) % verticals.length];
      setVerticalId(next.id);
      setActiveId(next.items[0].id);
    }, AUTO_SWITCH_MS);

    return () => clearTimeout(timer);
  }, [verticalId, paused]);

  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!CALIBRATE) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
    const txt = `[${x}, ${y}]`;
    console.log(vertical.id, txt);
    setPicked(txt);
  };

  return (
    <section className="relative border-t border-white/5 bg-black py-8 sm:py-14">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6">
        <div
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#04090d] xl:aspect-[2/1]"
        >
          {/* ---------------- Stage: image + hotspots ---------------- */}
          <div
            onClick={onStageClick}
            className={`relative aspect-video w-full overflow-hidden xl:absolute xl:inset-y-0 xl:right-0 xl:aspect-auto xl:h-[70%] xl:w-[70%] ${
              CALIBRATE ? "cursor-crosshair" : ""
            }`}
          >
            {/* Background image: cross-fades on every vertical change */}
            <AnimatePresence initial={false}>
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={vertical.stage}
                  alt={vertical.label}
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* readability gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#04090d] via-[#04090d]/50 to-transparent xl:via-[#04090d]/40" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04090d]/70 via-transparent to-transparent" />

            {/* Pins + connector lines: re-mount per vertical so they swap with the image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="absolute inset-0"
              >
                {/* connector lines: one per dot */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  {vertical.items.map((item) =>
                    getDots(item.pin).map((d, i) => (
                      <line
                        key={`${item.id}-${i}`}
                        x1={d[0]}
                        y1={d[1]}
                        x2={item.pin.pill[0]}
                        y2={item.pin.pill[1]}
                        stroke="#25D9C7"
                        strokeOpacity={activeId === item.id ? 0.95 : 0.55}
                        strokeWidth={1.2}
                        vectorEffect="non-scaling-stroke"
                      />
                    )),
                  )}
                </svg>

                {/* hotspots */}
                {vertical.items.map((item) => {
                  const active = activeId === item.id;
                  const left = item.pin.side === "left";
                  return (
                    <div key={item.id}>
                      {/* one dot per point */}
                      {getDots(item.pin).map((d, i) => (
                        <span
                          key={i}
                          style={{ left: `${d[0]}%`, top: `${d[1]}%` }}
                          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                        >
                          {active && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D9C7]/60" />
                          )}
                          <span className="relative block h-2 w-2 rounded-full bg-[#25D9C7] shadow-[0_0_14px_4px_rgba(37,217,199,0.7)] sm:h-3 sm:w-3" />
                        </span>
                      ))}

                      {/* single label */}
                      <div
                        tabIndex={0}
                        onMouseEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        aria-label={item.name}
                        style={{
                          left: `${item.pin.pill[0]}%`,
                          top: `${item.pin.pill[1]}%`,
                        }}
                        className={`absolute z-10 flex -translate-y-1/2 items-center gap-1.5 rounded-full border bg-[#06161d]/85 p-0.5 pr-2.5 text-white backdrop-blur-md transition duration-300 sm:gap-3 sm:p-1 sm:pr-5 ${
                          left ? "-translate-x-full" : ""
                        } ${
                          active
                            ? "border-[#25D9C7] shadow-[0_0_24px_rgba(37,217,199,0.45)]"
                            : "border-white/15 hover:border-[#25D9C7]/70"
                        }`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#bfe9ff] to-[#29B9F2] text-[#04202b] shadow-[0_0_12px_rgba(41,185,242,0.8)] sm:h-7 sm:w-7">
                          <Plus
                            className="h-3 w-3 sm:h-4 sm:w-4"
                            strokeWidth={3}
                          />
                        </span>
                        <span className="whitespace-nowrap text-[10px] font-medium sm:text-sm">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {CALIBRATE && picked && (
              <div className="absolute right-3 top-3 z-20 rounded-md bg-black/80 px-3 py-1.5 font-mono text-sm text-[#25D9C7]">
                {picked}
              </div>
            )}
          </div>

          {/* ---------------- Left column ---------------- */}
          <div className="pointer-events-none relative flex flex-col gap-6 p-5 sm:p-8 xl:absolute xl:inset-y-0 xl:left-0 xl:w-[27%] xl:justify-between xl:gap-0 xl:p-0 xl:pb-[2.2%] xl:pl-[2.5%] xl:pt-[1.4%]">
            <div>
              <h2 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl xl:mt-0 xl:text-[clamp(2rem,2.9vw,3.4rem)]">
                Complete
                <br />
                <span
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  className="bg-clip-text text-transparent"
                >
                  IT Infrastructure
                </span>
                <br />
                Solutions
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base xl:max-w-[92%] xl:text-[clamp(0.8rem,1vw,1.1rem)]">
                Explore our integrated solutions.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-semibold text-[#25D9C7] xl:text-[clamp(1.3rem,1.7vw,2rem)]">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-xs text-white/55 xl:text-[clamp(0.65rem,0.75vw,0.85rem)]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical menu */}
            <nav
              aria-label="Solution verticals"
              className="pointer-events-auto rounded-2xl border border-[#25D9C7]/20 bg-[#06141a]/85 p-2.5 backdrop-blur-md xl:w-[95%]"
            >
              {verticals.map((v) => {
                const selected = v.id === verticalId;
                const Icon = v.icon;
                return (
                  <Link
                    key={v.id}
                    href={v.href}
                    onMouseEnter={() => selectVertical(v)}
                    onFocus={() => selectVertical(v)}
                    style={
                      selected ? { backgroundImage: BRAND_GRADIENT } : undefined
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition duration-300 xl:text-[clamp(0.75rem,0.8vw,0.95rem)] ${
                      selected
                        ? "font-semibold text-black"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        selected ? "" : "bg-white/5 text-white/80"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">{v.label}</span>
                    {selected && <ArrowRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ---------------- Bottom explore panel ---------------- */}
          <div className="hidden sm:block relative m-3 rounded-2xl border border-[#25D9C7]/20 bg-[#06141a]/90 p-4 backdrop-blur-md sm:m-5 sm:p-5 xl:absolute xl:bottom-[4.5%] xl:left-[27%] xl:right-[1.5%] xl:m-0 xl:p-[1.2%]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-white sm:text-lg">
                Explore {vertical.label}
              </h3>
              <Link
                href={vertical.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#29B9F2] transition hover:text-white"
              >
                View All {vertical.short}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-flow-col xl:auto-cols-fr xl:grid-cols-none"
              >
                {vertical.items.map((item) => {
                  const active = activeId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveId(item.id)}
                      className={`flex flex-col rounded-xl border p-3 transition duration-300 ${
                        active
                          ? "border-[#25D9C7] bg-gradient-to-b from-[#25D9C7]/15 to-transparent shadow-[0_0_22px_rgba(37,217,199,0.25)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25"
                      }`}
                    >
                      <div className="mt-3">
                        <span className="text-sm font-semibold text-white">
                          {item.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-snug text-white/55">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

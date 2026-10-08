"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building,
  Building2,
  Headset,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  Settings,
  Truck,
  User,
  Users,
  Wifi,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { siteImages } from "@/lib/site-images";

const metrics = [
  {
    label: "Enterprise Clients",
    value: "2,300+",
    icon: Building,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50",
  },
  {
    label: "Technology Experts",
    value: "300+",
    icon: Users,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    label: "Managed Support",
    value: "24/7",
    icon: Headset,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    label: "Years of Experience",
    value: "25+",
    icon: MapPin,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
];

const commandStats = [
  { icon: Wifi, value: "99.9%", label: "Uptime", accent: true },
  { icon: Truck, value: "2,300+", label: "Clients" },
  { icon: Users, value: "300+", label: "Experts" },
  { icon: Settings, value: "24/7", label: "Support" },
];

type Node = {
  id: string;
  label: string;
  svgX: number;
  svgY: number;
  hub?: boolean;
  hasLine?: boolean;
  side: "left" | "right";
};

// Coordinates calibrated to the map image (987x987px).
const nodes: Node[] = [
  // Central / HQ
  {
    id: "delhi",
    label: "Delhi NCR",
    svgX: 340,
    svgY: 300,
    hub: true,
    side: "right",
  },

  // Primary hubs (connected with lines)
  {
    id: "chandigarh",
    label: "Chandigarh",
    svgX: 309,
    svgY: 238,
    hasLine: true,
    side: "right",
  },
  {
    id: "jaipur",
    label: "Jaipur",
    svgX: 232,
    svgY: 382,
    hasLine: true,
    side: "left",
  },
  {
    id: "lucknow",
    label: "Lucknow",
    svgX: 418,
    svgY: 369,
    hasLine: true,
    side: "right",
  },
  {
    id: "kolkata",
    label: "Kolkata",
    svgX: 650,
    svgY: 500,
    hasLine: true,
    side: "right",
  },
  {
    id: "ahmedabad",
    label: "Ahmedabad",
    svgX: 173,
    svgY: 486,
    hasLine: true,
    side: "left",
  },
  {
    id: "mumbai",
    label: "Mumbai",
    svgX: 190,
    svgY: 611,
    hasLine: true,
    side: "left",
  },
  {
    id: "pune",
    label: "Pune",
    svgX: 230,
    svgY: 629,
    hasLine: true,
    side: "right",
  },
  {
    id: "hyderabad",
    label: "Hyderabad",
    svgX: 354,
    svgY: 667,
    hasLine: true,
    side: "right",
  },
  {
    id: "bangalore",
    label: "Bangalore",
    svgX: 326,
    svgY: 809,
    hasLine: true,
    side: "left",
  },
  {
    id: "chennai",
    label: "Chennai",
    svgX: 410,
    svgY: 810,
    hasLine: true,
    side: "right",
  },

  // North Presence
  { id: "srinagar", label: "Srinagar", svgX: 280, svgY: 100, side: "left" },
  { id: "jammu", label: "Jammu", svgX: 247, svgY: 134, side: "left" },
  { id: "amritsar", label: "Amritsar", svgX: 285, svgY: 190, side: "left" },
  { id: "shimla", label: "Shimla", svgX: 340, svgY: 190, side: "right" },
  { id: "jodhpur", label: "Jodhpur", svgX: 174, svgY: 376, side: "left" },
  { id: "udaipur", label: "Udaipur", svgX: 205, svgY: 438, side: "left" },
  { id: "kanpur", label: "Kanpur", svgX: 420, svgY: 340, side: "right" },

  // Central Presence
  { id: "gwalior", label: "Gwalior", svgX: 360, svgY: 389, side: "right" },
  { id: "bhopal", label: "Bhopal", svgX: 370, svgY: 486, side: "right" },
  { id: "indore", label: "Indore", svgX: 263, svgY: 507, side: "left" },
  { id: "nagpur", label: "Nagpur", svgX: 364, svgY: 555, side: "right" },
  { id: "raipur", label: "Raipur", svgX: 464, svgY: 541, side: "right" },

  // West Presence
  { id: "vadodara", label: "Vadodara", svgX: 196, svgY: 480, side: "right" },
  { id: "surat", label: "Surat", svgX: 120, svgY: 525, side: "left" },
  { id: "nashik", label: "Nashik", svgX: 205, svgY: 589, side: "right" },
  { id: "goa", label: "Goa", svgX: 225, svgY: 730, side: "left" },

  // East & Northeast Presence
  { id: "patna", label: "Patna", svgX: 582, svgY: 390, side: "right" },
  { id: "ranchi", label: "Ranchi", svgX: 592, svgY: 465, side: "right" },
  {
    id: "bhubaneswar",
    label: "Bhubaneswar",
    svgX: 550,
    svgY: 582,
    side: "right",
  },
  { id: "guwahati", label: "Guwahati", svgX: 752, svgY: 376, side: "right" },

  // South Presence
  {
    id: "visakhapatnam",
    label: "Visakhapatnam",
    svgX: 464,
    svgY: 658,
    side: "right",
  },
  {
    id: "vijayawada",
    label: "Vijayawada",
    svgX: 418,
    svgY: 720,
    side: "right",
  },
  { id: "mangalore", label: "Mangalore", svgX: 262, svgY: 762, side: "left" },
  { id: "coimbatore", label: "Coimbatore", svgX: 298, svgY: 700, side: "left" },
  { id: "kochi", label: "Kochi", svgX: 290, svgY: 872, side: "left" },
  { id: "madurai", label: "Madurai", svgX: 356, svgY: 879, side: "right" },
  {
    id: "trivandrum",
    label: "Thiruvananthapuram",
    svgX: 310,
    svgY: 923,
    side: "left",
  },
];

// Matches the pixel dimensions of the map image, so the overlay lines up 1:1.
const SVG_W = 987;
const SVG_H = 987;
const hub = nodes.find((n) => n.hub)!;
const lineSpokes = nodes.filter((n) => n.hasLine);

const MIN_ZOOM = 1;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.2;

function curvePath(x1: number, y1: number, x2: number, y2: number, bow = 0.18) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * len * bow;
  const cy = my + (dx / len) * len * bow;
  return { d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}` };
}

function Compass() {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-0.5 text-neutral-500">
      <span className="text-[10px] font-semibold tracking-wider">N</span>
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" stroke="#94A3B8" strokeWidth="1.2" />
        <circle
          cx="26"
          cy="26"
          r="17"
          stroke="#CBD5E1"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <path d="M26 6 L30 26 L26 46 L22 26 Z" fill="#94A3B8" opacity="0.55" />
        <path d="M6 26 L26 22 L46 26 L26 30 Z" fill="#94A3B8" opacity="0.35" />
        <path d="M26 6 L30 26 L26 26 Z" fill="#64748B" />
        <circle cx="26" cy="26" r="2" fill="#fff" stroke="#64748B" />
      </svg>
    </div>
  );
}

export default function FootprintMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const id = setInterval(
      () => setCycleIndex((v) => (v + 1) % lineSpokes.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  const activeSpoke = lineSpokes[cycleIndex % lineSpokes.length];
  const activeId = hoveredId ?? activeSpoke?.id ?? lineSpokes[0]?.id;

  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const zoomReset = () => setZoom(1);

  const controlBtn =
    "flex h-11 w-11 items-center justify-center text-neutral-800 transition hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-[#EEF6F8] py-16 sm:py-24">
      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:gap-10">
          {/* ───────── Left: text, stats, CTAs ───────── */}
          <div>
            <div data-aos="fade-right">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[#29B9F2]/30 bg-[#29B9F2]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                <span className="h-2 w-2 rounded-full bg-[#29B9F2]" />
                National Coverage
              </span>

              <h2 className="mt-7 text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                A Live Network
                <span
                  className="block bg-clip-text pb-[0.1em] text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  Across India
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-500 sm:text-md">
                Every delivery hub connects back to our Delhi command center,
                from initial consultation to long-term managed support,
                PAN-India.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {metrics.map((metric, i) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,60,50,0.06)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${metric.iconBg}`}
                  >
                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                  <div>
                    <div className="bg-clip-text text-3xl font-bold leading-none text-black">
                      {metric.value}
                    </div>
                    <p className="mt-1.5 text-sm leading-tight text-neutral-500">
                      {metric.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 rounded-xl px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-emerald-900/20 transition"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                Talk to Our Team
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="border-l border-slate-200 pl-4 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-neutral-500">
                Trusted by
                <br />
                Enterprises Nationwide
              </div>
            </div>
          </div>

          {/* ───────── Right: live network map ───────── */}
          <div id="network" data-aos="fade-left" data-aos-delay="200">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-[#F4FAFB] to-[#E3F1F6] shadow-sm">
              {/* Soft water glow */}
              <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-sky-200/30 blur-[100px]" />

              {/* Compass */}
              <div className="absolute right-5 top-5 z-40">
                <Compass />
              </div>

              {/* Map (zoomable layer) */}
              <div className="relative mx-auto w-full max-w-[760px] px-2 pt-4 sm:px-4">
                <div
                  className="relative mx-auto w-full transition-transform duration-500 ease-out"
                  style={{
                    aspectRatio: `${SVG_W} / ${SVG_H}`,
                    transform: `scale(${zoom})`,
                    transformOrigin: "35% 30%",
                  }}
                >
                  <img
                    src={siteImages.indiaMapNetwork}
                    alt="India delivery network map"
                    className="absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                  />

                  {/* Connection paths */}
                  <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    {lineSpokes.map((node) => {
                      const { d } = curvePath(
                        hub.svgX,
                        hub.svgY,
                        node.svgX,
                        node.svgY,
                      );
                      const isActive = activeId === node.id;
                      return (
                        <g key={node.id}>
                          <motion.path
                            d={d}
                            fill="none"
                            stroke={isActive ? "#FFE3A3" : "#F5C26B"}
                            strokeOpacity={isActive ? 1 : 0.6}
                            strokeWidth={isActive ? 2.4 : 1.5}
                            strokeLinecap="round"
                            style={{
                              filter: isActive
                                ? "drop-shadow(0 0 5px rgba(255,200,100,0.95))"
                                : "drop-shadow(0 0 2px rgba(255,200,100,0.5))",
                            }}
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.1 }}
                          />
                          {isActive && (
                            <circle
                              r={3.5}
                              fill="#FFF4D6"
                              className="animate-travel-dot"
                              style={{ offsetPath: `path("${d}")` }}
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* City nodes */}
                  {nodes.map((node) => {
                    const leftPct = (node.svgX / SVG_W) * 100;
                    const topPct = (node.svgY / SVG_H) * 100;
                    const isHub = !!node.hub;
                    const isLineCity = !!node.hasLine;
                    const isActive = isHub || activeId === node.id;
                    const isHovered = hoveredId === node.id;

                    // Regional hubs: small gold dots, label on hover
                    if (!isLineCity && !isHub) {
                      return (
                        <div
                          key={node.id}
                          className="group absolute -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            zIndex: isHovered ? 35 : 12,
                          }}
                          onMouseEnter={() => setHoveredId(node.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <span
                            className="relative block cursor-pointer rounded-full border border-amber-100 bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] transition-all duration-300 group-hover:scale-150"
                            style={{ width: 7, height: 7 }}
                          />
                          <span
                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0B2233]/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-md transition-all duration-200 ${
                              isHovered
                                ? "scale-100 opacity-100"
                                : "scale-95 opacity-0"
                            } ${
                              node.side === "left"
                                ? "right-full mr-2 text-right"
                                : "left-full ml-2"
                            }`}
                          >
                            {node.label}
                          </span>
                        </div>
                      );
                    }

                    // HQ + primary hubs
                    return (
                      <div
                        key={node.id}
                        className="group absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${leftPct}%`,
                          top: `${topPct}%`,
                          zIndex: isHub ? 32 : isActive ? 30 : 15,
                        }}
                        onMouseEnter={() => setHoveredId(node.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {isActive && (
                          <span
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full ${
                              isHub ? "bg-emerald-400/60" : "bg-amber-300/60"
                            }`}
                            style={{
                              width: isHub ? 32 : 24,
                              height: isHub ? 32 : 24,
                            }}
                          />
                        )}

                        {isHub ? (
                          <span
                            className="relative flex cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-emerald-600 shadow-[0_0_0_5px_rgba(16,185,129,0.25),0_2px_12px_rgba(0,0,0,0.3)]"
                            style={{ width: 20, height: 20 }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                        ) : (
                          <span
                            className="relative block cursor-pointer rounded-full border-2 border-white bg-amber-500 transition-all duration-300"
                            style={{
                              width: isActive ? 15 : 13,
                              height: isActive ? 15 : 13,
                              boxShadow: isActive
                                ? "0 0 0 4px rgba(251,191,36,0.35), 0 0 14px rgba(251,191,36,0.9)"
                                : "0 0 0 3px rgba(251,191,36,0.25), 0 0 8px rgba(251,191,36,0.6)",
                            }}
                          />
                        )}

                        {/* Label chip */}
                        {isHub ? (
                          <span className="pointer-events-none absolute left-full top-1/2 ml-3 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[10px] max-sm:text-[7px] max-sm:px-1 max-sm:py-1 font-bold text-neutral-900 shadow-[0_6px_20px_rgba(0,0,0,0.18)] sm:text-xs">
                            <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                            Delhi NCR HQ
                          </span>
                        ) : (
                          <span
                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0B2233]/95 px-2 py-1 text-[7px] font-semibold text-white shadow-md transition-all duration-300 sm:text-[11px] ${
                              isActive ? "scale-105" : ""
                            } ${
                              node.side === "left"
                                ? "right-full mr-2.5 text-right"
                                : "left-full ml-2.5"
                            }`}
                          >
                            {node.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delhi Command Center card */}
              <div className="relative z-30 mx-3 mb-3 mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,40,60,0.14)] lg:absolute lg:bottom-4 lg:right-4 lg:m-0 lg:w-[340px]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-neutral-900">
                    Delhi Command Center
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-neutral-500">
                  Centralized monitoring &amp; 24/7 support
                </p>

                <div className="my-4 border-t border-slate-100" />

                <div className="grid grid-cols-4 divide-x divide-slate-100">
                  {commandStats.map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col items-center px-1 text-center"
                    >
                      <s.icon
                        className={`h-5 w-5 ${
                          s.accent ? "text-emerald-600" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`mt-1.5 text-[13px] font-bold ${
                          s.accent ? "text-emerald-600" : "text-neutral-800"
                        }`}
                      >
                        {s.value}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacer so the map clears the card/controls on desktop */}
              <div className="hidden h-6 lg:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

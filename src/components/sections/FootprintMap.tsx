"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building, Headset, MapPin, Users } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { siteImages } from "@/lib/site-images";

const metrics = [
  { label: "Enterprise Clients", value: "2,300+", icon: Building },
  { label: "Technology Experts", value: "250+", icon: Users },
  { label: "Managed Support", value: "24/7", icon: Headset },
  { label: "Years of Experience", value: "25+", icon: MapPin },
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

// Coordinates recalibrated to the new map image (987x987px,
// landmass content roughly spans x:22-972, y:10-970 within that canvas).
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
    svgX: 179,
    svgY: 611,
    hasLine: true,
    side: "left",
  },
  {
    id: "pune",
    label: "Pune",
    svgX: 211,
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
    svgY: 805,
    hasLine: true,
    side: "right",
  },

  // North Presence
  { id: "srinagar", label: "Srinagar", svgX: 232, svgY: 100, side: "left" },
  { id: "jammu", label: "Jammu", svgX: 247, svgY: 134, side: "left" },
  { id: "amritsar", label: "Amritsar", svgX: 216, svgY: 182, side: "left" },
  { id: "chandigarh", label: "Chandigarh", svgX: 309, svgY: 238, side: "left" },
  { id: "shimla", label: "Shimla", svgX: 340, svgY: 203, side: "right" },
  { id: "dehradun", label: "Dehradun", svgX: 379, svgY: 210, side: "right" },
  { id: "jaipur", label: "Jaipur", svgX: 232, svgY: 382, side: "left" },
  { id: "jodhpur", label: "Jodhpur", svgX: 174, svgY: 376, side: "left" },
  { id: "udaipur", label: "Udaipur", svgX: 205, svgY: 438, side: "left" },
  { id: "agra", label: "Agra", svgX: 348, svgY: 348, side: "right" },
  { id: "lucknow", label: "Lucknow", svgX: 418, svgY: 369, side: "right" },
  { id: "kanpur", label: "Kanpur", svgX: 449, svgY: 410, side: "right" },
  { id: "varanasi", label: "Varanasi", svgX: 488, svgY: 403, side: "right" },

  // Central Presence
  { id: "gwalior", label: "Gwalior", svgX: 325, svgY: 389, side: "right" },
  { id: "bhopal", label: "Bhopal", svgX: 309, svgY: 486, side: "right" },
  { id: "indore", label: "Indore", svgX: 263, svgY: 507, side: "left" },
  { id: "nagpur", label: "Nagpur", svgX: 364, svgY: 555, side: "right" },
  { id: "raipur", label: "Raipur", svgX: 464, svgY: 541, side: "right" },

  // West Presence
  { id: "vadodara", label: "Vadodara", svgX: 196, svgY: 507, side: "right" },
  { id: "surat", label: "Surat", svgX: 187, svgY: 541, side: "left" },
  { id: "nashik", label: "Nashik", svgX: 205, svgY: 589, side: "right" },
  { id: "goa", label: "Goa", svgX: 221, svgY: 720, side: "left" },

  // East & Northeast Presence
  { id: "patna", label: "Patna", svgX: 542, svgY: 389, side: "right" },
  { id: "ranchi", label: "Ranchi", svgX: 542, svgY: 465, side: "right" },
  { id: "kolkata", label: "Kolkata", svgX: 620, svgY: 500, side: "right" },
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
    svgY: 707,
    side: "right",
  },
  { id: "mangalore", label: "Mangalore", svgX: 252, svgY: 782, side: "left" },
  { id: "coimbatore", label: "Coimbatore", svgX: 298, svgY: 845, side: "left" },
  { id: "kochi", label: "Kochi", svgX: 278, svgY: 872, side: "left" },
  { id: "madurai", label: "Madurai", svgX: 356, svgY: 879, side: "right" },
  {
    id: "trivandrum",
    label: "Thiruvananthapuram",
    svgX: 294,
    svgY: 913,
    side: "left",
  },
];

// Matches the actual pixel dimensions of the new map image exactly,
// so the overlay's coordinate space lines up 1:1 with the rendered <img>.
const SVG_W = 987;
const SVG_H = 987;
const hub = nodes.find((n) => n.hub)!;
const lineSpokes = nodes.filter((n) => n.hasLine);

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

export default function FootprintMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCycleIndex((v) => (v + 1) % lineSpokes.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  const activeSpoke = lineSpokes[cycleIndex % lineSpokes.length];
  const activeId = hoveredId ?? activeSpoke?.id ?? lineSpokes[0]?.id;

  return (
    <section className="relative overflow-hidden border-t border-neutral-200 bg-white py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D9C7]/[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr] lg:items-center lg:gap-16">
          {/* Left: text + stats */}
          <div>
            <div data-aos="fade-right">
              <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-widest text-[#25D9C7]">
                National Coverage
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
                A Live Network Across India
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-500">
                Every delivery hub connects back to our Delhi command center,
                from initial consultation to long-term managed support,
                PAN-India.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {metrics.map((metric, i) => (
                <div
                  key={metric.label}
                  className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:border-neutral-300 hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <metric.icon className="h-4 w-4 text-neutral-400 transition duration-300 group-hover:text-[#25D9C7]" />
                  <div
                    className="mt-2 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    {metric.value}
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live network map, large */}
          <div data-aos="fade-left" data-aos-delay="200">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50/60 shadow-sm">
              {/* Static dot grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Reduced padding (was px-14 pb-8 pt-12) and widened max-w
                  (was max-w-2xl) so the map fills more of the card */}
              <div className="relative mx-auto w-full max-w-3xl px-4 pb-4 pt-6">
                <div
                  className="relative mx-auto w-full"
                  style={{ aspectRatio: `${SVG_W} / ${SVG_H}` }}
                >
                  {/* Pre-rendered glowing network map image — same aspect ratio as the box above, so it fills exactly with no letterboxing */}
                  <img
                    src={siteImages.indiaMapNetwork}
                    alt="India delivery network map"
                    className="absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                  />

                  {/* Connection paths - only for cities that were there before */}
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
                            stroke="#ffffff"
                            strokeOpacity={isActive ? 0.95 : 0.35}
                            strokeWidth={isActive ? 2 : 1.25}
                            style={{
                              filter: isActive
                                ? "drop-shadow(0 0 4px rgba(255,255,255,0.9))"
                                : undefined,
                            }}
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.1 }}
                          />
                          {isActive && (
                            <circle
                              r={3}
                              fill="#ffffff"
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

                    // Remaining cities rendered as normal light dots
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
                          {/* Normal light dot */}
                          <span
                            className="relative block cursor-pointer rounded-full bg-white/70 border border-white/90 shadow-[0_0_6px_rgba(255,255,255,0.6)] transition-all duration-300 group-hover:scale-125 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                            style={{
                              width: 6,
                              height: 6,
                            }}
                          />

                          {/* City label on hover */}
                          <span
                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-200 bg-white/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-800 shadow-md backdrop-blur-sm transition-all duration-200 ${
                              isHovered
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95"
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

                    // Hub & previous major line cities
                    return (
                      <div
                        key={node.id}
                        className="group absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${leftPct}%`,
                          top: `${topPct}%`,
                          zIndex: isActive ? 30 : 15,
                        }}
                        onMouseEnter={() => setHoveredId(node.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {isActive && (
                          <span
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/60"
                            style={{
                              width: node.hub ? 26 : 20,
                              height: node.hub ? 26 : 20,
                            }}
                          />
                        )}
                        <span
                          className="relative block cursor-pointer rounded-full border-2 border-white transition-all duration-300"
                          style={{
                            width: node.hub ? 13 : isActive ? 12 : 7,
                            height: node.hub ? 13 : isActive ? 12 : 7,
                            backgroundColor: node.hub ? "#0f9ac9" : "#ffffff",
                            boxShadow: isActive
                              ? "0 0 0 4px rgba(255,255,255,0.3), 0 2px 10px rgba(0,0,0,0.25)"
                              : "0 1px 4px rgba(0,0,0,0.2)",
                          }}
                        />

                        {/* City label, always a legible chip for primary hubs */}
                        <span
                          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border text-[10px] font-semibold uppercase tracking-wide transition-all duration-300 ${
                            node.side === "left"
                              ? "right-full mr-2 text-right"
                              : "left-full ml-2"
                          } ${
                            isActive
                              ? "border-neutral-200 bg-white px-2 py-1 text-neutral-900 shadow-md"
                              : "border-transparent bg-white/70 px-1.5 py-0.5 text-neutral-600"
                          }`}
                        >
                          {node.label}
                          {node.hub && (
                            <span className="ml-1 text-[#0f9ac9]">HQ</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex items-center gap-2 border-t border-neutral-200 bg-white px-6 py-3.5 text-[11px] font-semibold text-neutral-500">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-[#25D9C7]/50" />
                Live delivery network, {nodes.length} active hubs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

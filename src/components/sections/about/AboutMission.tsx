"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

const missionPoints = [
  {
    number: "01",
    title: "Right Solutions",
    description:
      "Technology aligned to your business, not technology for technology's sake.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Right Partners",
    description:
      "Trusted expertise and partnerships that make complex decisions simpler.",
    icon: Network,
  },
  {
    number: "03",
    title: "Right Outcomes",
    description:
      "Solutions measured by the value, reliability, and impact they deliver.",
    icon: ShieldCheck,
  },
];

export default function AboutMission() {
  return (
    <section
      id="mission"
      className="relative isolate overflow-hidden bg-black py-28 sm:py-32 lg:py-40"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      {/* Main cyan glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 top-1/4 h-150 w-150 rounded-full bg-[#29B9F2]/8 blur-[150px]"
      />

      {/* Teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 bottom-0 h-125 w-125 rounded-full bg-[#25D9C7]/7 blur-[150px]"
      />

      {/* Subtle grid */}
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* =======================================================
            HEADER
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span
              className="h-px w-10"
              style={{ backgroundImage: BRAND_GRADIENT }}
            />

            <span className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              Our Mission
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-8 text-4xl font-semibold leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[5.5rem]">
            Making complex
            <br />
            technology
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              simple.
            </span>
          </h2>

          {/* Mission statement */}
          <div className="mt-10 max-w-3xl border-l border-[#29B9F2]/60 pl-6 sm:pl-8">
            <p className="text-xl font-medium leading-relaxed text-white/85 sm:text-2xl lg:text-[1.75rem]">
              To simplify technology decisions for enterprises — delivering the
              right solutions, right partners, right outcomes, every time.
            </p>
          </div>
        </motion.div>

        {/* =======================================================
            MISSION SYSTEM
        ======================================================= */}

        <div className="mt-20 lg:mt-28">
          <div className="grid gap-5 lg:grid-cols-3">
            {missionPoints.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-sm transition-colors duration-500 hover:border-white/[0.16] hover:bg-white/[0.045] sm:p-8 lg:min-h-[320px]"
                >
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        index === 0
                          ? "rgba(41,185,242,0.12)"
                          : index === 1
                            ? "rgba(37,217,199,0.12)"
                            : "rgba(41,185,242,0.1)",
                    }}
                  />

                  {/* Top row */}
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.2em] text-white/25">
                      {item.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition-all duration-500 group-hover:border-[#29B9F2]/30 group-hover:text-[#29B9F2]">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="relative mt-16 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="relative mt-4 max-w-sm text-sm leading-6 text-white/40 sm:text-base">
                    {item.description}
                  </p>

                  {/* Bottom line */}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-[#29B9F2] to-[#25D9C7] transition-all duration-700 group-hover:w-full" />

                  {/* Arrow */}
                  <ArrowRight className="absolute bottom-7 right-7 h-4 w-4 -translate-x-2 text-white/10 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-[#29B9F2]/60 group-hover:opacity-100" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* =======================================================
            BOTTOM STATEMENT
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="mt-16 flex flex-col justify-between gap-8 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/25">
              One window. One partner.
            </p>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              From infrastructure to end-user technology, we bring the
              enterprise technology ecosystem together under one roof.
            </p>
          </div>

          {/* Process indicator */}
          <div className="flex shrink-0 items-center gap-2">
            {missionPoints.map((item, index) => (
              <div key={item.number} className="flex items-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    index === 0
                      ? "border-[#29B9F2]/30 bg-[#29B9F2]/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <Check
                    className={`h-3.5 w-3.5 ${
                      index === 0 ? "text-[#29B9F2]" : "text-white/20"
                    }`}
                  />
                </span>

                {index < missionPoints.length - 1 && (
                  <span className="h-px w-8 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-white/[0.06]" />
    </section>
  );
}

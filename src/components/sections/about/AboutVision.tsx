"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND_GRADIENT } from "@/lib/brand";

export default function AboutVision() {
  return (
    <section
      id="vision"
      className="relative isolate overflow-hidden bg-black py-28 sm:py-32 lg:py-40"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      {/* Cyan glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-100 w-100 rounded-full bg-[#29B9F2]/10 blur-[140px]"
      />

      {/* Teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-100 w-100 rounded-full bg-[#25D9C7]/10 blur-[140px]"
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

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          {/* =====================================================
              LEFT — VISION CONTENT
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Label */}
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#29B9F2]" />

              <span className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Our Vision
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-8 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[5rem]">
              Building the
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                future of enterprise.
              </span>
            </h2>

            {/* Vision statement */}
            <div className="relative mt-10 max-w-2xl pl-6 sm:pl-8">
              {/* Accent line */}
              <div
                className="absolute left-0 top-1 bottom-1 w-px"
                style={{
                  backgroundImage: BRAND_GRADIENT,
                }}
              />

              <p className="text-xl font-medium leading-relaxed text-white/85 sm:text-2xl lg:text-[1.8rem]">
                To be the default choice of IT infrastructure for the
                enterprises of India.
              </p>
            </div>

            {/* Supporting text */}
            <p className="mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              We believe we can be the most reliable partner for Indian
              businesses who want to focus on what they do best, without having
              to worry about the IT infrastructure that enables them to do so.
              As these organizations continue to digitalize and transform, and
              as they leverage emerging disruptive technologies such as
              artificial intelligence, we want to continue being there for them,
              not as a transactional vendor, but as a true partner in growth.
            </p>
          </motion.div>

          {/* =====================================================
    RIGHT — ORBIT VISUAL
===================================================== */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex min-h-[400px] items-center justify-center sm:min-h-[500px]"
          >
            {/* ===================================================
      OUTER ORBIT
  =================================================== */}

            <div className="absolute h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[430px] lg:w-[430px]">
              {/* Static orbit line */}
              <div className="absolute inset-0 rounded-full border border-white/[0.07]" />

              {/* Orbiting elements */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* ================= TRUST ================= */}

                <div className="absolute left-1/2 top-0 -translate-x-1/2">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 24,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-md"
                  >
                    <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-[#29B9F2]/80">
                      Trust
                    </span>
                  </motion.div>
                </div>

                {/* ================= INNOVATION ================= */}

                <div className="absolute bottom-[14%] left-[4%]">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 24,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-md"
                  >
                    <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-[#29B9F2]/80">
                      Innovation
                    </span>
                  </motion.div>
                </div>

                {/* ================= EXCELLENCE ================= */}

                <div className="absolute bottom-[10%] -right-[10%]">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 24,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-md"
                  >
                    <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-[#29B9F2]/80">
                      Excellence
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* ===================================================
      MIDDLE ORBIT
  =================================================== */}

            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[210px] w-[210px] rounded-full border border-dashed border-white/[0.08] sm:h-[285px] sm:w-[285px]"
            >
              <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/30" />
            </motion.div>

            {/* ===================================================
      CENTER GLOW
  =================================================== */}

            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-52 w-52 rounded-full bg-[#29B9F2]/10 blur-3xl sm:h-64 sm:w-64"
            />

            {/* ===================================================
      CENTER
  =================================================== */}

            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-[#071014]/90 backdrop-blur-xl sm:h-56 sm:w-56">
              <div className="absolute inset-3 rounded-full border border-white/[0.06]" />

              <div className="relative text-center">
                <Image
                  src="/cursor-original.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-white/[0.06]" />
    </section>
  );
}

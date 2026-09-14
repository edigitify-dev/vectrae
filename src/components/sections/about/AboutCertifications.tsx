"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

/* ============================================================
   CERTIFICATION / AWARD DATA

   Replace these placeholder entries with the actual
   certifications, OEM certifications and awards provided
   by Vectrae HR / Marketing.

   Example:

   {
     name: "ISO 9001:2015",
     category: "Management System",
     image: "/images/certifications/iso-9001.webp",
   }

============================================================ */

type Certification = {
  name: string;
  category: string;
  image?: string;
};

const certifications: Certification[] = [
  {
    name: "ISO Certification",
    category: "Quality Management",
  },
  {
    name: "OEM Certification",
    category: "Technology Partner",
  },
  {
    name: "Industry Certification",
    category: "Enterprise Technology",
  },
  {
    name: "Industry Recognition",
    category: "Excellence & Innovation",
  },
];

export default function AboutCertifications() {
  return (
    <section
      id="certifications"
      className="relative isolate overflow-hidden bg-black py-28 sm:py-32 lg:py-40"
    >
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      {/* Cyan glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 top-1/4 h-150 w-150 rounded-full bg-[#29B9F2]/7 blur-[160px]"
      />

      {/* Teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 bottom-0 h-125 w-125 rounded-full bg-[#25D9C7]/6 blur-[150px]"
      />

      {/* Technical grid */}
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
        {/* ======================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end"
        >
          {/* Heading */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />

              <span className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Certifications & Awards
              </span>
            </div>

            <h2 className="mt-8 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[5.2rem]">
              Trust backed by
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                recognition.
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-md text-sm leading-7 text-white/40 sm:text-base lg:mb-2">
            Our certifications, technology partnerships, and industry
            recognition reflect the standards we bring to every enterprise
            engagement.
          </p>
        </motion.div>

        {/* ======================================================
            CERTIFICATION WALL
        ====================================================== */}

        <div className="mt-16 sm:mt-20">
          <div className="mb-7 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25">
              Credentials
            </span>

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/15">
              VERIFIED PARTNERSHIPS
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((certification, index) => (
              <motion.article
                key={certification.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.045] sm:p-7"
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#29B9F2]/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Number */}
                <div className="relative flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/20">
                    0{index + 1}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/25 transition-colors duration-300 group-hover:border-[#29B9F2]/30 group-hover:text-[#29B9F2]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* ==================================================
                    LOGO / PLACEHOLDER
                ================================================== */}

                <div className="relative mt-8 flex h-36 items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-black/30">
                  {certification.image ? (
                    <Image
                      src={certification.image}
                      alt={certification.name}
                      width={150}
                      height={100}
                      className="max-h-20 w-auto object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08]">
                        <BadgeCheck className="h-6 w-6 text-white/15" />

                        <span className="absolute inset-[-5px] rounded-full border border-dashed border-white/[0.05]" />
                      </div>

                      <span className="mt-4 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/15">
                        Logo Pending
                      </span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="relative mt-6 text-lg font-semibold tracking-tight text-white">
                  {certification.name}
                </h3>

                {/* Category */}
                <p
                  className="relative mt-2 bg-clip-text text-xs font-semibold uppercase tracking-[0.14em] text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {certification.category}
                </p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                />
              </motion.article>
            ))}
          </div>
        </div>

        {/* ======================================================
            PARTNER / AWARD STRIP
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <div className="flex flex-col border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Technology Ecosystem
              </p>

              <p className="mt-1 text-sm text-white/25">
                Trusted relationships across the enterprise technology stack.
              </p>
            </div>

            <div className="mt-4 font-mono text-[9px] tracking-[0.2em] text-white/15 sm:mt-0">
              VECTRAE / PARTNERS
            </div>
          </div>

          {/* Logo placeholders */}
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="group flex h-28 items-center justify-center transition-colors duration-300 hover:bg-white/[0.025]"
              >
                <div className="text-center">
                  <span className="block font-mono text-xs tracking-[0.2em] text-white/10 transition-colors duration-300 group-hover:text-white/25">
                    OEM
                  </span>

                  <span className="mt-1 block text-[8px] uppercase tracking-[0.2em] text-white/[0.08]">
                    Partner {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          SECTION DIVIDER
      ======================================================== */}

      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-white/[0.06]" />
    </section>
  );
}

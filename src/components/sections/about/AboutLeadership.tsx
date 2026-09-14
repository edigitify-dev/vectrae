"use client";

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
 * - 3-line bio
 * - LinkedIn URL (if available)
 *
 * Do not invent leadership information.
 */

type Leader = {
  name: string;
  designation: string;
  bio: string;
  image: string;
  linkedin?: string;
};

const leaders: Leader[] = [
  {
    name: "Leadership Profile",
    designation: "Designation",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: "",
  },
  {
    name: "Leadership Profile",
    designation: "Designation",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: "",
  },
  {
    name: "Leadership Profile",
    designation: "Designation",
    bio: "Leadership profile content will be provided by Vectrae HR/Marketing. This space is reserved for the leader's professional background and expertise.",
    image: "",
  },
];

export default function AboutLeadership() {
  return (
    <section
      id="leadership"
      className="relative isolate overflow-hidden bg-white py-28 sm:py-32 lg:py-40"
    >
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      {/* Cyan glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 top-1/4 h-150 w-150 rounded-full bg-[#29B9F2]/7 blur-[160px]"
      />

      {/* Teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 bottom-1/4 h-125 w-125 rounded-full bg-[#25D9C7]/6 blur-[150px]"
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

      {/* ========================================================
          MAIN CONTAINER
      ======================================================== */}

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
          className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end"
        >
          {/* Left */}
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />

              <span className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Leadership
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-8 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-black sm:text-5xl md:text-6xl lg:text-[5.5rem]">
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

          {/* Right intro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="max-w-md text-sm leading-7 text-black/40 sm:text-base lg:mb-2"
          >
            Experienced leadership driving Vectrae&apos;s vision, building
            trusted partnerships, and delivering enterprise technology outcomes
            at scale.
          </motion.p>
        </motion.div>

        {/* ======================================================
            LEADERSHIP CARDS
        ====================================================== */}

        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {leaders.map((leader, index) => (
            <motion.article
              key={`${leader.name}-${index}`}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.75,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.025] transition-colors duration-500 hover:border-black/[0.15] hover:bg-black/[0.04]"
            >
              {/* =================================================
                  IMAGE AREA
              ================================================= */}

              <div className="relative aspect-[4/4.6] overflow-hidden bg-[#071014]">
                {/* Image */}
                {leader.image ? (
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                ) : (
                  /* Temporary placeholder until HR provides image */
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Technical rings */}
                    <div className="absolute h-64 w-64 rounded-full border border-white/[0.05]" />

                    <div className="absolute h-44 w-44 rounded-full border border-dashed border-white/[0.06]" />

                    <div className="absolute h-28 w-28 rounded-full border border-[#29B9F2]/10 bg-[#29B9F2]/[0.025]" />

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

                {/* Image gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-white/10 to-transparent" />

                {/* Top metadata */}
                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                    0{index + 1}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 backdrop-blur-md">
                    Leadership
                  </span>
                </div>

                {/* Bottom image indicator */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#29B9F2] shadow-[0_0_12px_rgba(41,185,242,0.8)]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Executive Profile
                  </span>
                </div>
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div className="relative p-7 sm:p-8">
                {/* Name */}
                <h3 className="text-2xl font-semibold tracking-[-0.025em] text-black sm:text-[1.7rem]">
                  {leader.name}
                </h3>

                {/* Designation */}
                <p
                  className="mt-2 bg-clip-text text-sm font-semibold uppercase tracking-[0.12em] text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {leader.designation}
                </p>

                {/* Bio */}
                <p className="mt-5 text-sm leading-6 text-black/40">
                  {leader.bio}
                </p>

                {/* Bottom actions */}
                <div className="mt-7 flex items-center justify-between border-t border-black/[0.07] pt-5">
                  {/* Profile indicator */}
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/20">
                    Vectrae Infotech
                  </span>

                  {/* LinkedIn / arrow */}
                  {leader.linkedin ? (
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
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
                </div>

                {/* Hover line */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
                  style={{
                    backgroundImage: BRAND_GRADIENT,
                  }}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* ========================================================
          SECTION DIVIDER
      ======================================================== */}

      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-black/[0.06]" />
    </section>
  );
}

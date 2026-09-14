"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { BRAND_GRADIENT } from "@/lib/brand";
import { departmentIcons, departments } from "@/lib/careers-types";
import type { JobOpening } from "@/lib/careers-types";
import Navbar from "../Navbar";

const FILTERS = ["All Roles", ...departments] as const;

export default function CareersOpenings({ jobs }: { jobs: JobOpening[] }) {
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("All Roles");

  const visibleJobs =
    activeFilter === "All Roles"
      ? jobs
      : jobs.filter((job) => job.department === activeFilter);

  return (
    <section
      id="openings"
      className="relative overflow-hidden bg-black pb-20 sm:pb-28"
    >
      {/* <motion.div
        aria-hidden
        style={{ x: blobX, y: blobY }}
        className="pointer-events-none absolute left-1/2 top-0 h-130 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#84D96C]/15 blur-[140px]"
      />
      <motion.div
        aria-hidden
        style={{ x: blob2X, y: blob2Y }}
        className="pointer-events-none absolute bottom-0 right-1/4 h-100 w-100 translate-y-1/3 rounded-full bg-[#29B9F2]/10 blur-[120px]"
      /> */}

      <Navbar />
      <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="text-center" data-aos="fade-up">
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
            Open Roles
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {jobs.length} Position{jobs.length === 1 ? "" : "s"}, PAN-India
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Don&apos;t see the right fit?{" "}
            <a
              href="mailto:enquiry@vectrae.com"
              className="text-[#29B9F2] underline-offset-4 hover:underline"
            >
              Email us anyway
            </a>
            , we&apos;re always looking for great people.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap justify-center gap-2"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "border-transparent text-black"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                }`}
                style={
                  isActive ? { backgroundImage: BRAND_GRADIENT } : undefined
                }
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div
          className="mt-10 flex flex-col gap-3"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <AnimatePresence mode="popLayout">
            {visibleJobs.map((job) => {
              const Icon = departmentIcons[job.department];
              return (
                <motion.div
                  key={job.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SpotlightCard className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 hover:border-white/20">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-7"
                    >
                      <span className="flex items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#29B9F2]">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span>
                          <span className="block text-base font-semibold text-white sm:text-lg">
                            {job.title}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {job.location}
                            </span>
                            <span>{job.type}</span>
                            <span>{job.experience}</span>
                          </span>
                        </span>
                      </span>
                      <span
                        style={{ backgroundImage: BRAND_GRADIENT }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:rotate-45"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

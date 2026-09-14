"use client";

import Image from "next/image";
import { BRAND_GRADIENT } from "@/lib/brand";
import Navbar from "@/components/sections/Navbar";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteImages } from "@/lib/site-images";

export default function IndustriesHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="pointer-events-none absolute left-1/2 top-0 h-130 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/15 blur-[140px]" />

      <Navbar />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:py-12 lg:py-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          {/* Text column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-md">
            <h1
              className="text-6xl font-normal tracking-normal text-white sm:text-7xl lg:text-7xl xl:text-8xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Industries
            </h1>
            <div
              className="mt-6 h-1 w-16 rounded-full"
              style={{ backgroundImage: BRAND_GRADIENT }}
              data-aos="fade-up"
              data-aos-delay="150"
            />
            <p
              className="mt-6 text-base leading-relaxed text-white/55"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              From banking to broadcast, every industry runs on different
              technology requirements. Vectrae builds the AV, networking, and
              infrastructure solutions matched to yours.
            </p>
          </div>

          {/* Image cluster column */}
          <div className="relative w-full max-w-sm shrink-0 sm:max-w-md lg:w-[26rem] lg:max-w-none">
            <motion.div
              initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
            >
              <Image
                src={"/images/industry/industry_hero.png"}
                alt="Vectrae enterprise AV boardroom deployment"
                fill
                priority
                unoptimized
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            </motion.div>

            {/* Top-left overlapping photo */}
            <motion.div
              initial={{ opacity: 0, x: -48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 1.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute -left-4 top-16 rounded-2xl bg-white p-1 shadow-2xl sm:-left-10 sm:top-20 lg:-left-14"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-xl sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                <Image
                  src={"/images/industry/industry_hero_sub_01.png"}
                  alt="Enterprise video collaboration setup"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Bottom-right overlapping photo */}
            <motion.div
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute bottom-16 -right-4 rounded-2xl bg-white p-1 shadow-2xl sm:bottom-20 sm:-right-10 lg:-right-14"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-xl sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                <Image
                  src={"/images/industry/industry_hero_sub_02.png"}
                  alt="24/7 managed IT monitoring"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

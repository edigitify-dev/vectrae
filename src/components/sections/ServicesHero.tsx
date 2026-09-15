"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND_GRADIENT } from "@/lib/brand";
import Navbar from "@/components/sections/Navbar";

interface ServicesHeroProps {
  heroImage?: string;
  heroAlt?: string;
}

export default function ServicesHero({
  heroImage = "/video/av_hero_vid.mp4",
  heroAlt = "Vectrae enterprise technology solutions",
}: ServicesHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="pointer-events-none absolute left-1/2 top-0 h-130 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/15 blur-[140px]" />

      <Navbar />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-6 sm:pt-8 sm:pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left column: heading, copy, CTA */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1
              className="text-6xl font-normal tracking-normal text-white sm:text-7xl lg:text-8xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Solutions
            </h1>

            <div
              className="mt-6 h-1 w-16 rounded-full"
              style={{ backgroundImage: BRAND_GRADIENT }}
              data-aos="fade-up"
              data-aos-delay="150"
            />

            <p
              className="mt-6 max-w-md text-base leading-relaxed text-white/55"
              data-aos="fade-up"
            >
              From boardrooms to data centers, Vectrae designs, deploys, and
              supports every layer of enterprise technology so your teams can
              focus on the work that matters.
            </p>

            <Link
              href="#solutions"
              className="group mt-8 inline-flex shrink-0 items-center gap-4 rounded-full border border-white/10 bg-white/5 py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Explore Our Solutions
              <span
                style={{ backgroundImage: BRAND_GRADIENT }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:rotate-45"
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Right column: image cluster */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <motion.div
              initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl sm:aspect-[16/10]"
            >
              {heroImage.endsWith(".mp4") ? (
                <video
                  src={heroImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
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
              className="absolute -left-4 top-8 rounded-2xl border-2 border-white bg-white p-1 shadow-2xl sm:-left-10 sm:top-10 lg:-left-14"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-xl sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                <Image
                  src="/images/solutions/laptop.png"
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
              className="absolute -right-4 bottom-8 rounded-2xl border-2 border-white bg-white p-1 shadow-2xl sm:-right-10 sm:bottom-10 lg:-right-14"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-xl sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                <Image
                  src="/images/products/managedIt.png"
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

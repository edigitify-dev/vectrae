"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteImages } from "@/lib/site-images";

export default function SampleAboutUs() {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden flex items-center py-24 sm:py-32 border-t border-black/5">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 z-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#29B9F2]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 items-center">
          {/* Image Card - Clean fade-up animation */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] w-full rounded-2xl overflow-hidden lg:h-[600px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-black/10"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/hero/about.png"
                alt="About Us Sample"
                fill
                unoptimized
                className="object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Content - Clean fade-up animation */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              About Us
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Pioneering the <span className="text-[#29B9F2]">Future</span> of
              Technology
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#29B9F2] to-transparent" />
            <p className="mt-8 text-lg leading-relaxed text-neutral-600">
              We believe in building digital experiences that inspire and
              connect. Our team of visionary creators and technical experts work
              together to transform bold ideas into reality.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">
              From initial strategy to final implementation, we are your trusted
              partner in navigating the ever-evolving technological landscape.
              Join us in shaping tomorrow, today.
            </p>

            <div className="mt-10 flex gap-4">
              <button className="rounded-full bg-[#29B9F2] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#25D9C7] hover:scale-105 shadow-md hover:shadow-lg">
                Our Story
              </button>
              <button className="rounded-full border border-black/10 bg-black/5 px-8 py-3 text-sm font-semibold text-neutral-800 transition-all hover:bg-black/10 hover:border-black/20">
                Meet the Team
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

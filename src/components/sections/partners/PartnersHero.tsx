"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type MouseEvent } from "react";
import Navbar from "@/components/sections/Navbar";
import { BRAND_GRADIENT } from "@/lib/brand";

const HEADLINE = ["Global Brands.", "ONE TRUSTED PARTNER"];

export default function PartnersHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const blobX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const blobY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const blob2X = useTransform(blobX, (v) => v * -0.6);
  const blob2Y = useTransform(blobY, (v) => v * -0.6);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-black"
    >
      <motion.div
        aria-hidden
        style={{ x: blobX, y: blobY }}
        className="pointer-events-none absolute left-1/2 top-0 h-130 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/15 blur-[140px]"
      />
      <motion.div
        aria-hidden
        style={{ x: blob2X, y: blob2Y }}
        className="pointer-events-none absolute bottom-0 right-1/4 h-100 w-100 translate-y-1/3 rounded-full bg-[#84D96C]/10 blur-[120px]"
      />

      <Navbar />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-16">
        <p
          className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]"
          data-aos="fade-up"
        >
          Our OEM Partners
        </p>

        <h1 className="mt-8 font-semibold leading-[1] tracking-tight text-white text-4xl lg:text-[5rem]">
          {HEADLINE.map((line, i) => (
            <span
              key={line}
              className="block overflow-hidden pb-[0.2em] -mb-[0.2em]"
            >
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`block ${i === 1 ? "bg-clip-text text-transparent" : ""}`}
                style={
                  i === 1 ? { backgroundImage: BRAND_GRADIENT } : undefined
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          We partner with the world&apos;s leading technology brands across AV,
          Networking, Security, and End Computing, so every solution we deliver
          is best-in-class.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#partners"
            className="group inline-flex shrink-0 items-center gap-4 rounded-full border border-white/10 bg-white/5 py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
          >
            Explore Our Partners
            <span
              style={{ backgroundImage: BRAND_GRADIENT }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:rotate-45"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
          <a
            href="mailto:enquiry@vectrae.com"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:text-white"
          >
            Become a Partner
          </a>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-white/5 py-6">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Direct OEM & Technology Partners across every solution vertical
          </p>
        </div>
      </div>
    </section>
  );
}

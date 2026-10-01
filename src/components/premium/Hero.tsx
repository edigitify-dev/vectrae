"use client";
import { r2Asset } from "@/lib/site-images";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import TypewriterWord from "@/components/ui/TypewriterWord";
import { BRAND_GRADIENT } from "@/lib/brand";
import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";

const headlineWords = ["Integrated", "Technology", "Solutions", "For"];

const tickerItems = [
  "2,300+ Enterprises",
  "250+ Technology Experts",
  "OEM Partnerships",
  "25+ Years of Experience",
  "PAN-India Delivery",
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-black">
      {/* Animated technical grid backdrop */}
      <div
        className="animate-grid-pan pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Scanning sweep line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
        <div className="animate-scan-sweep absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-[#29B9F2]/10 to-transparent" />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-105 w-225 -translate-x-1/2 rounded-full bg-[#29B9F2]/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 translate-x-1/3 rounded-full bg-[#25D9C7]/15 blur-[110px]" />

      <header className="relative z-20 flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <Image
            src={r2Asset("/logo.png")}
            alt="Vectrae"
            width={140}
            height={29}
            className="h-7 w-auto"
            priority
          />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 md:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D9C7] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#25D9C7]" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-white/50">
            All systems operational
          </span>
        </div>

        <MagneticButton>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:px-5 sm:py-2.5"
          >
            Request Access
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </MagneticButton>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Reveal>
          <p className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            Trusted by{" "}
            <span className="font-semibold text-white">2,300+ Enterprises</span>{" "}
            Across India
          </p>
        </Reveal>

        <motion.h1
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          transition={{ staggerChildren: 0.07 }}
          className="flex max-w-6xl flex-wrap items-center justify-center gap-x-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {headlineWords.map((word) => (
            <motion.span
              key={word}
              variants={{
                hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
          <span className="mt-2 flex w-full items-baseline justify-center whitespace-nowrap">
            <TypewriterWord
              words={[
                "Audio Visual Setup",
                "Data Centers",
                "Power",
                "The Modern Enterprise",
              ]}
              className="text-[#29B9F2]"
              cursorClassName="bg-[#29B9F2]"
              align="center"
            />
          </span>
        </motion.h1>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            From AV and Networking to Data Centers and Power, Vectrae delivers
            end-to-end enterprise technology across PAN-India.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <MagneticButton className="w-full sm:w-auto">
              <button
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 text-sm font-semibold text-black transition hover:brightness-110 sm:w-auto"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                Request a Free Consultation
                <ArrowRight className="h-4 w-4" />
              </button>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <button className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto">
                Explore Our Solutions
              </button>
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={0.1}
        className="relative z-10 border-t border-white/10 py-4"
      >
        <div className="group relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-black to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-black to-transparent sm:w-32" />
          <div
            className="animate-marquee flex w-max items-center gap-10 group-hover:[animation-play-state:paused]"
            style={{ animationDuration: "35s" }}
          >
            {[tickerItems, tickerItems].map((pass, passIndex) => (
              <Fragment key={passIndex}>
                {pass.map((item, i) => (
                  <span
                    key={`${passIndex}-${i}`}
                    className="flex shrink-0 items-center gap-3 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-white/35"
                  >
                    {item}
                    <span className="h-1 w-1 rounded-full bg-[#29B9F2]/60" />
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

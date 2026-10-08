"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-black py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.05]">
        <div
          className="animate-marquee flex w-max"
          style={{ animationDuration: "40s" }}
        >
          {[0, 1].map((p) => (
            <span
              key={p}
              className="shrink-0 whitespace-nowrap px-8 text-[14vw] font-bold leading-none tracking-tighter text-white"
            >
              LET&apos;S BUILD SOMETHING ENTERPRISE-GRADE
            </span>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(480px circle at var(--x, 50%) var(--y, 50%), rgba(41,185,242,0.15), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#29B9F2]">
            Let&apos;s Get Started
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Ready to transform your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              enterprise technology?
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Trusted by 2,300+ enterprises.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:opacity-90"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                Request a Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href="tel:+91-11-40590964-65"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4 text-[#25D9C7]" />
                +91-11-40590964-65
              </a>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

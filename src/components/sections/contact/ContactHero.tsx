"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import Navbar from "@/components/sections/Navbar";

export default function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="pointer-events-none absolute left-1/2 top-0 h-130 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/15 blur-[140px]" />

      <Navbar />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-8 text-center sm:pb-28 sm:pt-14">
        <p
          className="text-xl font-semibold uppercase tracking-[0.3em] text-[#29B9F2]"
          data-aos="fade-up"
        >
          Get In Touch
        </p>
        <h1
          className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Let&apos;s Talk Technology
        </h1>
        <div
          className="mx-auto mt-6 h-1 w-16 rounded-full"
          style={{ backgroundImage: BRAND_GRADIENT }}
          data-aos="fade-up"
          data-aos-delay="150"
        />
        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Whether you need a quick quote or a complete technology
          transformation, our experts are ready to help. We respond within 4
          business hours.
        </p>

        <div
          className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <a
            href="tel:+911140590964"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
          >
            <Phone className="h-4 w-4 text-[#25D9C7]" />
            +91-11-40590964
          </a>
          <a
            href="mailto:enquiry@vectrae.com"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
          >
            <Mail className="h-4 w-4 text-[#25D9C7]" />
            enquiry@vectrae.com
          </a>
          <a
            href="https://wa.me/911140590964"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4 text-[#25D033]" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

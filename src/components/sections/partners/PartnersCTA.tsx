"use client";

import { ArrowRight, Mail } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

export default function PartnersCTA() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#29B9F2]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p
          className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]"
          data-aos="fade-up"
        >
          For OEMs & Technology Brands
        </p>
        <h2
          className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Want to become a{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            Vectrae partner?
          </span>
        </h2>
        <p
          className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-500 lg:text-base"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Reach 2,300+ enterprise clients PAN-India through Vectrae&apos;s
          distribution and delivery network. We&apos;re always evaluating new
          technology partnerships.
        </p>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <a
            href="mailto:enquiry@vectrae.com?subject=OEM%20Partnership%20Enquiry"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:opacity-90"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            Start a Partnership Conversation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="mailto:enquiry@vectrae.com"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-black/20"
          >
            <Mail className="h-4 w-4 text-[#0f9ac9]" />
            enquiry@vectrae.com
          </a>
        </div>
      </div>
    </section>
  );
}

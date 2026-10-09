"use client";

import { ShieldCheck } from "lucide-react";
import LogoMarquee from "@/components/ui/LogoMarquee";
import { coreValues } from "@/data/coreValues";
import { priorityPartnerLogos } from "@/data/partners";

export default function AboutTrust() {
  const valueItems = coreValues.map((value) => (
    <span
      key={value.title}
      className="text-4xl font-bold uppercase tracking-tight sm:text-6xl"
      style={{
        WebkitTextStroke: "1.5px rgba(0,0,0,0.12)",
        color: "transparent",
      }}
    >
      {value.title}
    </span>
  ));

  const certItems = priorityPartnerLogos.slice(0, 10).map((partner) => (
    <span
      key={partner.name}
      className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm font-medium text-neutral-700"
    >
      <ShieldCheck className="h-4 w-4 text-[#25D9C7]" />
      {partner.name}
    </span>
  ));

  return (
    <section className="relative overflow-hidden border-t border-black/5 bg-white py-24 sm:py-32">
      <div className="relative flex flex-col gap-10">
        <LogoMarquee items={valueItems} durationSeconds={38} />

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6">
          <div className="mx-auto max-w-xl bg-white/90 py-4 text-center backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0f9ac9]">
              Trust
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              Certified. Partnered. Chosen.
            </h2>
          </div>
        </div>

        <LogoMarquee items={certItems} reverse durationSeconds={28} />
      </div>
    </section>
  );
}

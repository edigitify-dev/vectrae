"use client";

import { useState } from "react";
import Image from "next/image";
import TiltCard from "@/components/ui/TiltCard";
import { BRAND_GRADIENT } from "@/lib/brand";
import { coreValues } from "@/data/coreValues";
import { perks } from "@/data/careers";
import { siteImages } from "@/lib/site-images";

export default function CareersCulture() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedValue = coreValues[selectedIndex];

  return (
    <section
      id="culture"
      className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-100 w-100 -translate-y-1/3 translate-x-1/4 rounded-full bg-[#84D96C]/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 translate-y-1/3 -translate-x-1/3 rounded-full bg-[#29B9F2]/8 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#29B9F2]">
            Life at Vectrae
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Five values that shape how we work.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div data-aos="fade-up">
            <TiltCard className="h-full">
              <div className="group relative h-full min-h-[360px] overflow-hidden rounded-3xl border border-black/10">
                <Image
                  src="/images/hero/about.png"
                  alt="Team at Vectrae"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <h3 className="text-2xl font-semibold text-white">
                    {selectedValue.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                    {selectedValue.description}
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            {coreValues.map((value, i) => {
              const isActive = i === selectedIndex;
              return (
                <button
                  key={value.title}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-pressed={isActive}
                  className="group relative flex w-full items-center gap-5 border-b border-black/10 py-5 pl-5 text-left first:pt-0 last:border-0 last:pb-0 sm:gap-6 sm:py-6"
                >
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
                      isActive ? "h-2/3" : "h-0 group-hover:h-2/3"
                    }`}
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  />
                  <span
                    className={`text-2xl font-bold tabular-nums transition-colors duration-300 sm:text-3xl ${
                      isActive
                        ? "text-neutral-900"
                        : "text-black/15 group-hover:text-neutral-900"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={`text-lg font-semibold sm:text-xl ${
                      isActive ? "text-neutral-900" : "text-neutral-500"
                    }`}
                  >
                    {value.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-20 border-t border-black/10 pt-20">
          <div className="max-w-2xl" data-aos="fade-up">
            <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]">
              Perks & Benefits
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              What you get, beyond the paycheck.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="group rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.15)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-colors duration-300 group-hover:bg-[#25D9C7]/10 group-hover:text-[#25D9C7]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-sm font-semibold text-neutral-900">
                    {perk.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

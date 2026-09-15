"use client";

import { Building2, Users, CalendarClock } from "lucide-react";
import Odometer from "@/components/ui/Odometer";
import { BRAND_GRADIENT } from "@/lib/brand";
import { stats } from "@/data/stats";

const icons = [Building2, Users, CalendarClock];

export default function AboutImpact() {
  const [primary, ...rest] = stats;

  return (
    <section
      id="impact"
      className="relative overflow-hidden border-t border-black/5 bg-white py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-100 w-100 translate-y-1/2 rounded-full bg-[#25D9C7]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]">
            Impact
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Numbers built over more than a decade of trust.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[170px]">
          <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 p-8 text-white shadow-lg sm:col-span-2 lg:row-span-2"
            style={{
              backgroundImage:
                "linear-gradient(155deg, #0b1220 0%, #0f172a 55%, #0c2b33 100%)",
            }}
            data-aos="fade-up"
          >
            <Building2 className="h-6 w-6 text-[#29B9F2]" />
            <div>
              <Odometer
                value={primary.value}
                suffix={primary.suffix}
                className="text-6xl font-bold text-white sm:text-7xl"
              />
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                {primary.label}
              </p>
            </div>
          </div>

          {rest.map((stat, i) => {
            const Icon = icons[i + 1];
            return (
              <div
                key={stat.label}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-neutral-50 p-6 transition hover:border-black/20 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <Icon className="h-5 w-5 text-neutral-400 transition group-hover:text-[#25D9C7]" />
                <div>
                  <Odometer
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-4xl font-bold text-neutral-900 sm:text-5xl"
                  />
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}

          <div
            className="relative flex flex-col justify-center overflow-hidden rounded-3xl border border-black/10 bg-black p-8 sm:col-span-2 lg:col-span-2"
            data-aos="fade-up"
            data-aos-delay="240"
          >
            <span
              className="h-8 w-8 rounded-full"
              style={{ backgroundImage: BRAND_GRADIENT }}
            />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Delivering the right solutions, the right partners, and the right
              outcomes, from initial consultation through long-term managed
              support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

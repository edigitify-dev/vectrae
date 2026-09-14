"use client";

import { motion } from "framer-motion";
import { Handshake, Users, Move3D, Scale, Sparkles } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

const values = [
  {
    number: "01",
    title: "Commitment to Clients",
    description:
      "We believe in earning the trust of our clients through our actions, and not through empty talk or promises. This has helped us retain our clients for decades now.",
    icon: Handshake,
  },
  {
    number: "02",
    title: "Single Point of Contact",
    description:
      "We understand how frustrating it can be to deal with multiple people for the same query, so we endeavor to provide end-to-end service and support with one person, or one team, throughout the relationship.",
    icon: Users,
  },
  {
    number: "03",
    title: "Flexibility",
    description:
      "We know how dynamic the business landscape can be, and how your IT infrastructure requirements can evolve as you grow, so we build our processes around flexibility and not a rigid template.",
    icon: Move3D,
  },
  {
    number: "04",
    title: "Value Engineering",
    description:
      "When budgets are tight, no one thinks about asking for anything more than what they need. So when you work with us, you pay for the solution, not for any embellishments the market may try to sell you.",
    icon: Scale,
  },
  {
    number: "05",
    title: "Curiosity",
    description:
      "Enterprise IT, especially emerging technologies such as artificial intelligence, is constantly evolving, so we encourage our people to embrace that dynamism and constantly update their skills.",
    icon: Sparkles,
  },
];

export default function AboutValues() {
  return (
    <section
      id="values"
      className="relative isolate overflow-hidden bg-white py-28 sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 top-1/4 h-150 w-150 rounded-full bg-[#29B9F2]/7 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 bottom-0 h-125 w-125 rounded-full bg-[#25D9C7]/6 blur-[150px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-px w-10"
              style={{ backgroundImage: BRAND_GRADIENT }}
            />
            <span className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              Core Values
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-semibold leading-[0.98] tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[5rem]">
            What we
            <br />
            stand on.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] p-7 transition-colors duration-500 hover:border-black/[0.15] hover:bg-black/[0.04] sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#29B9F2]/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-black/25">
                    {value.number}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] text-black/50 transition-all duration-500 group-hover:border-[#29B9F2]/30 group-hover:text-[#29B9F2]">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="relative mt-10 text-xl font-semibold tracking-tight text-black">
                  {value.title}
                </h3>

                <p className="relative mt-3 text-sm leading-6 text-black/45">
                  {value.description}
                </p>

                <div
                  className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

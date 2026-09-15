"use client";

import { Building2, Globe, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND_GRADIENT } from "@/lib/brand";

const reasons = [
  {
    icon: Globe,
    title: "PAN-India Reach",
    description:
      "A single distribution and delivery network spanning every major enterprise market in India.",
  },
  {
    icon: Users,
    title: "2,300+ Enterprise Relationships",
    description:
      "Direct access to a large, established base of enterprise decision-makers.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Technical Bench",
    description:
      "250+ trained and OEM-certified engineers ready to design, deploy, and support.",
  },
  {
    icon: Building2,
    title: "Single-Window Fulfillment",
    description:
      "Presales, procurement, deployment, and AMC support, handled end-to-end under one roof.",
  },
];

export default function PartnersWhy() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#25D9C7]/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 translate-y-1/3 -translate-x-1/3 rounded-full bg-[#84D96C]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
            Why OEMs Choose Vectrae
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            A distribution partner built for scale
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-start"
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#29B9F2]">
                  <Icon className="h-6 w-6" />
                  <span
                    style={{ backgroundImage: BRAND_GRADIENT }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-black shadow-sm"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

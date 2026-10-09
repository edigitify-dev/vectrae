"use client";

import { LifeBuoy, PenTool, Rocket, Search } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ComponentType, type SVGProps } from "react";
import { BRAND_GRADIENT } from "@/lib/brand";

type Step = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: Search,
    title: "Discover & Assess",
    description:
      "We audit your current infrastructure and map requirements against business goals.",
  },
  {
    icon: PenTool,
    title: "Design & Architect",
    description:
      "Our engineers design a tailored solution blueprint across AV, network, DC, and power.",
  },
  {
    icon: Rocket,
    title: "Deploy & Integrate",
    description:
      "Certified technicians install, configure, and integrate systems with zero disruption.",
  },
  {
    icon: LifeBuoy,
    title: "Support & Optimize",
    description:
      "24/7 monitoring, proactive AMC, and continuous optimization post go-live.",
  },
];

export default function ServiceProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#29B9F2]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 translate-y-1/3 -translate-x-1/3 rounded-full bg-[#84D96C]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="text-xl font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
            How We Work
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            From First Call to Full Deployment
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500">
            A proven four-stage engagement model that keeps every project on
            time, on budget, and built to scale.
          </p>
        </div>

        <div ref={containerRef} className="relative mt-20">
          {/* Connecting line, desktop only */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-neutral-200 lg:block" />
          <motion.div
            style={{ width: lineWidth }}
            className="pointer-events-none absolute left-0 top-8 hidden h-px lg:block"
          >
            <div
              className="h-full w-full"
              style={{ backgroundImage: BRAND_GRADIENT }}
            />
          </motion.div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex flex-col items-start"
                >
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-[#0f9ac9] shadow-sm">
                    <Icon className="h-6 w-6" />
                    <span
                      style={{ backgroundImage: BRAND_GRADIENT }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-black shadow-sm"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

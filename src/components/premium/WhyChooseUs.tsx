"use client";

import { useRef, type ComponentType, type SVGProps } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Handshake, Layers, MapPin, ShieldCheck, Workflow } from "lucide-react";
import { whyChooseUs } from "@/data/whyChooseUs";
import Reveal from "./Reveal";

const icons = [Layers, Workflow, Handshake, MapPin, ShieldCheck];
const colors = ["#29B9F2", "#25D9C7", "#84D96C", "#B6D93B", "#29B9F2"];

function StackCard({
  title,
  description,
  Icon,
  color,
  index,
}: {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  return (
    <div
      ref={ref}
      className="sticky flex justify-center px-6"
      style={{
        top: `${88 + index * 18}px`,
        zIndex: index + 1,
        paddingBottom: "56vh",
        marginBottom: index === whyChooseUs.length - 1 ? 0 : "-56vh",
      }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="flex w-full max-w-3xl origin-top flex-col gap-5 rounded-3xl border border-white/10 bg-neutral-950 p-8 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:gap-8 sm:p-10"
      >
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10"
          style={{ color, backgroundColor: `${color}14` }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <span className="font-mono text-xs text-white/30">0{index + 1}</span>
          <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden border-t border-black/5 bg-neutral-50 py-24 sm:pb-40 sm:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D9C7]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]">
            Why Choose Us
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Five Reasons Enterprises Choose Vectrae
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {whyChooseUs.map((item, i) => (
            <StackCard
              key={item.title}
              title={item.title}
              description={item.description}
              Icon={icons[i]}
              color={colors[i]}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { coreValues } from "@/data/coreValues";
import { BRAND_GRADIENT } from "@/lib/brand";
import Reveal from "./Reveal";

const INTERVAL = 2800;

export default function CoreValues() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((v) => (v + 1) % coreValues.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative border-t border-black/5 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]">
            Our Core Values
          </p>
        </Reveal>

        <div className="relative mt-10 flex h-24 items-center justify-center sm:h-28">
          <AnimatePresence mode="wait">
            <motion.span
              key={coreValues[index].title}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              {coreValues[index].title}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-8 flex max-w-xs items-center gap-1.5">
          {coreValues.map((value, i) => (
            <button
              key={value.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${value.title}`}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-200"
            >
              {i === index && (
                <motion.span
                  key={index}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                />
              )}
              {i < index && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND_GRADIENT } from "@/lib/brand";
import { partnersByCategory } from "@/data/partners";

const CATEGORIES = Object.keys(
  partnersByCategory,
) as (keyof typeof partnersByCategory)[];

export default function PartnersCategories() {
  const [activeCategory, setActiveCategory] = useState<
    keyof typeof partnersByCategory
  >(CATEGORIES[0]);
  const activePartners = partnersByCategory[activeCategory];

  return (
    <section
      id="partners"
      className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
            Partner Directory
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Best-in-class technology, by category
          </h2>
        </div>

        <div
          className="mt-12 flex flex-wrap justify-center gap-2"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "border-transparent text-black shadow-sm"
                    : "border-black/10 bg-white text-neutral-600 hover:border-black/20"
                }`}
                style={
                  isActive ? { backgroundImage: BRAND_GRADIENT } : undefined
                }
              >
                {category}
                <span
                  className={`ml-2 text-xs ${isActive ? "text-black/60" : "text-neutral-400"}`}
                >
                  {partnersByCategory[category].length}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="mt-12 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-10"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-2.5"
            >
              {activePartners.map((name) => (
                <span
                  key={name}
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-black/20 hover:bg-white hover:shadow-md"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-black"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    {name.charAt(0)}
                  </span>
                  {name}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

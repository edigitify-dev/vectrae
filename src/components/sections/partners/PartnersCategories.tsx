"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND_GRADIENT } from "@/lib/brand";
import { partnersByCategory } from "@/data/partners";

const CATEGORIES = Object.keys(
  partnersByCategory,
) as (keyof typeof partnersByCategory)[];

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
          <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
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
              className="flex flex-wrap justify-center gap-3"
            >
              {activePartners.map((partner) => (
                <span
                  key={partner.name}
                  className="group inline-flex w-fit shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-black/10 bg-neutral-50 py-1 px-1 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-black/20 hover:bg-white hover:shadow-md"
                >
                  {partner.logo ? (
                    <span className="relative flex h-10 w-26 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={28}
                        height={28}
                        unoptimized
                        className="h-full w-full object-contain p-2.5"
                      />
                    </span>
                  ) : (
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black"
                      style={{ backgroundImage: BRAND_GRADIENT }}
                    >
                      {getInitials(partner.name)}
                    </span>
                  )}
                  {/* <span className="whitespace-nowrap">{partner.name}</span> */}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

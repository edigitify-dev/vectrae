"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import { BRAND_GRADIENT } from "@/lib/brand";

import { categoryIcons, DEFAULT_CATEGORY_ICON } from "@/lib/blogCategoryIcon";

type Props = {
  postCount: number;
  categories: string[];
};

export default function BlogHero({ postCount, categories }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="pointer-events-none absolute left-1/2 top-0 h-130 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/15 blur-[140px]" />

      <Navbar />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-8 text-center sm:pb-20 sm:pt-14">
        <p
          className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]"
          data-aos="fade-up"
        >
          Insights &amp; Perspectives
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-6xl"
        >
          Ideas shaping{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            enterprise technology
          </span>
          .
        </motion.h1>
        {/* <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
        >
          Practical field notes from our AV, networking, data center, and
          managed services teams, {postCount} articles across{" "}
          {categories.length} disciplines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2.5"
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category] ?? DEFAULT_CATEGORY_ICON;
            return (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 backdrop-blur-sm transition hover:border-white/20 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5 text-[#29B9F2]" />
                {category}
              </Link>
            );
          })}
        </motion.div> */}
      </div>
    </section>
  );
}

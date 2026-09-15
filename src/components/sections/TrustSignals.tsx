"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { clientLogos, type ClientLogo } from "@/data/clients";
import { BRAND_GRADIENT } from "@/lib/brand";

const BATCH_SIZE = 9;
const ROTATE_INTERVAL_MS = 3500;

function getBatches(list: ClientLogo[], size: number): ClientLogo[][] {
  const count = Math.ceil(list.length / size);
  const batches: ClientLogo[][] = [];

  for (let b = 0; b < count; b++) {
    const batch: ClientLogo[] = [];

    for (let j = 0; j < size; j++) {
      batch.push(list[(b * size + j) % list.length]);
    }

    batches.push(batch);
  }

  return batches;
}

const BATCHES = getBatches(clientLogos, BATCH_SIZE);

function LogoCard({ name, logo }: ClientLogo) {
  return (
    <div
      className="
        flex
        h-full
        min-h-[90px]
        w-full
        items-center
        justify-center
        rounded-xl
        border
        border-neutral-200
        bg-white
        p-3
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-neutral-300
        hover:shadow-md
        sm:min-h-28
        sm:rounded-2xl
        sm:p-6
      "
    >
      <Image
        src={logo}
        alt={name}
        width={220}
        height={110}
        unoptimized
        className="
          h-6
          w-auto
          max-w-[75%]
          object-contain
          sm:h-8
          sm:max-w-[65%]
          md:h-9
        "
      />
    </div>
  );
}

function ClientWall() {
  const [batchIndex, setBatchIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useMotionTemplate`
    radial-gradient(
      420px circle at ${mouseX}px ${mouseY}px,
      rgba(37,217,199,0.14),
      transparent 70%
    )
  `;

  useEffect(() => {
    if (paused || BATCHES.length <= 1) return;

    const id = setInterval(() => {
      setBatchIndex((i) => (i + 1) % BATCHES.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [paused, batchIndex]);

  const activeBatch = BATCHES[batchIndex];

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function goToPrevious() {
    setBatchIndex((current) => (current - 1 + BATCHES.length) % BATCHES.length);
  }

  function goToNext() {
    setBatchIndex((current) => (current + 1) % BATCHES.length);
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="group/wall relative min-w-0 flex-1"
      >
        {/* Cursor glow */}
        <motion.div
          aria-hidden
          style={{ background }}
          className="
            pointer-events-none
            absolute
            -inset-4
            rounded-4xl
            opacity-0
            transition-opacity
            duration-500
            group-hover/wall:opacity-100
          "
        />

        {/* Previous button */}
        {BATCHES.length > 1 && (
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous client logos"
            className="
              absolute
              left-1
              top-1/2
              z-30
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200
              bg-white
              text-neutral-700
              shadow-sm
              transition-all
              duration-300
              hover:border-[#25D9C7]
              hover:text-[#25D9C7]
              hover:shadow-md
              sm:left-0
              sm:h-10
              sm:w-10
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:h-[18px] sm:w-[18px]"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Next button */}
        {BATCHES.length > 1 && (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next client logos"
            className="
              absolute
              right-1
              top-1/2
              z-30
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200
              bg-white
              text-neutral-700
              shadow-sm
              transition-all
              duration-300
              hover:border-[#25D9C7]
              hover:text-[#25D9C7]
              hover:shadow-md
              sm:right-0
              sm:h-10
              sm:w-10
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:h-[18px] sm:w-[18px]"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Logo carousel viewport */}
        <div className="relative h-full min-w-0 overflow-hidden px-10 sm:px-12">
          <AnimatePresence initial={false}>
            <motion.div
              key={batchIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                inset-0
                grid
                grid-cols-3
                grid-rows-3
                items-center
                justify-items-center
                gap-2
                px-10
                sm:gap-4
                sm:px-12
              "
            >
              {activeBatch.map((card) => (
                <LogoCard key={card.name} {...card} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      {BATCHES.length > 1 && (
        <div className="mt-5 flex justify-center gap-2 sm:mt-8">
          {BATCHES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show client logos group ${i + 1}`}
              onClick={() => setBatchIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === batchIndex ? "w-6 bg-[#25D9C7]" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrustSignals() {
  return (
    <section className="border-t border-neutral-200 bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="
  grid
  grid-cols-1
  gap-12
  lg:grid-cols-[2fr_3fr]
  lg:items-stretch
  lg:gap-16
"
        >
          {/* LEFT CONTENT */}
          <div
            className="
              flex
              flex-col
              justify-center
              lg:min-h-[480px]
            "
            data-aos="fade-right"
          >
            <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#25D9C7] sm:tracking-[0.13em]">
              Client Portfolio
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:mt-4 sm:text-5xl">
              Trusted across India&apos;s largest{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                enterprises
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 sm:mt-5">
              From global banks to Fortune 500 manufacturers, enterprises rely
              on Vectrae to deliver PAN-India technology infrastructure.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-neutral-200 pt-5 sm:mt-8 sm:gap-6 sm:pt-6">
              <div>
                <p className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                  2,300+
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Enterprises served
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                  250+
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Technology experts
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT LOGO WALL */}
          <div
            className="
    h-[460px]
    w-full
    min-w-0
    sm:h-[520px]
    lg:h-auto
    lg:min-h-[480px]
  "
          >
            <ClientWall />
          </div>
        </div>
      </div>
    </section>
  );
}

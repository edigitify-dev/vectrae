"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

/* ============================================================
   CERTIFICATION IMAGES

   Update the `image` path for each entry to match wherever you
   place these files (e.g. /public/images/certificates/...).
============================================================ */

const certifications: { image: string }[] = [
  { image: "/images/certificates/img.webp" },
  { image: "/images/certificates/img1.webp" },
  { image: "/images/certificates/img2.webp" },
  { image: "/images/certificates/img3.webp" },
  { image: "/images/certificates/img4.webp" },
  { image: "/images/certificates/img5.webp" },
  { image: "/images/certificates/img6.webp" },
  { image: "/images/certificates/img7.webp" },
  { image: "/images/certificates/img8.webp" },
  { image: "/images/certificates/img9.webp" },
  { image: "/images/certificates/img10.webp" },
  { image: "/images/certificates/img11.webp" },
  { image: "/images/certificates/img12.webp" },
  { image: "/images/certificates/img13.webp" },
  { image: "/images/certificates/img14.webp" },
  { image: "/images/certificates/img15.webp" },
  { image: "/images/certificates/img16.webp" },
];

export default function AboutCertifications() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Lock body scroll + allow Escape to close while dialog is open
  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage]);

  return (
    <section
      id="certifications"
      className="relative isolate overflow-hidden bg-black py-28 sm:py-32 lg:py-40"
    >
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      {/* Cyan glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 top-1/4 h-150 w-150 rounded-full bg-[#29B9F2]/7 blur-[160px]"
      />

      {/* Teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 bottom-0 h-125 w-125 rounded-full bg-[#25D9C7]/6 blur-[150px]"
      />

      {/* Technical grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end"
        >
          {/* Heading */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />

              <span className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Certifications & Awards
              </span>
            </div>

            <h2 className="mt-8 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[5.2rem]">
              Trust backed by
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                recognition.
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-md text-sm leading-7 text-white/40 sm:text-base lg:mb-2">
            Our certifications, technology partnerships, and industry
            recognition reflect the standards we bring to every enterprise
            engagement.
          </p>
        </motion.div>

        {/* ======================================================
            CERTIFICATION WALL
        ====================================================== */}

        <div className="mt-16 sm:mt-20">
          <div className="mb-7 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25">
              Credentials
            </span>

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/15">
              VERIFIED PARTNERSHIPS
            </span>
          </div>

          {/* Mobile: horizontal snap carousel. sm+: grid */}
          <div
            className="
              flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4
              [-ms-overflow-style:none] [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:grid sm:snap-none sm:gap-4 sm:overflow-visible sm:pb-0
              sm:grid-cols-3 lg:grid-cols-4
            "
          >
            {certifications.map((certification, index) => (
              <motion.button
                key={certification.image}
                type="button"
                onClick={() => setActiveImage(certification.image)}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative aspect-[4/3] w-[78%] shrink-0 snap-center cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] text-left transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.045] sm:w-auto sm:shrink"
              >
                <Image
                  src={certification.image}
                  alt="Certification"
                  fill
                  className="object-contain p-4 opacity-100 transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION DIVIDER
      ======================================================== */}

      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-white/[0.06]" />

      {/* ========================================================
          CERTIFICATE DIALOG
      ======================================================== */}

      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="certificate-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-6 backdrop-blur-sm"
            onClick={() => setActiveImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Certificate preview"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/70 backdrop-blur-md transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={activeImage}
                  alt="Certificate"
                  fill
                  className="object-contain p-6"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

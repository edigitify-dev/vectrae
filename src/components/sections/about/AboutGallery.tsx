"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

/*
 * Categories shown as pills above the bento.
 *
 * Each category has its own folder inside /public/images/gallery/
 * with files named "img (1).png", "img (2).png", ...
 *
 *   public/images/gallery/events/img (1).png ... img (18).png
 *   public/images/gallery/projects/img (1).png ... img (19).png
 *
 * `count` = how many images are in that folder.
 * To add a category: create the folder, then add one object here.
 * The "All" pill automatically combines every folder below.
 */
const CATEGORY_CONFIG = [
  { id: "events", label: "Events", folder: "events", count: 18 },
  { id: "projects", label: "Projects", folder: "projects", count: 19 },
];

const CATEGORIES: { id: string; label: string; images: string[] }[] =
  CATEGORY_CONFIG.map(({ id, label, folder, count }) => ({
    id,
    label,
    images: Array.from(
      { length: count },
      (_, i) => `/images/gallery/${folder}/img (${i + 1}).png`,
    ),
  }));

const ALL_CATEGORY = {
  id: "all",
  label: "All",
  images: CATEGORIES.flatMap((category) => category.images),
};

const PILLS = [ALL_CATEGORY, ...CATEGORIES];

/*
 * Number of photos shown in each bento composition.
 */
const IMAGES_PER_SLIDE = 9;

export default function AboutGallery() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY.id);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLightboxImageLoaded, setIsLightboxImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  /*
   * Portals need a browser document to attach to, so we only
   * flip this on after mount (also keeps SSR happy).
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /*
   * Images of the currently selected category.
   */
  const galleryImages = useMemo(
    () =>
      (PILLS.find((pill) => pill.id === activeCategory) ?? ALL_CATEGORY).images,
    [activeCategory],
  );

  /*
   * Automatically divide the category's images into groups of 9.
   */
  const slides = useMemo(() => {
    const result: string[][] = [];

    for (let i = 0; i < galleryImages.length; i += IMAGES_PER_SLIDE) {
      result.push(galleryImages.slice(i, i + IMAGES_PER_SLIDE));
    }

    return result;
  }, [galleryImages]);

  const totalSlides = slides.length;
  const totalImages = galleryImages.length;
  const isLightboxOpen = lightboxIndex !== null;

  function selectCategory(id: string) {
    if (id === activeCategory) return;

    setDirection(1);
    setActiveSlide(0);
    setActiveCategory(id);
  }

  function goToSlide(index: number) {
    if (index === activeSlide) return;

    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  }

  function nextSlide() {
    setDirection(1);

    setActiveSlide((current) =>
      current === totalSlides - 1 ? 0 : current + 1,
    );
  }

  function previousSlide() {
    setDirection(-1);

    setActiveSlide((current) =>
      current === 0 ? totalSlides - 1 : current - 1,
    );
  }

  function openLightbox(globalIndex: number) {
    setLightboxIndex(globalIndex);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function nextLightboxImage() {
    setLightboxIndex((current) =>
      current === null ? current : (current + 1) % totalImages,
    );
  }

  function previousLightboxImage() {
    setLightboxIndex((current) =>
      current === null ? current : (current - 1 + totalImages) % totalImages,
    );
  }

  /*
   * Reset the loaded flag every time the lightbox target changes,
   * so the skeleton shows again for images that haven't rendered yet.
   */
  useEffect(() => {
    setIsLightboxImageLoaded(false);
  }, [lightboxIndex]);

  /*
   * Keyboard navigation — carousel when the lightbox is closed,
   * lightbox nav/close when it's open.
   */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isLightboxOpen) {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") nextLightboxImage();
        if (event.key === "ArrowLeft") previousLightboxImage();
        return;
      }

      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalSlides, isLightboxOpen, totalImages]);

  /*
   * Lock body scroll while the lightbox is open.
   */
  useEffect(() => {
    if (isLightboxOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isLightboxOpen]);

  if (!slides.length) return null;

  const lightboxMarkup = (
    <AnimatePresence>
      {isLightboxOpen && lightboxIndex !== null && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close preview"
            className="absolute right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-[10000] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.1] hover:text-white sm:right-5 sm:top-5 sm:h-11 sm:w-11"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div
            className="absolute left-4 top-[calc(env(safe-area-inset-top)+1.25rem)] z-[10000] font-mono text-xs tracking-[0.18em] text-white/40 sm:left-5 sm:top-5"
            onClick={(event) => event.stopPropagation()}
          >
            {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
            {String(totalImages).padStart(2, "0")}
          </div>

          {/* Previous */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousLightboxImage();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-[10000] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextLightboxImage();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-[10000] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image */}
          <motion.div
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-4 h-[80vh] w-full max-w-5xl sm:mx-16"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Skeleton loader */}
            {!isLightboxImageLoaded && (
              <div className="absolute inset-0 animate-pulse rounded-md bg-gradient-to-br from-white/[0.4] via-white/[0.03] to-transparent" />
            )}

            <Image
              src={galleryImages[lightboxIndex]}
              alt="Vectrae gallery preview"
              fill
              sizes="90vw"
              className={`object-contain transition-opacity duration-500 ${
                isLightboxImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsLightboxImageLoaded(true)}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section
      id="gallery"
      className="relative isolate overflow-hidden bg-black py-20 sm:py-24 lg:py-32"
    >
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div
        aria-hidden
        className="pointer-events-none absolute -left-80 top-1/3 h-150 w-150 rounded-full bg-[#29B9F2]/[0.025] blur-[160px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-80 bottom-0 h-150 w-150 rounded-full bg-[#25D9C7]/[0.025] blur-[160px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* ======================================================
            CATEGORY PILLS
        ====================================================== */}

        <div className="mb-8 flex justify-center sm:mb-10">
          <div
            role="tablist"
            aria-label="Gallery categories"
            className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PILLS.map((pill) => {
              const isActive = activeCategory === pill.id;

              return (
                <button
                  key={pill.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectCategory(pill.id)}
                  className={`relative shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 sm:px-6 ${
                    isActive ? "text-black" : "text-white/50 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="gallery-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundImage: BRAND_GRADIENT }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}

                  <span className="relative z-10">{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================
            BENTO CAROUSEL
        ====================================================== */}

        <div className="relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${activeCategory}-${activeSlide}`}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction * 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: direction * -40,
              }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <BentoGrid
                images={slides[activeSlide] ?? slides[0]}
                slideIndex={activeSlide}
                onImageClick={openLightbox}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ======================================================
            CAROUSEL CONTROLS
        ====================================================== */}

        {totalSlides > 1 && (
          <div className="mt-6 flex items-center justify-between">
            {/* Counter */}
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-xs font-medium tracking-[0.18em]"
                style={{
                  color: "#29B9F2",
                }}
              >
                {String(activeSlide + 1).padStart(2, "0")}
              </span>

              <span className="h-px w-8 bg-white/10" />

              <span className="font-mono text-xs tracking-[0.18em] text-white/20">
                {String(totalSlides).padStart(2, "0")}
              </span>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to gallery slide ${index + 1}`}
                  aria-current={activeSlide === index}
                  onClick={() => goToSlide(index)}
                  className="group flex h-8 items-center justify-center px-1"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-400 ${
                      activeSlide === index
                        ? "w-8"
                        : "w-1.5 bg-white/20 group-hover:bg-white/40"
                    }`}
                    style={
                      activeSlide === index
                        ? {
                            backgroundImage: BRAND_GRADIENT,
                          }
                        : undefined
                    }
                  />
                </button>
              ))}
            </div>

            {/* Previous / Next */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous gallery slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/45 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next gallery slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/45 transition-all duration-300 hover:border-[#29B9F2]/30 hover:bg-[#29B9F2]/5 hover:text-[#29B9F2]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          SECTION DIVIDER
      ======================================================== */}

      <div
        className="absolute bottom-0 left-1/2 h-px w-[calc(100%-2rem)] max-w-[1450px] -translate-x-1/2"
        style={{
          backgroundImage: BRAND_GRADIENT,
          opacity: 0.1,
        }}
      />

      {/* ========================================================
          LIGHTBOX (portaled to <body> so it escapes this section's
          `isolate` stacking context and always sits above the navbar)
      ======================================================== */}

      {isMounted && createPortal(lightboxMarkup, document.body)}
    </section>
  );
}

function BentoGrid({
  images,
  slideIndex,
  onImageClick,
}: {
  images: string[];
  slideIndex: number;
  onImageClick: (globalIndex: number) => void;
}) {
  const baseIndex = slideIndex * IMAGES_PER_SLIDE;

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2.5
        lg:grid-cols-12
        lg:grid-rows-[260px_260px_210px]
      "
    >
      {/* =======================================================
          LARGE FEATURE
      ======================================================= */}

      {images[0] && (
        <GalleryImage
          src={images[0]}
          alt="Vectrae office"
          onClick={() => onImageClick(baseIndex + 0)}
          className="
            col-span-2
            min-h-[360px]
            lg:col-span-4
            lg:row-span-2
            lg:min-h-0
          "
        />
      )}

      {/* =======================================================
          TOP RIGHT
      ======================================================= */}

      {images[1] && (
        <GalleryImage
          src={images[1]}
          alt="Vectrae office"
          onClick={() => onImageClick(baseIndex + 1)}
          className="
            col-span-2
            min-h-[220px]
            lg:col-span-4
            lg:min-h-0
          "
        />
      )}

      {images[2] && (
        <GalleryImage
          src={images[2]}
          alt="Vectrae team"
          onClick={() => onImageClick(baseIndex + 2)}
          className="
            col-span-2
            min-h-[220px]
            lg:col-span-4
            lg:min-h-0
          "
        />
      )}

      {/* =======================================================
          MIDDLE RIGHT
      ======================================================= */}

      {images[3] && (
        <GalleryImage
          src={images[3]}
          alt="Vectrae workspace"
          onClick={() => onImageClick(baseIndex + 3)}
          className="
            col-span-2
            min-h-[220px]
            lg:col-span-4
            lg:min-h-0
          "
        />
      )}

      {images[4] && (
        <GalleryImage
          src={images[4]}
          alt="Vectrae meeting room"
          onClick={() => onImageClick(baseIndex + 4)}
          className="
            col-span-2
            min-h-[220px]
            lg:col-span-4
            lg:min-h-0
          "
        />
      )}

      {/* =======================================================
          BOTTOM ROW
      ======================================================= */}

      {images[5] && (
        <GalleryImage
          src={images[5]}
          alt="Vectrae team"
          onClick={() => onImageClick(baseIndex + 5)}
          className="
            col-span-1
            min-h-[220px]
            lg:col-span-3
            lg:min-h-0
          "
        />
      )}

      {images[6] && (
        <GalleryImage
          src={images[6]}
          alt="Vectrae team event"
          onClick={() => onImageClick(baseIndex + 6)}
          className="
            col-span-1
            min-h-[220px]
            lg:col-span-3
            lg:min-h-0
          "
        />
      )}

      {images[7] && (
        <GalleryImage
          src={images[7]}
          alt="Vectrae office"
          onClick={() => onImageClick(baseIndex + 7)}
          className="
            col-span-1
            min-h-[220px]
            lg:col-span-3
            lg:min-h-0
          "
        />
      )}

      {images[8] && (
        <GalleryImage
          src={images[8]}
          alt="Vectrae collaboration"
          onClick={() => onImageClick(baseIndex + 8)}
          className="
            col-span-1
            min-h-[220px]
            lg:col-span-3
            lg:min-h-0
          "
        />
      )}
    </div>
  );
}

/* =============================================================
   IMAGE COMPONENT
============================================================= */

function GalleryImage({
  src,
  alt,
  className = "",
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open preview: ${alt}`}
      className={`group relative overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#071014] text-left cursor-zoom-in ${className}`}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.2] via-white/[0.02] to-transparent" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="
          (max-width: 640px) 50vw,
          (max-width: 1024px) 50vw,
          33vw
        "
        onLoad={() => setIsLoaded(true)}
        className={`
          object-cover
          transition-all
          duration-700
          ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:scale-[1.045]
          ${isLoaded ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Extremely subtle hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.06]" />

      {/* Subtle Vectrae accent */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-[#29B9F2]/10
          opacity-0
          blur-3xl
          transition-opacity
          duration-700
          group-hover:opacity-100
        "
      />

      {/* Hover border */}
      <div className="pointer-events-none absolute inset-0 rounded-[14px] border border-[#29B9F2]/0 transition-colors duration-500 group-hover:border-[#29B9F2]/20" />
    </button>
  );
}

"use client";
import { r2Asset } from "@/lib/site-images";
import type { ShowcaseImage } from "@/lib/gallery";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  /** Tailwind grid span classes for the bento layout (md+) */
  span: string;
};

// Replace image paths with your real project photos (put them in /public/projects)
const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Enterprise Command Center",
    category: "Audio Visual",
    location: "New Delhi",
    image: r2Asset("/projects/command-center.jpg"),
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "p2",
    title: "Boardroom Collaboration Suite",
    category: "Collaboration",
    location: "Mumbai",
    image: r2Asset("/projects/boardroom.jpg"),
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: "p3",
    title: "Tier-III Data Center",
    category: "Data Center",
    location: "Noida",
    image: r2Asset("/projects/data-center.jpg"),
    span: "md:col-span-1 md:row-span-2",
  },
  {
    id: "p4",
    title: "Digital Signage Network",
    category: "Digital Signage",
    location: "Bengaluru",
    image: r2Asset("/projects/signage.jpg"),
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: "p5",
    title: "Secure Network Backbone",
    category: "Cyber Security & Networking",
    location: "Hyderabad",
    image: r2Asset("/projects/network.jpg"),
    span: "md:col-span-2 md:row-span-1",
  },
  {
    id: "p6",
    title: "Power & Backup Infrastructure",
    category: "Power Solutions",
    location: "Pune",
    image: r2Asset("/projects/power.jpg"),
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: "p7",
    title: "Managed NOC Operations",
    category: "Managed IT",
    location: "Gurugram",
    image: r2Asset("/projects/noc.jpg"),
    span: "md:col-span-1 md:row-span-1",
  },
];

type ImgStatus = "loading" | "loaded" | "error";

/**
 * Lazy image with skeleton while loading, fade-in when loaded,
 * and a clean placeholder if the image is missing / fails to load.
 * Parent must be `relative`.
 */
function LazyImage({
  src,
  alt,
  className = "",
  eager = false,
  placeholderClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Extra classes for the "coming soon" placeholder (e.g. padding to avoid overlapping card text) */
  placeholderClassName?: string;
}) {
  const [status, setStatus] = useState<ImgStatus>(src ? "loading" : "error");
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset when src changes, and handle images that finished (or failed)
  // before hydration, since onLoad/onError won't fire for those.
  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const el = imgRef.current;
    if (el && el.complete) {
      setStatus(el.naturalWidth > 0 ? "loaded" : "error");
    }
  }, [src]);

  return (
    <>
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 via-white/10 to-white/5" />
      )}

      {status === "error" ? (
        <div
          role="img"
          aria-label={`${alt} (image coming soon)`}
          className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/[0.03] via-white/[0.07] to-white/[0.03] text-white/30 ${placeholderClassName}`}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
            Image coming soon
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`${className} transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}

export default function ProjectsShowcase({
  galleryImages = [],
}: {
  galleryImages?: ShowcaseImage[];
}) {
  // Merge DB images into the placeholder array, slot by slot
  const projects: Project[] = PROJECTS.map((placeholder, i) => {
    const dbImg = galleryImages[i];
    if (!dbImg) return placeholder;
    return {
      ...placeholder,
      image: dbImg.url,
      title: dbImg.alt || placeholder.title,
      category: dbImg.categoryName || placeholder.category,
    };
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? projects[activeIndex] : null;

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % projects.length)),
    [],
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + projects.length) % projects.length,
      ),
    [],
  );

  // Keyboard controls + body scroll lock while lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, close, next, prev]);

  // Preload neighbouring images while the lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const neighbours = [
      projects[(activeIndex + 1) % projects.length],
      projects[(activeIndex - 1 + projects.length) % projects.length],
    ];
    neighbours.forEach((p) => {
      if (!p.image) return;
      const img = new Image();
      img.src = p.image;
    });
  }, [activeIndex, projects]);

  return (
    <section className="relative overflow-hidden bg-[#05080d] py-24 md:py-32">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-lime-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 text-xl font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Our Work
          </p>
          <h2 className="text-3xl font-semibold text-white md:text-5xl">
            Projects we&apos;re{" "}
            <span className="bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent">
              proud of
            </span>
          </h2>
          <p className="mt-4 text-sm text-white/60 md:text-base">
            A glimpse of enterprise environments we&apos;ve designed, deployed
            and supported across India.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[200px] md:grid-cols-4 lg:auto-rows-[220px]">
          {projects.map((project, i) => (
            <motion.button
              key={project.id}
              type="button"
              layoutId={`card-${project.id}`}
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:col-span-1 ${project.span}`}
            >
              <LazyImage
                src={project.image}
                alt={project.title}
                placeholderClassName="pb-24"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-[#05080d]/30 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

              {/* gradient border glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition group-hover:ring-cyan-400/50" />

              {/* expand icon */}
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="mb-2 inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-lime-300 backdrop-blur-md">
                  {project.category}
                </span>
                <h3 className="text-base font-semibold text-white md:text-lg">
                  {project.title}
                </h3>
                <p className="mt-0.5 text-xs text-white/60">
                  {project.location}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl md:p-10"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              layoutId={`card-${active.id}`}
              className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f16] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative min-h-[40vh] w-full bg-black">
                <LazyImage
                  key={active.id}
                  src={active.image}
                  alt={active.title}
                  eager
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-lime-300">
                    {active.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    {active.title}
                  </h3>
                  <p className="text-xs text-white/60">{active.location}</p>
                </div>
                <span className="text-xs text-white/40">
                  {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>

              {/* close */}
              <button
                type="button"
                onClick={close}
                aria-label="Close preview"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              {/* prev / next */}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous project"
                className="absolute left-3 top-[35%] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-gradient-to-r hover:from-lime-400 hover:to-cyan-400 hover:text-black"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="absolute right-3 top-[35%] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-gradient-to-r hover:from-lime-400 hover:to-cyan-400 hover:text-black"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

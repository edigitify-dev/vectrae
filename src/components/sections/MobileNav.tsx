"use client";
import { r2Asset } from "@/lib/site-images";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Crown, ArrowRight, Phone } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/navLinks";
import { solutions } from "@/data/solutions";

const FEATURED_SLUG = "av-solutions";
const avSolution = solutions.find((s) => s.slug === FEATURED_SLUG) ?? solutions[0];
const otherSolutions = solutions.filter((s) => s.slug !== FEATURED_SLUG);

function MobileMenuOverlay({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const [solutionsOpen, setSolutionsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex flex-col text-white"
      style={{ zIndex: 99999, backgroundColor: "#090a0f" }}
    >
      {/* Top Brand Gradient Accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="h-[3px] w-full shrink-0 origin-left"
        style={{ backgroundImage: BRAND_GRADIENT }}
      />

      {/* Header: Logo + Close */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link href="/" onClick={onClose}>
          <Image
            src={r2Asset("/logo.png")}
            alt="Vectrae"
            width={130}
            height={27}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition active:scale-95 hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Nav Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Navigation
        </motion.p>

        {/* Nav Links — staggered */}
        <div className="space-y-1">
          {NAV_LINKS.map((link, i) => {
            const delay = 0.15 + i * 0.05;

            /* ── Solutions accordion ── */
            if (link.label === "Solutions") {
              return (
                <motion.div
                  key="solutions"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {/* Accordion trigger */}
                  <button
                    type="button"
                    onClick={() => setSolutionsOpen((v) => !v)}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span className="flex items-center gap-2">
                      Solutions
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-black"
                        style={{ backgroundImage: BRAND_GRADIENT }}
                      >
                        Flagship AV
                      </span>
                    </span>
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-300"
                      style={{
                        transform: solutionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                        color: solutionsOpen ? "#25D9C7" : "rgba(255,255,255,0.5)",
                      }}
                    />
                  </button>

                  {/* Accordion body */}
                  <AnimatePresence initial={false}>
                    {solutionsOpen && (
                      <motion.div
                        key="solutions-body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-3 pb-3 pt-2 space-y-2"
                          style={{ background: "rgba(12,13,20,0.95)" }}
                        >
                          {/* AV Flagship Card */}
                          <Link
                            href={`/solutions/${avSolution.slug}`}
                            onClick={onClose}
                            className="block rounded-xl p-3 transition active:scale-[0.99]"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(37,217,199,0.18) 0%, rgba(37,217,199,0.08) 60%, transparent 100%)",
                              border: "1px solid rgba(37,217,199,0.35)",
                            }}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span
                                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: "#25D9C7" }}
                              >
                                <Crown className="h-3 w-3" /> Main Product
                              </span>
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-black"
                                style={{ backgroundImage: BRAND_GRADIENT }}
                              >
                                Flagship
                              </span>
                            </div>
                            <p className="text-sm font-bold text-white">{avSolution.title}</p>
                            <p
                              className="mt-0.5 text-xs line-clamp-2"
                              style={{ color: "rgba(255,255,255,0.65)" }}
                            >
                              {avSolution.tagline}
                            </p>
                          </Link>

                          {/* Other Solutions */}
                          <p
                            className="px-1 pt-1 text-[9px] font-bold uppercase tracking-widest"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            More Solutions
                          </p>
                          {otherSolutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <Link
                                key={solution.slug}
                                href={`/solutions/${solution.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-xs font-medium transition hover:bg-white/5"
                                style={{ color: "rgba(255,255,255,0.75)" }}
                              >
                                <Icon
                                  className="h-3.5 w-3.5 shrink-0"
                                  style={{ color: "#25D9C7" }}
                                />
                                <span>{solution.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            /* ── Audio Visual Solutions Flagship Link ── */
            if (link.label === "Audio Visual Solutions") {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition active:scale-[0.99]"
                    style={{
                      background: isActive
                        ? "linear-gradient(90deg, rgba(37,217,199,0.25) 0%, rgba(37,217,199,0.12) 100%)"
                        : "linear-gradient(90deg, rgba(37,217,199,0.12) 0%, rgba(37,217,199,0.05) 100%)",
                      border: "1px solid rgba(37,217,199,0.35)",
                      color: "#fff",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#25D9C7]" />
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              );
            }

            /* ── Regular link ── */
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-xl px-4 py-3.5 text-sm font-semibold transition hover:bg-white/5"
                  style={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                    background: isActive ? "rgba(255,255,255,0.09)" : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid transparent",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Contact CTA (pinned) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link
          href="/contact"
          onClick={onClose}
          style={{ backgroundImage: BRAND_GRADIENT }}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold text-black shadow-lg transition active:scale-[0.98] hover:brightness-105"
        >
          <Phone className="h-4 w-4" />
          <span>Contact Us</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:scale-95 hover:bg-white/20"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Portal — renders on <body>, escapes all parent stacking contexts */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <MobileMenuOverlay
                onClose={() => setOpen(false)}
                pathname={pathname}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

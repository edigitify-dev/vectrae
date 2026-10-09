"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MonitorPlay, CircleCheck, ArrowRight } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

const EXCLUDED_PREFIXES = ["/admin", "/desktop", "/premium"];

export default function FloatingAvWidget() {
  const pathname = usePathname();

  // Hide on admin, desktop OS, or premium landing pages
  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const isAvPage = pathname === "/solutions/av-solutions";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-5 z-40 block lg:hidden"
    >
      <Link href="/solutions/av-solutions" className="group relative block focus:outline-none">
        {/* Outer Radiant Ambient Glow */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.4, 0.75, 0.4],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#25D9C7] via-[#29B9F2] to-[#25D9C7] opacity-50 blur-md pointer-events-none"
        />

        {/* Main Floating Glass Pill Container */}
        <motion.div
          whileTap={{ scale: 0.94 }}
          className={`relative flex items-center gap-2.5 rounded-full border px-3.5 py-2 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 ${
            isAvPage
              ? "border-[#25D9C7] bg-[#090a0f]/95 shadow-[0_0_22px_rgba(37,217,199,0.45)]"
              : "border-[#25D9C7]/60 bg-[#090a0f]/90 hover:border-[#25D9C7]"
          }`}
        >
          {/* Animated AV Equalizer / Icon Orb */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25D9C7] to-[#29B9F2] text-black font-bold shadow-[0_0_14px_rgba(37,217,199,0.5)]">
            <MonitorPlay className="h-4 w-4" />

            {/* Live Audio Equalizer Waveform Ping */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D9C7] opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D9C7]" />
            </span>
          </div>

          {/* Text & Callout */}
          <div className="flex flex-col pr-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
              AV Solution
            </span>
            <span className="text-[9.5px] font-semibold text-[#25D9C7] flex items-center gap-1">
              {isAvPage ? (
                <>
                  <CircleCheck className="h-2.5 w-2.5 text-[#25D9C7]" /> Viewing Flagship
                </>
              ) : (
                <>
                  Audio Visual Flagship <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

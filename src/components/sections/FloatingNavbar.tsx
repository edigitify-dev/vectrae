"use client";
import { r2Asset } from "@/lib/site-images";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { BRAND_GRADIENT } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/navLinks";
import SolutionsMenu from "@/components/sections/SolutionsMenu";
import MobileNav from "@/components/sections/MobileNav";

// Past this scroll offset the floating bar takes over from the in-hero navbar.
const REVEAL_THRESHOLD = 120;
// Ignore sub-pixel/momentum scroll noise so the bar doesn't flicker.
const DIRECTION_DEADZONE = 4;
// Routes that render their own bespoke header — don't overlay the shared nav there.
const EXCLUDED_PREFIXES = ["/premium", "/desktop", "/admin"];

export default function FloatingNavbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastY.current;
    lastY.current = y;

    if (y <= REVEAL_THRESHOLD) {
      setVisible(false);
      return;
    }

    if (Math.abs(diff) < DIRECTION_DEADZONE) return;

    // Scrolling up (diff < 0) reveals the bar; scrolling down hides it.
    setVisible(diff < 0);
  });

  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? "0%" : "-100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 grid grid-cols-2 items-center border-b border-white/10 bg-black/80 px-6 py-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:grid-cols-3 lg:px-10"
    >
      <div className="flex items-center">
        <Link href="/">
          <Image src={r2Asset("/logo.png")} alt="Vectrae" width={154} height={32} className="h-8 w-auto" priority />
        </Link>
      </div>

      <nav className="hidden items-center gap-1 justify-self-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm lg:flex">
        {NAV_LINKS.map((link) => {
          if (link.label === "Solutions") {
            return <SolutionsMenu key={link.label} />;
          }

          if (link.label === "Audio Visual Solutions") {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#25D9C7]/20 text-[#25D9C7] ring-1 ring-[#25D9C7]/40 shadow-[0_0_12px_rgba(37,217,199,0.25)]"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D9C7]" />
                <span>{link.label}</span>
              </Link>
            );
          }

          const isActive = link.href !== "#" && pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="col-span-1 flex items-center justify-self-end gap-3">
        <Link
          href="/contact"
          style={{ backgroundImage: BRAND_GRADIENT }}
          className="hidden lg:inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Contact
        </Link>
        <MobileNav />
      </div>
    </motion.header>
  );
}

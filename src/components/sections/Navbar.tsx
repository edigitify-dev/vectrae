"use client";
import { r2Asset } from "@/lib/site-images";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_GRADIENT } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/navLinks";
import SolutionsMenu from "@/components/sections/SolutionsMenu";
import MobileNav from "@/components/sections/MobileNav";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 grid grid-cols-2 items-center px-6 py-6 lg:grid-cols-3 lg:px-10">
      <div className="flex items-center" data-aos="fade-down" data-aos-duration="600" data-aos-once="true">
        <Link href="/">
          <Image src={r2Asset("/logo.png")} alt="Vectrae" width={154} height={32} className="h-8 w-auto" priority />
        </Link>
      </div>

      <nav
        className="hidden items-center gap-1 justify-self-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm lg:flex"
        data-aos="fade-down"
        data-aos-delay="100"
        data-aos-once="true"
      >
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

      <div className="col-span-1 flex items-center justify-self-end gap-3" data-aos="fade-down" data-aos-delay="200" data-aos-once="true">
        <Link
          href="/contact"
          style={{ backgroundImage: BRAND_GRADIENT }}
          className="hidden lg:inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Contact
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}

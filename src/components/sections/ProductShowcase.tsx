"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Monitor,
  Server,
  ShieldCheck,
  Zap,
  Laptop,
  Cpu,
  Wifi,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { siteImages } from "@/lib/site-images";

type ProductPoint = {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string;
  image: string;
  icon: typeof Monitor;
  top: string;
  left: string;
  href: string;
  popoverPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

const products: ProductPoint[] = [
  {
    id: "laptop",
    name: "Enterprise Workstation Laptop",
    category: "End Computing",
    description:
      "High-performance enterprise laptop for heavy workloads and secure remote access.",
    specs: "Intel Core i9 • 64GB RAM • 2TB NVMe",
    image: siteImages.products.laptop,
    icon: Laptop,
    top: "22%",
    left: "18%",
    href: "/products/workstation-laptop",
    popoverPosition: "bottom-right",
  },
  {
    id: "motherboard",
    name: "Server Motherboard",
    category: "Data Center Solutions",
    description:
      "Dual-socket enterprise server motherboard built for intense computing and virtualization.",
    specs: "Dual LGA 4189 • 16x DIMM • PCIe 4.0",
    image: siteImages.products.motherboard,
    icon: Server,
    top: "80.4%",
    left: "26.3%",
    href: "/products/server-motherboard",
    popoverPosition: "top-right",
  },
  {
    id: "power-supply",
    name: "Industrial Power Supply",
    category: "Power Solutions",
    description:
      "Reliable and highly efficient power supply unit designed for continuous server operation.",
    specs: "1600W • 80 Plus Titanium • Hot-Swappable",
    image: siteImages.products.powerSupply,
    icon: Zap,
    top: "80.1%",
    left: "57.7%",
    href: "/products/power-supply",
    popoverPosition: "top-left",
  },
  {
    id: "server-ram",
    name: "Enterprise Server RAM",
    category: "Data Center Solutions",
    description:
      "High-speed ECC memory modules designed for intensive computing and virtualization.",
    specs: "128GB DDR5 • 4800MT/s • ECC",
    image: siteImages.products.serverRam,
    icon: Cpu,
    top: "80.6%",
    left: "41.9%",
    href: "/products/server-ram",
    popoverPosition: "top-right",
  },
  {
    id: "enterprise-router",
    name: "Enterprise WiFi Router",
    category: "Networking & Security",
    description:
      "High-performance WiFi 7 access point built for dense enterprise environments.",
    specs: "WiFi 7 • 10GbE Uplink • AI Roaming",
    image: siteImages.products.router,
    icon: Wifi,
    top: "80.7%",
    left: "73.2%",
    href: "/products/enterprise-router",
    popoverPosition: "top-left",
  },
  {
    id: "desktop-pc",
    name: "Enterprise Desktop PC",
    category: "End Computing",
    description:
      "Secure and powerful small form factor desktop built for enterprise deployments.",
    specs: "Intel vPro • 32GB RAM • TPM 2.0",
    image: siteImages.products.desktop,
    icon: Monitor,
    top: "45%",
    left: "18%",
    href: "/products/enterprise-desktop",
    popoverPosition: "bottom-right",
  },
];

const categories = [
  "All Products",
  "End Computing",
  "Data Center",
  "Power",
  "Networking",
];

export default function ProductShowcase() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const isFiltered = selectedCategory !== "All Products";

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All Products") return true;
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Auto-select the first product when a specific category filter is clicked
  useEffect(() => {
    if (isFiltered && filteredProducts.length > 0) {
      setActiveId(filteredProducts[0].id);
    } else {
      setActiveId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const getPopoverClasses = (position: ProductPoint["popoverPosition"]) => {
    switch (position) {
      case "top-left":
        return "bottom-full right-0 mb-4";
      case "top-right":
        return "bottom-full left-0 mb-4";
      case "bottom-left":
        return "top-full right-0 mt-4";
      case "bottom-right":
      default:
        return "top-full left-0 mt-4";
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black py-24 sm:py-32">
      {/* Background ambient lighting glows to match About & Services theme */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#29B9F2]/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-100 w-100 translate-x-1/3 translate-y-1/3 rounded-full bg-[#25D9C7]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section Header matching theme styling */}
        <div
          className="mx-auto w-full max-w-5xl text-center"
          data-aos="fade-up"
        >
          <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#29B9F2]">
            Interactive Showcase
          </p>
          <h2 className="mx-auto mt-4 w-full text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:whitespace-nowrap">
            Explore Hardware &amp; Enterprise Solutions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Hover or tap any product hotspot on the video frame to inspect
            specifications, key features, and enterprise deployment options.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition duration-300 ${
                  isSelected
                    ? "bg-[#29B9F2] text-black shadow-[0_0_20px_rgba(41,185,242,0.4)]"
                    : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Video Frame Canvas */}
        <div className="mt-12 sm:mt-16" data-aos="zoom-in" data-aos-delay="150">
          <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-sm sm:p-4">
            <div className="relative rounded-2xl bg-black">
              {/* Clipped layer: video + vignette only, so popovers below can escape this boundary */}
              <div className="relative overflow-hidden rounded-2xl">
                {/* Main Video */}
                <video
                  src="/product.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-auto max-h-[700px] w-full object-cover"
                />

                {/* Subtle Ambient Vignette Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>

              {/* Interactive Product Pointers */}
              {filteredProducts.map((product) => (
                <MagneticPin
                  key={product.id}
                  product={product}
                  isActive={activeId === product.id}
                  isFiltered={isFiltered}
                  onClick={() =>
                    setActiveId((prev) =>
                      prev === product.id ? null : product.id,
                    )
                  }
                  onMouseEnter={() => {
                    if (!isFiltered) setActiveId(product.id);
                  }}
                  onMouseLeave={() => {
                    if (!isFiltered) setActiveId(null);
                  }}
                  getPopoverClasses={getPopoverClasses}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MagneticPin({
  product,
  isActive,
  isFiltered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  getPopoverClasses,
}: {
  product: ProductPoint;
  isActive: boolean;
  isFiltered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  getPopoverClasses: (position: ProductPoint["popoverPosition"]) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.hypot(distX, distY);

    if (distance < 45) {
      const pullX = Math.max(-6, Math.min(6, (distX / 45) * 6));
      const pullY = Math.max(-6, Math.min(6, (distY / 45) * 6));
      x.set(pullX);
      y.set(pullY);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    onMouseLeave();
  };

  const Icon = product.icon;

  return (
    <div
      ref={ref}
      style={{ top: product.top, left: product.left }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 p-6 -m-6 ${
        isActive ? "z-50" : "z-20"
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isFiltered ? onClick : undefined}
    >
      {/* Magnetic wrapper for pin + aura */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="relative flex items-center justify-center"
      >
        {/* Pulsing Outer Aura */}
        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#25D9C7]/40 opacity-75 sm:h-12 sm:w-12" />

        {/* Hotspot Pin */}
        <div
          className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/90 text-white shadow-[0_0_20px_rgba(37,217,199,0.5)] transition duration-300 sm:h-11 sm:w-11 ${
            isActive
              ? "scale-125 border-[#25D9C7] bg-[#25D9C7] text-black shadow-[0_0_30px_rgba(37,217,199,0.8)]"
              : "hover:scale-125 hover:border-[#25D9C7] hover:bg-[#25D9C7] hover:text-black"
          }`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </motion.div>

      {/* Popover, sibling to motion.div so it stays stable while pin nudges */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${getPopoverClasses(
              product.popoverPosition,
            )} pointer-events-auto w-72 overflow-hidden rounded-2xl border border-white/15 bg-black/95 shadow-2xl backdrop-blur-xl sm:w-80`}
            style={{ zIndex: 9999 }}
          >
            <div className="relative h-32 w-full sm:h-40">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            </div>

            <div className="p-5 pt-2">
              <span className="rounded-md border border-[#29B9F2]/30 bg-[#29B9F2]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#29B9F2]">
                {product.category}
              </span>

              <h3 className="mt-2.5 text-base font-semibold text-white sm:text-lg">
                {product.name}
              </h3>

              <p className="mt-1.5 text-xs leading-relaxed text-white/60 sm:text-sm">
                {product.description}
              </p>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono font-medium text-white/70">
                {product.specs}
              </div>

              <Link
                href={product.href}
                style={{ backgroundImage: BRAND_GRADIENT }}
                className="group/btn mt-4 inline-flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-black transition duration-300 hover:opacity-90"
              >
                <span>View Product Details</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

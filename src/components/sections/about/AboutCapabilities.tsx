"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Laptop,
  ShieldCheck,
  Wifi,
  Presentation,
  Package,
  Headphones,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TiltCard from "@/components/ui/TiltCard";
import { siteImages } from "@/lib/site-images";

const whatWeDo = [
  {
    title: "End-Computing & Device Lifecycle",
    description:
      "Servers, laptops, workstations, and mobile devices from premier global brands, ready to be deployed and configured to order.",
    image: "/images/products/laptop.png",
  },
  {
    title: "Data Centre & Security",
    description:
      "Everything from design and deployment to firewall design and 24x7 monitoring, ensuring data is available when it's needed and secure when it's not.",
    image: "/images/products/ram.png",
  },
  {
    title: "Networking & Wi-Fi On-demand",
    description:
      "Managed-switch based wired and wireless network infrastructure, with analytical and monitoring capabilities to ensure uninterrupted uptime.",
    image: "/images/products/router.png",
  },
  {
    title: "Boardroom & AV",
    description:
      "Intuitive video-conferencing and AV infrastructure, spanning conferencing rooms and larger-than-life auditoriums.",
    image: "/images/solutions/boardroom.png",
  },
  {
    title: "IT Spares & Accessories",
    description:
      "A wide-ranging, OEM-sourced spares and accessories portfolio that ensures infrastructure downtime is minimized even in the face of device failures.",
    image: "/images/products/motherboard.png",
  },
  {
    title: "IT Services & Support",
    description:
      "Presales advisory and post-sales technical support, with certified engineers standing by to answer any given query.",
    image: "/images/products/managedIt.png",
  },
] as const;

const icons = [Laptop, ShieldCheck, Wifi, Presentation, Package, Headphones];

export default function AboutCapabilities() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const featured = whatWeDo[selectedIndex];
  const FeaturedIcon = icons[selectedIndex];

  // Everything except the currently-featured item, in original order.
  const rest = whatWeDo
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ originalIndex }) => originalIndex !== selectedIndex);

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden border-t border-black/5 bg-white py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute left-1/4 top-0 h-100 w-100 -translate-y-1/2 rounded-full bg-[#84D96C]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-widest text-[#29B9F2]">
            What We Do
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
            Built around the full lifecycle of enterprise IT.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-black/50 sm:text-base">
            From end-devices to data centers, our verticals mean our clients
            don&apos;t have to deal with the fragmented ecosystem that comes
            with working with multiple vendors.
          </p>
        </div>

        {/* lg:grid-cols-3 -> featured card (2x2 = 4 cells) + 2 cells in rows 1-2
            + 3 cells in row 3 = 9 cells total for 6 items (1 big + 5 small).
            This divides evenly, so no card is ever orphaned on its own row. */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[220px]">
          <div
            key={featured.title}
            className="lg:col-span-2 lg:row-span-2"
            data-aos="fade-up"
          >
            <TiltCard className="h-full">
              <div className="group relative h-full min-h-[280px] overflow-hidden rounded-3xl border border-black/10">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <FeaturedIcon className="h-6 w-6 text-[#29B9F2]" />
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {featured.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                    {featured.description}
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>

          {rest.map(({ item, originalIndex }, i) => {
            const Icon = icons[originalIndex];
            return (
              <div key={item.title} data-aos="fade-up" data-aos-delay={i * 80}>
                <SpotlightCard
                  onClick={() => setSelectedIndex(originalIndex)}
                  className="h-full cursor-pointer rounded-3xl border border-black/10 bg-black/[0.03] p-6 transition hover:border-black/20 hover:bg-black/[0.05]"
                >
                  <Icon className="h-5 w-5 text-[#25D9C7]" />
                  <h3 className="mt-4 text-base font-semibold text-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/50">
                    {item.description}
                  </p>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

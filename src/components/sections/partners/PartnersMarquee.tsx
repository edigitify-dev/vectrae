import Image from "next/image";
import { priorityPartnerLogos, type PartnerLogo } from "@/data/partners";

const firstRow = priorityPartnerLogos.filter((_, i) => i % 2 === 0);
const secondRow = priorityPartnerLogos.filter((_, i) => i % 2 === 1);

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MarqueeRow({
  partners,
  reverse,
  durationSeconds,
}: {
  partners: readonly PartnerLogo[];
  reverse?: boolean;
  durationSeconds: number;
}) {
  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-black to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-black to-transparent sm:w-32" />
      <div
        className={`flex w-max items-center gap-16 sm:gap-20 md:gap-24 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[...partners, ...partners].map((partner, i) => (
          <span
            key={`${partner.name}-${i}`}
            className="flex shrink-0 items-center gap-3"
          >
            {partner.logo ? (
              <span className="relative flex h-9 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={28}
                  height={28}
                  unoptimized
                  className="h-full w-full object-contain p-1.5"
                />
              </span>
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold text-white/50">
                {getInitials(partner.name)}
              </span>
            )}
            <span className="text-2xl font-semibold tracking-tight text-white/25 transition-colors duration-300 hover:text-white/70 sm:text-3xl">
              {partner.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PartnersMarquee() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center" data-aos="fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
          Trusted By The World&apos;s Leading Technology Brands
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        <MarqueeRow partners={firstRow} durationSeconds={34} />
        <MarqueeRow partners={secondRow} reverse durationSeconds={38} />
      </div>
    </section>
  );
}

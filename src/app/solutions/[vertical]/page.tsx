import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Odometer from "@/components/ui/Odometer";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import PremiumHeroBackdrop from "@/components/ui/PremiumHeroBackdrop";
import SolutionMedia from "@/components/ui/SolutionMedia";
import ReadingProgress from "@/components/sections/blog/ReadingProgress";
import { BRAND_GRADIENT, NOISE_BG_URL } from "@/lib/brand";
import { solutions, getSolution } from "@/data/solutions";
import { stats } from "@/data/stats";

type Props = {
  params: Promise<{ vertical: string }>;
};

export function generateStaticParams() {
  return solutions.map((solution) => ({ vertical: solution.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  const solution = getSolution(vertical);
  if (!solution) return {};

  return {
    title: `${solution.title} | Vectrae Enterprise Technology`,
    description: solution.description,
  };
}

function getOemInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function SolutionOverviewPage({ params }: Props) {
  const { vertical } = await params;
  const solution = getSolution(vertical);
  if (!solution) notFound();

  const Icon = solution.icon;
  const related = solutions.filter((s) => s.slug !== vertical).slice(0, 3);

  const capabilityImages = [
    "/images/audioCard/audioCardImg1.png",
    "/images/audioCard/audioCardImg2.png",
    "/images/audioCard/audioCardImg3.png",
    "/images/audioCard/audioCardImg4.png",
    "/images/audioCard/audioCardImg5.png",
    "/images/audioCard/audioCardImg6.png",
  ];

  return (
    <>
      <ReadingProgress />
      <section className="relative overflow-hidden bg-black">
        <PremiumHeroBackdrop />

        <Navbar />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-6 sm:pb-28">
          <div
            className="flex items-center gap-1.5 text-sm text-white/40"
            data-aos="fade-up"
          >
            <Link href="/" className="transition hover:text-white/70">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/solutions" className="transition hover:text-white/70">
              Solutions
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">{solution.title}</span>
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#29B9F2] shadow-[0_0_25px_rgba(41,185,242,0.25)]"
                data-aos="zoom-in"
              >
                <Icon className="h-6 w-6" />
              </span>
              <h1
                className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {solution.title}
              </h1>
              <p
                className="mt-4 text-lg text-white/60"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {solution.tagline}
              </p>
              <p
                className="mt-6 max-w-xl text-base leading-relaxed text-white/50"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {solution.description}
              </p>

              <div
                className="mt-8 flex flex-wrap items-center gap-3"
                data-aos="fade-up"
                data-aos-delay="250"
              >
                <Link
                  href="/contact"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Request a Free Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+911140590964"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  <PhoneCall className="h-4 w-4 text-[#25D9C7]" />
                  +91-11-40590964
                </a>
              </div>
            </div>

            <div
              className="group relative h-80 overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-shadow duration-700 hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.4),0_40px_80px_-20px_rgba(0,0,0,0.6)] sm:h-100"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              <SolutionMedia
                src={solution.heroImage}
                alt={solution.title}
                priority
                className="transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              {/* Floating trust badge */}
              <div
                className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-md"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <span
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black"
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-none text-white">
                    2,300+ Enterprises
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/50">
                    Trust Vectrae PAN-India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative overflow-hidden border-t border-black/5 bg-white py-14">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ backgroundImage: BRAND_GRADIENT }}
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-3 gap-x-6 gap-y-10 px-6 lg:grid-cols-3 lg:divide-x lg:divide-neutral-100">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col lg:pl-8 lg:first:pl-0"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <Odometer
                value={stat.value}
                suffix={stat.suffix}
                className="text-3xl font-bold text-neutral-900 sm:text-4xl"
              />
              <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#29B9F2]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              What&apos;s Included
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
              Everything under {solution.title}
            </h2>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-5">
            {solution.capabilities.map((cap, i) => {
              const CapIcon = cap.icon;

              return (
                <div
                  key={cap.title}
                  className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f5f5f0] px-8 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.45),0_20px_45px_-15px_rgba(15,23,42,0.18)] sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                >
                  {/* Hover Background Image */}
                  {capabilityImages[i] && (
                    <Image
                      src={capabilityImages[i]}
                      alt=""
                      fill
                      unoptimized
                      className="pointer-events-none absolute inset-0 z-0 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}

                  {/* Black Overlay */}
                  <div className="pointer-events-none absolute inset-0 z-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Top Gradient Line */}
                  <span
                    className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-black/3 text-[#0f9ac9] transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-[#25D9C7]/40 group-hover:bg-[#25D9C7]/10 group-hover:text-white group-hover:shadow-[0_0_18px_rgba(37,217,199,0.4)]">
                      <CapIcon className="h-5 w-5" />
                    </span>

                    <h3 className="mt-5 text-2xl font-semibold text-neutral-900 transition-colors duration-500 group-hover:text-white">
                      {cap.title}
                    </h3>

                    <p className="mt-2 text-md leading-relaxed text-neutral-500 transition-colors duration-500 group-hover:text-white/70">
                      {cap.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sub-services */}
      {solution.subServices.length > 0 && (
        <section className="relative overflow-hidden bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
              <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Go Deeper
              </p>
              <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
                {solution.title} Services
              </h2>
            </div>

            <div className="mt-14 flex flex-wrap justify-center gap-5">
              {solution.subServices.map((sub, i) => {
                const SubIcon = sub.icon;
                return (
                  <Link
                    key={sub.slug}
                    href={`/solutions/${solution.slug}/${sub.slug}`}
                    className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f5f5f0] px-8 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.45),0_20px_45px_-15px_rgba(15,23,42,0.18)] sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)]"
                    data-aos="fade-up"
                    data-aos-delay={i * 60}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white text-[#0f9ac9] transition-all duration-500 group-hover:scale-105 group-hover:border-[#25D9C7]/40 group-hover:shadow-[0_0_18px_rgba(37,217,199,0.35)]">
                        <SubIcon className="h-5 w-5" />
                      </span>
                      <span
                        style={{ backgroundImage: BRAND_GRADIENT }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:rotate-45 group-hover:opacity-100"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                      {sub.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                      {sub.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-400 transition-colors duration-300 group-hover:text-[#0f9ac9]">
                      Explore
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D9C7]/10 blur-[140px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BG_URL }}
        />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <p
            className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]"
            data-aos="fade-up"
          >
            Why Vectrae
          </p>
          <h2
            className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Built for enterprise reliability
          </h2>

          <div className="mx-auto mt-12 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
            {solution.benefits.map((benefit, i) => (
              <div
                key={benefit}
                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-[#25D9C7]/30 hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(37,217,199,0.15)]"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#25D9C7] transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm text-white/70">{benefit}</span>
              </div>
            ))}
          </div>

          {solution.oems.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl" data-aos="fade-up">
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/30">
                Technology Partners for {solution.title}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {solution.oems.map((oem) => (
                  <span
                    key={oem.name}
                    className="inline-flex w-fit shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] py-1.5 px-1.5 text-sm font-medium text-white/70 shadow-[inset_0_0_20px_rgba(37,217,199,0.12)] backdrop-blur-sm transition-all duration-300 hover:border-[#25D9C7]/30 hover:bg-white/[0.06]"
                  >
                    {oem.logo ? (
                      <span className="relative flex h-10 w-26 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                        <Image
                          src={oem.logo}
                          alt={oem.name}
                          width={28}
                          height={28}
                          unoptimized
                          className="h-full w-full object-contain p-1.5"
                        />
                      </span>
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold text-white/60 shadow-[inset_0_0_12px_rgba(37,217,199,0.35)]">
                        {getOemInitials(oem.name)}
                      </span>
                    )}
                    {/* <span className="whitespace-nowrap">{oem.name}</span> */}
                  </span>
                ))}
              </div>
              <Link
                href="#more"
                style={{ backgroundImage: BRAND_GRADIENT }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 mt-8"
              >
                View More Solutions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related solutions */}
      <section
        className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-28"
        id="more"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center" data-aos="fade-up">
            <p className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              Explore More
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              Related Solutions
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {related.map((r, i) => {
              const RelIcon = r.icon;
              return (
                <Link
                  key={r.slug}
                  href={`/solutions/${r.slug}`}
                  className="group relative h-64 w-full overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 ease-out hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.5),0_25px_50px_-15px_rgba(0,0,0,0.5)] sm:w-[calc(33.333%-0.833rem)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <SolutionMedia
                    src={r.heroImage}
                    alt={r.title}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />
                  <div className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[120%]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                      <RelIcon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      {r.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/70">
                      Explore{" "}
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import PremiumHeroBackdrop from "@/components/ui/PremiumHeroBackdrop";
import ReadingProgress from "@/components/sections/blog/ReadingProgress";
import { BRAND_GRADIENT } from "@/lib/brand";
import { solutions, getSolution } from "@/data/solutions";

type Props = {
  params: Promise<{ vertical: string; subservice: string }>;
};

export function generateStaticParams() {
  return solutions.flatMap((solution) =>
    solution.subServices.map((sub) => ({
      vertical: solution.slug,
      subservice: sub.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, subservice } = await params;
  const solution = getSolution(vertical);
  const sub = solution?.subServices.find((s) => s.slug === subservice);
  if (!solution || !sub) return {};

  return {
    title: `${sub.title} | ${solution.title} | Vectrae Enterprise Technology`,
    description: sub.description,
  };
}

export default async function SubServicePage({ params }: Props) {
  const { vertical, subservice } = await params;
  const solution = getSolution(vertical);
  const sub = solution?.subServices.find((s) => s.slug === subservice);
  if (!solution || !sub) notFound();

  const Icon = sub.icon;
  const siblings = solution.subServices.filter((s) => s.slug !== subservice);

  return (
    <>
      <ReadingProgress />
      <section className="relative overflow-hidden bg-black">
        <PremiumHeroBackdrop />

        <Navbar />

        <div className="relative mx-auto max-w-3xl px-6 pb-20 pt-6 text-center sm:pb-28">
          <div
            className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-white/40"
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
            <Link
              href={`/solutions/${solution.slug}`}
              className="transition hover:text-white/70"
            >
              {solution.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">{sub.title}</span>
          </div>

          <span
            className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#29B9F2] shadow-[0_0_25px_rgba(41,185,242,0.25)]"
            data-aos="zoom-in"
          >
            <Icon className="h-6 w-6" />
          </span>

          <h1
            className="mx-auto mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {sub.title}
          </h1>
          <p
            className="mt-4 text-lg text-white/60"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            {sub.tagline}
          </p>
          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {sub.description}
          </p>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
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
              Everything under {sub.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {sub.capabilities.map((cap, i) => {
              const CapIcon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.45),0_20px_45px_-15px_rgba(15,23,42,0.18)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-black/3 text-[#0f9ac9] transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-[#25D9C7]/40 group-hover:bg-[#25D9C7]/10 group-hover:shadow-[0_0_18px_rgba(37,217,199,0.4)]">
                    <CapIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D9C7]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
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
            {sub.benefits.map((benefit, i) => (
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
        </div>
      </section>

      {/* More within this vertical */}
      <section className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p
            className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]"
            data-aos="fade-up"
          >
            Explore More
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            More {solution.title}
          </h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/solutions/${solution.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.4),0_10px_25px_-8px_rgba(15,23,42,0.2)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {solution.title} Overview
            </Link>
            {siblings.map((sib) => (
              <Link
                key={sib.slug}
                href={`/solutions/${solution.slug}/${sib.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.4),0_10px_25px_-8px_rgba(15,23,42,0.2)]"
              >
                {sib.title}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}

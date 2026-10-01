import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  PhoneCall,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import LogoMarquee from "@/components/ui/LogoMarquee";
import PremiumHeroBackdrop from "@/components/ui/PremiumHeroBackdrop";
import ReadingProgress from "@/components/sections/blog/ReadingProgress";
import { BRAND_GRADIENT } from "@/lib/brand";
import { industries, getIndustry } from "@/data/industries";
import { getSolution } from "@/data/solutions";
import { clientLogos } from "@/data/clients";

type Props = {
  params: Promise<{ industry: string }>;
};

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  return {
    title: `${industry.title} Technology Solutions | Vectrae`,
    description: industry.overview,
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const Icon = industry.icon;
  const featuredClients = industry.featuredClientNames
    .map((name) => clientLogos.find((c) => c.name === name))
    .filter((c): c is (typeof clientLogos)[number] => Boolean(c));
  const solutionsFit = industry.solutionsFit
    .map((fit) => {
      const solution = getSolution(fit.solutionSlug);
      return solution ? { ...fit, solution } : null;
    })
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  // Marquee only makes sense with enough logos; fewer than 4 → static responsive cards
  const useMarquee = featuredClients.length >= 4;

  const renderClientCard = (client: (typeof clientLogos)[number]) => (
    <div className="group flex h-24 w-44 items-center justify-center rounded-2xl border border-black/[0.06] bg-white px-6 shadow-[0_18px_40px_-20px_rgba(37,217,199,0.35),0_2px_6px_rgba(15,23,42,0.04)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#25D9C7]/30 hover:shadow-[0_24px_50px_-18px_rgba(37,217,199,0.45),0_2px_8px_rgba(15,23,42,0.06)] sm:h-28 sm:w-60">
      <Image
        src={client.logo}
        alt={client.name}
        width={140}
        height={56}
        unoptimized
        className="h-8 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105 sm:h-9"
      />
    </div>
  );

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
            <Link href="/industries" className="transition hover:text-white/70">
              Industries
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">{industry.title}</span>
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
            {industry.headline}
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            {industry.overview}
          </p>

          <div
            className="mx-auto mt-6 flex flex-wrap justify-center gap-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {industry.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/60"
              >
                {area}
              </span>
            ))}
          </div>

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
              Talk to Our {industry.title} Technology Expert
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

      {/* Key challenges */}
      <section className="relative overflow-hidden bg-[#f5f5f0] py-20 sm:py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#29B9F2]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              The Challenge
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
              What {industry.title} enterprises are up against
            </h2>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {industry.challenges.map((challenge, i) => (
              <div
                key={challenge}
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.45),0_20px_45px_-15px_rgba(15,23,42,0.18)]"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-black shadow-md transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  {challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions fit map */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D9C7]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
              How Vectrae Fits
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Solutions built for {industry.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutionsFit.map(({ solution, note }, i) => {
              const SolutionIcon = solution.icon;
              return (
                <Link
                  key={solution.slug}
                  href={`/solutions/${solution.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#25D9C7]/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(37,217,199,0.15)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#25D9C7] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(37,217,199,0.4)]">
                    <SolutionIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {note}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#25D9C7]">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured clients */}
      {featuredClients.length > 0 && (
        <section className="relative overflow-hidden bg-white py-20">
          {/* soft teal glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,rgba(37,217,199,0.10),transparent_70%)]" />

          {/* faint arc behind the cards */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-72 w-full -translate-y-[38%] lg:block"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="clients-arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#25D9C7" stopOpacity="0" />
                <stop offset="50%" stopColor="#25D9C7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#25D9C7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 40 Q600 330 1200 40"
              stroke="url(#clients-arc)"
              strokeWidth="1"
            />
          </svg>

          <div className="relative mx-auto max-w-6xl px-6">
            {/* heading */}
            <div
              className="flex items-center justify-center gap-4 sm:gap-8"
              data-aos="fade-up"
            >
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#0f5c57]/30 sm:w-40" />
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.45em] text-[#0f5c57] sm:text-xs">
                Trusted by {industry.title} Leaders
              </p>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#0f5c57]/30 sm:w-40" />
            </div>

            {/* glowing dot */}
            <div
              className="mt-5 flex justify-center"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D9C7]/30 blur-[3px]" />
                <span className="relative h-2 w-2 rounded-full bg-[#25D9C7] shadow-[0_0_10px_rgba(37,217,199,0.8)]" />
              </span>
            </div>

            {/* fewer than 4 logos → simple responsive cards, no marquee */}
            {!useMarquee && (
              <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-5">
                {featuredClients.map((client, i) => (
                  <div
                    key={client.name}
                    data-aos="fade-up"
                    data-aos-delay={i * 60}
                  >
                    {renderClientCard(client)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4+ logos → continuous marquee, full width with faded edges */}
          {useMarquee && (
            <div
              className="relative mt-12 py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <LogoMarquee
                items={featuredClients.map((client) => (
                  <div key={client.name} className="mx-2.5 shrink-0">
                    {renderClientCard(client)}
                  </div>
                ))}
              />
            </div>
          )}
        </section>
      )}

      {/* Explore other industries */}
      <section className="relative overflow-hidden bg-[#f5f5f0] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_0_0_1.5px_rgba(37,217,199,0.4),0_10px_25px_-8px_rgba(15,23,42,0.2)]"
          >
            View All Industries
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}

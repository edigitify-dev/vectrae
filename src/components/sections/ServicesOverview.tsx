import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import SolutionsCards from "./SolutionsCards";

export default function ServicesOverview() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1320px] px-6">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#25D9C7]">
            What We Do
          </p>

          <h2
            className="
              mx-auto
              mt-4
              text-3xl
              font-semibold
              leading-tight
              tracking-tight
              text-black
              sm:text-4xl
              md:whitespace-nowrap
              lg:text-5xl
            "
          >
            Enterprise technology,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              end to end
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-base
              leading-relaxed
              text-[#7F7F7F]
            "
          >
            From the boardroom to the data center, here&apos;s exactly what
            Vectrae delivers, engineered, deployed, and supported PAN-India.
          </p>
        </div>

        {/* =====================================================
            SOLUTIONS GRID + MOBILE CAROUSEL
        ===================================================== */}
        <SolutionsCards />

        {/* =====================================================
            VIEW ALL
        ===================================================== */}
        <div className="mt-12 flex justify-center" data-aos="fade-up">
          <Link
            href="/solutions"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              px-7
              py-3.5
              text-sm
              font-semibold
              text-black
              shadow-lg
              transition
              hover:-translate-y-0.5
              hover:opacity-90
            "
            style={{
              backgroundImage: BRAND_GRADIENT,
            }}
          >
            View All Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

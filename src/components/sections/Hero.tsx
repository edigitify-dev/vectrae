import { ArrowRight } from "lucide-react";
import { WovenCanvas } from "@/components/ui/woven-light-hero";
import Navbar from "@/components/sections/Navbar";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#141414]">
      <WovenCanvas />

      {/* Mobile-only blur + dim layer: the canvas pattern is too busy behind text on small screens */}
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px] bg-black/35 sm:hidden" />

      {/* Subtle overlays to ensure text readability without hiding the 3D canvas */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[130px] bg-gradient-to-b from-black via-black/40 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[105px] w-[225px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />

      <Navbar />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:px-6">
        {/* Top Badge */}
        <div
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur-md sm:mb-6 sm:px-4 sm:text-sm"
          data-aos="fade-up"
          data-aos-delay="50"
          data-aos-once="true"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#25D9C7] animate-pulse" />
          <span className="whitespace-nowrap">
            Trusted by{" "}
            <span className="font-semibold text-white">2,300+ Enterprises</span>
          </span>
        </div>

        {/* Responsive Heading */}
        <h1
          className="w-full max-w-4xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,1)] [font-size:clamp(1.75rem,6vw+0.5rem,3.75rem)]"
          data-aos="fade-up"
          data-aos-duration="900"
          data-aos-once="true"
        >
          <span className="block text-balance drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            Integrated Technology Solutions
          </span>
          <span className="mt-1 block sm:mt-2">
            <span className="text-white/90">For </span>
            <span
              className="text-transparent bg-clip-text drop-shadow-sm"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #B6D93B 0%, #84D96C 35%, #25D9C7 68%, #29B9F2 100%)",
              }}
            >
              The Modern Enterprise
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-4 max-w-[22rem] text-sm leading-relaxed text-white/80 sm:mt-6 sm:max-w-2xl sm:text-lg sm:text-white"
          data-aos="fade-up"
          data-aos-delay="250"
          data-aos-once="true"
        >
          <span className="sm:hidden">
            End-to-end Audio Visual &amp; enterprise IT infrastructure delivered
            PAN-India.
          </span>
          <span className="hidden sm:inline">
            From AV and Networking to Data Centers and Power, Vectrae delivers
            end-to-end enterprise technology across PAN-India.
          </span>
        </p>

        {/* CTAs */}
        <div
          className="mt-6 flex w-full max-w-md flex-col gap-2.5 sm:mt-10 sm:w-auto sm:flex-row sm:gap-3"
          data-aos="fade-up"
          data-aos-delay="350"
          data-aos-once="true"
        >
          <button
            className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 active:scale-95 sm:px-6 sm:py-3.5"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #B6D93B 0%, #84D96C 35%, #25D9C7 68%, #29B9F2 100%)",
            }}
          >
            Request Consultation
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95 sm:px-6 sm:py-3.5">
            Explore Solutions
          </button>
        </div>

        {/* Trust metrics footer */}
        <p
          className="mt-6 hidden text-xs font-medium tracking-wide text-white/40 sm:block"
          data-aos="fade-up"
          data-aos-delay="450"
          data-aos-once="true"
        >
          300+ Technology Experts&nbsp;|&nbsp;PAN-India
          Delivery&nbsp;|&nbsp;2,300+ Enterprise Clients
        </p>
      </div>
    </section>
  );
}

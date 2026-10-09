import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";

const links = {
  solutions: [
    { label: "Audio Visual", href: "/solutions/audio-visual" },
    { label: "Networking & Security", href: "/solutions/networking-security" },
    { label: "Data Center", href: "/solutions/data-center" },
    { label: "End Computing", href: "/solutions/end-computing" },
    { label: "Power Solutions", href: "/solutions/power" },
    { label: "Managed IT Services", href: "/solutions/managed-it" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    {
      label: "Corporate Governance",
      href: "https://vectrae.com/corporate-governance/",
      external: true,
    },
  ],
};

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/vectraeinfotechpvtltd./",
    abbr: "in",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vectraeinfotech/",
    abbr: "ig",
  },
  { label: "Facebook", href: "https://www.facebook.com/vectraee/", abbr: "fb" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#030712]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#29B9F2]/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 pt-14 pb-10 md:grid-cols-4">
          <Reveal className="col-span-2 md:col-span-1">
            <span
              className="bg-clip-text text-2xl font-bold tracking-tight text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              VECTRAE
            </span>
            <p className="mt-4 text-sm leading-relaxed text-white/40">
              End-to-end enterprise technology. PAN-India delivery & support.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <MagneticButton key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold text-white/40 uppercase transition hover:border-[#29B9F2]/40 hover:text-[#29B9F2]"
                  >
                    {s.abbr}
                  </a>
                </MagneticButton>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2.5">
              {links.solutions.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/45 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5">
              {links.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-white/45 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+91-11-40590964-65"
                  className="flex items-start gap-2.5 text-sm text-white/45 transition hover:text-white"
                >
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#29B9F2]" />
                  +91-11-40590964-65
                </a>
              </li>
              <li>
                <a
                  href="mailto:enquiry@vectrae.com"
                  className="flex items-start gap-2.5 text-sm text-white/45 transition hover:text-white"
                >
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#29B9F2]" />
                  enquiry@vectrae.com
                </a>
              </li>
              <li>
                <p className="flex items-start gap-2.5 text-sm text-white/40">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#29B9F2]" />
                  A-16-B-1, Mohan Co-Operative Industrial Estate Extn., Mathura
                  Road New Delhi-110044, India
                </p>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-5 text-xs text-white/25 sm:flex-row">
          <p>© {new Date().getFullYear()} Vectrae Infotech Pvt. Ltd.</p>
          <p>Trusted by 2,300+ enterprises across India</p>
        </div>

        <div className="select-none overflow-hidden pb-6 text-center">
          <span
            aria-hidden
            className="block text-[16vw] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[12vw]"
          >
            VECTRAE
          </span>
        </div>
      </div>

      <a
        href="https://wa.me/+919205557448?text=Hello%20I%20want%20to%20know%20more"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D033] shadow-[0_4px_20px_rgba(37,208,51,0.45)] transition hover:scale-110"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 .5C7.439.5.5 7.439.5 16c0 2.787.725 5.405 1.99 7.682L.5 31.5l8.01-2.094A15.46 15.46 0 0016 31.5C24.561 31.5 31.5 24.561 31.5 16S24.561.5 16 .5zm0 28.2a13.16 13.16 0 01-6.73-1.848l-.483-.287-4.757 1.245 1.265-4.634-.316-.502A13.164 13.164 0 012.8 16C2.8 8.71 8.71 2.8 16 2.8 23.29 2.8 29.2 8.71 29.2 16c0 7.29-5.91 13.2-13.2 13.2zm7.238-9.88c-.396-.2-2.34-1.156-2.703-1.284-.362-.13-.627-.196-.89.196-.266.394-1.025 1.284-1.256 1.547-.23.264-.461.297-.858.099-.396-.197-1.673-.617-3.187-1.967-1.178-1.052-1.974-2.351-2.205-2.748-.231-.396-.025-.61.173-.808.179-.177.396-.462.594-.693.198-.23.264-.396.396-.66.132-.264.066-.495-.033-.694-.099-.196-.89-2.148-1.22-2.94-.32-.773-.646-.668-.89-.68a16.3 16.3 0 00-.76-.014c-.264 0-.692.099-1.055.495-.362.395-1.386 1.354-1.386 3.306 0 1.952 1.42 3.837 1.618 4.1.198.265 2.795 4.267 6.772 5.983.946.408 1.683.652 2.258.836.949.302 1.813.26 2.495.157.76-.113 2.34-.956 2.67-1.879.33-.921.33-1.71.23-1.878-.097-.167-.362-.264-.758-.462z" />
        </svg>
      </a>
    </footer>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const links = {
  solutions: [
    { label: "Audio Visual", href: "/solutions/av-solutions" },
    { label: "Networking & Security", href: "/solutions/networking-security" },
    { label: "Data Center", href: "/solutions/data-center" },
    { label: "End Computing", href: "/solutions/end-computing" },
    { label: "Power Solutions", href: "/solutions/power-solutions" },
    { label: "Managed IT Services", href: "/solutions/managed-it-services" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "OEM Partners", href: "/oem-partners" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    {
      label: "Corporate Governance",
      href: "https://vectrae.com/corporate-governance/",
      external: true,
    },
  ],
  career: [
    { label: "Employment Opportunities", href: "/careers" },
    { label: "Join Us", href: "/careers#join-us" },
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
    <footer className="relative overflow-hidden bg-[#030712] max-sm:pb-24">
      {/* Top gradient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#29B9F2]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Main row */}
        <div className="grid grid-cols-2 gap-10 pt-14 pb-10 md:grid-cols-4 lg:grid-cols-7">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1" data-aos="fade-up">
            <Image
              src="/logo.png"
              alt="Vectrae"
              width={120}
              height={26}
              className="h-7 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/30">
              End-to-end enterprise technology. PAN-India delivery & support.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold text-white/40 uppercase transition hover:border-[#29B9F2]/40 hover:text-[#29B9F2]"
                >
                  {s.abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2.5">
              {links.solutions.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/30 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5">
              {links.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-white/30 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Career */}
          <div data-aos="fade-up" data-aos-delay="250">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Career
            </h4>
            <ul className="mt-4 space-y-2.5">
              {links.career.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/30 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+911140590964"
                  className="flex items-start gap-2.5 text-sm text-white/30 transition hover:text-white"
                >
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#29B9F2]" />
                  +91-11-40590964
                </a>
              </li>
              <li>
                <a
                  href="mailto:enquiry@vectrae.com"
                  className="flex items-start gap-2.5 text-sm text-white/30 transition hover:text-white"
                >
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#29B9F2]" />
                  enquiry@vectrae.com
                </a>
              </li>
              <li>
                <p className="flex items-start gap-2.5 text-sm text-white/30">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#29B9F2]" />
                  Mohan Co-Op, New Delhi, 110044
                </p>
              </li>
            </ul>

            <a
              href="https://wa.me/911140590964"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              WhatsApp us
            </a>
          </div>

          {/* Map */}
          <div className="col-span-2" data-aos="fade-up" data-aos-delay="400">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Find Us
            </h4>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Mohan+Co-Op+Industrial+Estate+New+Delhi+110044"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition hover:border-[#29B9F2]/40"
            >
              <div className="relative h-56 w-full">
                <iframe
                  title="Vectrae Infotech location map"
                  src="https://maps.google.com/maps?q=Mohan%20Co-Op%20Industrial%20Estate%2C%20New%20Delhi%2C%20110044&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
              <span className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/45 transition group-hover:text-white">
                Get directions
                <ArrowRight className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-5 text-xs text-white/25 sm:flex-row"
          data-aos="fade-in"
          data-aos-delay="300"
          data-aos-once="true"
        >
          <p>© {new Date().getFullYear()} Vectrae Infotech Pvt. Ltd.</p>
          <p>Trusted by 2,300+ enterprises across India</p>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/911140590964"
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

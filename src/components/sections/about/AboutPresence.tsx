"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Phone } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

const offices = [
  {
    city: "Delhi",
    tag: "Headquarter",
    area: "Mohan Co-Operative Industrial Estate",
    name: "Vectrae Infotech Pvt. Ltd.",
    address:
      "A-16-B-1, Mohan Co-Operative Industrial Estate Extn., Mathura Road, New Delhi - 110044, India",
    phone: "+91-11-40590964-65",
  },
  {
    city: "Mumbai",
    tag: "Branch",
    area: "Navjivan Commercial Premises",
    name: "Vectrae Infotech Pvt. Ltd.",
    address:
      "Office No. 05/06/06, Building No. 3, 1st Floor, Navjivan Commercial Premises, Mumbai - 400008",
  },
  {
    city: "Chennai",
    tag: "Branch",
    area: "Sholinganallur",
    name: "Vectrae Infotech Pvt. Ltd.",
    address:
      "First Floor, Shop No. 11, G 18, Sidhi Vinayagar Complex, Kalaignar Karunanidhi Salai, Sholinganallur Village and Taluk, Chennai - 600119, Tamil Nadu",
  },
  {
    city: "Hyderabad",
    tag: "Branch",
    area: "Chandralok Complex, Secunderabad",
    name: "Vectrae Infotech Pvt. Ltd.",
    address:
      "A Block, 4th Floor, Flat No. 410 to 413, Cabin No. 3, Chandralok Complex, SD Road, Secunderabad, Hyderabad, Telangana - 500003",
  },
  {
    city: "Pune",
    tag: "Branch",
    area: "Poornima Tower, Swargate",
    name: "Vectrae Infotech Pvt. Ltd.",
    address:
      "Office No. 17, Ground Floor, Poornima Tower, Shankar Seth Road, Swargate, Pune, Maharashtra - 411037",
  },
  {
    city: "Bangalore",
    tag: "Branch",
    area: "Unity Buildings Complex, Mission Road",
    name: "Vectrae Infotech Pvt. Ltd.",
    address:
      "No. 3/10, Western Portion of 7th Floor, Tower Block, Unity Buildings Complex, Mission Road, Bangalore - 560027",
  },
];

const reach = [
  { value: "6", label: "Offices Nationwide" },
  { value: "10,000+", label: "Pin-Codes Covered" },
  { value: "300+", label: "Professionals" },
  { value: "₹500+ Cr", label: "Annual Turnover" },
];

export default function AboutPresence() {
  return (
    <section
      id="presence"
      className="relative isolate overflow-hidden bg-black py-28 sm:py-32 lg:py-40"
    >
      {/* Background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 top-0 h-150 w-150 rounded-full bg-[#29B9F2]/8 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-60 bottom-0 h-125 w-125 rounded-full bg-[#25D9C7]/7 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />
              <span className="text-xl max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
                Our Presence
              </span>
            </div>

            <h2 className="mt-8 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[5.2rem]">
              Headquartered in Delhi.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                Present PAN-India.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/40 sm:text-base lg:mb-2">
            While we may have been founded in Delhi, where we continue to
            maintain our head office, our reach extends to several other cities
            across the country.
          </p>
        </motion.div>

        {/* Office cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 sm:mt-20 lg:grid-cols-3">
          {offices.map((office, index) => (
            <motion.article
              key={office.city}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.7,
                delay: (index % 3) * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.045] sm:p-7"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#29B9F2]/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex items-start justify-between">
                <MapPin className="h-5 w-5 text-[#29B9F2]" />
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40">
                  {office.tag}
                </span>
              </div>

              <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-white">
                {office.city}
              </h3>

              <p
                className="relative mt-1.5 bg-clip-text text-xs font-semibold uppercase tracking-[0.12em] text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                {office.area}
              </p>

              <p className="relative mt-5 text-sm font-medium text-white/60">
                {office.name}
              </p>

              <p className="relative mt-2 text-sm leading-6 text-white/40">
                {office.address}
              </p>

              {office.phone && (
                <a
                  href={`tel:${office.phone}`}
                  className="relative mt-auto inline-flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs font-semibold text-white/50 transition-colors hover:text-[#29B9F2]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#29B9F2]" />
                  {office.phone}
                </a>
              )}

              <div
                className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
                style={{ backgroundImage: BRAND_GRADIENT }}
              />
            </motion.article>
          ))}
        </div>

        {/* Coverage note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 max-w-3xl text-sm leading-7 text-white/40 sm:text-base"
        >
          Our nationwide network of sales and service channels spans 6 offices
          across Delhi, Mumbai, Chennai, Hyderabad, Pune and Bangalore, and
          covers more than 10,000 pin-codes across the country.
        </motion.p>

        {/* Reach strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-4 lg:divide-y-0">
            {reach.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col items-center justify-center gap-1 px-4 py-8 text-center transition-colors duration-300 hover:bg-white/[0.025]"
              >
                <Building2 className="h-4 w-4 text-white/20 transition-colors duration-300 group-hover:text-[#25D9C7]" />
                <span
                  className="mt-2 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {item.value}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-1/2 h-px w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 bg-white/[0.06]" />
    </section>
  );
}

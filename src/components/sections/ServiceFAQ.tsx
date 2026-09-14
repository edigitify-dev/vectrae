"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { BRAND_GRADIENT } from "@/lib/brand";

const faqs = [
  {
    question: "What size of company do you typically work with?",
    answer:
      "We work exclusively with enterprises, from mid-sized organisations to large PAN-India corporates. We're currently trusted by 2,300+ enterprise clients across the country.",
  },
  {
    question: "How does a project engagement start?",
    answer:
      "Every project follows our four-stage model: Discover & Assess, Design & Architect, Deploy & Integrate, and Support & Optimize. It starts with a free consultation to understand your infrastructure and goals.",
  },
  {
    question: "Do you support us after the project goes live?",
    answer:
      "Yes. Our Managed IT Services cover proactive AMC, remote monitoring, and helpdesk support, so your systems stay operational long after deployment.",
  },
  {
    question: "Which brands and OEMs do you work with?",
    answer:
      "We partner with leading OEMs and technology brands, including Cisco, Palo Alto Networks, Crestron, Microsoft, Dell, and HP, so you get best-in-class hardware regardless of the solution.",
  },
  {
    question: "Do you deliver projects outside Delhi NCR?",
    answer:
      "Yes, we deliver and support projects PAN-India through our nationwide execution and service network, not just in our home base of New Delhi.",
  },
  {
    question: "How quickly will you respond to an inquiry?",
    answer: "We respond to every consultation request within 4 business hours.",
  },
];

type FAQItemProps = {
  item: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ item, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <SpotlightCard
        className={`rounded-2xl border bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 ${
          isOpen ? "border-white/20" : "border-white/10 hover:border-white/15"
        }`}
      >
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7 sm:py-6"
        >
          <span className="flex items-center gap-4 sm:gap-5">
            <span
              className={`text-sm font-bold tracking-wider transition-colors duration-300 ${
                isOpen ? "text-[#29B9F2]" : "text-white/25"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-base font-semibold text-white sm:text-lg">
              {item.question}
            </span>
          </span>
          <span
            style={isOpen ? { backgroundImage: BRAND_GRADIENT } : undefined}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isOpen
                ? "rotate-180 border-transparent text-black"
                : "border-white/10 bg-white/5 text-white/50"
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 pl-[3.25rem] pr-14 text-sm leading-relaxed text-white/55 sm:px-7 sm:pb-7 sm:pl-[3.75rem] sm:text-base">
                {item.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>
    </motion.div>
  );
}

export default function ServiceFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#29B9F2]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-y-1/3 translate-x-1/4 rounded-full bg-[#84D96C]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-center" data-aos="fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
            FAQ
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Common Questions, Answered
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Everything you need to know before reaching out. Can&apos;t find
            your answer? We respond within 4 business hours.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-3">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-sm text-white/40">Still have questions?</p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
          >
            Talk to an Expert
            <span
              style={{ backgroundImage: BRAND_GRADIENT }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:rotate-45"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

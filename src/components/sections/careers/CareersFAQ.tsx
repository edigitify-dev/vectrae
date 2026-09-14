"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { BRAND_GRADIENT } from "@/lib/brand";

const faqs = [
  {
    question: "What does the hiring process look like?",
    answer:
      "Most roles follow a four-step process: application review, a technical or functional interview, a conversation with the hiring manager, and a final offer discussion. We aim to close the loop within two weeks.",
  },
  {
    question: "Do you offer internships?",
    answer:
      'Yes, we periodically open internships across engineering and business development. Select "General Application" on the form and mention your availability in the message.',
  },
  {
    question: "Is relocation required for PAN-India roles?",
    answer:
      "Most roles are based out of our New Delhi headquarters with travel for project deployments. Some field and delivery roles are location-specific, this will be discussed during the interview.",
  },
  {
    question: "Can I apply for more than one role?",
    answer:
      "Absolutely. Submit a separate application for each role you're interested in so our talent team can route it to the right hiring manager.",
  },
  {
    question: "I don't see a role that fits, what should I do?",
    answer:
      "Submit a general application below. We keep every profile on file and reach out when a matching opening comes up.",
  },
];

export default function CareersFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-225 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#84D96C]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-y-1/3 translate-x-1/4 rounded-full bg-[#29B9F2]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-center" data-aos="fade-up">
          <p className="text-lg max-sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#29B9F2]">
            FAQ
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Hiring, Answered
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <SpotlightCard
                  className={`rounded-2xl border bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 ${
                    isOpen
                      ? "border-white/20"
                      : "border-white/10 hover:border-white/15"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <span className="flex items-center gap-4 sm:gap-5">
                      <span
                        className={`text-sm font-bold tracking-wider transition-colors duration-300 ${
                          isOpen ? "text-[#29B9F2]" : "text-white/25"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base font-semibold text-white sm:text-lg">
                        {item.question}
                      </span>
                    </span>
                    <span
                      style={
                        isOpen ? { backgroundImage: BRAND_GRADIENT } : undefined
                      }
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
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-sm text-white/40">
            Have a question we didn&apos;t cover?
          </p>
          <a
            href="mailto:enquiry@vectrae.com"
            className="group inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
          >
            Email Our Talent Team
            <span
              style={{ backgroundImage: BRAND_GRADIENT }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:rotate-45"
            >
              <Mail className="h-4 w-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

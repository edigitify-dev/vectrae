"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";

const COMPANY_SIZE_OPTIONS = [
  "Under 50 employees",
  "50–200 employees",
  "200–1,000 employees",
  "1,000+ employees",
];

const SOLUTION_OPTIONS = [
  "Audio Visual",
  "Networking & Security",
  "Data Center",
  "End Computing",
  "IT Spares & Accessories",
  "Power Solutions",
  "Managed IT Services",
  "Other",
];

const HOW_HEARD_OPTIONS = [
  "Google Search",
  "LinkedIn",
  "Referral",
  "Existing Client",
  "Event / Conference",
  "Other",
];

type FormState = {
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  designation: string;
  companySize: string;
  solutionInterest: string[];
  message: string;
  howHeard: string;
};

const INITIAL_STATE: FormState = {
  fullName: "",
  companyName: "",
  workEmail: "",
  phone: "",
  designation: "",
  companySize: "",
  solutionInterest: [],
  message: "",
  howHeard: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#29B9F2] focus:ring-2 focus:ring-[#29B9F2]/15";

const labelClasses = "text-sm font-medium text-neutral-700";

export default function ContactFormSection() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSolution(option: string) {
    setForm((prev) => ({
      ...prev,
      solutionInterest: prev.solutionInterest.includes(option)
        ? prev.solutionInterest.filter((item) => item !== option)
        : [...prev.solutionInterest, option],
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Something went wrong. Please try again.",
        );
      }

      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section className="relative bg-[#f5f5f0] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          {/* Form card */}
          <div
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-10"
            data-aos="fade-up"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  className="flex h-14 w-14 items-center justify-center rounded-full text-black"
                >
                  <Check className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-neutral-900">
                  Thanks, we&apos;ve got it.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
                  A Vectrae expert will reach out within 4 business hours. In
                  the meantime, feel free to call or WhatsApp us directly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className={labelClasses} htmlFor="fullName">
                      Full Name <span className="text-[#E8500A]">*</span>
                    </label>
                    <input
                      id="fullName"
                      required
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      className={inputClasses}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses} htmlFor="companyName">
                      Company Name <span className="text-[#E8500A]">*</span>
                    </label>
                    <input
                      id="companyName"
                      required
                      value={form.companyName}
                      onChange={(e) => update("companyName", e.target.value)}
                      className={inputClasses}
                      placeholder="Your company"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses} htmlFor="workEmail">
                      Work Email <span className="text-[#E8500A]">*</span>
                    </label>
                    <input
                      id="workEmail"
                      type="email"
                      required
                      value={form.workEmail}
                      onChange={(e) => update("workEmail", e.target.value)}
                      className={inputClasses}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses} htmlFor="phone">
                      Phone Number <span className="text-[#E8500A]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClasses}
                      placeholder="+91"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses} htmlFor="designation">
                      Designation / Role
                    </label>
                    <input
                      id="designation"
                      value={form.designation}
                      onChange={(e) => update("designation", e.target.value)}
                      className={inputClasses}
                      placeholder="e.g. IT Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses} htmlFor="companySize">
                      Company Size
                    </label>
                    <select
                      id="companySize"
                      value={form.companySize}
                      onChange={(e) => update("companySize", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Select company size</option>
                      {COMPANY_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={labelClasses}>Solution Area of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {SOLUTION_OPTIONS.map((option) => {
                      const active = form.solutionInterest.includes(option);
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => toggleSolution(option)}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                            active
                              ? "border-transparent text-black"
                              : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                          style={
                            active
                              ? { backgroundImage: BRAND_GRADIENT }
                              : undefined
                          }
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses} htmlFor="message">
                    Message / Requirement
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={inputClasses}
                    placeholder="Tell us a bit about what you're looking for"
                  />
                </div>

                <div className="space-y-2 sm:max-w-xs">
                  <label className={labelClasses} htmlFor="howHeard">
                    How did you hear about us?
                  </label>
                  <select
                    id="howHeard"
                    value={form.howHeard}
                    onChange={(e) => update("howHeard", e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Select an option</option>
                    {HOW_HEARD_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {status === "error" && (
                  <p className="text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === "submitting"
                    ? "Sending…"
                    : "Request a Consultation"}
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div
            className="flex flex-col gap-6 rounded-3xl bg-black p-6 text-white sm:p-8"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div>
              <p className="text-xl font-semibold uppercase tracking-widest text-[#29B9F2]">
                Reach Us Directly
              </p>
              <ul className="mt-5 space-y-4">
                <li>
                  <a
                    href="tel:+911140590964"
                    className="flex items-start gap-3 text-sm text-white/70 transition hover:text-white"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#25D9C7]" />
                    +91-11-40590964
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:enquiry@vectrae.com"
                    className="flex items-start gap-3 text-sm text-white/70 transition hover:text-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#25D9C7]" />
                    enquiry@vectrae.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#25D9C7]" />
                  Mohan Co-Op, New Delhi, 110044
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#25D9C7]" />
                  We respond within 4 business hours
                </li>
              </ul>

              <a
                href="https://wa.me/911140590964"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#25D033]" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Vectrae office location"
                src="https://www.google.com/maps?q=Mohan+Co-operative+Industrial+Estate+New+Delhi+110044&output=embed"
                className="h-56 w-full grayscale invert"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

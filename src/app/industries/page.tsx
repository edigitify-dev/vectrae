import type { Metadata } from "next";
import IndustriesHero from "@/components/sections/industries/IndustriesHero";
import IndustriesGrid from "@/components/sections/industries/IndustriesGrid";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import ServicesOverview from "@/components/sections/ServicesOverview";

export const metadata: Metadata = {
  title: "Industries We Serve | Vectrae Enterprise Technology Solutions",
  description:
    "Vectrae delivers technology solutions matched to your industry, IT & ITES, BFSI, consulting, manufacturing, automotive, telecom, digital platforms, aerospace & defense, and media, PAN-India.",
};

export default function IndustriesPage() {
  return (
    <>
      <IndustriesHero />
      <IndustriesGrid />
      <ServicesOverview />
      <CTA />
      <Footer />
    </>
  );
}

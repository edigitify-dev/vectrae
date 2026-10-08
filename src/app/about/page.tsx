import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutImpact from "@/components/sections/about/AboutImpact";
import AboutCapabilities from "@/components/sections/about/AboutCapabilities";
import AboutPresence from "@/components/sections/about/AboutPresence";
import AboutValues from "@/components/sections/about/AboutValues";
// import AboutTrust from "@/components/sections/about/AboutTrust";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import AboutVision from "@/components/sections/about/AboutVision";
import AboutMission from "@/components/sections/about/AboutMission";
import AboutLeadership from "@/components/sections/about/AboutLeadership";
import AboutCertifications from "@/components/sections/about/AboutCertifications";
import AboutGallery from "@/components/sections/about/AboutGallery";
import SolutionsCards from "@/components/sections/SolutionsCards";
import ServicesOverview from "@/components/sections/ServicesOverview";

export const metadata: Metadata = {
  title: "About Vectrae | Enterprise Technology Solutions",
  description:
    "Vectrae Infotech Pvt. Ltd. is a full-spectrum enterprise IT infrastructure company headquartered in New Delhi, India, delivering End-Computing, Data Centre & Security, Networking, Boardroom & AV, and IT Services PAN-India.",
};

export default function AboutPage() {
  return (
    <>
      {/* <AboutHero /> */}
      <AboutStory />
      {/* <AboutImpact /> */}
      {/* <AboutCapabilities /> */}
      <AboutPresence />
      <AboutLeadership />
      <ServicesOverview />
      <AboutValues />
      <AboutVision />
      <AboutMission />
      <AboutCertifications />
      <AboutGallery />
      {/* <AboutTrust /> */}
      <CTA />
      <Footer />
    </>
  );
}

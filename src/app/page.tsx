import About from "@/components/sections/About";
import CoreValues from "@/components/sections/CoreValues";
import Hero from "@/components/sections/Hero";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Workspace from "@/components/sections/Workspace";
import Services from "@/components/sections/Services";
import ServicesOverview from "@/components/sections/ServicesOverview";
import TrustSignals from "@/components/sections/TrustSignals";
import SampleAboutUs from "@/components/sections/SampleAboutUs";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Blog from "@/components/sections/Blog";
import { getPublishedPosts } from "@/lib/blog";
import FootprintMap from "@/components/sections/FootprintMap";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import PartnersCategories from "@/components/sections/partners/PartnersCategories";
import ProjectsShowcase from "@/components/sections/ProjectShowcase";

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Hero />
      <TrustSignals />
      <ServicesOverview />
      <ProductShowcase />
      <FootprintMap />
      <PartnersCategories />
      {/* <Workspace /> */}
      {/* <About /> */}
      <WhyChooseUs />
      <SampleAboutUs />
      {/* <Services /> */}
      <CoreValues />
      <ProjectsShowcase />
      <Blog posts={posts} />
      <CTA />
      <Footer />
    </>
  );
}

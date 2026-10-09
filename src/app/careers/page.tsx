import type { Metadata } from "next";
import CareersHero from "@/components/sections/careers/CareersHero";
import CareersCulture from "@/components/sections/careers/CareersCulture";
import CareersOpenings from "@/components/sections/careers/CareersOpenings";
import CareersFAQ from "@/components/sections/careers/CareersFAQ";
import Footer from "@/components/sections/Footer";
import { getPublishedJobs } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers at Vectrae | Enterprise Technology Solutions",
  description:
    "Join Vectrae Infotech Pvt. Ltd. and build the AV, Networking, Data Center, End Computing, and Power solutions trusted by 2,300+ enterprises PAN-India. Explore open roles.",
};

// Rebuilt on demand by the admin panel via `revalidatePath`, with an hourly
// backstop so a missed revalidation can never strand the listing for long.
export const revalidate = 3600;

export default async function CareersPage() {
  const jobs = await getPublishedJobs();

  return (
    <>
      {/* <CareersHero /> */}
      <CareersOpenings jobs={jobs} />
      <CareersCulture />
      <CareersFAQ />
      <Footer />
    </>
  );
}

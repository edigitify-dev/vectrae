import { r2Asset } from "@/lib/site-images";
import {
  Briefcase,
  Car,
  Cpu,
  Factory,
  Globe,
  Landmark,
  Newspaper,
  Plane,
  RadioTower,
  type LucideIcon,
} from "lucide-react";

export type SolutionFit = {
  solutionSlug: string;
  note: string;
};

export type Industry = {
  slug: string;
  title: string;
  headline: string;
  icon: LucideIcon;
  overview: string;
  image: string;
  challenges: string[];
  solutionsFit: SolutionFit[];
  focusAreas: string[];
  featuredClientNames: string[];
};

export const industries: Industry[] = [
  {
    slug: "it-ites",
    title: "IT & ITES",
    headline: "Technology Solutions for Technology Companies",
    image: r2Asset("/images/industry/industry_IT.png"),
    icon: Cpu,
    overview:
      "IT and ITES enterprises run at scale, thousands of employees, dozens of meeting rooms, and infrastructure that can't afford downtime. Vectrae delivers the AV, networking, and device infrastructure that keeps large technology campuses running without friction.",
    challenges: [
      "Standardizing meeting room technology across hundreds of rooms and multiple campuses",
      "Securing and scaling networks for large, high-density office floors",
      "Managing device lifecycle for a constantly growing headcount",
      "Modernizing legacy data center infrastructure without disrupting operations",
    ],
    solutionsFit: [
      {
        solutionSlug: "av-solutions",
        note: "Standardized meeting room AV across every campus",
      },
      {
        solutionSlug: "networking-security",
        note: "High-density networking built for large office floors",
      },
      {
        solutionSlug: "end-computing",
        note: "Device lifecycle management at IT-scale headcount",
      },
      { solutionSlug: "data-center", note: "Modernization without downtime" },
    ],
    focusAreas: [
      "Scalable meeting room infrastructure",
      "Secure networking for large campuses",
      "End-user device management",
      "Data center modernisation",
    ],
    featuredClientNames: [
      "HCL",
      "Tata Consultancy Services",
      "Accenture",
      "Tech Mahindra",
      "Genpact",
      "Adobe",
      "BT",
    ],
  },
  {
    slug: "bfsi",
    title: "BFSI",
    headline:
      "Secure, Compliant, Always-On Technology for Financial Enterprises",
    image: "images/industry/industry_BFSI.png",
    icon: Landmark,
    overview:
      "Banks and financial institutions operate under some of the strictest compliance and uptime requirements of any industry. Vectrae builds the secure networking, surveillance, and boardroom infrastructure that financial enterprises depend on to stay compliant and always-on.",
    challenges: [
      "Meeting regulatory and data security compliance across every branch",
      "Securing branch networks against evolving cyber threats",
      "Physical security and surveillance across distributed locations",
      "Zero-downtime infrastructure for customer-facing systems",
    ],
    solutionsFit: [
      {
        solutionSlug: "networking-security",
        note: "Secure branch networking, compliant by design",
      },
      {
        solutionSlug: "data-center",
        note: "Compliance-ready, always-on data center infrastructure",
      },
      {
        solutionSlug: "av-solutions",
        note: "Boardroom AV for executive and client-facing spaces",
      },
      {
        solutionSlug: "power-solutions",
        note: "Redundant power for zero-downtime operations",
      },
    ],
    focusAreas: [
      "Secure branch networking",
      "Surveillance & access control",
      "Compliant data center",
      "Boardroom AV",
    ],
    featuredClientNames: [
      "HDFC Bank",
      "American Express",
      "IndusInd Bank",
      "J.P. Morgan",
    ],
  },
  {
    slug: "consulting",
    title: "Consulting & Professional Services",
    headline: "Premium Workplace Technology for World-Class Consulting Firms",
    image: "images/industry/industry_consulting.png",
    icon: Briefcase,
    overview:
      "Consulting and professional services firms live in the boardroom, client pitches, partner meetings, and constant travel between offices. Vectrae delivers the premium AV and unified communications infrastructure that matches the standard these firms hold themselves to.",
    challenges: [
      "Delivering a premium, client-ready AV experience in every boardroom",
      "Unifying video conferencing across global offices and platforms",
      "Providing secure, frictionless guest networking for visiting clients",
      "Supporting a highly mobile, always-traveling workforce",
    ],
    solutionsFit: [
      {
        solutionSlug: "av-solutions",
        note: "Premium boardroom AV built for client-facing meetings",
      },
      {
        solutionSlug: "networking-security",
        note: "Secure guest networking for visiting clients and partners",
      },
      {
        solutionSlug: "managed-it-services",
        note: "Reliable support across every office, every time zone",
      },
    ],
    focusAreas: [
      "Premium boardroom AV",
      "Video conferencing (Teams/Zoom)",
      "Unified communications",
      "Secure guest networking",
    ],
    featuredClientNames: [
      "Deloitte",
      "KPMG",
      "PwC",
      "McKinsey & Company",
      "Forvis Mazars",
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & Industrial",
    headline: "Robust Technology Solutions for Industrial Environments",
    image: "images/industry/industry_manufacturing.png",
    icon: Factory,
    overview:
      "Manufacturing and industrial environments demand technology that survives where standard office equipment fails, dust, heat, and round-the-clock operation. Vectrae designs rugged networking, power, and command-centre infrastructure built for the plant floor.",
    challenges: [
      "Deploying networking infrastructure that survives industrial conditions",
      "Keeping production-critical systems on uninterrupted power",
      "Monitoring plant operations from a centralized command centre",
      "Coordinating communication across large, noisy facility floors",
    ],
    solutionsFit: [
      {
        solutionSlug: "networking-security",
        note: "Rugged network infrastructure built for the plant floor",
      },
      {
        solutionSlug: "power-solutions",
        note: "Industrial-grade UPS and power for production-critical systems",
      },
      {
        solutionSlug: "av-solutions",
        note: "Command centre video walls and plant-wide PA systems",
      },
    ],
    focusAreas: [
      "Rugged networking",
      "Industrial-grade UPS & power",
      "Command centre AV",
      "PA systems",
    ],
    featuredClientNames: ["Valvoline"],
  },
  {
    slug: "automotive",
    title: "Automotive",
    headline: "Connected Technology for a Mobile Industry",
    image: "images/industry/industry_automotive.png",
    icon: Car,
    overview:
      "Automotive enterprises span manufacturing plants, dealership networks, and corporate offices, each with different technology needs. Vectrae connects every site with consistent networking, digital signage, and boardroom AV, PAN-India.",
    challenges: [
      "Connecting manufacturing plants, offices, and dealer networks reliably",
      "Deploying consistent digital signage across showroom and retail locations",
      "Equipping executive boardrooms for global stakeholder meetings",
      "Standardizing end-user computing across multiple site types",
    ],
    solutionsFit: [
      {
        solutionSlug: "networking-security",
        note: "Multi-site networking connecting plants, offices, and dealers",
      },
      {
        solutionSlug: "av-solutions",
        note: "Digital signage for showrooms and executive boardroom AV",
      },
      {
        solutionSlug: "end-computing",
        note: "Standardized computing across every site type",
      },
    ],
    focusAreas: [
      "Multi-site networking",
      "Digital signage",
      "Executive boardroom AV",
      "End computing",
    ],
    featuredClientNames: ["Maruti Suzuki", "Ford"],
  },
  {
    slug: "telecom",
    title: "Telecom",
    headline: "Infrastructure Solutions for the Infrastructure Builders",
    image: "images/industry/industry_telecom.png",
    icon: RadioTower,
    overview:
      "Telecom operators build the infrastructure everyone else depends on, which means their own infrastructure can't fail. Vectrae delivers the data center, power, and command-centre technology that keeps telecom operations running around the clock.",
    challenges: [
      "Scaling data center capacity to match network growth",
      "Guaranteeing uninterrupted power across critical facilities",
      "Monitoring national network operations from a unified command centre",
      "Maintaining resilient networking across a distributed infrastructure footprint",
    ],
    solutionsFit: [
      {
        solutionSlug: "data-center",
        note: "Data center infrastructure scaled to network growth",
      },
      {
        solutionSlug: "power-solutions",
        note: "Zero-downtime power for critical telecom facilities",
      },
      {
        solutionSlug: "networking-security",
        note: "Resilient networking across a distributed footprint",
      },
      {
        solutionSlug: "av-solutions",
        note: "NOC command centre video walls for national monitoring",
      },
    ],
    focusAreas: ["Data center", "Power", "Networking", "NOC command centre"],
    featuredClientNames: ["Airtel"],
  },
  {
    slug: "digital-platforms",
    title: "Internet & Digital Platforms",
    headline: "Fast-Scale Technology for High-Growth Digital Businesses",
    image: "images/industry/industry_internet.png",
    icon: Globe,
    overview:
      "High-growth digital businesses scale faster than most technology partners can keep up with. Vectrae delivers rapid office fit-outs, cloud-ready networking, and end-user computing that scale as fast as the business does.",
    challenges: [
      "Standing up new offices and workspaces on compressed timelines",
      "Building cloud-ready networking that scales with headcount growth",
      "Equipping fast-growing teams with collaboration-ready AV",
      "Provisioning end-user computing at startup speed",
    ],
    solutionsFit: [
      {
        solutionSlug: "end-computing",
        note: "End-user computing provisioned at startup speed",
      },
      {
        solutionSlug: "networking-security",
        note: "Cloud-ready networking that scales with growth",
      },
      {
        solutionSlug: "av-solutions",
        note: "Collaboration-ready AV for fast-growing teams",
      },
    ],
    focusAreas: [
      "Rapid office fit-out",
      "AV collaboration",
      "Cloud-ready networking",
      "EUC at scale",
    ],
    featuredClientNames: [],
  },
  {
    slug: "aerospace-defense",
    title: "Aerospace & Defense",
    headline: "Mission-Critical Technology Infrastructure",
    image: "images/industry/industry_aerospace.png",
    icon: Plane,
    overview:
      "Aerospace and defense organizations operate under the highest security and reliability standards of any sector. Vectrae delivers secure networking, high-security AV, and redundant power engineered for mission-critical environments.",
    challenges: [
      "Securing networks to defense-grade standards",
      "Deploying AV systems in high-security, access-controlled environments",
      "Guaranteeing redundant power for mission-critical operations",
      "Building command-centre infrastructure for round-the-clock monitoring",
    ],
    solutionsFit: [
      {
        solutionSlug: "networking-security",
        note: "Defense-grade secure networking",
      },
      {
        solutionSlug: "av-solutions",
        note: "High-security AV for access-controlled environments",
      },
      {
        solutionSlug: "power-solutions",
        note: "Redundant power for mission-critical operations",
      },
    ],
    focusAreas: [
      "Secure networking",
      "High-security AV",
      "Redundant power",
      "NOC/SOC",
    ],
    featuredClientNames: ["Thales"],
  },
  {
    slug: "media",
    title: "Media & Publishing",
    headline: "Technology That Tells Your Story",
    image: "images/industry/industry_media.png",
    icon: Newspaper,
    overview:
      "Media and publishing organizations run on production deadlines and visual storytelling. Vectrae delivers the large-format displays, production AV, and secure networking that keep newsrooms and studios running.",
    challenges: [
      "Deploying production-grade AV for studios and newsrooms",
      "Displaying content across large-format screens and digital signage",
      "Securing networks against high-value content and data breaches",
      "Supporting always-on production schedules",
    ],
    solutionsFit: [
      {
        solutionSlug: "av-solutions",
        note: "Production AV and large-format displays for studios and newsrooms",
      },
      {
        solutionSlug: "networking-security",
        note: "Secure networking for high-value content",
      },
    ],
    focusAreas: [
      "Large-format displays",
      "Media production AV",
      "Secure networking",
      "Digital signage",
    ],
    featuredClientNames: [],
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

// Seed data only. Job openings are served from Postgres (`job_openings`) and
// edited in the admin panel — this array is the one-time migration source,
// replayed by `npm run db:seed-careers`. Editing it does NOT change the live
// site. `departments`, `departmentIcons`, and `perks` below remain static —
// they are not part of the CMS.
import {
  GraduationCap,
  HeartPulse,
  MapPin,
  PartyPopper,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { JobOpening } from "@/lib/careers-types";

export {
  departments,
  departmentIcons,
  type Department,
} from "@/lib/careers-types";

const seedJobOpenings: JobOpening[] = [
  {
    slug: "av-solutions-engineer",
    title: "AV Solutions Engineer",
    department: "Engineering & Technical",
    location: "New Delhi",
    type: "Full-time",
    experience: "2-5 years",
    summary:
      "Design, install, and commission boardroom, auditorium, and command-centre AV systems for enterprise clients.",
    responsibilities: [
      "Read and execute AV system designs, signal flows, and rack layouts",
      "Install, configure, and commission Crestron, Extron, QSC, and Biamp systems",
      "Support pre-sales teams with technical scoping and site surveys",
      "Troubleshoot live systems and coordinate with OEM support when required",
    ],
    requirements: [
      "Diploma/degree in Electronics, IT, or related field",
      "Hands-on experience with control systems, DSPs, and video switching",
      "CTS or OEM certifications (Crestron/Extron/QSC) preferred",
      "Willingness to travel for PAN-India project deployments",
    ],
  },
  {
    slug: "network-security-engineer",
    title: "Network & Security Engineer",
    department: "Engineering & Technical",
    location: "New Delhi",
    type: "Full-time",
    experience: "3-6 years",
    summary:
      "Architect and deploy enterprise networking, wireless, and firewall infrastructure for large PAN-India rollouts.",
    responsibilities: [
      "Design and configure LAN/WAN, wireless, and SD-WAN infrastructure",
      "Deploy and harden firewalls, VPNs, and network access control policies",
      "Lead technical implementation for Cisco, Fortinet, and Palo Alto deployments",
      "Own post-deployment monitoring and incident response for client networks",
    ],
    requirements: [
      "CCNA/CCNP or equivalent networking certification",
      "Strong grasp of routing, switching, and firewall administration",
      "Experience with enterprise-scale rollouts across multiple sites",
      "Excellent client-facing communication skills",
    ],
  },
  {
    slug: "data-center-infrastructure-specialist",
    title: "Data Center Infrastructure Specialist",
    department: "Engineering & Technical",
    location: "New Delhi",
    type: "Full-time",
    experience: "4-8 years",
    summary:
      "Deliver greenfield and brownfield data center builds, from server racking to disaster recovery architecture.",
    responsibilities: [
      "Plan and execute server, storage, and DC infrastructure deployments",
      "Coordinate structured cabling, cooling, and power design with vendors",
      "Support cloud migration and disaster recovery implementation projects",
      "Maintain documentation and SOPs for managed DC environments",
    ],
    requirements: [
      "Degree in Computer Science, IT, or Electrical Engineering",
      "Experience with enterprise server/storage platforms (Dell, HP, Lenovo)",
      "Understanding of virtualization and DC power/cooling fundamentals",
      "OEM certifications a strong plus",
    ],
  },
  {
    slug: "business-development-manager",
    title: "Business Development Manager, Enterprise Accounts",
    department: "Sales & Business Development",
    location: "New Delhi",
    type: "Full-time",
    experience: "5+ years",
    summary:
      "Own the full sales cycle for enterprise technology engagements across AV, networking, and data center solutions.",
    responsibilities: [
      "Identify, pursue, and close enterprise accounts across target industries",
      "Build relationships with CXOs and IT decision-makers PAN-India",
      "Partner with presales to structure proposals and commercial terms",
      "Maintain and grow a healthy pipeline against quarterly targets",
    ],
    requirements: [
      "Proven B2B sales track record in IT/AV/enterprise technology",
      "Comfort selling complex, multi-solution engagements",
      "Strong negotiation and stakeholder management skills",
      "Willingness to travel for client meetings",
    ],
  },
  {
    slug: "presales-solutions-consultant",
    title: "Presales Solutions Consultant",
    department: "Sales & Business Development",
    location: "New Delhi",
    type: "Full-time",
    experience: "3-6 years",
    summary:
      "Translate client requirements into technical proposals spanning Vectrae's full solution portfolio.",
    responsibilities: [
      "Conduct requirement discovery and site assessments with sales teams",
      "Prepare BOQs, technical proposals, and solution architectures",
      "Coordinate with OEM partners on pricing and product specification",
      "Support RFP/RFQ responses for enterprise tenders",
    ],
    requirements: [
      "Background in AV, IT infrastructure, or networking presales",
      "Strong proposal writing and presentation skills",
      "Familiarity with BOQ preparation and vendor coordination",
      "Bachelor's degree in Engineering or related field",
    ],
  },
  {
    slug: "managed-services-noc-engineer",
    title: "Managed Services / NOC Engineer",
    department: "Operations & Support",
    location: "New Delhi",
    type: "Full-time",
    experience: "1-3 years",
    summary:
      "Monitor and support client infrastructure around the clock as part of our Managed IT Services helpdesk.",
    responsibilities: [
      "Monitor client networks, AV systems, and endpoints for incidents",
      "Triage and resolve tickets within defined SLAs",
      "Escalate complex issues to engineering and OEM support",
      "Maintain accurate incident and asset records",
    ],
    requirements: [
      "Diploma/degree in IT or related discipline",
      "Basic understanding of networking, AV, or end-user computing support",
      "Comfortable working rotational shifts",
      "Strong ticketing discipline and communication",
    ],
  },
  {
    slug: "procurement-vendor-management-executive",
    title: "Procurement & Vendor Management Executive",
    department: "Corporate & Admin",
    location: "New Delhi",
    type: "Full-time",
    experience: "2-4 years",
    summary:
      "Manage OEM and vendor relationships to keep project procurement on time and on budget.",
    responsibilities: [
      "Source quotes and negotiate pricing with OEMs and distributors",
      "Track purchase orders, delivery timelines, and vendor performance",
      "Coordinate with project and finance teams on procurement schedules",
      "Maintain vendor documentation and partnership records",
    ],
    requirements: [
      "Bachelor's degree in Commerce, Business, or related field",
      "Experience in IT/technology hardware procurement preferred",
      "Strong negotiation and vendor relationship skills",
      "Proficiency in MS Excel and procurement tracking tools",
    ],
  },
];

export { seedJobOpenings };

export type Perk = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const perks: Perk[] = [
  {
    icon: HeartPulse,
    title: "Health & Wellness Cover",
    description: "Comprehensive medical insurance for you and your family.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Certifications",
    description:
      "OEM certification sponsorship and structured upskilling paths.",
  },
  {
    icon: TrendingUp,
    title: "Performance-Linked Growth",
    description: "Clear career ladders and merit-based promotions.",
  },
  {
    icon: Users,
    title: "Flat, Collaborative Culture",
    description: "Direct access to leadership and cross-functional teams.",
  },
  {
    icon: MapPin,
    title: "PAN-India Project Exposure",
    description: "Work on marquee enterprise deployments across the country.",
  },
  {
    icon: PartyPopper,
    title: "Team Celebrations",
    description: "Festive get-togethers, milestone recognitions, and offsites.",
  },
];

import {
  BatteryCharging,
  Boxes,
  Cable,
  Cloud,
  Database,
  Gauge,
  HardDrive,
  Laptop,
  LayoutGrid,
  LifeBuoy,
  Monitor,
  MonitorCog,
  MonitorPlay,
  Network,
  PackageCheck,
  RadioTower,
  RefreshCw,
  Server,
  Settings2,
  ShieldCheck,
  Truck,
  Users,
  Video,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { siteImages } from "@/lib/site-images";

export type ServiceCapability = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type OemPartner = {
  name: string;
  logo?: string; // path under /public, e.g. "/images/oem/AV/crestron.webp"
};

export type SubService = {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  description: string;
  capabilities: ServiceCapability[];
  benefits: string[];
};

export type Solution = {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  heroImage: string;
  cardImage: string;
  description: string;
  capabilities: ServiceCapability[];
  benefits: string[];
  oems: OemPartner[];
  subServices: SubService[];
};

export const solutions: Solution[] = [
  {
    slug: "av-solutions",
    title: "Audio Visual Solutions",
    tagline: "Immersive meeting experiences, engineered for the enterprise.",
    icon: MonitorPlay,
    heroImage: "/video/av_hero_vid.mp4",
    cardImage: "/images/products/av.png",
    description:
      "From huddle rooms to command centres, we design and deploy audio-visual systems that make every meeting effortless, video conferencing, digital signage, and unified communications, integrated and supported end-to-end.",
    capabilities: [
      {
        icon: Video,
        title: "Video Conferencing Systems",
        description:
          "Zoom, Microsoft Teams & Cisco-certified room deployments for seamless hybrid meetings.",
      },
      {
        icon: LayoutGrid,
        title: "Digital Signage & Displays",
        description:
          "Large-format displays, video walls, and interactive panels for boardrooms and lobbies.",
      },
      {
        icon: Settings2,
        title: "Room Automation & Control",
        description:
          "Centralized scheduling, lighting, and AV control panels for one-touch meetings.",
      },
      {
        icon: RadioTower,
        title: "Auditorium & Command Centre AV",
        description:
          "Large-venue sound reinforcement, projection, and multi-screen command wall design.",
      },
      {
        icon: MonitorCog,
        title: "Acoustic & Room Design",
        description:
          "Acoustic treatment and room engineering for clear, distraction-free audio.",
      },
      {
        icon: Users,
        title: "Unified Communications",
        description:
          "Enterprise-wide UC integration connecting every room to your collaboration platform.",
      },
    ],
    benefits: [
      "Certified Crestron, Cisco & Microsoft integration partners",
      "Single point of accountability from design to AMC",
      "PAN-India installation with local support coverage",
      "Minimal-disruption deployment for live offices",
    ],
    oems: [
      { name: "Crestron", logo: "/images/oem/AV/crestron.webp" },
      { name: "Extron", logo: "/images/oem/AV/extron.webp" },
      { name: "Cisco", logo: "/images/oem/AV/cisco.webp" },
      { name: "Poly", logo: "/images/oem/AV/poly.webp" },
      { name: "Jabra", logo: "/images/oem/AV/jabra.webp" },
      { name: "Samsung", logo: "/images/oem/AV/samsung.webp" },
      { name: "LG", logo: "/images/oem/AV/lg.webp" },
      { name: "Sony", logo: "/images/oem/AV/sony.webp" },
      { name: "Bosch", logo: "/images/oem/AV/bosch.webp" },
      { name: "Sennheiser", logo: "/images/oem/AV/sennheiser.webp" },
      { name: "Harman", logo: "/images/oem/AV/harman.webp" },
      { name: "QSC", logo: "/images/oem/AV/qsc.webp" },
      { name: "Biamp", logo: "/images/oem/AV/biamp.webp" },
      { name: "Yealink", logo: "/images/oem/AV/yealink.webp" },
      { name: "Huddly", logo: "/images/oem/AV/huddly.webp" },
      { name: "Key Digital", logo: "/images/oem/AV/keyDigital.webp" },
      { name: "Aurora", logo: "/images/oem/AV/aurora.webp" },
      { name: "ATEN", logo: "/images/oem/AV/aten.webp" },
      { name: "Lightware", logo: "/images/oem/AV/lightware.webp" },
      { name: "AMX", logo: "/images/oem/AV/amx.webp" },
      { name: "Atlona", logo: "/images/oem/AV/atlona.webp" },
      { name: "Prysm", logo: "/images/oem/AV/prysm.webp" },
      { name: "Audio-Technica", logo: "/images/oem/AV/audioTechnica.webp" },
      { name: "Kramer", logo: "/images/oem/AV/kramer.webp" },
    ],
    subServices: [
      {
        slug: "meeting-room-boardroom",
        title: "Meeting Room & Boardroom Solutions",
        tagline: "One-touch meetings, engineered for every room size.",
        icon: MonitorPlay,
        description:
          "From huddle spaces to executive boardrooms, we design and integrate AV systems that make every meeting effortless, camera, audio, display, and control, working together out of the box.",
        capabilities: [
          {
            icon: Settings2,
            title: "Room Scheduling & One-Touch Join",
            description:
              "Centralized booking panels and one-touch meeting start for every room.",
          },
          {
            icon: Video,
            title: "Camera & Audio Tuning",
            description:
              "Room-tuned camera framing and audio pickup for clear hybrid calls.",
          },
          {
            icon: MonitorCog,
            title: "Display & Acoustic Integration",
            description:
              "Display, control, and acoustic treatment engineered as one system.",
          },
        ],
        benefits: [
          "Certified Crestron, Cisco & Poly integrations",
          "Single point of accountability from design to AMC",
        ],
      },
      {
        slug: "video-conferencing-uc",
        title: "Video Conferencing & Unified Communication",
        tagline: "Microsoft Teams Rooms and Zoom Rooms, deployed at scale.",
        icon: Video,
        description:
          "We deploy and manage certified Teams Rooms and Zoom Rooms across your enterprise, unifying every meeting space onto one collaboration platform with centralized monitoring.",
        capabilities: [
          {
            icon: Video,
            title: "Teams Rooms & Zoom Rooms Certification",
            description:
              "Certified room deployments for both major collaboration platforms.",
          },
          {
            icon: Users,
            title: "Unified Communications Integration",
            description:
              "One collaboration platform connected across every enterprise meeting space.",
          },
          {
            icon: Settings2,
            title: "Room Health Monitoring",
            description:
              "Centralized dashboards flag issues before they interrupt a meeting.",
          },
        ],
        benefits: [
          "Microsoft & Zoom certified deployment",
          "Centralized fleet monitoring across every room",
        ],
      },
      {
        slug: "digital-signage-video-wall",
        title: "Digital Signage & Video Wall Solutions",
        tagline: "Large-format displays that turn every wall into a canvas.",
        icon: LayoutGrid,
        description:
          "From lobby signage to command-centre video walls, we design, install, and manage content-driven display systems built for 24/7 enterprise use.",
        capabilities: [
          {
            icon: LayoutGrid,
            title: "Video Wall Engineering",
            description:
              "Seamless multi-panel video walls for lobbies, command centres, and briefing rooms.",
          },
          {
            icon: Settings2,
            title: "Content Management Systems",
            description:
              "Centralized content scheduling and push across every display, every site.",
          },
          {
            icon: MonitorCog,
            title: "Interactive Displays",
            description:
              "Touch-enabled panels for wayfinding, briefing rooms, and collaboration spaces.",
          },
        ],
        benefits: [
          "Samsung & LG certified large-format partners",
          "Centralized content push across every site",
        ],
      },
      {
        slug: "auditorium-training-room",
        title: "Auditorium & Training Room Solutions",
        tagline: "Sound and visuals engineered for the back row.",
        icon: RadioTower,
        description:
          "We design large-venue AV systems, sound reinforcement, projection, and multi-camera capture, for auditoriums, training rooms, and town-hall spaces.",
        capabilities: [
          {
            icon: RadioTower,
            title: "Sound Reinforcement Design",
            description:
              "Even audio coverage engineered for large and irregular-shaped venues.",
          },
          {
            icon: MonitorPlay,
            title: "Projection & Large-Format Display",
            description:
              "High-lumen projection and display systems sized to the room.",
          },
          {
            icon: Video,
            title: "Multi-Camera Capture & Streaming",
            description:
              "Live-stream ready capture systems for training and town-hall sessions.",
          },
        ],
        benefits: [
          "Even audio coverage across every seat",
          "Live-stream ready capture systems",
        ],
      },
      {
        slug: "command-centre-noc-soc",
        title: "Command Centre, NOC & SOC Solutions",
        tagline: "Mission-critical video walls for 24/7 operations.",
        icon: MonitorCog,
        description:
          "We build command-centre environments for network and security operations, multi-screen video walls, redundant switching, and control-room ergonomics engineered for round-the-clock monitoring.",
        capabilities: [
          {
            icon: LayoutGrid,
            title: "Multi-Screen Video Wall Design",
            description:
              "Purpose-built video walls for NOC and SOC monitoring operations.",
          },
          {
            icon: RefreshCw,
            title: "Redundant Signal Switching",
            description:
              "Failover-ready switching architecture for zero-downtime monitoring.",
          },
          {
            icon: Settings2,
            title: "Control Room Ergonomics",
            description:
              "Console and sightline design for round-the-clock operator comfort.",
          },
        ],
        benefits: [
          "Redundant architecture for zero-downtime monitoring",
          "Purpose-built for NOC/SOC operations",
        ],
      },
    ],
  },
  {
    slug: "networking-security",
    title: "Networking & Security",
    tagline: "Resilient connectivity for the always-on enterprise.",
    icon: Network,
    heroImage: "/images/products/router.png",
    cardImage: "/images/products/router.png",
    description:
      "We design, deploy, and secure the network backbone your business runs on, structured cabling, enterprise Wi-Fi, and firewall infrastructure built for performance at scale.",
    capabilities: [
      {
        icon: Cable,
        title: "Structured Cabling",
        description:
          "Certified fiber & copper cabling infrastructure for new and retrofit sites.",
      },
      {
        icon: Wifi,
        title: "Enterprise Wi-Fi",
        description:
          "Wireless site surveys and high-density Wi-Fi design for seamless coverage.",
      },
      {
        icon: Network,
        title: "LAN/WAN Architecture",
        description:
          "Resilient network design connecting offices, data centers, and branches.",
      },
      {
        icon: ShieldCheck,
        title: "Firewall & Network Security",
        description:
          "Palo Alto Networks-certified perimeter and internal network protection.",
      },
      {
        icon: Cloud,
        title: "SD-WAN & Cloud Connectivity",
        description:
          "Optimized multi-site connectivity for hybrid and cloud-first enterprises.",
      },
      {
        icon: Settings2,
        title: "Network Monitoring",
        description:
          "Proactive performance monitoring and bandwidth optimization.",
      },
    ],
    benefits: [
      "Cisco & Palo Alto Networks certified engineers",
      "Optional 24/7 network operations centre (NOC) monitoring",
      "Scalable architecture for multi-site enterprises",
      "Rapid fault response with PAN-India field support",
    ],
    oems: [
      { name: "Cisco", logo: "/images/oem/netSec/cisco.webp" },
      { name: "Palo Alto Networks", logo: "/images/oem/netSec/paloalto.webp" },
      { name: "Fortinet", logo: "/images/oem/netSec/fortinet.webp" },
      { name: "Sophos", logo: "/images/oem/netSec/sophos.webp" },
      { name: "McAfee", logo: "/images/oem/netSec/mcAfee.webp" },
      { name: "D-Link", logo: "/images/oem/netSec/dLink.webp" },
      { name: "CommScope", logo: "/images/oem/netSec/commscope.webp" },
    ],
    subServices: [
      {
        slug: "enterprise-networking",
        title: "Enterprise Networking",
        tagline: "The backbone your business runs on.",
        icon: Network,
        description:
          "We design and deploy structured cabling, LAN/WAN architecture, and core switching infrastructure built to scale with your enterprise.",
        capabilities: [
          {
            icon: Cable,
            title: "Structured Cabling",
            description:
              "Certified fiber & copper cabling for new builds and retrofits.",
          },
          {
            icon: Network,
            title: "LAN/WAN Architecture",
            description:
              "Resilient network design connecting offices, branches, and data centers.",
          },
          {
            icon: Settings2,
            title: "Core & Access Switching",
            description:
              "Switching infrastructure sized and segmented for enterprise scale.",
          },
        ],
        benefits: [
          "Cisco-certified network architects",
          "Scalable design for multi-site enterprises",
        ],
      },
      {
        slug: "wireless-infrastructure",
        title: "Wireless Infrastructure",
        tagline: "Seamless coverage, engineered for density.",
        icon: Wifi,
        description:
          "From wireless site surveys to high-density Wi-Fi design, we build wireless infrastructure that performs reliably across offices, campuses, and warehouses.",
        capabilities: [
          {
            icon: Wifi,
            title: "Wireless Site Surveys",
            description:
              "RF-mapped surveys that catch dead zones before installation.",
          },
          {
            icon: Network,
            title: "High-Density Wi-Fi Design",
            description:
              "Access-point density engineered for auditoriums and open-plan floors.",
          },
          {
            icon: ShieldCheck,
            title: "Guest & BYOD Segmentation",
            description:
              "Secure network segmentation for guest and personal-device traffic.",
          },
        ],
        benefits: [
          "Coverage engineered for high-density spaces",
          "Secure guest and BYOD segmentation",
        ],
      },
      {
        slug: "firewall-network-security",
        title: "Firewall & Network Security",
        tagline: "Perimeter and internal protection, built for scale.",
        icon: ShieldCheck,
        description:
          "We design, deploy, and manage firewall and network security infrastructure, perimeter protection, internal segmentation, and secure connectivity for the modern enterprise.",
        capabilities: [
          {
            icon: ShieldCheck,
            title: "Perimeter Firewall Deployment",
            description:
              "Palo Alto Networks-certified perimeter defense, tuned to your traffic.",
          },
          {
            icon: Network,
            title: "Network Segmentation",
            description:
              "Internal segmentation that contains threats before they spread.",
          },
          {
            icon: Cloud,
            title: "SD-WAN & Secure Connectivity",
            description:
              "Optimized, secured connectivity across every branch and cloud.",
          },
        ],
        benefits: [
          "Palo Alto Networks certified engineers",
          "24/7 network operations centre option",
        ],
      },
    ],
  },
  {
    slug: "data-center",
    title: "Data Center Solutions",
    tagline: "Infrastructure built for uptime, scale, and resilience.",
    icon: Server,
    heroImage: "/images/products/ram.png",
    cardImage: "/images/products/ram.png",
    description:
      "We build and secure the infrastructure behind your business, from greenfield data centers to disaster recovery and physical security, engineered for enterprise-grade reliability.",
    capabilities: [
      {
        icon: HardDrive,
        title: "Data Center Build-Out",
        description:
          "Greenfield and brownfield DC infrastructure, from racks to cooling.",
      },
      {
        icon: Server,
        title: "Server & Storage Deployment",
        description:
          "Dell & HP enterprise server and storage rollouts, sized to your workload.",
      },
      {
        icon: Cloud,
        title: "Disaster Recovery & Backup",
        description:
          "Business continuity planning with tested backup and DR architecture.",
      },
      {
        icon: ShieldCheck,
        title: "Physical & Cyber Security",
        description:
          "Access control, surveillance, and network security hardening for your DC.",
      },
      {
        icon: Boxes,
        title: "Hyperconverged Infrastructure",
        description:
          "Simplified, scalable HCI deployments for modern workloads.",
      },
      {
        icon: Settings2,
        title: "Cloud Migration",
        description:
          "Guided migration paths from on-prem to hybrid and cloud environments.",
      },
    ],
    benefits: [
      "Dell & HP certified infrastructure partners",
      "24/7 monitored uptime and proactive alerting",
      "Compliance-ready security and access control",
      "Disaster recovery planning built into every deployment",
    ],
    oems: [
      { name: "Dell", logo: "/images/oem/endCom/dell.webp" },
      { name: "HP", logo: "/images/oem/endCom/hp.webp" },
      { name: "Lenovo", logo: "/images/oem/endCom/lenovo.webp" },
      {
        name: "APC by Schneider Electric",
        logo: "/images/oem/endCom/apc.webp",
      },
      { name: "CommScope", logo: "/images/oem/netSec/commscope.webp" },
    ],
    subServices: [
      {
        slug: "dc-infrastructure",
        title: "Data Centre Infrastructure",
        tagline: "Greenfield to brownfield, built for uptime.",
        icon: HardDrive,
        description:
          "We build data center infrastructure from the ground up, racks, cooling, cabling, and power, for both new greenfield builds and brownfield upgrades.",
        capabilities: [
          {
            icon: HardDrive,
            title: "Greenfield DC Build-Out",
            description:
              "Full-stack infrastructure builds for new data center facilities.",
          },
          {
            icon: RefreshCw,
            title: "Brownfield Infrastructure Upgrades",
            description:
              "Modernization of live facilities with minimal service disruption.",
          },
          {
            icon: Settings2,
            title: "Rack & Cooling Design",
            description:
              "Rack layout and cooling engineered for density and airflow.",
          },
        ],
        benefits: [
          "Engineered for Tier-appropriate uptime",
          "Minimal-disruption brownfield upgrades",
        ],
      },
      {
        slug: "server-storage",
        title: "Server & Storage Solutions",
        tagline: "Compute and storage, sized to your workload.",
        icon: Server,
        description:
          "We spec, deploy, and support enterprise server and storage infrastructure from Dell and HP, sized precisely to your workload and growth plan.",
        capabilities: [
          {
            icon: Server,
            title: "Server Deployment & Sizing",
            description:
              "Workload-matched server specs, not over- or under-provisioned.",
          },
          {
            icon: Database,
            title: "Enterprise Storage Solutions",
            description:
              "Scalable storage architecture for structured and unstructured data.",
          },
          {
            icon: Boxes,
            title: "Hyperconverged Infrastructure",
            description:
              "Simplified, scalable HCI deployments for modern workloads.",
          },
        ],
        benefits: [
          "Dell & HP certified infrastructure partners",
          "Right-sized to workload, not overprovisioned",
        ],
      },
      {
        slug: "cloud-solutions",
        title: "Cloud Solutions",
        tagline: "Private, public, or hybrid, your call.",
        icon: Cloud,
        description:
          "We guide and execute cloud migration and management across private, public, and hybrid environments, matching architecture to your compliance and performance needs.",
        capabilities: [
          {
            icon: Cloud,
            title: "Cloud Migration Planning",
            description:
              "Guided migration paths from on-prem to hybrid and cloud.",
          },
          {
            icon: Settings2,
            title: "Hybrid Cloud Architecture",
            description:
              "Architecture matched to your compliance and latency requirements.",
          },
          {
            icon: Gauge,
            title: "Managed Cloud Operations",
            description: "Ongoing cost, performance, and capacity management.",
          },
        ],
        benefits: [
          "Guided migration paths, on-prem to cloud",
          "Architecture matched to compliance needs",
        ],
      },
      {
        slug: "backup-disaster-recovery",
        title: "Backup & Disaster Recovery",
        tagline: "Business continuity, tested and ready.",
        icon: RefreshCw,
        description:
          "We design and implement backup and disaster recovery architecture, tested, documented, and ready, so a single point of failure never becomes a business outage.",
        capabilities: [
          {
            icon: RefreshCw,
            title: "Backup Architecture Design",
            description:
              "Backup systems designed around your recovery point objectives.",
          },
          {
            icon: Cloud,
            title: "Disaster Recovery Planning",
            description:
              "DR architecture built for tested, predictable recovery.",
          },
          {
            icon: ShieldCheck,
            title: "DR Testing & Drills",
            description:
              "Regular failover drills so recovery plans work when it matters.",
          },
        ],
        benefits: [
          "Tested DR plans, not just documentation",
          "Recovery objectives built into every design",
        ],
      },
    ],
  },
  {
    slug: "end-computing",
    title: "End Computing Solutions",
    tagline: "Equip every desk, every workstation, every employee.",
    icon: Laptop,
    heroImage: "/images/products/laptop.png",
    cardImage: "/images/products/laptop.png",
    description:
      "From laptops to thin clients, we procure, configure, and manage the devices your workforce uses every day, with lifecycle support that keeps IT overhead low.",
    capabilities: [
      {
        icon: Laptop,
        title: "Laptops & Desktops",
        description:
          "Bulk procurement of Dell, HP & Microsoft devices at enterprise pricing.",
      },
      {
        icon: MonitorCog,
        title: "Thin Client Deployment",
        description:
          "Centralized, secure thin-client environments for cost-efficient computing.",
      },
      {
        icon: LayoutGrid,
        title: "Monitors & Peripherals",
        description:
          "Standardized workstation rollouts across offices and branches.",
      },
      {
        icon: Settings2,
        title: "Bulk Imaging & Configuration",
        description: "Pre-configured, ready-to-deploy devices out of the box.",
      },
      {
        icon: Boxes,
        title: "Asset Lifecycle Management",
        description:
          "Tracking, refresh cycles, and end-of-life disposal, managed for you.",
      },
      {
        icon: Users,
        title: "Warranty & AMC Support",
        description:
          "Doorstep support and annual maintenance contracts, PAN-India.",
      },
    ],
    benefits: [
      "Direct partnerships with Dell, HP & Microsoft",
      "Volume pricing for large enterprise rollouts",
      "PAN-India delivery and doorstep support",
      "Full asset lifecycle tracking and reporting",
    ],
    oems: [
      { name: "Lenovo", logo: "/images/oem/endCom/lenovo.webp" },
      { name: "Dell", logo: "/images/oem/endCom/dell.webp" },
      { name: "HP", logo: "/images/oem/endCom/hp.webp" },
      { name: "Acer", logo: "/images/oem/endCom/acer.webp" },
      { name: "Microsoft", logo: "/images/oem/endCom/microsoft.webp" },
      { name: "Samsung", logo: "/images/oem/endCom/samsung.webp" },
      { name: "LG", logo: "/images/oem/endCom/lg.webp" },
      { name: "Targus", logo: "/images/oem/endCom/targus.webp" },
      { name: "Kensington", logo: "/images/oem/endCom/kensington.webp" },
      { name: "Logitech", logo: "/images/oem/endCom/logitech.webp" },
    ],
    subServices: [
      {
        slug: "laptops-desktops-workstations",
        title: "Laptops, Desktops & Workstations",
        tagline: "Enterprise devices, procured at scale.",
        icon: Laptop,
        description:
          "Bulk procurement of Dell, HP, and Microsoft laptops, desktops, and high-performance workstations, pre-configured and ready to deploy at enterprise pricing.",
        capabilities: [
          {
            icon: Laptop,
            title: "Bulk Device Procurement",
            description:
              "Volume procurement of enterprise laptops and desktops.",
          },
          {
            icon: Gauge,
            title: "High-Performance Workstations",
            description:
              "Workstation-class hardware for engineering and design teams.",
          },
          {
            icon: Settings2,
            title: "Pre-Configured Imaging",
            description:
              "Devices imaged and ready to deploy straight out of the box.",
          },
        ],
        benefits: [
          "Direct Dell, HP & Microsoft partnerships",
          "Volume pricing for large rollouts",
        ],
      },
      {
        slug: "thin-clients-collaboration-devices",
        title: "Thin Clients & Collaboration Devices",
        tagline: "Centralized, secure, cost-efficient computing.",
        icon: Monitor,
        description:
          "We deploy thin-client environments and collaboration devices that centralize management, reduce endpoint cost, and simplify enterprise IT operations.",
        capabilities: [
          {
            icon: Monitor,
            title: "Thin Client Deployment",
            description:
              "Centralized, secure thin-client environments at lower endpoint cost.",
          },
          {
            icon: Settings2,
            title: "Centralized Endpoint Management",
            description:
              "Single-console management across every deployed device.",
          },
          {
            icon: Users,
            title: "Collaboration Device Rollout",
            description:
              "Standardized collaboration hardware deployed across teams.",
          },
        ],
        benefits: [
          "Lower total cost of endpoint ownership",
          "Centralized, secure management",
        ],
      },
      {
        slug: "monitors-docking-peripherals",
        title: "Monitors, Docking & Peripherals",
        tagline: "Standardized workstations, every desk, every branch.",
        icon: LayoutGrid,
        description:
          "From monitors to docking stations, we standardize workstation rollouts across offices and branches, consistent hardware, consistent experience.",
        capabilities: [
          {
            icon: LayoutGrid,
            title: "Monitor & Display Rollout",
            description:
              "Standardized display hardware across every workstation.",
          },
          {
            icon: Cable,
            title: "Docking Station Deployment",
            description:
              "Universal docking rolled out for consistent desk setups.",
          },
          {
            icon: Boxes,
            title: "Peripheral Standardization",
            description:
              "A single peripheral catalog, managed across every site.",
          },
        ],
        benefits: [
          "Consistent hardware across every branch",
          "Standardized peripheral catalog",
        ],
      },
    ],
  },
  {
    slug: "it-spares-accessories",
    title: "IT Spares & Accessories",
    tagline:
      "Fast-turnaround components that keep your infrastructure running.",
    icon: PackageCheck,
    heroImage: "/images/products/motherboard.png",
    cardImage: "/images/products/motherboard.png",
    description:
      "When hardware fails, downtime isn't an option. We stock and dispatch genuine OEM spare parts and accessories, so your IT and AV systems stay operational.",
    capabilities: [
      {
        icon: PackageCheck,
        title: "Genuine OEM Spare Parts",
        description:
          "Authentic components sourced directly from certified OEM partners.",
      },
      {
        icon: Truck,
        title: "Rapid Replacement & Logistics",
        description:
          "Fast-dispatch logistics network for time-critical replacements.",
      },
      {
        icon: Cable,
        title: "Cables & Accessories",
        description:
          "A full range of enterprise-grade cables, adapters, and mounts.",
      },
      {
        icon: Boxes,
        title: "Legacy Component Sourcing",
        description: "Hard-to-find parts for systems still in active service.",
      },
      {
        icon: LayoutGrid,
        title: "Bulk Inventory Management",
        description:
          "Managed spare-parts inventory so you're never caught short.",
      },
      {
        icon: Settings2,
        title: "Emergency Dispatch",
        description:
          "Priority handling for mission-critical hardware failures.",
      },
    ],
    benefits: [
      "OEM & technology partnerships",
      "Fast-delivery logistics network, PAN-India",
      "100% genuine parts guarantee",
      "Managed inventory for zero-downtime operations",
    ],
    oems: [
      { name: "Jabra", logo: "/images/oem/AV/jabra.webp" },
      { name: "Poly", logo: "/images/oem/AV/poly.webp" },
      { name: "Logitech", logo: "/images/oem/endCom/logitech.webp" },
      { name: "3M", logo: "/images/oem/endCom/3m.webp" },
      { name: "Kensington", logo: "/images/oem/endCom/kensington.webp" },
      { name: "Targus", logo: "/images/oem/endCom/targus.webp" },
      { name: "Philips", logo: "/images/oem/endCom/philips.webp" },
    ],
    subServices: [
      {
        slug: "enterprise-it-peripherals",
        title: "Enterprise IT Peripherals",
        tagline: "Genuine peripherals, always in stock.",
        icon: PackageCheck,
        description:
          "A full catalog of enterprise-grade peripherals, keyboards, mice, headsets, docking accessories, sourced genuine and delivered fast, PAN-India.",
        capabilities: [
          {
            icon: PackageCheck,
            title: "Genuine OEM Peripherals",
            description:
              "Authentic peripherals sourced directly from certified partners.",
          },
          {
            icon: Truck,
            title: "Fast-Dispatch Logistics",
            description:
              "Priority logistics network for time-critical peripheral needs.",
          },
          {
            icon: Boxes,
            title: "Bulk Peripheral Procurement",
            description: "Volume procurement for large enterprise rollouts.",
          },
        ],
        benefits: [
          "100% genuine parts guarantee",
          "Fast-dispatch logistics network",
        ],
      },
      {
        slug: "workplace-accessories-components",
        title: "Workplace Accessories & Components",
        tagline: "The small parts that keep everything running.",
        icon: Boxes,
        description:
          "Cables, adapters, mounts, and hard-to-find legacy components, we stock and dispatch the accessories that keep enterprise IT and AV systems operational.",
        capabilities: [
          {
            icon: Cable,
            title: "Cables & Adapters",
            description:
              "A full range of enterprise-grade cables and adapters, in stock.",
          },
          {
            icon: Settings2,
            title: "Mounting & Accessories",
            description:
              "Mounts and installation accessories for IT and AV hardware.",
          },
          {
            icon: Boxes,
            title: "Legacy Component Sourcing",
            description:
              "Hard-to-find parts sourced for systems still in active service.",
          },
        ],
        benefits: [
          "Hard-to-find legacy parts sourced fast",
          "Emergency dispatch for critical failures",
        ],
      },
    ],
  },
  {
    slug: "power-solutions",
    title: "Power Solutions",
    tagline: "Zero downtime starts with the right power strategy.",
    icon: Zap,
    heroImage: "/images/products/power.png",
    cardImage: "/images/products/power.png",
    description:
      "From UPS systems to distribution infrastructure, Vectrae designs and deploys the power backbone that keeps enterprise operations running, critical infrastructure, engineered for zero downtime.",
    capabilities: [
      {
        icon: BatteryCharging,
        title: "UPS Systems & Sizing",
        description:
          "Enterprise-grade UPS design and deployment sized to your critical load.",
      },
      {
        icon: Cable,
        title: "Power Distribution Units",
        description:
          "Rack and floor PDUs engineered for data center and office density.",
      },
      {
        icon: Zap,
        title: "Backup & Standby Power",
        description:
          "Generator integration and failover architecture for zero-downtime operations.",
      },
      {
        icon: Gauge,
        title: "Power Monitoring & Management",
        description: "Real-time load monitoring and remote power management.",
      },
      {
        icon: ShieldCheck,
        title: "Critical Infrastructure Power",
        description:
          "Redundant power architecture for data centers and command centres.",
      },
      {
        icon: Settings2,
        title: "Energy Efficiency Consulting",
        description:
          "Load assessment and efficiency planning to reduce operating cost.",
      },
    ],
    benefits: [
      "APC by Schneider Electric certified deployment partner",
      "Redundant (N+1) architecture on every critical installation",
      "PAN-India installation and AMC support",
      "Rapid-response field engineering for power-critical outages",
    ],
    oems: [
      {
        name: "APC by Schneider Electric",
        logo: "/images/oem/endCom/apc.webp",
      },
      { name: "Schneider Electric", logo: "/images/oem/endCom/schneider.webp" },
    ],
    subServices: [
      {
        slug: "ups-systems",
        title: "UPS Systems",
        tagline: "Uninterrupted power, sized to your load.",
        icon: BatteryCharging,
        description:
          "We design, size, and deploy enterprise UPS systems, from rack-mount to facility-scale, engineered around your critical load and runtime requirements.",
        capabilities: [
          {
            icon: BatteryCharging,
            title: "UPS Sizing & Design",
            description:
              "UPS capacity engineered around your actual critical load.",
          },
          {
            icon: Settings2,
            title: "Rack & Facility-Scale Deployment",
            description:
              "Deployments scaled from single racks to full facilities.",
          },
          {
            icon: RefreshCw,
            title: "Battery Management",
            description:
              "Battery health monitoring and scheduled replacement cycles.",
          },
        ],
        benefits: [
          "APC by Schneider Electric certified",
          "Sized to critical load, not guesswork",
        ],
      },
      {
        slug: "power-distribution-management",
        title: "Power Distribution & Management",
        tagline:
          "Distribution and monitoring, built for critical infrastructure.",
        icon: Gauge,
        description:
          "From rack PDUs to facility-wide distribution, we design power distribution and monitoring systems that keep data centers and critical infrastructure running.",
        capabilities: [
          {
            icon: Cable,
            title: "PDU Design & Deployment",
            description:
              "Rack and floor PDUs engineered for data center density.",
          },
          {
            icon: Gauge,
            title: "Power Monitoring Systems",
            description: "Real-time visibility into load across every circuit.",
          },
          {
            icon: Settings2,
            title: "Remote Power Management",
            description:
              "Remote control and monitoring for critical-site power.",
          },
        ],
        benefits: ["Real-time load monitoring", "Engineered redundancy (N+1)"],
      },
    ],
  },
  {
    slug: "managed-it-services",
    title: "Managed IT Services",
    tagline: "Focus on your business. We'll run your IT.",
    icon: LifeBuoy,
    heroImage: "/images/products/managedIt.png",
    cardImage: "/images/products/managedIt.png",
    description:
      "Proactive AMC, remote monitoring, and full-scope IT support, Vectrae's managed services keep enterprise technology running so your team can focus on the business, not the break-fix.",
    capabilities: [
      {
        icon: Settings2,
        title: "Annual Maintenance Contracts (AMC)",
        description:
          "Scheduled maintenance and priority support across your IT estate.",
      },
      {
        icon: Gauge,
        title: "Remote Monitoring & Management",
        description:
          "24/7 remote monitoring that catches issues before they escalate.",
      },
      {
        icon: Users,
        title: "IT Helpdesk Support",
        description: "A dedicated helpdesk for day-to-day employee IT issues.",
      },
      {
        icon: RefreshCw,
        title: "Moves, Adds & Changes",
        description:
          "Managed rollout of office moves, adds, and infrastructure changes.",
      },
      {
        icon: Truck,
        title: "Field Engineering & On-Site Support",
        description:
          "On-site engineers dispatched PAN-India when remote isn't enough.",
      },
      {
        icon: ShieldCheck,
        title: "SLA-Backed Full Managed IT",
        description:
          "End-to-end IT management with a committed service-level agreement.",
      },
    ],
    benefits: [
      "99.9% uptime SLA",
      "4-hour on-site response",
      "Dedicated account manager",
      "PAN-India helpdesk coverage",
    ],
    oems: [],
    subServices: [],
  },
];

export function getSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

export function getSubService(vertical: string, subservice: string) {
  const solution = getSolution(vertical);
  return solution?.subServices.find((sub) => sub.slug === subservice);
}

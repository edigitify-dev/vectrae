export type OSMeta = { label: string; value: string };

export type OSFile = {
  id: string;
  icon: string;
  title: string;
  tag?: string;
  summary: string;
  body: string;
  meta?: OSMeta[];
  action?: { label: string; href: string };
  toggleDefault?: boolean;
};

export type OSFolder = {
  id: string;
  label: string;
  icon: string;
  accent: string;
  files: OSFile[];
  subFolders?: OSFolder[];
};

// Mirrors the homepage content brief (abt.md), one folder per homepage
// section, one subfolder per content block within that section.
export const desktopFolders: OSFolder[] = [
  {
    id: "homepage",
    label: "Homepage",
    icon: "home",
    accent: "#29B9F2",
    files: [],
    subFolders: [
      {
        id: "hero",
        label: "Hero",
        icon: "sparkles",
        accent: "#29B9F2",
        files: [
          {
            id: "primary-headline",
            icon: "layoutGrid",
            title: "Primary Headline (H1)",
            tag: "Recommended",
            summary:
              "Integrated Technology Solutions for the Modern Enterprise",
            body: "The primary H1 headline for the hero section, with two alternates on file for A/B testing.",
            meta: [
              {
                label: "Alternate A",
                value:
                  "One Trusted Technology Partner for 2,300+ Enterprises Across India",
              },
              {
                label: "Alternate B",
                value:
                  "Comprehensive Technology Solutions, From AV to Data Centers to Power",
              },
            ],
          },
          {
            id: "sub-headline",
            icon: "fileText",
            title: "Sub-headline",
            tag: "Hero Copy",
            summary:
              "From AV and Networking to Data Centers and Power, Vectrae delivers end-to-end enterprise technology across PAN-India.",
            body: "Sits directly beneath the primary headline in the hero section.",
          },
          {
            id: "trust-line-ctas",
            icon: "shieldCheck",
            title: "Trust Line & CTAs",
            tag: "Conversion Copy",
            summary:
              "Trusted by 2,300+ enterprises | 300+ Technology Experts | PAN-India Delivery.",
            body: "Displayed directly below the hero CTA buttons.",
            meta: [
              { label: "Primary CTA", value: "Request a Free Consultation" },
              { label: "Secondary CTA", value: "Explore Our Solutions" },
            ],
          },
          {
            id: "top-bar-contact",
            icon: "mail",
            title: "Top Bar Contact",
            tag: "Header",
            summary: "enquiry@vectrae.com",
            body: "Displayed in the top utility bar above the main navigation.",
            action: { label: "Email Us", href: "mailto:enquiry@vectrae.com" },
          },
          {
            id: "certifications-badges",
            icon: "stickyNote",
            title: "Certifications / Badges",
            tag: "Needs Client Input",
            summary: "Awaiting badge assets from the client team.",
            body: "Team will share a Drive link with certification and award badge graphics once available.",
          },
        ],
      },
      {
        id: "trust-signals",
        label: "Trust Signals",
        icon: "handshake",
        accent: "#25D9C7",
        files: [
          {
            id: "client-logos",
            icon: "briefcase",
            title: "Client Logos",
            tag: "49 Enterprises",
            summary:
              "Wipro, HCL, TCS, Accenture, HDFC Bank, JP Morgan, EY, Deloitte, KPMG, PwC, McKinsey, Maruti Suzuki, Zomato, Adobe, Airtel, Thales, American Express, Ford, MakeMyTrip, Schneider Electric, plus additional names from the full 49-client list.",
            body: "Displayed as a scrolling logo carousel directly beneath the hero section.",
            meta: [
              { label: "Format", value: "Carousel" },
              { label: "Total Clients", value: "49" },
            ],
          },
          {
            id: "priority-oem-partners",
            icon: "shieldCheck",
            title: "Priority OEM Partners",
            tag: "Homepage Strip",
            summary:
              "Cisco, Microsoft, Lenovo, Dell, HP, Crestron, Palo Alto Networks, APC by Schneider Electric, Fortinet, Samsung, Bosch, Harman, QSC.",
            body: "The 13 partner names to feature most prominently in the homepage OEM strip.",
          },
          {
            id: "av-collaboration-partners",
            icon: "network",
            title: "AV & Collaboration",
            tag: "22 Partners",
            summary:
              "Crestron, Extron, Kramer, Key Digital, Aurora, ATEN, Lightware, AMX by Harman, Atlona, Altafron, Biamp, QSC, Harman, Prysm, Bosch, Sennheiser, Audio-Technica, Poly, Jabra, Yealink, Huddly, Epson.",
            body: "Full category list, per Blueprint §7.2.",
          },
          {
            id: "networking-security-partners",
            icon: "shieldCheck",
            title: "Networking & Security",
            tag: "7 Partners",
            summary:
              "Cisco, Palo Alto Networks, Fortinet, Sophos, McAfee, D-Link, CommScope.",
            body: "Full category list, per Blueprint §7.2.",
          },
          {
            id: "compute-power-partners",
            icon: "server",
            title: "End Computing & Power",
            tag: "14 Partners",
            summary:
              "Lenovo, Dell, HP, Acer, Microsoft, Samsung, LG, Sony, Philips, Logitech, 3M, Kensington, Targus, APC by Schneider Electric, Schneider Electric.",
            body: "Full category list, per Blueprint §7.2.",
          },
          {
            id: "logo-assets-needed",
            icon: "stickyNote",
            title: "Logo Assets Needed",
            tag: "Action Required",
            summary:
              "High-resolution, transparent-background logos are still needed for all OEM partners.",
            body: "The Blueprint provides names only, awaiting final logo files from the client team.",
          },
        ],
      },
      {
        id: "about",
        label: "About Us",
        icon: "info",
        accent: "#84D96C",
        files: [
          {
            id: "homepage-teaser",
            icon: "fileText",
            title: "Homepage Teaser",
            tag: "Section Copy",
            summary:
              "Vectrae Infotech is a full-spectrum enterprise technology solutions provider, delivering Audio Visual, IT Infrastructure, Networking & Security, Data Center, End Computing, and Power solutions to enterprises across India.",
            body: "With 300+ technology experts, OEM and technology partnerships, and a PAN-India delivery footprint, Vectrae has supported 2,300+ enterprise clients from initial consultation through to long-term managed support. Our mission is to simplify technology decisions for enterprises, delivering the right solutions, the right partners, and the right outcomes, every time.",
          },
          {
            id: "key-statistics",
            icon: "database",
            title: "Key Statistics",
            tag: "Number Counters",
            summary:
              "2,300+ Enterprise Clients · 300+ Technology Experts · 25+ Years of Enterprise Experience.",
            body: "Animated number counters displayed in the About Us section.",
            meta: [
              { label: "Enterprise Clients", value: "2,300+" },
              { label: "Technology Experts", value: "300+" },
              { label: "Years Experience", value: "25+" },
            ],
          },
        ],
      },
      {
        id: "why-choose-us",
        label: "Why Choose Us",
        icon: "gem",
        accent: "#B6D93B",
        files: [
          {
            id: "single-window-partner",
            icon: "layoutGrid",
            title: "Single-Window Technology Partner",
            summary: "AV, IT, Networking, DC, Power under one roof.",
            body: "One of five headline cards in the Why Choose Us section.",
          },
          {
            id: "pre-sales-post-sales",
            icon: "userCog",
            title: "Pre-Sales to Post-Sales",
            summary: "End-to-end support from needs assessment to AMC.",
            body: "One of five headline cards in the Why Choose Us section.",
          },
          {
            id: "oem-partnerships",
            icon: "handshake",
            title: "OEM Partnerships",
            summary:
              "Best-in-class technology from the world's leading brands.",
            body: "One of five headline cards in the Why Choose Us section.",
          },
          {
            id: "pan-india-delivery",
            icon: "globe2",
            title: "PAN-India Delivery",
            summary:
              "Nationwide project execution and service support network.",
            body: "One of five headline cards in the Why Choose Us section.",
          },
          {
            id: "enterprise-grade-expertise",
            icon: "users",
            title: "Enterprise-Grade Expertise",
            summary: "300+ certified professionals across all verticals.",
            body: "One of five headline cards in the Why Choose Us section.",
          },
        ],
      },
      {
        id: "solutions-services",
        label: "Solutions & Services",
        icon: "network",
        accent: "#29B9F2",
        files: [
          {
            id: "audio-visual-solutions",
            icon: "monitorPlay",
            title: "Audio Visual Solutions",
            summary:
              "End-to-end AV for meeting rooms, boardrooms, auditoriums & command centres.",
            body: "Homepage service card, per Blueprint spec.",
          },
          {
            id: "networking-security",
            icon: "network",
            title: "Networking & Security",
            summary:
              "Enterprise networking, wireless infrastructure, firewall & secure connectivity.",
            body: "Homepage service card, per Blueprint spec.",
          },
          {
            id: "data-center-solutions",
            icon: "server",
            title: "Data Center Solutions",
            summary:
              "Greenfield/brownfield DC infrastructure, servers, cloud & disaster recovery.",
            body: "Homepage service card, per Blueprint spec.",
          },
          {
            id: "end-computing-solutions",
            icon: "laptop",
            title: "End Computing Solutions",
            summary:
              "Laptops, workstations, thin clients, monitors & enterprise peripherals.",
            body: "Homepage service card, per Blueprint spec.",
          },
          {
            id: "it-spares-accessories",
            icon: "packageCheck",
            title: "IT Spares & Accessories",
            summary:
              "Fast-delivery enterprise IT components, accessories & spare parts.",
            body: "Homepage service card, per Blueprint spec.",
          },
          {
            id: "power-solutions",
            icon: "zap",
            title: "Power Solutions",
            summary:
              "UPS, power backup, distribution & critical infrastructure power management.",
            body: "Homepage service card, per Blueprint spec.",
          },
          {
            id: "managed-it-services",
            icon: "headset",
            title: "Managed IT Services",
            summary:
              "Proactive AMC, remote monitoring, helpdesk & full managed IT support.",
            body: "Homepage service card, per Blueprint spec.",
          },
        ],
      },
      {
        id: "core-values",
        label: "Core Values",
        icon: "gem",
        accent: "#25D9C7",
        files: [
          {
            id: "integrity",
            icon: "shieldCheck",
            title: "Integrity",
            tag: "Core Value",
            summary: "Integrity",
            body: "One of five principles guiding every Vectrae engagement.",
          },
          {
            id: "excellence",
            icon: "gem",
            title: "Excellence",
            tag: "Core Value",
            summary: "Excellence",
            body: "One of five principles guiding every Vectrae engagement.",
          },
          {
            id: "partnership",
            icon: "handshake",
            title: "Partnership",
            tag: "Core Value",
            summary: "Partnership",
            body: "One of five principles guiding every Vectrae engagement.",
          },
          {
            id: "innovation",
            icon: "sparkles",
            title: "Innovation",
            tag: "Core Value",
            summary: "Innovation",
            body: "One of five principles guiding every Vectrae engagement.",
          },
          {
            id: "accountability",
            icon: "userCog",
            title: "Accountability",
            tag: "Core Value",
            summary: "Accountability",
            body: "One of five principles guiding every Vectrae engagement.",
          },
        ],
      },
      {
        id: "blog",
        label: "Blog",
        icon: "newspaper",
        accent: "#84D96C",
        files: [
          {
            id: "av-tech-2026",
            icon: "monitorPlay",
            title:
              "Top 10 AV Technologies for Enterprise Meeting Rooms in 2026",
            tag: "Audio Visual",
            summary:
              "A rundown of the AV upgrades enterprises are prioritizing this year.",
            body: "Covers everything from AI-framing cameras to acoustic fencing for open-plan boardrooms.",
            meta: [
              { label: "Published", value: "March 12, 2026" },
              { label: "Read Time", value: "6 min" },
            ],
            action: { label: "Read Article", href: "/blog/av-tech-2026" },
          },
          {
            id: "managed-it",
            icon: "headset",
            title: "Why Every Enterprise Needs a Managed IT Services Provider",
            tag: "Managed Services",
            summary:
              "The case for proactive AMC and remote monitoring over reactive break-fix support.",
            body: "Explores the hidden cost of downtime and how a managed helpdesk shifts IT from reactive to proactive.",
            meta: [
              { label: "Published", value: "March 08, 2026" },
              { label: "Read Time", value: "5 min" },
            ],
            action: { label: "Read Article", href: "/blog/managed-it" },
          },
          {
            id: "teams-vs-zoom",
            icon: "network",
            title:
              "Microsoft Teams Rooms vs Zoom Rooms, Which Is Right for Your Enterprise?",
            tag: "Collaboration",
            summary:
              "A side-by-side comparison for enterprises standardizing their meeting room platform.",
            body: "Weighs licensing, hardware compatibility, and admin overhead across both platforms.",
            meta: [
              { label: "Published", value: "March 02, 2026" },
              { label: "Read Time", value: "8 min" },
            ],
            action: { label: "Read Article", href: "/blog/teams-vs-zoom" },
          },
          {
            id: "choose-ups",
            icon: "zap",
            title: "How to Choose the Right UPS for Your Data Center",
            tag: "Power Solutions",
            summary:
              "A buyer's guide to sizing and specifying UPS systems for critical infrastructure.",
            body: "Covers load calculation, runtime planning, and the tradeoffs between line-interactive and online UPS.",
            meta: [
              { label: "Published", value: "February 25, 2026" },
              { label: "Read Time", value: "7 min" },
            ],
            action: { label: "Read Article", href: "/blog/choose-ups" },
          },
          {
            id: "network-security",
            icon: "shieldCheck",
            title: "5 Signs Your Enterprise Network Needs a Security Overhaul",
            tag: "Networking & Security",
            summary:
              "Warning signs that your current network architecture is due for a zero-trust review.",
            body: "From flat VLANs to unmanaged BYOD access, the red flags our security engineers see most often.",
            meta: [
              { label: "Published", value: "February 18, 2026" },
              { label: "Read Time", value: "5 min" },
            ],
            action: { label: "Read Article", href: "/blog/network-security" },
          },
          {
            id: "dc-decision",
            icon: "database",
            title: "Greenfield vs Brownfield Data Center, Decision Guide",
            tag: "Data Center",
            summary:
              "A framework for deciding between a new build and modernizing an existing facility.",
            body: "Compares total cost of ownership, timeline, and risk between the two approaches.",
            meta: [
              { label: "Published", value: "February 10, 2026" },
              { label: "Read Time", value: "9 min" },
            ],
            action: { label: "Read Article", href: "/blog/dc-decision" },
          },
        ],
      },
      {
        id: "footprint",
        label: "Footprint",
        icon: "globe2",
        accent: "#B6D93B",
        files: [
          {
            id: "pan-india-coverage",
            icon: "mapPin",
            title: "PAN-India Coverage",
            tag: "Coverage Map",
            summary: "PAN-India service and delivery footprint.",
            body: "Active delivery and support hubs across major metro regions, shown as an interactive map on the homepage.",
            meta: [
              { label: "Delhi NCR", value: "Active" },
              { label: "Mumbai", value: "Active" },
              { label: "Bangalore", value: "Active" },
              { label: "Hyderabad", value: "Active" },
              { label: "Chennai", value: "Active" },
              { label: "Pune", value: "Active" },
              { label: "Kolkata", value: "Active" },
              { label: "Ahmedabad", value: "Active" },
            ],
            action: { label: "View Coverage Map", href: "/#footprint" },
          },
        ],
      },
      {
        id: "contact-footer",
        label: "Contact & Footer",
        icon: "phone",
        accent: "#29B9F2",
        files: [
          {
            id: "company-info",
            icon: "briefcase",
            title: "Company Info",
            tag: "Footer",
            summary: "Vectrae Infotech Pvt. Ltd.",
            body: "A-16/B-1 Extension, Mohan Co-Op, Industrial Estate, New Delhi - 110044, India",
            meta: [
              { label: "Email", value: "enquiry@vectrae.com" },
              { label: "Phone", value: "+91-11-40590964-65" },
            ],
            action: { label: "Call Us", href: "tel:+91-11-40590964-65" },
          },
          {
            id: "social-links",
            icon: "send",
            title: "Social Links",
            tag: "Footer",
            summary: "LinkedIn · Instagram · Facebook",
            body: "Official social channels linked in the footer.",
            meta: [
              {
                label: "LinkedIn",
                value: "linkedin.com/company/vectraeinfotechpvtltd.",
              },
              { label: "Instagram", value: "instagram.com/vectraeinfotech" },
              { label: "Facebook", value: "facebook.com/vectraee" },
            ],
            action: {
              label: "Visit LinkedIn",
              href: "https://www.linkedin.com/company/vectraeinfotechpvtltd./",
            },
          },
          {
            id: "legal-links",
            icon: "stickyNote",
            title: "Legal Links",
            tag: "Needs Content",
            summary:
              "Privacy Policy and Terms of Use still need to be drafted.",
            body: "Corporate Governance page is live. Privacy Policy and Terms of Use are flagged as pending in the Blueprint.",
            meta: [
              { label: "Privacy Policy", value: "Please create" },
              { label: "Terms of Use", value: "Please create" },
              { label: "Corporate Governance", value: "Live" },
            ],
            action: {
              label: "View Corporate Governance",
              href: "https://vectrae.com/corporate-governance/",
            },
          },
          {
            id: "support-promise",
            icon: "headset",
            title: "Support Promise",
            tag: "Footer Element",
            summary: "",
            body: "A floating WhatsApp Quick Connect button is fixed bottom-right on all pages. Footer layout uses 4 columns: Company info + social links | Solutions | Industries | Quick Links. A slim OEM partner logo strip sits directly above the footer. Newsletter signup is optional.",
            action: {
              label: "Chat on WhatsApp",
              href: "https://wa.me/+919205557448?text=Hello%20I%20want%20to%20know%20more",
            },
          },
        ],
      },
    ],
  },

  // ─── About ───────────────────────────────────────────────────────────────
  {
    id: "about-page",
    label: "About",
    icon: "info",
    accent: "#84D96C",
    files: [],
    subFolders: [
      {
        id: "about-company-overview",
        label: "Company Overview",
        icon: "briefcase",
        accent: "#84D96C",
        files: [
          {
            id: "about-intro",
            icon: "fileText",
            title: "About Vectrae Infotech",
            tag: "Company Profile",
            summary:
              "Vectrae Infotech Pvt. Ltd. is a full-spectrum enterprise technology solutions provider headquartered in New Delhi, India.",
            body: "Founded with a mission to simplify technology for enterprises, Vectrae delivers Audio Visual, IT Infrastructure, Networking & Security, Data Center, End Computing, and Power solutions to 2,300+ enterprise clients across PAN-India.",
            meta: [
              { label: "Founded", value: "2014" },
              { label: "HQ", value: "New Delhi, India" },
              { label: "Footprint", value: "PAN-India" },
            ],
          },
          {
            id: "about-mission",
            icon: "sparkles",
            title: "Mission & Vision",
            tag: "Brand Identity",
            summary:
              "To simplify technology decisions for enterprises, delivering the right solutions, the right partners, and the right outcomes, every time.",
            body: "Our vision is to be India's most trusted end-to-end enterprise technology partner, enabling organisations to grow, innovate, and operate with confidence.",
          },
          {
            id: "about-stats",
            icon: "database",
            title: "Key Numbers",
            tag: "At a Glance",
            summary:
              "2,300+ Enterprise Clients · 300+ Technology Experts · 25+ Years",
            body: "These numbers reflect Vectrae's scale of operations and depth of expertise across India.",
            meta: [
              { label: "Enterprise Clients", value: "2,300+" },
              { label: "Technology Experts", value: "300+" },
              { label: "Years of Experience", value: "25+" },
            ],
          },
        ],
      },
      {
        id: "about-story",
        label: "Our Story",
        icon: "stickyNote",
        accent: "#84D96C",
        files: [
          {
            id: "about-history",
            icon: "fileText",
            title: "Company History",
            tag: "Milestones",
            summary:
              "From a focused AV integrator to a full-spectrum enterprise technology company over 25 years.",
            body: "Vectrae began as a specialist Audio Visual integrator serving enterprise clients in Delhi NCR. Over two decades, the company expanded into Networking, Data Centers, End Computing, and Power, growing its client base to 2,300+ enterprises and its workforce to 300+ certified technology professionals.",
          },
          {
            id: "about-milestones",
            icon: "zap",
            title: "Key Milestones",
            tag: "Timeline",
            summary:
              "25+ years of enterprise technology milestones across India.",
            body: "Needs client input, please provide a verified milestone timeline for the About Us page.",
            meta: [{ label: "Status", value: "Awaiting client input" }],
          },
        ],
      },
      {
        id: "about-leadership",
        label: "Leadership Team",
        icon: "userCog",
        accent: "#84D96C",
        files: [
          {
            id: "leadership-profiles",
            icon: "users",
            title: "Leadership Profiles",
            tag: "Needs Client Input",
            summary:
              "Founder, Directors, and Business Unit Heads, profiles and headshots needed.",
            body: "Please share leadership names, titles, brief bios, and professional headshots for the About Us leadership section.",
          },
        ],
      },
      {
        id: "about-achievements",
        label: "Achievements",
        icon: "gem",
        accent: "#84D96C",
        files: [
          {
            id: "awards",
            icon: "sparkles",
            title: "Awards & Recognition",
            tag: "Needs Client Input",
            summary:
              "Industry awards, OEM partner certifications, and enterprise accolades.",
            body: "Please provide award names, issuing bodies, and years received. Badge/logo assets also needed.",
          },
          {
            id: "certifications",
            icon: "shieldCheck",
            title: "Certifications",
            tag: "OEM & Industry",
            summary:
              "Cisco, Palo Alto, Crestron, Microsoft, Dell, HP, certified partner status across key OEMs.",
            body: "List of active OEM certifications held by Vectrae's technology teams. Awaiting official certificate files from client.",
          },
        ],
      },
    ],
  },

  // ─── Partners ─────────────────────────────────────────────────────────────
  {
    id: "partners-page",
    label: "Partners",
    icon: "handshake",
    accent: "#25D9C7",
    files: [],
    subFolders: [
      {
        id: "partners-oem",
        label: "OEM Partners",
        icon: "shieldCheck",
        accent: "#25D9C7",
        files: [
          {
            id: "oem-av",
            icon: "monitorPlay",
            title: "AV & Collaboration",
            tag: "22 Partners",
            summary:
              "Crestron, Extron, Kramer, Key Digital, Aurora, ATEN, Lightware, AMX by Harman, Atlona, Biamp, QSC, Harman, Prysm, Bosch, Sennheiser, Audio-Technica, Poly, Jabra, Yealink, Huddly, Epson.",
            body: "OEM partnerships for Audio Visual and collaboration technology deployments.",
          },
          {
            id: "oem-network",
            icon: "network",
            title: "Networking & Security",
            tag: "7 Partners",
            summary:
              "Cisco, Palo Alto Networks, Fortinet, Sophos, McAfee, D-Link, CommScope.",
            body: "OEM partnerships for enterprise networking, wireless infrastructure, and cybersecurity.",
          },
          {
            id: "oem-compute",
            icon: "laptop",
            title: "End Computing & Power",
            tag: "15 Partners",
            summary:
              "Lenovo, Dell, HP, Acer, Microsoft, Samsung, LG, Sony, Philips, Logitech, Kensington, Targus, APC by Schneider Electric, Schneider Electric.",
            body: "OEM partnerships for end-user computing, peripherals, and power infrastructure.",
          },
          {
            id: "oem-datacenter",
            icon: "server",
            title: "Data Center",
            tag: "Key Partners",
            summary:
              "Dell, HP, Lenovo, APC by Schneider Electric, Schneider Electric, Vertiv.",
            body: "OEM partnerships for data center infrastructure including servers, racks, cooling, and power.",
          },
        ],
      },
      {
        id: "partners-technology",
        label: "Technology Alliances",
        icon: "network",
        accent: "#25D9C7",
        files: [
          {
            id: "cloud-alliances",
            icon: "database",
            title: "Cloud & Software Alliances",
            tag: "Strategic",
            summary:
              "Microsoft, Google Workspace, and cloud infrastructure alliances that complement Vectrae's hardware deployments.",
            body: "These alliances allow Vectrae to offer hybrid deployments, combining on-premise enterprise hardware with cloud-native services.",
          },
        ],
      },
      {
        id: "partners-program",
        label: "Partner Program",
        icon: "gem",
        accent: "#25D9C7",
        files: [
          {
            id: "reseller-program",
            icon: "handshake",
            title: "Reseller Program",
            tag: "Needs Content",
            summary:
              "Information about Vectrae's reseller and channel partner program.",
            body: "Awaiting partner program documentation from the client team.",
          },
          {
            id: "become-partner",
            icon: "send",
            title: "Become a Partner",
            tag: "CTA",
            summary:
              "Enterprises and technology companies interested in partnering with Vectrae.",
            body: "Contact enquiry@vectrae.com to discuss partnership opportunities.",
            action: { label: "Contact Us", href: "mailto:enquiry@vectrae.com" },
          },
        ],
      },
    ],
  },

  // ─── Gallery ──────────────────────────────────────────────────────────────
  {
    id: "gallery-page",
    label: "Gallery",
    icon: "monitorPlay",
    accent: "#29B9F2",
    files: [],
    subFolders: [
      {
        id: "gallery-installations",
        label: "Project Installations",
        icon: "layoutGrid",
        accent: "#29B9F2",
        files: [
          {
            id: "gallery-av",
            icon: "monitorPlay",
            title: "AV Installations",
            tag: "Audio Visual",
            summary:
              "Boardrooms, conference rooms, auditoriums, and command centre AV deployments.",
            body: "Awaiting project photography from the client team. Please share high-resolution images of completed AV installations.",
          },
          {
            id: "gallery-dc",
            icon: "server",
            title: "Data Center Projects",
            tag: "Infrastructure",
            summary:
              "Greenfield and brownfield data center builds, rack deployments, and cooling installations.",
            body: "Awaiting project photography from the client team.",
          },
          {
            id: "gallery-network",
            icon: "network",
            title: "Networking Projects",
            tag: "Network Infrastructure",
            summary:
              "Structured cabling, wireless access point deployments, and network operations centre setups.",
            body: "Awaiting project photography from the client team.",
          },
        ],
      },
      {
        id: "gallery-office",
        label: "Office & Workspace",
        icon: "briefcase",
        accent: "#29B9F2",
        files: [
          {
            id: "gallery-hq",
            icon: "mapPin",
            title: "Headquarters",
            tag: "New Delhi HQ",
            summary:
              "A-16/B-1 Extension, Mohan Co-Op, Industrial Estate, New Delhi - 110044.",
            body: "Office and workspace photography. Awaiting assets from the client team.",
          },
          {
            id: "gallery-team",
            icon: "users",
            title: "Team & Culture",
            tag: "People",
            summary:
              "Behind-the-scenes look at Vectrae's 300+ technology professionals.",
            body: "Team photography and culture content. Awaiting assets from the client team.",
          },
        ],
      },
      {
        id: "gallery-events",
        label: "Events & Exhibitions",
        icon: "sparkles",
        accent: "#29B9F2",
        files: [
          {
            id: "gallery-trade-shows",
            icon: "globe2",
            title: "Trade Shows",
            tag: "Events",
            summary:
              "Vectrae's presence at industry trade shows and technology exhibitions across India.",
            body: "Awaiting event photography and exhibition documentation from the client team.",
          },
          {
            id: "gallery-client-events",
            icon: "handshake",
            title: "Client Events",
            tag: "Enterprise",
            summary:
              "Product launches, client briefings, and technology demonstration events.",
            body: "Awaiting event photography from the client team.",
          },
        ],
      },
    ],
  },

  // ─── Careers ──────────────────────────────────────────────────────────────
  {
    id: "careers-page",
    label: "Careers",
    icon: "briefcase",
    accent: "#B6D93B",
    files: [],
    subFolders: [
      {
        id: "careers-openings",
        label: "Open Positions",
        icon: "layoutGrid",
        accent: "#B6D93B",
        files: [
          {
            id: "job-av-engineer",
            icon: "monitorPlay",
            title: "AV Systems Engineer",
            tag: "Audio Visual",
            summary:
              "Design, install, and commission AV systems for enterprise clients across India.",
            body: "Seeking certified AV engineers with experience in Crestron, Extron, QSC, or equivalent platforms. CTS certification preferred.",
            meta: [
              { label: "Location", value: "New Delhi / PAN-India" },
              { label: "Experience", value: "3–7 Years" },
              { label: "Type", value: "Full-Time" },
            ],
            action: {
              label: "Apply Now",
              href: "mailto:Hr@vectrae.com?subject=Application: AV Systems Engineer",
            },
          },
          {
            id: "job-network-engineer",
            icon: "network",
            title: "Network & Security Engineer",
            tag: "Networking",
            summary:
              "Design and deploy enterprise networking, firewall, and wireless solutions for Fortune 500 clients.",
            body: "Seeking CCNA/CCNP or equivalent certified engineers with hands-on Cisco, Palo Alto, or Fortinet experience.",
            meta: [
              { label: "Location", value: "New Delhi / PAN-India" },
              { label: "Experience", value: "3–6 Years" },
              { label: "Type", value: "Full-Time" },
            ],
            action: {
              label: "Apply Now",
              href: "mailto:Hr@vectrae.com?subject=Application: Network Engineer",
            },
          },
          {
            id: "job-sales-enterprise",
            icon: "send",
            title: "Enterprise Sales Manager",
            tag: "Sales",
            summary:
              "Drive enterprise technology sales across AV, Networking, and Data Center verticals.",
            body: "Seeking experienced B2B technology sales professionals with an enterprise client network in India.",
            meta: [
              { label: "Location", value: "New Delhi / Mumbai / Bangalore" },
              { label: "Experience", value: "5–10 Years" },
              { label: "Type", value: "Full-Time" },
            ],
            action: {
              label: "Apply Now",
              href: "mailto:Hr@vectrae.com?subject=Application: Enterprise Sales Manager",
            },
          },
          {
            id: "job-project-manager",
            icon: "userCog",
            title: "Project Manager",
            tag: "Delivery",
            summary:
              "Lead end-to-end technology project delivery for enterprise clients across India.",
            body: "Seeking PMP-certified project managers with experience managing complex, multi-site enterprise technology deployments.",
            meta: [
              { label: "Location", value: "New Delhi" },
              { label: "Experience", value: "4–8 Years" },
              { label: "Type", value: "Full-Time" },
            ],
            action: {
              label: "Apply Now",
              href: "mailto:Hr@vectrae.com?subject=Application: Project Manager",
            },
          },
        ],
      },
      {
        id: "careers-culture",
        label: "Life at Vectrae",
        icon: "sparkles",
        accent: "#B6D93B",
        files: [
          {
            id: "culture-overview",
            icon: "users",
            title: "Our Culture",
            tag: "Work Environment",
            summary:
              "A collaborative, growth-focused culture where technology professionals thrive.",
            body: "At Vectrae, our team of 300+ experts works on some of India's most complex enterprise technology projects. We invest in continuous learning, OEM certifications, and career development.",
          },
          {
            id: "culture-values",
            icon: "gem",
            title: "Core Values",
            tag: "What We Stand For",
            summary:
              "Integrity · Excellence · Partnership · Innovation · Accountability",
            body: "These five values guide every decision, every project, and every client interaction at Vectrae.",
          },
        ],
      },
      {
        id: "careers-benefits",
        label: "Benefits & Perks",
        icon: "packageCheck",
        accent: "#B6D93B",
        files: [
          {
            id: "benefits-list",
            icon: "shieldCheck",
            title: "Employee Benefits",
            tag: "Needs Client Input",
            summary:
              "Health insurance, OEM certification sponsorship, performance bonuses, and flexible work.",
            body: "Awaiting finalised benefits documentation from the HR team.",
          },
        ],
      },
      {
        id: "careers-apply",
        label: "How to Apply",
        icon: "send",
        accent: "#B6D93B",
        files: [
          {
            id: "apply-process",
            icon: "fileText",
            title: "Application Process",
            tag: "3 Steps",
            summary:
              "Submit your CV → Technical Interview → HR Discussion → Offer",
            body: "Send your CV and a brief cover note to enquiry@vectrae.com with the role in the subject line. Our HR team typically responds within 5 business days.",
            meta: [
              { label: "Step 1", value: "Submit CV & Cover Note" },
              { label: "Step 2", value: "Technical Interview" },
              { label: "Step 3", value: "HR Discussion & Offer" },
            ],
            action: {
              label: "Send Application",
              href: "mailto:Hr@vectrae.com?subject=Job Application",
            },
          },
        ],
      },
    ],
  },

  // ─── Testimonials ─────────────────────────────────────────────────────────
  {
    id: "testimonials-page",
    label: "Testimonials",
    icon: "users",
    accent: "#25D9C7",
    files: [],
    subFolders: [
      {
        id: "testimonials-client",
        label: "Client Reviews",
        icon: "handshake",
        accent: "#25D9C7",
        files: [
          {
            id: "testimonial-1",
            icon: "users",
            title: "Enterprise Client, IT Head",
            tag: "Needs Client Input",
            summary:
              '"Vectrae delivered our 40-room AV upgrade on time and within budget. Their post-sales support is outstanding."',
            body: "Awaiting verified testimonial quotes with client name, title, company, and approval to publish. Please do not use placeholder quotes on the live site.",
          },
          {
            id: "testimonial-2",
            icon: "users",
            title: "Fortune 500, CIO",
            tag: "Needs Client Input",
            summary:
              '"Their single-window approach saved us months of coordination across multiple vendors."',
            body: "Awaiting verified testimonial quotes with client name, title, company, and approval to publish.",
          },
          {
            id: "testimonial-3",
            icon: "users",
            title: "BFSI Enterprise, IT Manager",
            tag: "Needs Client Input",
            summary:
              "\"We've worked with Vectrae for over 8 years. They're our go-to partner for all enterprise technology.\"",
            body: "Awaiting verified testimonial quotes with client name, title, company, and approval to publish.",
          },
        ],
      },
      {
        id: "testimonials-case-studies",
        label: "Case Studies",
        icon: "fileText",
        accent: "#25D9C7",
        files: [
          {
            id: "case-study-av",
            icon: "monitorPlay",
            title: "Enterprise AV Transformation",
            tag: "Case Study",
            summary:
              "How Vectrae unified AV across 120 meeting rooms for a Fortune 500 client.",
            body: "Full case study content to be drafted. Required: project scope, challenge, solution, outcome, and client quote. Awaiting client approval.",
            meta: [
              { label: "Industry", value: "BFSI" },
              { label: "Scope", value: "120 Meeting Rooms" },
              { label: "Status", value: "Awaiting Content" },
            ],
          },
          {
            id: "case-study-dc",
            icon: "server",
            title: "Greenfield Data Center Build",
            tag: "Case Study",
            summary:
              "End-to-end data center design and deployment for a pan-India logistics enterprise.",
            body: "Full case study content to be drafted. Required: project scope, challenge, solution, outcome, and client quote. Awaiting client approval.",
            meta: [
              { label: "Industry", value: "Logistics" },
              { label: "Scope", value: "Greenfield DC" },
              { label: "Status", value: "Awaiting Content" },
            ],
          },
        ],
      },
      {
        id: "testimonials-metrics",
        label: "Success Metrics",
        icon: "database",
        accent: "#25D9C7",
        files: [
          {
            id: "success-numbers",
            icon: "zap",
            title: "Impact Numbers",
            tag: "Proof Points",
            summary:
              "2,300+ enterprises served · 98%+ project delivery on time · 4-hour response SLA",
            body: "These metrics underpin Vectrae's reputation as a reliable enterprise technology partner. Specific client-facing impact numbers to be verified with the client team.",
            meta: [
              { label: "Enterprises Served", value: "2,300+" },
              { label: "On-Time Delivery", value: "98%+" },
              { label: "Response SLA", value: "4 Business Hours" },
              { label: "Repeat Client Rate", value: "Awaiting Data" },
            ],
          },
        ],
      },
    ],
  },

  // ─── Blogs ────────────────────────────────────────────────────────────────
  {
    id: "blogs-page",
    label: "Blogs",
    icon: "newspaper",
    accent: "#84D96C",
    files: [],
    subFolders: [
      {
        id: "blogs-av",
        label: "AV & Collaboration",
        icon: "monitorPlay",
        accent: "#84D96C",
        files: [
          {
            id: "blog-av-2026",
            icon: "monitorPlay",
            title:
              "Top 10 AV Technologies for Enterprise Meeting Rooms in 2026",
            tag: "Audio Visual",
            summary:
              "A rundown of the AV upgrades enterprises are prioritizing this year.",
            body: "Covers everything from AI-framing cameras to acoustic fencing for open-plan boardrooms.",
            meta: [
              { label: "Published", value: "March 12, 2026" },
              { label: "Read Time", value: "6 min" },
            ],
            action: { label: "Read Article", href: "/blog/av-tech-2026" },
          },
          {
            id: "blog-teams-zoom",
            icon: "network",
            title:
              "Microsoft Teams Rooms vs Zoom Rooms, Which Is Right for Your Enterprise?",
            tag: "Collaboration",
            summary:
              "A side-by-side comparison for enterprises standardizing their meeting room platform.",
            body: "Weighs licensing, hardware compatibility, and admin overhead across both platforms.",
            meta: [
              { label: "Published", value: "March 02, 2026" },
              { label: "Read Time", value: "8 min" },
            ],
            action: { label: "Read Article", href: "/blog/teams-vs-zoom" },
          },
        ],
      },
      {
        id: "blogs-network",
        label: "Networking & Security",
        icon: "shieldCheck",
        accent: "#84D96C",
        files: [
          {
            id: "blog-network-security",
            icon: "shieldCheck",
            title: "5 Signs Your Enterprise Network Needs a Security Overhaul",
            tag: "Networking & Security",
            summary:
              "Warning signs that your current network architecture is due for a zero-trust review.",
            body: "From flat VLANs to unmanaged BYOD access, the red flags our security engineers see most often.",
            meta: [
              { label: "Published", value: "February 18, 2026" },
              { label: "Read Time", value: "5 min" },
            ],
            action: { label: "Read Article", href: "/blog/network-security" },
          },
        ],
      },
      {
        id: "blogs-datacenter",
        label: "Data Centers",
        icon: "server",
        accent: "#84D96C",
        files: [
          {
            id: "blog-dc-decision",
            icon: "database",
            title: "Greenfield vs Brownfield Data Center, Decision Guide",
            tag: "Data Center",
            summary:
              "A framework for deciding between a new build and modernizing an existing facility.",
            body: "Compares total cost of ownership, timeline, and risk between the two approaches.",
            meta: [
              { label: "Published", value: "February 10, 2026" },
              { label: "Read Time", value: "9 min" },
            ],
            action: { label: "Read Article", href: "/blog/dc-decision" },
          },
        ],
      },
      {
        id: "blogs-power",
        label: "Power Solutions",
        icon: "zap",
        accent: "#84D96C",
        files: [
          {
            id: "blog-ups",
            icon: "zap",
            title: "How to Choose the Right UPS for Your Data Center",
            tag: "Power Solutions",
            summary:
              "A buyer's guide to sizing and specifying UPS systems for critical infrastructure.",
            body: "Covers load calculation, runtime planning, and the tradeoffs between line-interactive and online UPS.",
            meta: [
              { label: "Published", value: "February 25, 2026" },
              { label: "Read Time", value: "7 min" },
            ],
            action: { label: "Read Article", href: "/blog/choose-ups" },
          },
        ],
      },
      {
        id: "blogs-managed-it",
        label: "Managed IT",
        icon: "headset",
        accent: "#84D96C",
        files: [
          {
            id: "blog-managed-it",
            icon: "headset",
            title: "Why Every Enterprise Needs a Managed IT Services Provider",
            tag: "Managed Services",
            summary:
              "The case for proactive AMC and remote monitoring over reactive break-fix support.",
            body: "Explores the hidden cost of downtime and how a managed helpdesk shifts IT from reactive to proactive.",
            meta: [
              { label: "Published", value: "March 08, 2026" },
              { label: "Read Time", value: "5 min" },
            ],
            action: { label: "Read Article", href: "/blog/managed-it" },
          },
        ],
      },
    ],
  },
];

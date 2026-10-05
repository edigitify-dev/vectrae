import { r2Asset } from "@/lib/site-images";
export type PartnerLogo = {
  name: string;
  logo?: string;
};

export const priorityPartnerLogos: PartnerLogo[] = [
  { name: "Cisco", logo: r2Asset("/images/oem/netSec/cisco.webp") },
  { name: "Microsoft", logo: r2Asset("/images/oem/endCom/microsoft.webp") },
  { name: "Lenovo", logo: r2Asset("/images/oem/endCom/lenovo.webp") },
  { name: "Dell", logo: r2Asset("/images/oem/endCom/dell.webp") },
  { name: "HP", logo: r2Asset("/images/oem/endCom/hp.webp") },
  { name: "Crestron", logo: r2Asset("/images/oem/AV/crestron.webp") },
  {
    name: "Palo Alto Networks",
    logo: r2Asset("/images/oem/netSec/paloalto.webp"),
  },
  {
    name: "APC by Schneider Electric",
    logo: r2Asset("/images/oem/endCom/apc.webp"),
  },
  { name: "Fortinet", logo: r2Asset("/images/oem/netSec/fortinet.webp") },
  { name: "Samsung", logo: r2Asset("/images/oem/endCom/samsung.webp") },
  { name: "Bosch", logo: r2Asset("/images/oem/AV/bosch.webp") },
  { name: "Harman", logo: r2Asset("/images/oem/AV/harman.webp") },
  { name: "QSC", logo: r2Asset("/images/oem/AV/qsc.webp") },
];

export const partnersByCategory: Record<string, PartnerLogo[]> = {
  "AV & Collaboration": [
    { name: "Crestron", logo: r2Asset("/images/oem/AV/crestron.webp") },
    { name: "Extron", logo: r2Asset("/images/oem/AV/extron.webp") },
    { name: "Kramer", logo: r2Asset("/images/oem/AV/kramer.webp") },
    { name: "Key Digital", logo: r2Asset("/images/oem/AV/keyDigital.webp") },
    { name: "Aurora", logo: r2Asset("/images/oem/AV/aurora.webp") },
    { name: "ATEN", logo: r2Asset("/images/oem/AV/aten.webp") },
    { name: "Lightware", logo: r2Asset("/images/oem/AV/lightware.webp") },
    { name: "AMX by Harman", logo: r2Asset("/images/oem/AV/amx.webp") },
    { name: "Atlona", logo: r2Asset("/images/oem/AV/atlona.webp") },
    { name: "Altafron", logo: r2Asset("/images/oem/AV/altron.webp") },
    { name: "Biamp", logo: r2Asset("/images/oem/AV/biamp.webp") },
    { name: "QSC", logo: r2Asset("/images/oem/AV/qsc.webp") },
    { name: "Harman", logo: r2Asset("/images/oem/AV/harman.webp") },
    { name: "Prysm", logo: r2Asset("/images/oem/AV/prysm.webp") },
    { name: "Bosch", logo: r2Asset("/images/oem/AV/bosch.webp") },
    { name: "Sennheiser", logo: r2Asset("/images/oem/AV/sennheiser.webp") },
    {
      name: "Audio-Technica",
      logo: r2Asset("/images/oem/AV/audioTechnica.webp"),
    },
    { name: "Poly", logo: r2Asset("/images/oem/AV/poly.webp") },
    { name: "Jabra", logo: r2Asset("/images/oem/AV/jabra.webp") },
    { name: "Yealink", logo: r2Asset("/images/oem/AV/yealink.webp") },
    { name: "Huddly", logo: r2Asset("/images/oem/AV/huddly.webp") },
    { name: "Epson", logo: r2Asset("/images/oem/AV/epson.webp") },
  ],
  "Cyber Security & Networking": [
    {
      name: "Palo Alto Networks",
      logo: r2Asset("/images/oem/netSec/paloalto.webp"),
    },
    { name: "Fortinet", logo: r2Asset("/images/oem/netSec/fortinet.webp") },
    { name: "SonicWall", logo: r2Asset("/images/oem/netSec/sonicwall.webp") }, //
    { name: "Sophos", logo: r2Asset("/images/oem/netSec/sophos.webp") },
    {
      name: "CrowdStrike",
      logo: r2Asset("/images/oem/netSec/crowdstrike.webp"), //
    },
    { name: "Forcepoint", logo: r2Asset("/images/oem/netSec/forcepoint.webp") },
    {
      name: "SentinelOne",
      logo: r2Asset("/images/oem/netSec/sentinelOne.webp"),
    },
    { name: "Trellix", logo: r2Asset("/images/oem/netSec/trellix.webp") },
    { name: "RSA", logo: r2Asset("/images/oem/netSec/rsa.webp") },
    { name: "Commvault", logo: r2Asset("/images/oem/netSec/commvault.webp") },
    { name: "Acronis", logo: r2Asset("/images/oem/netSec/acronis.webp") },
    { name: "HPE", logo: r2Asset("/images/oem/netSec/hpe.webp") },
    { name: "Cisco", logo: r2Asset("/images/oem/netSec/cisco.webp") },
    { name: "Arista", logo: r2Asset("/images/oem/netSec/arista.webp") },
    {
      name: "Extreme Networks",
      logo: r2Asset("/images/oem/netSec/extremeNetworks.webp"),
    },
    { name: "Quantum", logo: r2Asset("/images/oem/netSec/quantum.webp") },
    { name: "TP-Link", logo: r2Asset("/images/oem/netSec/tpLink.webp") },
    { name: "D-Link", logo: r2Asset("/images/oem/netSec/dLink.webp") },
    { name: "CommScope", logo: r2Asset("/images/oem/netSec/commscope.webp") },
    { name: "Netrack", logo: r2Asset("/images/oem/netSec/netrack.webp") },
  ],
  "End Computing & Power": [
    { name: "Lenovo", logo: r2Asset("/images/oem/endCom/lenovo.webp") },
    { name: "Dell", logo: r2Asset("/images/oem/endCom/dell.webp") },
    { name: "HP", logo: r2Asset("/images/oem/endCom/hp.webp") },
    { name: "Acer", logo: r2Asset("/images/oem/endCom/acer.webp") },
    { name: "Microsoft", logo: r2Asset("/images/oem/endCom/microsoft.webp") },
    { name: "Samsung", logo: r2Asset("/images/oem/endCom/samsung.webp") },
    { name: "LG", logo: r2Asset("/images/oem/endCom/lg.webp") },
    { name: "Sony", logo: r2Asset("/images/oem/endCom/sony.webp") },
    { name: "Philips", logo: r2Asset("/images/oem/endCom/philips.webp") },
    { name: "Logitech", logo: r2Asset("/images/oem/endCom/logitech.webp") },
    { name: "3M", logo: r2Asset("/images/oem/endCom/3m.webp") },
    { name: "Kensington", logo: r2Asset("/images/oem/endCom/kensington.webp") },
    { name: "Targus", logo: r2Asset("/images/oem/endCom/targus.webp") },
    {
      name: "APC by Schneider Electric",
      logo: r2Asset("/images/oem/endCom/apc.webp"),
    },
    {
      name: "Schneider Electric",
      logo: r2Asset("/images/oem/endCom/schneider.webp"),
    },
  ],
};

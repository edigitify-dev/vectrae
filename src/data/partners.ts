export type PartnerLogo = {
  name: string;
  logo?: string;
};

export const priorityPartnerLogos: PartnerLogo[] = [
  { name: "Cisco", logo: "/images/oem/netSec/cisco.webp" },
  { name: "Microsoft", logo: "/images/oem/endCom/microsoft.webp" },
  { name: "Lenovo", logo: "/images/oem/endCom/lenovo.webp" },
  { name: "Dell", logo: "/images/oem/endCom/dell.webp" },
  { name: "HP", logo: "/images/oem/endCom/hp.webp" },
  { name: "Crestron", logo: "/images/oem/AV/crestron.webp" },
  { name: "Palo Alto Networks", logo: "/images/oem/netSec/paloalto.webp" },
  {
    name: "APC by Schneider Electric",
    logo: "/images/oem/endCom/apc.webp",
  },
  { name: "Fortinet", logo: "/images/oem/netSec/fortinet.webp" },
  { name: "Samsung", logo: "/images/oem/endCom/samsung.webp" },
  { name: "Bosch", logo: "/images/oem/AV/bosch.webp" },
  { name: "Harman", logo: "/images/oem/AV/harman.webp" },
  { name: "QSC", logo: "/images/oem/AV/qsc.webp" },
];

export const partnersByCategory: Record<string, PartnerLogo[]> = {
  "AV & Collaboration": [
    { name: "Crestron", logo: "/images/oem/AV/crestron.webp" },
    { name: "Extron", logo: "/images/oem/AV/extron.webp" },
    { name: "Kramer", logo: "/images/oem/AV/kramer.webp" },
    { name: "Key Digital", logo: "/images/oem/AV/keyDigital.webp" },
    { name: "Aurora", logo: "/images/oem/AV/aurora.webp" },
    { name: "ATEN", logo: "/images/oem/AV/aten.webp" },
    { name: "Lightware", logo: "/images/oem/AV/lightware.webp" },
    { name: "AMX by Harman", logo: "/images/oem/AV/amx.webp" },
    { name: "Atlona", logo: "/images/oem/AV/atlona.webp" },
    { name: "Altafron", logo: "/images/oem/AV/altron.webp" },
    { name: "Biamp", logo: "/images/oem/AV/biamp.webp" },
    { name: "QSC", logo: "/images/oem/AV/qsc.webp" },
    { name: "Harman", logo: "/images/oem/AV/harman.webp" },
    { name: "Prysm", logo: "/images/oem/AV/prysm.webp" },
    { name: "Bosch", logo: "/images/oem/AV/bosch.webp" },
    { name: "Sennheiser", logo: "/images/oem/AV/sennheiser.webp" },
    { name: "Audio-Technica", logo: "/images/oem/AV/audioTechnica.webp" },
    { name: "Poly", logo: "/images/oem/AV/poly.webp" },
    { name: "Jabra", logo: "/images/oem/AV/jabra.webp" },
    { name: "Yealink", logo: "/images/oem/AV/yealink.webp" },
    { name: "Huddly", logo: "/images/oem/AV/huddly.webp" },
    { name: "Epson", logo: "/images/oem/AV/epson.webp" },
  ],
  "Networking & Security": [
    { name: "Cisco", logo: "/images/oem/netSec/cisco.webp" },
    { name: "Palo Alto Networks", logo: "/images/oem/netSec/paloalto.webp" },
    { name: "Fortinet", logo: "/images/oem/netSec/fortinet.webp" },
    { name: "Sophos", logo: "/images/oem/netSec/sophos.webp" },
    { name: "McAfee", logo: "/images/oem/netSec/mcAfee.webp" },
    { name: "D-Link", logo: "/images/oem/netSec/dLink.webp" },
    { name: "CommScope", logo: "/images/oem/netSec/commscope.webp" },
  ],
  "End Computing & Power": [
    { name: "Lenovo", logo: "/images/oem/endCom/lenovo.webp" },
    { name: "Dell", logo: "/images/oem/endCom/dell.webp" },
    { name: "HP", logo: "/images/oem/endCom/hp.webp" },
    { name: "Acer", logo: "/images/oem/endCom/acer.webp" },
    { name: "Microsoft", logo: "/images/oem/endCom/microsoft.webp" },
    { name: "Samsung", logo: "/images/oem/endCom/samsung.webp" },
    { name: "LG", logo: "/images/oem/endCom/lg.webp" },
    { name: "Sony", logo: "/images/oem/endCom/sony.webp" },
    { name: "Philips", logo: "/images/oem/endCom/philips.webp" },
    { name: "Logitech", logo: "/images/oem/endCom/logitech.webp" },
    { name: "3M", logo: "/images/oem/endCom/3m.webp" },
    { name: "Kensington", logo: "/images/oem/endCom/kensington.webp" },
    { name: "Targus", logo: "/images/oem/endCom/targus.webp" },
    {
      name: "APC by Schneider Electric",
      logo: "/images/oem/endCom/apc.webp",
    },
    { name: "Schneider Electric", logo: "/images/oem/endCom/schneider.webp" },
  ],
};

import { Download } from "lucide-react";
import { getCompanyProfile } from "@/lib/r2";

export default async function CompanyProfileDownload() {
  try {
    if (!(await getCompanyProfile())) return null;
  } catch (error) {
    console.error("[about/company-profile] Couldn't load profile:", error);
    return null;
  }

  return (
    <a
      href="/company-profile"
      download
      className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#10bea7]/40 bg-[#10bea7]/10 px-5 py-3 text-sm font-semibold text-[#10bea7] transition-colors hover:bg-[#10bea7]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#10bea7]"
    >
      <Download className="h-4 w-4" aria-hidden />
      Download Company Profile
      <span className="text-xs font-normal text-neutral-400">PDF</span>
    </a>
  );
}

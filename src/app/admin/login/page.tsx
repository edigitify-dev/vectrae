import { r2Asset } from "@/lib/site-images";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { BRAND_GRADIENT, NOISE_BG_URL } from "@/lib/brand";

type Props = {
  searchParams: Promise<{ next?: string; changed?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next, changed } = await searchParams;

  // Verify the session in the database before redirecting; the proxy only
  // checks token format, so expired or revoked cookies can still reach here.
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect(next && next.startsWith("/admin") ? next : "/admin");
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      {/* Ambient brand wash — decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#29B9F2]/12 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG_URL }}
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src={r2Asset("/logo.png")} alt="Vectrae" width={112} height={28} className="h-7 w-auto" priority />
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm sm:p-9">
          <span
            className="inline-block h-1 w-12 rounded-full"
            style={{ backgroundImage: BRAND_GRADIENT }}
            aria-hidden
          />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">Admin console</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Sign in to review enquiries, candidate applications, and the blog.
          </p>

          {changed && (
            <p
              role="status"
              className="mt-6 flex items-start gap-2 rounded-xl border border-[#84D96C]/30 bg-[#84D96C]/10 px-4 py-3 text-sm text-[#b6e8a5]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Password updated. Sign in again with your new password.
            </p>
          )}

          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          Authorised personnel only. All actions are attributed to your account.
        </p>
      </div>
    </main>
  );
}

import path from "path";
import type { NextConfig } from "next";
import { siteImages } from "./src/lib/site-images";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

// Blog cover images uploaded through the admin panel live in Cloudflare R2.
// Allow only the site's asset bucket and the explicitly configured R2 host.
// A wildcard would let anyone ask our optimizer to fetch arbitrary R2 buckets.
const r2RemotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: new URL(siteImages.aboutBg).hostname },
];

if (process.env.R2_PUBLIC_URL) {
  try {
    const { protocol, hostname } = new URL(process.env.R2_PUBLIC_URL);
    if (protocol !== "https:") throw new Error("R2 images require HTTPS.");
    r2RemotePatterns.push({
      protocol: protocol.replace(":", "") as "https" | "http",
      hostname,
    });
  } catch {
    console.warn(
      "[next.config] R2_PUBLIC_URL is not a valid URL, ignoring it.",
    );
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const adminHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
    ];
    return [
      { source: "/:path*", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }] },
      { source: "/admin/:path*", headers: adminHeaders },
      { source: "/api/admin/:path*", headers: adminHeaders },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
  // Allow opening the dev server from other devices on the LAN
  allowedDevOrigins: ["192.168.1.8"],
  images: {
    remotePatterns: r2RemotePatterns,
  },
  async redirects() {
    return [
      { source: "/services", destination: "/solutions", permanent: true },
      {
        source: "/services/boardroom-av",
        destination: "/solutions/av-solutions",
        permanent: true,
      },
      {
        source: "/services/networking-wifi",
        destination: "/solutions/networking-security",
        permanent: true,
      },
      {
        source: "/services/data-center-security",
        destination: "/solutions/data-center",
        permanent: true,
      },
      {
        source: "/services/end-computing",
        destination: "/solutions/end-computing",
        permanent: true,
      },
      {
        source: "/services/it-spares",
        destination: "/solutions/it-spares-accessories",
        permanent: true,
      },
      {
        source: "/services/:slug*",
        destination: "/solutions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

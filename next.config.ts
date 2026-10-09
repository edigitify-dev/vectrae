import path from "path";
import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

// Blog cover images uploaded through the admin panel live in Cloudflare R2.
// Always allow the default `r2.dev` dev subdomain, plus the exact host from
// R2_PUBLIC_URL when a custom domain is configured instead.
const r2RemotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "*.r2.dev" },
];

if (process.env.R2_PUBLIC_URL) {
  try {
    const { protocol, hostname } = new URL(process.env.R2_PUBLIC_URL);
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

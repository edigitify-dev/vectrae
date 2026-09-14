/**
 * Static content images, served directly from Cloudflare R2 (not through
 * Vercel's image pipeline — every reference to these needs `unoptimized` on
 * `next/image`, or a plain `<img>`/CSS `url()`, so the browser fetches bytes
 * straight from R2 and Vercel never re-serves them).
 *
 * Re-run `npm run migrate:images` after replacing a source file in
 * `public/images/` or the root-level assets it covers; the keys here must
 * then be updated to match its printed mapping.
 */

const R2_BASE = "https://pub-9e9d29d15e3c4dbfbded10ae4d8b9ebf.r2.dev/site";

export const siteImages = {
  aboutBg: `${R2_BASE}/images/about-bg.webp`,
  wcuSolutions: `${R2_BASE}/images/wcu/solutions.webp`,
  workspaceWallpaper: `${R2_BASE}/workspace-wallpaper.webp`,
  indiaMap: `${R2_BASE}/india-map.svg`,
  indiaMapNetwork: "/map.png",
  blog: {
    avTech: `${R2_BASE}/images/blog/av-tech.webp`,
    managedIt: `${R2_BASE}/images/blog/managed-it.webp`,
    teamsZoom: `${R2_BASE}/images/blog/teams-zoom.webp`,
  },
  products: {
    desktop: `${R2_BASE}/images/products/desktop.webp`,
    laptop: `${R2_BASE}/images/products/laptop.webp`,
    motherboard: `${R2_BASE}/images/products/motherboard.webp`,
    powerSupply: `${R2_BASE}/images/products/power-supply.webp`,
    router: `${R2_BASE}/images/products/router.webp`,
    serverRam: `${R2_BASE}/images/products/server-ram.webp`,
  },
} as const;

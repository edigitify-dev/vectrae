/**
 * One-time migration of the site's static content images into Cloudflare R2,
 * so they're served directly by R2 (zero egress fees) instead of through
 * Vercel. Raster images are re-encoded as WebP; the one SVG is uploaded as-is
 * (vector, no format conversion).
 *
 * Part 2 applies the same recipe to EVERY other image in public/:
 * PNG/JPG -> WebP (same relative path, .webp extension), SVG/WebP/GIF as-is,
 * all under site/<same path>. The code side maps "/images/x.png" to the WebP
 * URL through r2Asset() in src/lib/site-images.ts.
 * LOCAL FILES ALWAYS WIN: if R2 already has the same key with different
 * content it is overwritten; identical files are skipped.
 * If code references a path with different letter-case than the file on disk
 * (works on Windows, 404s on Linux/R2), the file is also uploaded under the
 * exact name the code asks for.
 *
 *   npm run migrate:images           upload for real
 *   npm run migrate:images -- --dry  convert + report only, nothing is uploaded
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const DRY = process.argv.includes("--dry");
const WEBP_QUALITY = 82;
const MAX_DIMENSION = 2000;

// [local path relative to repo root, R2 key]
const RASTER_IMAGES: [string, string][] = [
  ["public/images/about-bg.png", "site/images/about-bg.webp"],
  ["public/images/blog/av-tech.png", "site/images/blog/av-tech.webp"],
  ["public/images/blog/managed-it.png", "site/images/blog/managed-it.webp"],
  ["public/images/blog/teams-zoom.png", "site/images/blog/teams-zoom.webp"],
  ["public/images/products/desktop.png", "site/images/products/desktop.webp"],
  ["public/images/products/laptop.png", "site/images/products/laptop.webp"],
  [
    "public/images/products/motherboard.png",
    "site/images/products/motherboard.webp",
  ],
  [
    "public/images/products/power-supply.png",
    "site/images/products/power-supply.webp",
  ],
  ["public/images/products/router.png", "site/images/products/router.webp"],
  [
    "public/images/products/server-ram.png",
    "site/images/products/server-ram.webp",
  ],
  ["public/images/sample_about_us.png", "site/images/sample_about_us.webp"],
  ["public/images/wcu/solutions.png", "site/images/wcu/solutions.webp"],
  ["public/workspace-wallpaper.jpg", "site/workspace-wallpaper.webp"],
];

const VECTOR_IMAGES: [string, string][] = [
  ["public/india-map.svg", "site/india-map.svg"],
];

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

// Stay on the app server, not R2
const KEEP_LOCAL = new Set(["cursor-original.png", "favicon.ico"]);

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    if ((await stat(full)).isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

async function toWebp(original: Buffer): Promise<Buffer> {
  const image = sharp(original).rotate();
  const metadata = await image.metadata();
  const resized =
    metadata.width && metadata.width > MAX_DIMENSION
      ? image.resize({ width: MAX_DIMENSION, withoutEnlargement: true })
      : image;
  return resized.webp({ quality: WEBP_QUALITY }).toBuffer();
}

/** Upload `body` to `key` unless R2 already holds byte-identical content. */
async function putIfChanged(
  s3: S3Client,
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string,
): Promise<"uploaded" | "replaced" | "unchanged"> {
  const md5 = createHash("md5").update(body).digest("hex");
  let existed = false;

  try {
    const head = await s3.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );
    existed = true;
    if ((head.ETag ?? "").replace(/"/g, "") === md5) return "unchanged";
  } catch {
    // not found -> upload
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // not "immutable": same-name files can change, so let caches revalidate daily
      CacheControl: "public, max-age=86400",
    }),
  );
  return existed ? "replaced" : "uploaded";
}

function client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

async function main() {
  const required = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
  ];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0 && !DRY) {
    throw new Error(
      `Missing env vars: ${missing.join(", ")}. Run \`vercel env pull .env.local\` first.`,
    );
  }

  const s3 = DRY
    ? ({ send: async () => ({}) } as unknown as S3Client)
    : client();
  const bucket = process.env.R2_BUCKET_NAME ?? "dry-run";
  const publicBase = (
    process.env.R2_PUBLIC_URL ?? "https://dry-run.invalid"
  ).replace(/\/+$/, "");
  const mapping: Record<string, string> = {};

  let totalBefore = 0;
  let totalAfter = 0;

  console.log(
    `Converting and uploading ${RASTER_IMAGES.length} raster images…\n`,
  );

  for (const [localPath, key] of RASTER_IMAGES) {
    if (!existsSync(path.resolve(localPath))) {
      console.log(
        `  skip (no local file, keeping what is on R2): ${localPath}`,
      );
      continue;
    }
    const original = await readFile(path.resolve(localPath));
    const image = sharp(original).rotate(); // .rotate() with no args auto-orients from EXIF, then strips it
    const metadata = await image.metadata();

    const resized =
      metadata.width && metadata.width > MAX_DIMENSION
        ? image.resize({ width: MAX_DIMENSION, withoutEnlargement: true })
        : image;

    const converted = await resized.webp({ quality: WEBP_QUALITY }).toBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: converted,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const url = `${publicBase}/${key}`;
    mapping[`/${localPath.replace(/^public\//, "")}`] = url;

    const before = original.length;
    const after = converted.length;
    totalBefore += before;
    totalAfter += after;

    const savedPct = Math.round((1 - after / before) * 100);
    console.log(
      `  ${localPath} (${(before / 1024).toFixed(0)}KB) -> ${key} (${(after / 1024).toFixed(0)}KB, -${savedPct}%)`,
    );
  }

  console.log(`\nUploading ${VECTOR_IMAGES.length} vector image(s) as-is…\n`);

  for (const [localPath, key] of VECTOR_IMAGES) {
    if (!existsSync(path.resolve(localPath))) {
      console.log(
        `  skip (no local file, keeping what is on R2): ${localPath}`,
      );
      continue;
    }
    const original = await readFile(path.resolve(localPath));

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: original,
        ContentType: "image/svg+xml",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const url = `${publicBase}/${key}`;
    mapping[`/${localPath.replace(/^public\//, "")}`] = url;
    totalBefore += original.length;
    totalAfter += original.length;

    console.log(
      `  ${localPath} (${(original.length / 1024).toFixed(0)}KB) -> ${key}`,
    );
  }

  // ---- Part 2: every other image in public/. Same recipe, local wins. ----
  const publicDir = path.resolve("public");
  const allPublic = await walk(publicDir);
  const handledInPart1 = new Set(
    [...RASTER_IMAGES, ...VECTOR_IMAGES].map(([p]) => path.resolve(p)),
  );
  const knownOnR2 = new Set(
    [...RASTER_IMAGES, ...VECTOR_IMAGES].map(
      ([, key]) => "/" + key.replace(/^site\//, ""),
    ),
  );
  const toUrlPath = (f: string) =>
    "/" + path.relative(publicDir, f).split(path.sep).join("/");
  const r2Path = (urlPath: string) =>
    urlPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const isRaster = (f: string) => /\.(png|jpe?g)$/i.test(f);

  const targets = new Map<string, string>(); // R2 path (.webp for rasters) -> local file
  for (const file of allPublic) {
    if (handledInPart1.has(file)) continue;
    if (
      !MIME[path.extname(file).toLowerCase()] ||
      KEEP_LOCAL.has(path.basename(file))
    )
      continue;
    const key = r2Path(toUrlPath(file));
    if (targets.has(key)) {
      console.log(
        `  WARNING: ${toUrlPath(file)} collides with ${toUrlPath(targets.get(key)!)} -> ${key}, skipped`,
      );
      continue;
    }
    targets.set(key, file);
  }

  // Paths the code asks for -> catch letter-case mismatches (Img_1.png vs img_1.png)
  const lowerKeys = new Map(
    [...targets.keys()].map((k) => [k.toLowerCase(), k]),
  );
  const refRe =
    /["'`](\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg|gif|avif|ico))["'`]/g;
  const missingRefs = new Set<string>();
  for (const f of (await walk(path.resolve("src"))).filter((x) =>
    /\.(ts|tsx)$/.test(x),
  )) {
    for (const m of (await readFile(f, "utf8")).matchAll(refRe)) {
      const want = r2Path(m[1]);
      if (targets.has(want) || knownOnR2.has(want)) continue;
      const actual = lowerKeys.get(want.toLowerCase());
      if (actual) {
        targets.set(want, targets.get(actual)!); // alias under the exact name the code uses
        console.log(`  case alias: ${want}  <-  ${actual}`);
      } else if (!KEEP_LOCAL.has(path.basename(m[1]))) {
        missingRefs.add(m[1]);
      }
    }
  }

  console.log(
    `\n${DRY ? "[DRY RUN] " : ""}Syncing ${targets.size} public/ images to R2 (local wins)…\n`,
  );
  const tally = { uploaded: 0, replaced: 0, unchanged: 0 };
  let rawBytes = 0;
  let outBytes = 0;
  const unreadable: string[] = [];

  for (const [r2File, file] of targets) {
    const original = await readFile(file);
    const raster = isRaster(file);
    let body: Buffer;
    try {
      body = raster ? await toWebp(original) : original;
    } catch {
      unreadable.push(toUrlPath(file));
      console.log(`  SKIPPED   ${toUrlPath(file)} (not a valid image file)`);
      continue;
    }
    const result = await putIfChanged(
      s3,
      bucket,
      `site${r2File}`,
      body,
      raster ? "image/webp" : MIME[path.extname(file).toLowerCase()],
    );
    tally[result]++;
    rawBytes += original.length;
    outBytes += body.length;
    console.log(
      `  ${result.padEnd(9)} ${r2File}  (${(original.length / 1024).toFixed(0)}KB -> ${(body.length / 1024).toFixed(0)}KB)`,
    );
  }

  console.log(
    `\nPart 2: ${tally.uploaded} new, ${tally.replaced} overwritten with local version, ${tally.unchanged} already identical. ` +
      `${(rawBytes / 1024 / 1024).toFixed(1)}MB -> ${(outBytes / 1024 / 1024).toFixed(1)}MB.`,
  );
  totalBefore += rawBytes;
  totalAfter += outBytes;

  if (unreadable.length > 0) {
    console.log("\nSkipped (corrupt / not real images, check these files):");
    for (const p of unreadable) console.log(`  ${p}`);
  }

  if (missingRefs.size > 0) {
    console.log(
      "\nReferenced in code but NOT found in public/ (add these files and re-run):",
    );
    for (const p of [...missingRefs].sort()) console.log(`  ${p}`);
  }

  console.log(
    `\nDone. ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB ` +
      `(${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller).\n`,
  );

  console.log("Path -> R2 URL mapping (for the code rewiring step):\n");
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch((error) => {
  console.error("\nMigration failed:", error);
  process.exit(1);
});

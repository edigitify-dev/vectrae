import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

let cachedClient: S3Client | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set. See ADMIN.md for the R2 setup steps.`);
  }

  return value;
}

/**
 * R2 exposes an S3-compatible API, so the AWS SDK talks to it directly —
 * no Cloudflare-specific client exists or is needed. `region: "auto"` is
 * R2's documented value; it ignores AWS regions entirely.
 */
function getClient(): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }

  return cachedClient;
}

function publicBase(): string {
  return requireEnv("R2_PUBLIC_URL").replace(/\/+$/, "");
}

/** Uploads a public image (blog covers) to R2 and returns its public URL. */
export async function uploadImageToR2(file: File, keyPrefix: string): Promise<string> {
  const extension = EXTENSIONS[file.type] ?? "bin";
  const key = `${keyPrefix}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  await getClient().send(
    new PutObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME"),
      Key: key,
      Body: bytes,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicBase()}/${key}`;
}

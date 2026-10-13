import "server-only";

import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { COMPANY_PROFILE_DOWNLOAD_NAME, type CompanyProfile } from "./company-profile-file";

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

// A single object is replaced atomically so the download always serves the
// latest complete profile, without a database migration or orphaned uploads.
const COMPANY_PROFILE_KEY = "about/company-profile/company-profile.pdf";

function isMissingObject(error: unknown): boolean {
  return error instanceof Error && ["NotFound", "NoSuchKey"].includes(error.name);
}

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  try {
    const object = await getClient().send(new HeadObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME"),
      Key: COMPANY_PROFILE_KEY,
    }), { abortSignal: AbortSignal.timeout(10000) });
    return {
      filename: decodeURIComponent(object.Metadata?.filename ?? COMPANY_PROFILE_DOWNLOAD_NAME),
      size: object.ContentLength ?? 0,
      updatedAt: object.LastModified?.toISOString() ?? "",
    };
  } catch (error) {
    if (isMissingObject(error)) return null;
    throw error;
  }
}

export async function uploadCompanyProfile(file: File): Promise<CompanyProfile> {
  const updatedAt = new Date().toISOString();
  await getClient().send(new PutObjectCommand({
    Bucket: requireEnv("R2_BUCKET_NAME"),
    Key: COMPANY_PROFILE_KEY,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: "application/pdf",
    ContentDisposition: `attachment; filename="${COMPANY_PROFILE_DOWNLOAD_NAME}"`,
    CacheControl: "no-store",
    Metadata: { filename: encodeURIComponent(file.name.slice(0, 200)) },
  }));
  return { filename: file.name.slice(0, 200), size: file.size, updatedAt };
}

export async function downloadCompanyProfile() {
  try {
    return await getClient().send(new GetObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME"),
      Key: COMPANY_PROFILE_KEY,
    }), { abortSignal: AbortSignal.timeout(10000) });
  } catch (error) {
    if (isMissingObject(error)) return null;
    throw error;
  }
}

import { fileHasExpectedSignature } from "./file-signature";

export const COMPANY_PROFILE_MAX_BYTES = 10 * 1024 * 1024;
export const COMPANY_PROFILE_DOWNLOAD_NAME = "Vectrae-Company-Profile.pdf";

export type CompanyProfile = {
  filename: string;
  size: number;
  updatedAt: string;
};

export async function validateCompanyProfile(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return "Choose a PDF to upload.";
  if (file.size > COMPANY_PROFILE_MAX_BYTES) return "The PDF must be 10 MB or smaller.";
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
    return "Company profile must be a PDF.";
  }
  if (!(await fileHasExpectedSignature(file))) return "This file is not a valid PDF.";
  return null;
}

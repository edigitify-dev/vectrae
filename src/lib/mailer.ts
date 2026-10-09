import "server-only";
import nodemailer from "nodemailer";

// ─── Destination addresses ────────────────────────────────────────────────────
/** Receives every job-application notification. */
export const HR_EMAIL = "Hr@vectrae.com";

/** Receives every contact-form enquiry notification. */
export const ENQUIRY_EMAIL = "enquiry@vectrae.com";

// ─── Transporter ─────────────────────────────────────────────────────────────
/**
 * Gmail SMTP transporter.
 *
 * Required env vars (add to .env.local and to your Vercel project):
 *   GMAIL_USER        – the Gmail address used as the sender, e.g. notifications@gmail.com
 *   GMAIL_APP_PASSWORD – a Google "App Password" (not your account password).
 *                        Generate one at: https://myaccount.google.com/apppasswords
 */
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = createTransporter();
  }
  return _transporter;
}

// ─── Send helper ─────────────────────────────────────────────────────────────
export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  /** Optional plain-text fallback */
  text?: string;
}) {
  const from = `"Vectrae Website" <${process.env.GMAIL_USER}>`;
  await getTransporter().sendMail({ from, ...options });
}

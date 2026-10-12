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
  const user = process.env.GMAIL_USER?.trim();
  // Google displays app passwords in groups separated by spaces.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

  if (!user || !pass) {
    throw new Error(
      "Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
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
/** Checks the SMTP connection and authentication without sending a message. */
export async function verifyMailConfiguration() {
  await getTransporter().verify();
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  /** Optional plain-text fallback */
  text?: string;
  /** Replies go to the person who submitted the form. */
  replyTo?: string;
}) {
  const transporter = getTransporter();
  const from = { name: "Vectrae Website", address: process.env.GMAIL_USER!.trim() };
  const result = await transporter.sendMail({ from, ...options });

  if (result.rejected.length > 0 || result.accepted.length === 0) {
    throw new Error("SMTP did not accept the notification recipient.");
  }
}

import { after, NextResponse } from "next/server";
import { getDb, withRetry } from "@/db";
import { contactEnquiries } from "@/db/schema";
import { sendMail, ENQUIRY_EMAIL } from "@/lib/mailer";
import { escapeHtml } from "@/lib/security";
import { takeRateLimit, trustedClientIp } from "@/lib/rate-limit";

type ContactPayload = {
  fullName?: string;
  companyName?: string;
  workEmail?: string;
  phone?: string;
  designation?: string;
  companySize?: string;
  solutionInterest?: string[];
  message?: string;
  howHeard?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 2000;

function clean(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().slice(0, MAX_FIELD_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const fullName = clean(body.fullName);
  const companyName = clean(body.companyName);
  const workEmail = clean(body.workEmail);
  const phone = clean(body.phone);

  if (!fullName || !companyName || !workEmail || !phone) {
    return NextResponse.json(
      { ok: false, error: "Full name, company name, work email, and phone number are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(workEmail)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid work email address." },
      { status: 400 },
    );
  }

  const solutionInterest = Array.isArray(body.solutionInterest)
    ? body.solutionInterest.filter((item): item is string => typeof item === "string").slice(0, 20).map((item) => item.trim().slice(0, MAX_FIELD_LENGTH))
    : [];

  try {
    const ip = trustedClientIp(request.headers);
    if ((ip && !(await takeRateLimit("contact-ip", ip, 20))) || !(await takeRateLimit("contact-email", workEmail.toLowerCase(), 5))) {
      return NextResponse.json({ ok: false, error: "Too many enquiries. Please try again in 15 minutes." }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "We couldn't process your request. Please try again shortly." }, { status: 503 });
  }

  try {
    await withRetry(() =>
      getDb().insert(contactEnquiries).values({
        fullName,
        companyName,
        workEmail: workEmail.toLowerCase(),
        phone,
        designation: clean(body.designation),
        companySize: clean(body.companySize),
        solutionInterest,
        message: clean(body.message),
        howHeard: clean(body.howHeard),
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      }),
    );
  } catch (error) {
    console.error("[contact] Failed to save enquiry:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your enquiry just now. Please try again shortly." },
      { status: 500 },
    );
  }

  // Keep the server invocation alive until the notification finishes,
  // while returning promptly after the enquiry is saved.
  const designation = clean(body.designation);
  const companySize = clean(body.companySize);
  const message = clean(body.message);
  const howHeard = clean(body.howHeard);
  const solutions = solutionInterest.length > 0 ? solutionInterest.join(", ") : "—";

  after(async () => {
    await sendMail({
      to: ENQUIRY_EMAIL,
      replyTo: workEmail,
      subject: `New Enquiry: ${fullName} from ${companyName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:linear-gradient(135deg,#0f9ac9,#25D9C7);padding:28px 32px;border-radius:12px 12px 0 0">
            <h1 style="margin:0;font-size:22px;color:#fff">New Contact Enquiry</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${escapeHtml(companyName)}</p>
          </div>
          <div style="background:#f9f9f9;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#666;width:180px">Full Name</td><td style="padding:8px 0;font-weight:600">${escapeHtml(fullName)}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Work Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(workEmail)}" style="color:#0f9ac9">${escapeHtml(workEmail)}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${escapeHtml(phone)}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Company</td><td style="padding:8px 0">${escapeHtml(companyName)}</td></tr>
              ${designation ? `<tr><td style="padding:8px 0;color:#666">Designation</td><td style="padding:8px 0">${escapeHtml(designation)}</td></tr>` : ""}
              ${companySize ? `<tr><td style="padding:8px 0;color:#666">Company Size</td><td style="padding:8px 0">${escapeHtml(companySize)}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#666">Solutions of Interest</td><td style="padding:8px 0">${escapeHtml(solutions)}</td></tr>
              ${howHeard ? `<tr><td style="padding:8px 0;color:#666">How They Heard</td><td style="padding:8px 0">${escapeHtml(howHeard)}</td></tr>` : ""}
              ${message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(message)}</td></tr>` : ""}
            </table>
            <p style="margin:24px 0 0;font-size:12px;color:#999">Submitted via Vectrae contact page · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
          </div>
        </div>`,
    }).catch((err) => console.error("[contact] Enquiry email failed:", err));
  });

  return NextResponse.json({ ok: true });
}

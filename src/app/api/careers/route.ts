import { NextResponse } from "next/server";
import { getDb, withRetry } from "@/db";
import { jobApplications } from "@/db/schema";
import { describeResumeProblem, uploadResume } from "@/lib/resume";
import { sendMail, HR_EMAIL } from "@/lib/mailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 2000;

function clean(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().slice(0, MAX_FIELD_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const fullName = clean(form.get("fullName"));
  const email = clean(form.get("email"));
  const phone = clean(form.get("phone"));
  const roleApplyingFor = clean(form.get("roleApplyingFor"));

  if (!fullName || !email || !phone || !roleApplyingFor) {
    return NextResponse.json(
      { ok: false, error: "Full name, email, phone number, and role are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const resume = form.get("resume");
  const resumeLink = clean(form.get("resumeLink"));
  const hasFile = resume instanceof File && resume.size > 0;

  if (!hasFile && !resumeLink) {
    return NextResponse.json(
      { ok: false, error: "Please attach your resume, or paste a link to it." },
      { status: 400 },
    );
  }

  let stored: Awaited<ReturnType<typeof uploadResume>> | null = null;

  if (hasFile) {
    const problem = describeResumeProblem(resume);

    if (problem) {
      return NextResponse.json({ ok: false, error: problem }, { status: 400 });
    }

    try {
      stored = await uploadResume(resume, fullName);
    } catch (error) {
      console.error("[careers] Resume upload failed:", error);
      return NextResponse.json(
        { ok: false, error: "We couldn't upload your resume. Please try again shortly." },
        { status: 500 },
      );
    }
  }

  try {
    await withRetry(() =>
      getDb().insert(jobApplications).values({
        fullName,
        email: email.toLowerCase(),
        phone,
        roleApplyingFor,
        jobSlug: clean(form.get("jobSlug")),
        experience: clean(form.get("experience")),
        resumeUrl: stored?.url ?? null,
        resumeFilename: stored?.filename ?? null,
        resumeSize: stored?.size ?? null,
        resumeLink,
        message: clean(form.get("message")),
      }),
    );
  } catch (error) {
    console.error("[careers] Failed to save application:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your application just now. Please try again shortly." },
      { status: 500 },
    );
  }

  // Send notification email to HR (non-blocking — a mail failure must not
  // reject an application that was already saved to the DB).
  const experience = clean(form.get("experience"));
  const message = clean(form.get("message"));
  const resumeDisplay = stored
    ? `<a href="${stored.url}" style="color:#29B9F2">${stored.filename}</a> (${(stored.size / 1024).toFixed(0)} KB)`
    : resumeLink
      ? `<a href="${resumeLink}" style="color:#29B9F2">${resumeLink}</a>`
      : "—";

  sendMail({
    to: HR_EMAIL,
    subject: `New Job Application: ${roleApplyingFor} — ${fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#0f9ac9,#25D9C7);padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;font-size:22px;color:#fff">New Job Application</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${roleApplyingFor}</p>
        </div>
        <div style="background:#f9f9f9;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:160px">Full Name</td><td style="padding:8px 0;font-weight:600">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#0f9ac9">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Role Applied For</td><td style="padding:8px 0">${roleApplyingFor}</td></tr>
            ${experience ? `<tr><td style="padding:8px 0;color:#666">Experience</td><td style="padding:8px 0">${experience}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#666">Resume</td><td style="padding:8px 0">${resumeDisplay}</td></tr>
            ${message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Cover Note</td><td style="padding:8px 0;white-space:pre-wrap">${message}</td></tr>` : ""}
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#999">Submitted via Vectrae careers page · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
        </div>
      </div>`,
  }).catch((err) => console.error("[careers] HR email failed:", err));

  return NextResponse.json({ ok: true });
}

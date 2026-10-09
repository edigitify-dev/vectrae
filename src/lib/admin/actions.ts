"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { getDb, withRetry } from "@/db";
import { adminUsers, blogPosts, certifications, contactEnquiries, galleryCategories, galleryImages, jobApplications, jobOpenings } from "@/db/schema";
import { requireAdmin, requireWriteAccess } from "./auth";
import { describePasswordProblem, hashPassword, verifyPassword } from "./password";
import {
  SESSION_COOKIE,
  createSessionToken,
  deleteSessionToken,
  sessionCookieOptions,
  type AdminRole,
} from "./session";
import { isApplicationStatus, isEnquiryStatus } from "./statuses";
import { estimateReadTime, type BlogBlock } from "@/lib/blog-types";
import { slugifyTitle } from "@/lib/slug";
import { isDepartment, isJobType } from "@/lib/careers-types";
import { deleteResume } from "@/lib/resume";

export type ActionState = { error?: string; success?: string };

/** Only ever allow redirects back into the panel, never to an attacker's URL. */
function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/admin") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

function text(form: FormData, key: string): string {
  // Server actions are callable endpoints, so a malformed payload must produce
  // a handled error rather than an unguarded crash.
  const value = form?.get?.(key);
  return typeof value === "string" ? value.trim() : "";
}

// ---------------------------------------------------------------- auth

export async function signIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  if (!(form instanceof FormData)) {
    return { error: "Malformed submission. Please reload the page and try again." };
  }

  const password = String(form.get("password") ?? "");
  const next = safeNextPath(form.get("next"));

  if (!password) {
    return { error: "Enter the password." };
  }

  let candidates: (typeof adminUsers.$inferSelect)[];

  try {
    candidates = await withRetry(() => getDb().select().from(adminUsers));
  } catch (error) {
    console.error("[admin/signIn] Lookup failed:", error);
    return { error: "We couldn't reach the database. Please try again." };
  }

  // No email to key off, so the submitted password is checked against every
  // account. Fine for a handful of admin users; each check costs ~100ms of
  // scrypt work, same as before.
  let user: (typeof candidates)[number] | undefined;

  for (const candidate of candidates) {
    if (await verifyPassword(password, candidate.passwordHash)) {
      user = candidate;
      break;
    }
  }

  if (!user) {
    return { error: "That password is incorrect." };
  }

  let token: string;

  try {
    token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: (user.role as AdminRole) ?? "admin",
      sessionVersion: user.sessionVersion,
    });
  } catch (error) {
    console.error("[admin/signIn] Could not create session:", error);
    return { error: "We couldn't start your session. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);

  // Best-effort bookkeeping: a failure here must not block a valid sign-in.
  try {
    await getDb().update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
  } catch (error) {
    console.error("[admin/signIn] Could not record last login:", error);
  }

  redirect(next);
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  await deleteSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function changePassword(_prev: ActionState, form: FormData): Promise<ActionState> {
  const admin = await requireAdmin();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission. Please reload the page and try again." };
  }

  const current = String(form.get("currentPassword") ?? "");
  const next = String(form.get("newPassword") ?? "");
  const confirm = String(form.get("confirmPassword") ?? "");

  if (next !== confirm) {
    return { error: "The new passwords don't match." };
  }

  const problem = describePasswordProblem(next);

  if (problem) {
    return { error: problem };
  }

  const db = getDb();
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, admin.id)).limit(1);

  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    return { error: "Your current password is incorrect." };
  }

  await db
    .update(adminUsers)
    .set({
      passwordHash: await hashPassword(next),
      // Bumping this signs out every other device.
      sessionVersion: sql`${adminUsers.sessionVersion} + 1`,
    })
    .where(eq(adminUsers.id, admin.id));

  // The caller's own cookie is now stale too, so send them back to sign in.
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login?changed=1");
}

// ---------------------------------------------------------------- enquiries

export async function updateEnquiryStatus(id: string, status: string): Promise<void> {
  await requireWriteAccess();

  if (!isEnquiryStatus(status)) {
    throw new Error(`Unknown enquiry status "${status}".`);
  }

  await withRetry(() =>
    getDb()
      .update(contactEnquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactEnquiries.id, id)),
  );

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin");
}

export async function saveEnquiryNotes(id: string, notes: string): Promise<void> {
  await requireWriteAccess();

  await withRetry(() =>
    getDb()
      .update(contactEnquiries)
      .set({ internalNotes: notes.slice(0, 5000), updatedAt: new Date() })
      .where(eq(contactEnquiries.id, id)),
  );

  revalidatePath(`/admin/enquiries/${id}`);
}

export async function deleteEnquiry(form: FormData): Promise<void> {
  await requireWriteAccess();
  const id = text(form, "id");

  await getDb().delete(contactEnquiries).where(eq(contactEnquiries.id, id));

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect("/admin/enquiries");
}

// ---------------------------------------------------------------- applications

export async function updateApplicationStatus(id: string, status: string): Promise<void> {
  await requireWriteAccess();

  if (!isApplicationStatus(status)) {
    throw new Error(`Unknown application status "${status}".`);
  }

  await withRetry(() =>
    getDb()
      .update(jobApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(jobApplications.id, id)),
  );

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin");
}

export async function saveApplicationNotes(id: string, notes: string): Promise<void> {
  await requireWriteAccess();

  await withRetry(() =>
    getDb()
      .update(jobApplications)
      .set({ internalNotes: notes.slice(0, 5000), updatedAt: new Date() })
      .where(eq(jobApplications.id, id)),
  );

  revalidatePath(`/admin/applications/${id}`);
}

export async function deleteApplication(form: FormData): Promise<void> {
  await requireWriteAccess();
  const id = text(form, "id");
  const db = getDb();

  const [row] = await db
    .select({ resumeUrl: jobApplications.resumeUrl })
    .from(jobApplications)
    .where(eq(jobApplications.id, id))
    .limit(1);

  await db.delete(jobApplications).where(eq(jobApplications.id, id));

  // Best-effort: a stranded blob is preferable to failing the delete outright.
  if (row?.resumeUrl) {
    try {
      await deleteResume(row.resumeUrl);
    } catch (error) {
      console.error("[admin] Failed to delete stored resume:", error);
    }
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  redirect("/admin/applications");
}

// ---------------------------------------------------------------- blog

function parseContent(raw: string): BlogBlock[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BlogBlock[]) : [];
  } catch {
    return [];
  }
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}

/** Shared by create and update — returns the values to write, or an error. */
async function readPostForm(form: FormData, existingId?: string) {
  const title = text(form, "title");

  if (!title) {
    return { error: "Give the post a title." as const };
  }

  const content = parseContent(text(form, "content"));

  if (content.length === 0) {
    return { error: "Add at least one content block." as const };
  }

  const status = text(form, "status") === "published" ? "published" : "draft";
  const slug = slugifyTitle(text(form, "slug") || title);

  if (!slug) {
    return { error: "That title doesn't produce a usable URL slug. Add some letters or numbers." as const };
  }

  // Slugs are the public URL, so a collision would silently break a live post.
  const clash = await withRetry(() =>
    getDb().select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1),
  );

  if (clash.length > 0 && clash[0].id !== existingId) {
    return { error: `The slug "${slug}" is already used by another post.` as const };
  }

  return {
    values: {
      slug,
      title,
      excerpt: text(form, "excerpt"),
      category: text(form, "category") || "Insights",
      readTime: text(form, "readTime") || estimateReadTime(content),
      color: text(form, "color") || "#29B9F2",
      image: text(form, "image"),
      featured: form.get("featured") === "on",
      status,
      authorName: text(form, "authorName"),
      authorRole: text(form, "authorRole"),
      authorInitials: text(form, "authorInitials").slice(0, 3).toUpperCase(),
      tags: parseTags(text(form, "tags")),
      content,
      updatedAt: new Date(),
    },
  };
}

/** Refreshes every public surface that renders posts. */
function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
}

export async function createPost(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission. Please reload the page and try again." };
  }

  const parsed = await readPostForm(form);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { values } = parsed;
  let id: string;

  try {
    const [row] = await withRetry(() =>
      getDb()
        .insert(blogPosts)
        .values({
          ...values,
          publishedAt: values.status === "published" ? new Date() : null,
        })
        .returning({ id: blogPosts.id }),
    );

    id = row.id;
  } catch (error) {
    console.error("[admin/createPost] Insert failed:", error);
    return { error: "We couldn't save the post. Please try again." };
  }

  revalidateBlog(values.slug);
  redirect(`/admin/blog/${id}?saved=1`);
}

export async function updatePost(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission. Please reload the page and try again." };
  }

  const id = text(form, "id");
  const parsed = await readPostForm(form, id);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { values } = parsed;
  const db = getDb();

  const [existing] = await db
    .select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (!existing) {
    return { error: "That post no longer exists." };
  }

  try {
    await db
      .update(blogPosts)
      .set({
        ...values,
        // First publish stamps the date; later edits keep the original.
        publishedAt:
          values.status === "published" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
      })
      .where(eq(blogPosts.id, id));
  } catch (error) {
    console.error("[admin/updatePost] Update failed:", error);
    return { error: "We couldn't save the post. Please try again." };
  }

  revalidateBlog(values.slug);

  if (existing.slug !== values.slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }

  return { success: "Saved." };
}

export async function deletePost(form: FormData): Promise<void> {
  await requireWriteAccess();

  const id = text(form, "id");
  const db = getDb();

  const [existing] = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  await db.delete(blogPosts).where(eq(blogPosts.id, id));

  revalidateBlog(existing?.slug);
  redirect("/admin/blog");
}

// ---------------------------------------------------------------- careers

function parseListField(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30);
}

/** Shared by create and update — returns the values to write, or an error. */
async function readJobForm(form: FormData, existingId?: string) {
  const title = text(form, "title");

  if (!title) {
    return { error: "Give the role a title." as const };
  }

  const department = text(form, "department");

  if (!isDepartment(department)) {
    return { error: "Choose a valid department." as const };
  }

  const type = text(form, "type") || "Full-time";

  if (!isJobType(type)) {
    return { error: "Choose a valid job type." as const };
  }

  const status = text(form, "status") === "published" ? "published" : "draft";
  const slug = slugifyTitle(text(form, "slug") || title);

  if (!slug) {
    return { error: "That title doesn't produce a usable URL slug. Add some letters or numbers." as const };
  }

  // Slugs are the public URL, so a collision would silently break a live posting.
  const clash = await withRetry(() =>
    getDb().select({ id: jobOpenings.id }).from(jobOpenings).where(eq(jobOpenings.slug, slug)).limit(1),
  );

  if (clash.length > 0 && clash[0].id !== existingId) {
    return { error: `The slug "${slug}" is already used by another posting.` as const };
  }

  return {
    values: {
      slug,
      title,
      department,
      location: text(form, "location"),
      type,
      experience: text(form, "experience"),
      summary: text(form, "summary"),
      responsibilities: parseListField(text(form, "responsibilities")),
      requirements: parseListField(text(form, "requirements")),
      status,
      updatedAt: new Date(),
    },
  };
}

/** Refreshes every public surface that renders job openings. */
function revalidateCareers(slug?: string) {
  revalidatePath("/careers");
  if (slug) {
    revalidatePath(`/careers/${slug}`);
  }
  revalidatePath("/admin/careers");
  revalidatePath("/admin");
}

export async function createJob(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission. Please reload the page and try again." };
  }

  const parsed = await readJobForm(form);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { values } = parsed;
  let id: string;

  try {
    const [row] = await withRetry(() =>
      getDb()
        .insert(jobOpenings)
        .values({
          ...values,
          publishedAt: values.status === "published" ? new Date() : null,
        })
        .returning({ id: jobOpenings.id }),
    );

    id = row.id;
  } catch (error) {
    console.error("[admin/createJob] Insert failed:", error);
    return { error: "We couldn't save the posting. Please try again." };
  }

  revalidateCareers(values.slug);
  redirect(`/admin/careers/${id}?saved=1`);
}

export async function updateJob(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission. Please reload the page and try again." };
  }

  const id = text(form, "id");
  const parsed = await readJobForm(form, id);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { values } = parsed;
  const db = getDb();

  const [existing] = await withRetry(() =>
    db
      .select({ slug: jobOpenings.slug, publishedAt: jobOpenings.publishedAt })
      .from(jobOpenings)
      .where(eq(jobOpenings.id, id))
      .limit(1),
  );

  if (!existing) {
    return { error: "That posting no longer exists." };
  }

  try {
    await withRetry(() =>
      db
        .update(jobOpenings)
        .set({
          ...values,
          // First publish stamps the date; later edits keep the original.
          publishedAt:
            values.status === "published" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
        })
        .where(eq(jobOpenings.id, id)),
    );
  } catch (error) {
    console.error("[admin/updateJob] Update failed:", error);
    return { error: "We couldn't save the posting. Please try again." };
  }

  revalidateCareers(values.slug);

  if (existing.slug !== values.slug) {
    revalidatePath(`/careers/${existing.slug}`);
  }

  return { success: "Saved." };
}

export async function deleteJob(form: FormData): Promise<void> {
  await requireWriteAccess();

  const id = text(form, "id");
  const db = getDb();

  const [existing] = await withRetry(() =>
    db.select({ slug: jobOpenings.slug }).from(jobOpenings).where(eq(jobOpenings.id, id)).limit(1),
  );

  await db.delete(jobOpenings).where(eq(jobOpenings.id, id));

  revalidateCareers(existing?.slug);
  redirect("/admin/careers");
}

// ---------------------------------------------------------------- gallery categories

function revalidateAbout() {
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function createGalleryCategory(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission." };
  }

  const name = text(form, "name");
  if (!name) return { error: "Give the category a name." };

  const { slugifyTitle } = await import("@/lib/slug");
  const slug = slugifyTitle(name);
  if (!slug) return { error: "That name doesn't produce a usable slug." };

  try {
    const db = getDb();
    const [row] = await withRetry(() =>
      db.insert(galleryCategories).values({ name, slug }).returning({ id: galleryCategories.id }),
    );
    revalidateAbout();
    return { success: row.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("gallery_categories_slug_key")) {
      return { error: `A category named "${name}" already exists.` };
    }
    console.error("[admin/createGalleryCategory] failed:", error);
    return { error: "We couldn't create the category." };
  }
}

export async function renameGalleryCategory(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission." };
  }

  const id = text(form, "id");
  const name = text(form, "name");
  if (!name) return { error: "Enter a name." };

  const { slugifyTitle } = await import("@/lib/slug");
  const slug = slugifyTitle(name);
  if (!slug) return { error: "That name doesn't produce a usable slug." };

  try {
    await withRetry(() =>
      getDb()
        .update(galleryCategories)
        .set({ name, slug, updatedAt: new Date() })
        .where(eq(galleryCategories.id, id)),
    );
    revalidateAbout();
    return { success: "Renamed." };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("gallery_categories_slug_key")) {
      return { error: `A category named "${name}" already exists.` };
    }
    console.error("[admin/renameGalleryCategory] failed:", error);
    return { error: "We couldn't rename the category." };
  }
}

export async function deleteGalleryCategory(form: FormData): Promise<void> {
  await requireWriteAccess();
  const id = text(form, "id");
  await getDb().delete(galleryCategories).where(eq(galleryCategories.id, id));
  revalidateAbout();
  redirect("/admin/about?tab=gallery");
}

// ---------------------------------------------------------------- gallery images

export async function addGalleryImage(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission." };
  }

  const categoryId = text(form, "categoryId");
  const url = text(form, "url");
  const alt = text(form, "alt");
  const caption = text(form, "caption");

  if (!categoryId) return { error: "Choose a category." };
  if (!url) return { error: "Upload an image first." };

  try {
    const db = getDb();
    const [row] = await withRetry(() =>
      db
        .insert(galleryImages)
        .values({ categoryId, url, alt, caption })
        .returning({ id: galleryImages.id }),
    );
    revalidateAbout();
    return { success: row.id };
  } catch (error) {
    console.error("[admin/addGalleryImage] failed:", error);
    return { error: "We couldn't add the image." };
  }
}

export async function deleteGalleryImage(form: FormData): Promise<void> {
  await requireWriteAccess();
  const id = text(form, "id");
  await getDb().delete(galleryImages).where(eq(galleryImages.id, id));
  revalidateAbout();
}

// ---------------------------------------------------------------- certifications

export async function createCertification(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission." };
  }

  const name = text(form, "name");
  if (!name) return { error: "Enter a certification name." };

  const fileUrl = text(form, "fileUrl");
  if (!fileUrl) return { error: "Upload a certificate file first." };

  try {
    const db = getDb();
    const [row] = await withRetry(() =>
      db
        .insert(certifications)
        .values({
          name,
          issuingOrg: text(form, "issuingOrg"),
          issueDate: text(form, "issueDate"),
          description: text(form, "description"),
          fileUrl,
          thumbnailUrl: text(form, "thumbnailUrl"),
        })
        .returning({ id: certifications.id }),
    );
    revalidateAbout();
    return { success: row.id };
  } catch (error) {
    console.error("[admin/createCertification] failed:", error);
    return { error: "We couldn't save the certification." };
  }
}

export async function updateCertification(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireWriteAccess();

  if (!(form instanceof FormData)) {
    return { error: "Malformed submission." };
  }

  const id = text(form, "id");
  const name = text(form, "name");
  if (!name) return { error: "Enter a certification name." };

  const fileUrl = text(form, "fileUrl");
  if (!fileUrl) return { error: "Upload a certificate file first." };

  try {
    await withRetry(() =>
      getDb()
        .update(certifications)
        .set({
          name,
          issuingOrg: text(form, "issuingOrg"),
          issueDate: text(form, "issueDate"),
          description: text(form, "description"),
          fileUrl,
          thumbnailUrl: text(form, "thumbnailUrl"),
          updatedAt: new Date(),
        })
        .where(eq(certifications.id, id)),
    );
    revalidateAbout();
    return { success: "Saved." };
  } catch (error) {
    console.error("[admin/updateCertification] failed:", error);
    return { error: "We couldn't update the certification." };
  }
}

export async function deleteCertification(form: FormData): Promise<void> {
  await requireWriteAccess();
  const id = text(form, "id");
  await getDb().delete(certifications).where(eq(certifications.id, id));
  revalidateAbout();
}

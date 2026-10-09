# Vectrae Admin Panel

An internal console at `/admin` for what the site collects and publishes:

| Section | Route | What it does |
| --- | --- | --- |
| Overview | `/admin` | Counts waiting on the team, plus the latest enquiries, applications, and edited content |
| Enquiries | `/admin/enquiries` | Every contact-form submission — search, filter by status, triage, internal notes |
| Applications | `/admin/applications` | Career applications with downloadable CVs, hiring stage, interview notes |
| Careers | `/admin/careers` | Job openings CMS: write, edit, publish, unpublish, delete. Publishing pushes straight to the careers page |
| Blog | `/admin/blog` | Full CMS: write, edit, publish, unpublish, delete. Publishing pushes straight to the live site |
| Settings | `/admin/settings` | Your account, password change, and (for owners) the list of admin users |

## Architecture

- **Database** — Neon Postgres via Drizzle ORM. Schema in [src/db/schema.ts](src/db/schema.ts), client in [src/db/index.ts](src/db/index.ts).
- **Auth** — **password only, no email/username.** The submitted password is checked against every row in `admin_users` (scrypt); on a match a random token goes into an httpOnly cookie for an 8-hour session. Only its SHA-256 digest is stored in `admin_sessions`. No separate session signing secret is needed. Logging out deletes the database session.
  - [src/proxy.ts](src/proxy.ts) bounces signed-out traffic away from `/admin` cheaply.
  - **The real boundary** is [`requireAdmin()`](src/lib/admin/auth.ts) in the panel layout and every mutation: it re-checks the session against the database on each request, so a deleted user or a bumped `session_version` loses access immediately.
  - `admin_users.email` still exists as the row's identifier (used by `npm run admin:create` and shown in Settings) — it is just never asked for at login.
- **Blog cover images** — Cloudflare R2 (S3-compatible), uploaded from the post editor via [`/api/admin/upload`](src/app/api/admin/upload/route.ts) → [`uploadImageToR2`](src/lib/r2.ts). Public, since covers render on the live site. See **Cloudflare R2 setup** below.
- **Resumes** — a private Vercel Blob store (`vectrae-resumes`), separate from images because one Blob store cannot mix public and private blobs. Never publicly addressable — verified to return `403` to anonymous fetches. Read back only through [`/api/admin/resume`](src/app/api/admin/resume/route.ts), which re-checks the session. Uses `BLOB_RESUMES_READ_WRITE_TOKEN`.

## Roles

| Role | Can do |
| --- | --- |
| `owner` | Everything, plus sees the admin user list in Settings |
| `admin` | Everything except the user list |
| `editor` | Read-only — sees all data, every write control is disabled |

## First-time setup

1. **Provision Neon** (needs a browser once, to accept marketplace terms):

   ```bash
   vercel integration add neon --no-claim
   ```

   If it reports `integration_terms_acceptance_required`, open the `verification_uri` it prints, accept, then re-run the same command.

2. **Pull the environment variables:**

   ```bash
   vercel env pull .env.local --yes
   ```

   You should now have `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, and `BLOB_RESUMES_READ_WRITE_TOKEN`.

3. **Create the tables:**

   ```bash
   npm run db:push
   ```

4. **Import the existing blog posts** (the seven articles previously hard-coded in `src/data/blogPosts.ts`):

   ```bash
   npm run db:seed
   ```

   Safe to re-run — existing slugs are skipped so panel edits are never clobbered. Use `npm run db:seed -- --force` to overwrite.

5. **Create your login:**

   ```bash
   npm run admin:create -- --email you@vectrae.com --name "Your Name" --role owner
   ```

   The email is only an internal identifier for the row (shown in Settings, used to target `admin:create` at a specific account) — it is **not** asked for at `/admin/login`, which takes a password only. Prints a generated password once. Pass `--password '…'` to choose your own (min 8 chars, upper + lower + digit). Re-running for an existing email resets that password and signs the user out everywhere.

6. **Set up Cloudflare R2** for blog cover image uploads — see the section below.

7. Sign in at `/admin/login` with just the password.

## Cloudflare R2 setup

Blog cover images upload to Cloudflare R2, not Vercel Blob — R2 isn't a Vercel Marketplace product, so it's provisioned entirely on Cloudflare's own dashboard, then wired in by hand via `vercel env add`.

### 1. Create the bucket

Cloudflare dashboard → **R2 Object Storage** → **Create bucket**. Name it e.g. `vectrae-blog-media`. Any region is fine (defaults to automatic).

### 2. Make it publicly readable

Open the new bucket → **Settings** → **Public Access** → **Allow Access** (enables the R2.dev subdomain). Cloudflare shows a URL like:

```
https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
```

That's `R2_PUBLIC_URL`. (The r2.dev subdomain is uncached and rate-limited — fine for a company blog. For higher traffic, connect a custom domain instead under the same Public Access screen, on a domain already on Cloudflare, and use that as `R2_PUBLIC_URL` instead.)

### 3. Create an API token

R2 Object Storage → **Manage R2 API Tokens** (top-right of the R2 overview page) → **Create API Token**:
- Permissions: **Object Read & Write**
- Scope: **Apply to specific buckets only** → select the bucket you just created (least privilege — this token can't touch anything else)
- Create it, then **copy the Access Key ID and Secret Access Key immediately** — Cloudflare shows the secret exactly once and cannot show it again.

### 4. Get the Account ID

Same R2 overview page, top-right corner — labelled **Account ID**. (A 32-character hex string.)

### 5. Set the environment variables

You now have five values. Set them with `vercel env add <NAME> <environment>` for `production`, `preview`, and `development`, or paste them here and they'll be wired in the same way the database connection string was:

| Variable | Value | Secret? |
| --- | --- | --- |
| `R2_ACCOUNT_ID` | From step 4 | No |
| `R2_ACCESS_KEY_ID` | From step 3 | Yes |
| `R2_SECRET_ACCESS_KEY` | From step 3 | Yes |
| `R2_BUCKET_NAME` | The bucket name from step 1 | No |
| `R2_PUBLIC_URL` | The r2.dev (or custom domain) URL from step 2 | No |

Then:

```bash
vercel env pull .env.local --yes
```

No code changes are needed after that — [src/lib/r2.ts](src/lib/r2.ts) reads these lazily, and cover uploads in the blog editor will start working immediately. Until they're set, uploading a cover fails cleanly with a 500 and a clear "R2_ACCOUNT_ID is not set" message in the server log rather than crashing.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run db:push` | Apply the schema to Neon |
| `npm run db:generate` | Write a new SQL migration to `drizzle/` after a schema change |
| `npm run db:studio` | Browse the data in Drizzle Studio |
| `npm run db:seed` | Import the static blog posts (idempotent; `-- --force` overwrites) |
| `npm run db:seed-careers` | Import the static job openings (idempotent; `-- --force` overwrites) |
| `npm run admin:create` | Create or reset an admin user |

## How the blog and careers page now work

The public blog and careers page both read from Postgres, not from `src/data/blogPosts.ts` / `src/data/careers.ts`:

- [/blog](src/app/blog/page.tsx), [/blog/[slug]](src/app/blog/[slug]/page.tsx), [/careers](src/app/careers/page.tsx), and [/careers/[slug]](src/app/careers/[slug]/page.tsx) are statically rendered with a 1-hour revalidation backstop.
- Saving in the panel calls `revalidatePath` for the relevant listing, detail page, and `/` — so changes appear immediately rather than after an hour.
- `src/data/blogPosts.ts` and the job openings in `src/data/careers.ts` are now **seed data only**. Editing them does not change the live site. `departments`, `departmentIcons`, and `perks` in `src/data/careers.ts` remain static (not part of the CMS) — postings are constrained to the four existing departments since each maps to a fixed icon used elsewhere on the site.

## Notes on the public forms

- The contact form writes to `contact_enquiries` and returns a real error if the write fails, instead of the previous console-log-only behaviour.
- The careers form now takes a **file upload** (PDF/DOC/DOCX, max 5 MB) in addition to the optional portfolio link. At least one of the two is required.

## Recommended hardening

The login endpoint has no rate limiting. The scrypt cost factor makes each attempt expensive (~100 ms), which caps brute-force throughput, but for a public-facing admin panel it is worth adding a WAF rate-limit rule on `/admin/login` in the Vercel dashboard (Firewall → Rate limiting), or enabling BotID.

## Stray resources to clean up

Two Vercel Blob stores are now unused, since cover images moved to R2 (`vectrae-resumes` is still needed, for private CVs):

- `vectrae-media` — created empty during initial setup, before a token-naming conflict was resolved; holds nothing.
- `vectrae-blog-media` — was the public store for cover images before the move to R2; may hold covers uploaded before this change.

Deleting a store can only be done interactively (Vercel CLI's own safeguard), so remove them yourself when convenient:

```bash
vercel blob delete-store store_KsCOZK8lJPQafsgG   # vectrae-media
vercel blob list-stores                            # find vectrae-blog-media's store_id, then:
vercel blob delete-store <that store_id>
```

You can also just leave `BLOB_READ_WRITE_TOKEN` in place — nothing reads it anymore, but it's harmless.

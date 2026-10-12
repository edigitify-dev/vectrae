# Admin backend and dashboard review

Reviewed on 12 October 2026 (IST). Scope: application source, installed dependencies,
the configured database's new rate-limit storage, and a temporary localhost
production server. This review did not test the hosted deployment or perform an
external penetration test. No admin credentials were reset and no real enquiries,
applications, uploads or emails were created during the review.

## Changes completed

| Finding | Change |
| --- | --- |
| Next.js 16.2.12 was covered by critical and high dependency advisories | Updated Next.js and its matching ESLint configuration to 16.3.8; applied compatible transitive dependency fixes. |
| Unlimited login and password verification attempts | Added atomic database counters shared across serverless instances: 5 sign-in attempts per username and 5 password-change attempts per account per 15 minutes. On Vercel, login additionally has a 30-attempt IP limit. A limiter failure denies the request. Successful attempts also count toward the limit. |
| Public forms could repeatedly write records and trigger notifications | Added 5 submissions per email per 15 minutes, plus 20 submissions per IP on Vercel, separately for careers and enquiries. Limits return 429; a limiter outage returns 503. |
| Unknown database roles were treated as full admins | Session validation now accepts only owner, admin and editor. Only owner and admin can write. Login rejects accounts with an unknown role. |
| Upload APIs had no explicit origin verification | All four upload endpoints now require an authenticated write-capable account and an Origin matching the request URL. |
| Uploads trusted the declared MIME type | Public images, certificates and resumes now check binary file signatures as well as existing type/size checks. Signature checks are not full decoding or malware scanning; DOCX checks identify the ZIP container only. |
| The image optimizer accepted any R2 bucket | Restricted remote images to the site's asset bucket and the explicitly configured HTTPS R2 host. |
| User input was interpolated into HTML notifications | Escaped text and attribute values in both notification templates. Private uploaded resume URLs are no longer put into notification emails as unusable direct links. |
| Untrusted resume URLs could become dashboard and email links | Reject non-HTTP(S), credential-bearing, overlong and control-character URLs. Existing unsafe saved URLs are suppressed in dashboard links without modifying historical records. |
| Redirects used a permissive `/admin` prefix check | Added a shared parser that rejects outside URLs, path traversal, backslashes, non-panel paths and login redirect loops. |
| Several record IDs reached UUID queries without validation | Validate IDs in detail pages, downloads and mutations. Malformed IDs are rejected before database access. |
| Blog JSON was trusted as valid content blocks | Validate block kinds, text/list shapes and size limits before saving or estimating reading time. Validate image, gallery and certificate URL schemes. |
| Download filenames could break response headers | Normalize filenames for safe attachment headers and set `nosniff`; successful private resume downloads retain `private, no-store`. |
| Admin pages lacked explicit framing controls | Added frame denial, a limited CSP for framing/base/forms/objects, no-referrer and no-index headers. This is not a complete script-nonce CSP. |
| Pagination accepted fractions, infinity and repeated search values | Added bounded integer parsing and bounded string searches. |
| Notes could continue to appear dirty after a successful save | Track the last acknowledged saved value; editing clears the temporary Saved indicator. |
| Settings fetched password hashes unnecessarily | Select only account-list fields needed for display. |
| Login page claimed every action was attributed despite no audit trail | Replaced the unsupported claim with accurate sign-in guidance. |

Relevant implementation files: `src/lib/admin/actions.ts`, `src/lib/admin/session.ts`,
`src/lib/admin/auth.ts`, `src/lib/security.ts`, `src/lib/rate-limit.ts`,
`src/lib/file-signature.ts`, `src/app/api/admin/`, `src/app/api/contact/route.ts`,
`src/app/api/careers/route.ts`, and `next.config.ts`.

The Next.js version change covers the maintained upstream advisories for
[AVIF image optimization remote code execution](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)
and [image optimization SSRF](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4).
Advisory presence alone does not prove that a particular deployment was exploited.

## Validation results

- Production build and TypeScript: passed on Next.js 16.3.8.
- `npm run test:security`: 12 tests passed.
- Existing gallery upload and leadership tests: 10 tests passed.
- Fixture-based checks of the actual handler/action source: all four upload
  endpoints reject anonymous, read-only, unknown-role, cross-origin and spoofed-type
  requests; both public forms handle throttling/outages and send escaped
  notifications to the intended recipients; all 21 protected admin actions deny
  unauthorized callers before data access. External storage and email services
  were mocked in these checks.
- Actual database rate-limit test: 8 concurrent attempts against an isolated key
  allowed exactly 3 at a configured limit of 3; expiry reset worked. The test key
  was deleted afterward.
- Actual localhost production HTTP checks: 7 panel pages redirect anonymous users;
  a format-valid forged session is denied; all 5 private APIs reject anonymous
  requests; the username field and security headers are present; foreign R2 image
  URLs are rejected; `.env.local` is not served.
- Admin/backend/config lint: passed. Full-project lint reports 6 errors and
  47 warnings in untouched public-site components, including MobileNav,
  ProjectShowcase, AboutGallery and CTA. These are outside this admin review's edits.
- `npm audit --omit=dev`: 0 reported vulnerabilities. Full audit still reports
  9 development-tool dependency findings: 5 high through the braces/ESLint chain
  and 4 moderate through the esbuild/Drizzle tooling chain. The suggested forced
  fixes downgrade major tooling versions and were not applied.
- No `.env` file is tracked. A comparison of configured secret values against
  tracked files up to 2 MB found no matches. Git history and external logs were
  not assessed.

## Feature review and remaining work

| Priority | Item | Status / next step |
| --- | --- | --- |
| Before production rollout | Deploy patched application | The source and configured database are updated. The hosted app needs redeployment. |
| Before production rollout | Gmail credential rotation | The app password was shared in chat. Generate a replacement, revoke the shared password and update local/hosted secrets. |
| High | Upload size behavior on Vercel | Current forms advertise 5–10 MB while uploads pass through application functions. Vercel documents a 4.5 MB request payload limit. Use authenticated signed/direct uploads with server-side verification, or reduce all advertised/client/server limits consistently. This flow was not redesigned in this review. |
| High | MFA and recovery | Not implemented. Add MFA and an audited recovery process for administrator accounts. |
| High | Durable audit history | Not implemented. Record who changed statuses, notes, content, accounts and deletions, with time and record IDs. Avoid putting credentials or candidate documents in logs. |
| High | Development-tool advisories | Resolve the remaining dependency chains using supported compatible releases; avoid forced downgrades that break the existing project. |
| Medium | Team management inside Settings | Account names/roles are visible to owners, but creating/resetting users remains a terminal operation. Add owner-only account creation, role changes and deactivation, protecting the last active owner. |
| Medium | Session management | Sign-out and password-version revocation exist. A device/session list and a revoke-other-sessions control do not. |
| Medium | Reliable notification delivery | Saved submissions survive SMTP failures, but failed messages have no durable retry queue or delivery status. Add an outbox and retry worker. |
| Medium | Spam/abuse controls | Database limits are active. CAPTCHA/honeypots, upload malware scanning and hosting-level WAF controls are not implemented. IP limits only trust Vercel's platform header; self-hosted deployments need their own trusted proxy/IP policy. |
| Medium | Storage cleanup and retention | Define candidate data retention and orphan-file cleanup; verify backup and restore procedures. |
| Medium | Recovery from backend outages | Some detail pages still display Not Found when a database read fails. Add distinct error/retry states and operational alerts. |
| Optional | Reporting and workflow | Search, status filters, pagination, notes, blog/careers editing, galleries, certificates, leadership editing and private resume downloads exist. CSV exports, record assignment, follow-up reminders and richer analytics remain possible additions. |

Vercel's upload constraints are documented in
[Functions limits](https://vercel.com/docs/functions/limitations) and its
[direct upload guidance](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions).
The IP-header trust rule follows
[Vercel request-header documentation](https://vercel.com/docs/headers/request-headers).

## Running the checks and preparing another environment

```bash
npm run db:setup-security
npm run test:security
node --import tsx --test src/lib/admin/gallery-upload.test.ts src/lib/admin/leadership-input.test.ts
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

`db:setup-security` applies the additive, idempotent
`drizzle/0004_security_rate_limits.sql` migration. It has already been applied to
the database configured in this workspace. Apply it to any other target database
before deploying these changes there: missing limiter storage intentionally blocks
logins and submissions. Counters expire after 15 minutes and expired rows are
cleaned during requests. Admin passwords, roles, sessions and existing business
records were preserved by the setup.

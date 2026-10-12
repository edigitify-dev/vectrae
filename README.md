This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Form notification emails

Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local` using the sending Gmail
account and its Google app password. Spaces in the app password are removed
automatically. Keep these values server-only and out of Git.

Careers submissions notify `Hr@vectrae.com`; contact enquiries notify
`enquiry@vectrae.com`. Replies go to the applicant or enquirer. Submissions are
saved to the database before Next.js schedules the email with `after`. SMTP
failures are logged without rejecting a saved submission.

Run `npm run email:verify` to check Gmail connectivity and authentication without
sending a message. This does not confirm recipient existence or inbox delivery.

For the hosted site, configure the same two secret variables in the Vercel
project's required environments and redeploy. `.env.local` configures local
development only.

## Admin usernames

See [the admin security and feature review](ADMIN_SECURITY_REVIEW.md) for the
completed security fixes, validation results and remaining feature priorities.
Before deploying to another environment, run `npm run db:setup-security` against
its database. This additive migration enables shared login and submission limits.

Admins sign in using a username and password. The dashboard shows the account's
display name and username instead of a personal email when a username is assigned.

Assign a generated username to an existing account without resetting its password:

```bash
npm run admin:username -- --id ACCOUNT_UUID
```

This applies the additive username migration, prints the saved username, and can
be rerun safely. Add `--username chosen-username` to choose a specific username.
Existing accounts without a username can enter their email in the username field.

After applying the migration, `npm run admin:create` accepts `--username`; omitted
usernames are generated for new accounts and preserved when resetting existing
accounts. Recreating an account resets its password and revokes its sessions.

Deploy the updated app for username sign-in to appear on the hosted site.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# vectrae

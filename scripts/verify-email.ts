import { verifyMailConfiguration, HR_EMAIL, ENQUIRY_EMAIL } from "../src/lib/mailer";

async function main() {
  await verifyMailConfiguration();
  console.log("Gmail SMTP connection and authentication succeeded.");
  console.log(`Careers notifications: ${HR_EMAIL}`);
  console.log(`Contact notifications: ${ENQUIRY_EMAIL}`);
  console.log("No messages were sent. Inbox delivery has not been tested.");
}

main().catch((error: unknown) => {
  // Avoid logging SMTP internals or credentials.
  const code = (error as { code?: string } | null)?.code;
  console.error(`Gmail SMTP verification failed${code ? ` (${code})` : ""}. Check credentials and SMTP connectivity.`);
  process.exitCode = 1;
});

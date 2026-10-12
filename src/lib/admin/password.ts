import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";
import { promisify } from "node:util";

// `promisify` resolves to the 3-argument overload, which drops the tuning
// options, so the options-bearing signature is restated here.
const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
// Deliberately above Node's defaults — admin logins are rare, so a slow hash costs
// nothing in practice but meaningfully raises the price of an offline crack.
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** Produces `scrypt$<saltHex>$<keyHex>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);

  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (password.length > MAX_PASSWORD_LENGTH) return false;
  const [scheme, saltHex, keyHex] = stored.split("$");

  if (scheme !== "scrypt" || !/^[0-9a-f]{32}$/i.test(saltHex ?? "") || !/^[0-9a-f]{128}$/i.test(keyHex ?? "")) {
    return false;
  }

  const expected = Buffer.from(keyHex, "hex");

  if (expected.length !== KEY_LENGTH) {
    return false;
  }

  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), KEY_LENGTH, SCRYPT_OPTIONS);

  return timingSafeEqual(derived, expected);
}

export function describePasswordProblem(password: string): string | null {
  if (password.length > MAX_PASSWORD_LENGTH) return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include an uppercase letter, a lowercase letter, and a number.";
  }

  return null;
}

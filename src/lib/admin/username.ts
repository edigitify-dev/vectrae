export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isAdminUsername(value: string): boolean {
  return /^[a-z0-9][a-z0-9._-]{2,63}$/.test(value);
}

export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "dev-change-me";

export function adminUsername() {
  return (process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME).trim();
}

export function adminPassword() {
  return (process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY || DEFAULT_ADMIN_PASSWORD).trim();
}

export function tokenSecret() {
  return (process.env.ADMIN_KEY || process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

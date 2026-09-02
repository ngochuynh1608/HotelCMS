import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { adminPassword, adminUsername, tokenSecret } from "./config.js";
import { findAdminByUsername } from "./db.js";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function signAdminToken(username) {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${username}.${exp}`;
  const sig = createHmac("sha256", tokenSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token) return false;
  if (safeEqual(token, adminPassword()) || safeEqual(token, tokenSecret())) {
    return true;
  }
  const parts = String(token).split(".");
  if (parts.length !== 3) return false;
  const [username, exp, sig] = parts;
  if (!username || !exp || !sig || Date.now() > Number(exp)) return false;
  const expected = createHmac("sha256", tokenSecret()).update(`${username}.${exp}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function loginWithCredentials({ username, password, key } = {}) {
  const pass = String(password || key || "").trim();
  const user = String(username || (key ? adminUsername() : "")).trim();
  if (!pass) return null;

  if (user && safeEqual(user, adminUsername()) && safeEqual(pass, adminPassword())) {
    return { username: adminUsername(), token: signAdminToken(adminUsername()) };
  }

  if (user) {
    const row = await findAdminByUsername(user);
    if (row?.password_hash && bcrypt.compareSync(pass, row.password_hash)) {
      return { username: row.username, token: signAdminToken(row.username) };
    }
  }

  return null;
}

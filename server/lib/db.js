import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { adminPassword, adminUsername, hasDatabase } from "./config.js";
import { loadSeedContent, readJsonFile, writeJsonFile } from "./jsonFile.js";

let pool;
let schemaReady;

function sslOption() {
  const url = process.env.DATABASE_URL || "";
  if (!url || url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return { rejectUnauthorized: false };
}

export function getPool() {
  if (!hasDatabase()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1,
      ssl: sslOption(),
    });
  }
  return pool;
}

async function migrate() {
  const db = getPool();
  if (!db) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const contentCount = await db.query("SELECT 1 FROM site_content WHERE id = 1 LIMIT 1");
  if (contentCount.rowCount === 0) {
    await db.query(
      "INSERT INTO site_content (id, data, updated_at) VALUES (1, $1::jsonb, NOW())",
      [JSON.stringify(loadSeedContent())]
    );
  }

  const adminCount = await db.query("SELECT 1 FROM admins LIMIT 1");
  if (adminCount.rowCount === 0) {
    const hash = bcrypt.hashSync(adminPassword(), 10);
    await db.query("INSERT INTO admins (username, password_hash) VALUES ($1, $2)", [
      adminUsername(),
      hash,
    ]);
  }
}

export async function ensureSchema() {
  if (!hasDatabase()) return;
  if (!schemaReady) schemaReady = migrate();
  await schemaReady;
}

export async function findAdminByUsername(username) {
  if (!hasDatabase()) return null;
  await ensureSchema();
  const result = await getPool().query("SELECT username, password_hash FROM admins WHERE username = $1 LIMIT 1", [
    username,
  ]);
  return result.rows[0] || null;
}

export async function getContent() {
  if (!hasDatabase()) return readJsonFile();
  try {
    await ensureSchema();
    const result = await getPool().query("SELECT data FROM site_content WHERE id = 1 LIMIT 1");
    return result.rows[0]?.data || loadSeedContent();
  } catch (err) {
    console.error("PostgreSQL read failed, falling back to JSON", err);
    return readJsonFile();
  }
}

export async function saveContent(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("Invalid body");
  }
  if (!hasDatabase()) {
    writeJsonFile(obj);
    return;
  }
  await ensureSchema();
  await getPool().query(
    `INSERT INTO site_content (id, data, updated_at)
     VALUES (1, $1::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [JSON.stringify(obj)]
  );
  try {
    writeJsonFile(obj);
  } catch {
    /* Vercel filesystem is read-only */
  }
}

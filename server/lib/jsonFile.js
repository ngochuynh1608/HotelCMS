import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { DEFAULT_SITE_CONTENT } from "../../src/site-content/defaultContent.js";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "..", "..", "data", "site-content.json");

export function loadSeedContent() {
  try {
    return require("../../data/site-content.json");
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function readJsonFile() {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, "utf8"));
    }
  } catch (err) {
    console.error("Failed to read site-content.json", err);
  }
  return loadSeedContent();
}

export function writeJsonFile(obj) {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), "utf8");
}

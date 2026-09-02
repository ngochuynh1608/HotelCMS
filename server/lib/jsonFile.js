import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_SITE_CONTENT } from "../../src/site-content/defaultContent.js";
import seedContent from "../../data/site-content.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "..", "..", "data", "site-content.json");

function readJsonAt(path) {
  try {
    if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.error("Failed to read", path, err);
  }
  return null;
}

export function loadSeedContent() {
  if (seedContent && typeof seedContent === "object" && seedContent.brandName) {
    return seedContent;
  }
  return (
    readJsonAt(DATA_FILE) ||
    readJsonAt(join(process.cwd(), "data", "site-content.json")) ||
    DEFAULT_SITE_CONTENT
  );
}

export function readJsonFile() {
  return (
    readJsonAt(DATA_FILE) ||
    readJsonAt(join(process.cwd(), "data", "site-content.json")) ||
    loadSeedContent()
  );
}

export function writeJsonFile(obj) {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), "utf8");
}

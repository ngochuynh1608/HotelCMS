import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";
import { DEFAULT_SITE_CONTENT } from "../src/site-content/defaultContent.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8787;
const DATA_DIR = join(__dirname, "..", "data");
const DATA_FILE = join(DATA_DIR, "site-content.json");
const PUBLIC_DIR = join(__dirname, "..", "public");
const UPLOAD_DIR = join(PUBLIC_DIR, "uploads");
const MAX_UPLOAD_BYTES = 18 * 1024 * 1024;
const ADMIN_KEY = process.env.ADMIN_KEY || "dev-change-me";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "mov"]);
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
};

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(DATA_FILE)) {
  writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf8");
}

function readJson() {
  return JSON.parse(readFileSync(DATA_FILE, "utf8"));
}

function writeJson(obj) {
  writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), "utf8");
}

function checkAdmin(req) {
  const auth = req.headers.get("authorization") || "";
  const keyHeader = req.headers.get("x-admin-key") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return (bearer || keyHeader) === ADMIN_KEY;
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === "OPTIONS" && path.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (path === "/api/auth/login" && req.method === "POST") {
      try {
        const body = await req.json();
        const key = typeof body?.key === "string" ? body.key : "";
        if (key && key === ADMIN_KEY) {
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Bad request" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
    }

    if (path === "/api/content" && req.method === "GET") {
      return new Response(JSON.stringify(readJson()), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          ...CORS_HEADERS,
        },
      });
    }

    if (path === "/api/upload" && req.method === "POST") {
      if (!checkAdmin(req)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
      try {
        const formData = await req.formData();
        const file = formData.get("file");
        if (!file || typeof file === "string" || !file.name) {
          return new Response(JSON.stringify({ error: "Missing file" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }
        const orig = file.name || "upload";
        const ext = (extname(orig).slice(1).toLowerCase() || "bin").split("?")[0];
        if (!ALLOWED_EXT.has(ext)) {
          return new Response(JSON.stringify({ error: `Loai file khong cho phep: .${ext}` }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }
        const buf = Buffer.from(await file.arrayBuffer());
        if (buf.length > MAX_UPLOAD_BYTES) {
          return new Response(JSON.stringify({ error: "File qua lon (toi da ~18MB)" }), {
            status: 413,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }
        if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
        const outPath = join(UPLOAD_DIR, name);
        writeFileSync(outPath, buf);
        const url = `/uploads/${name}`;
        return new Response(JSON.stringify({ ok: true, url }), {
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e.message) }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
    }

    if (path === "/api/content" && req.method === "PUT") {
      const auth = req.headers.get("authorization") || "";
      const keyHeader = req.headers.get("x-admin-key") || "";
      const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
      const token = bearer || keyHeader;
      if (token !== ADMIN_KEY) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
      try {
        const body = await req.json();
        if (!body || typeof body !== "object") throw new Error("Invalid body");
        writeJson(body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e.message) }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
    }

    if (path === "/api/health") {
      return new Response("ok");
    }

    // Serve uploaded files so /uploads/... never 404 (even without Vite static).
    if (req.method === "GET" && path.startsWith("/uploads/")) {
      try {
        const name = path.slice("/uploads/".length);
        if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
          return new Response("Not found", { status: 404 });
        }
        const filePath = join(UPLOAD_DIR, name);
        if (!existsSync(filePath)) {
          return new Response("Not found", { status: 404 });
        }
        const ext = extname(name).slice(1).toLowerCase();
        const mimeMap = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          webp: "image/webp",
          gif: "image/gif",
          svg: "image/svg+xml",
          mp4: "video/mp4",
          webm: "video/webm",
          mov: "video/quicktime",
        };
        const mime = mimeMap[ext] || "application/octet-stream";
        const buf = readFileSync(filePath);
        return new Response(buf, {
          headers: { "Content-Type": mime },
        });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Bliss content API http://localhost:${PORT} (ADMIN_KEY=${ADMIN_KEY === "dev-change-me" ? "default dev-change-me" : "set"})`);

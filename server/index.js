import { existsSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loginWithCredentials, verifyAdminToken } from "./lib/auth.js";
import { getContent, saveContent } from "./lib/db.js";
import { corsHeaders, getTokenFromWebHeaders } from "./lib/http.js";
import { handleClientUpload, saveUploadedFile } from "./lib/upload.js";
import { adminPassword, hasBlobToken, hasDatabase } from "./lib/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8787;
const PUBLIC_DIR = join(__dirname, "..", "public");
const UPLOAD_DIR = join(PUBLIC_DIR, "uploads");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...corsHeaders(),
    },
  });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === "OPTIONS" && path.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (path === "/api/auth/login" && req.method === "POST") {
      try {
        const body = await req.json();
        const session = await loginWithCredentials(body);
        if (!session) return json({ error: "Invalid credentials" }, 401);
        return json({ ok: true, token: session.token, username: session.username });
      } catch {
        return json({ error: "Bad request" }, 400);
      }
    }

    if (path === "/api/content" && req.method === "GET") {
      try {
        return json(await getContent());
      } catch (err) {
        return json({ error: String(err.message || err) }, 500);
      }
    }

    if (path === "/api/upload" && req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      try {
        if (contentType.includes("application/json")) {
          const body = await req.json();
          const result = await handleClientUpload(req, body);
          return json(result);
        }
        const token = getTokenFromWebHeaders(req.headers);
        if (!verifyAdminToken(token)) return json({ error: "Unauthorized" }, 401);
        const formData = await req.formData();
        const url = await saveUploadedFile(formData.get("file"));
        return json({ ok: true, url });
      } catch (err) {
        const message = String(err.message || err);
        const status = message === "Unauthorized" ? 401 : 500;
        return json({ error: message }, status);
      }
    }

    if (path === "/api/content" && req.method === "PUT") {
      const token = getTokenFromWebHeaders(req.headers);
      if (!verifyAdminToken(token)) return json({ error: "Unauthorized" }, 401);
      try {
        const body = await req.json();
        await saveContent(body);
        return json({ ok: true });
      } catch (err) {
        return json({ error: String(err.message || err) }, 400);
      }
    }

    if (path === "/api/health") {
      return json({ ok: true, database: hasDatabase(), blob: hasBlobToken() });
    }

    if (req.method === "GET" && path.startsWith("/uploads/")) {
      try {
        const name = path.slice("/uploads/".length);
        if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
          return new Response("Not found", { status: 404 });
        }
        const filePath = join(UPLOAD_DIR, name);
        if (!existsSync(filePath)) return new Response("Not found", { status: 404 });
        const file = Bun.file(filePath);
        return new Response(file);
      } catch {
        return new Response("Not found", { status: 404 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

const store = hasDatabase() ? "PostgreSQL" : "JSON file";
const blob = hasBlobToken() ? "Vercel Blob" : "local /uploads";
console.log(
  `Hotel CMS API http://localhost:${PORT} (${store}, ${blob}; default admin ${adminPassword() === "dev-change-me" ? "admin / dev-change-me" : "from env"})`
);

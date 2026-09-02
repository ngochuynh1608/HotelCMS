import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import { handleUpload } from "@vercel/blob/client";
import { hasBlobToken } from "./config.js";
import { verifyAdminToken } from "./auth.js";
import { getTokenFromRequest } from "./http.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, "..", "..", "public", "uploads");

export const MAX_UPLOAD_BYTES = 18 * 1024 * 1024;
export const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "mov"]);

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function extensionOf(name) {
  return (extname(name || "").slice(1).toLowerCase() || "bin").split("?")[0];
}

export async function saveUploadedFile(file) {
  if (!file || typeof file === "string" || !file.name) {
    throw new Error("Missing file");
  }
  const ext = extensionOf(file.name);
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`Loai file khong cho phep: .${ext}`);
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_UPLOAD_BYTES) {
    throw new Error("File qua lon (toi da ~18MB)");
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  if (hasBlobToken()) {
    const blob = await put(`uploads/${name}`, buf, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
  writeFileSync(join(UPLOAD_DIR, name), buf);
  return `/uploads/${name}`;
}

export async function handleClientUpload(request, body) {
  if (!hasBlobToken()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  return handleUpload({
    request,
    body,
    onBeforeGenerateToken: async (pathname) => {
      const token = getTokenFromRequest(request);
      if (!verifyAdminToken(token)) {
        throw new Error("Unauthorized");
      }
      const ext = extensionOf(pathname);
      if (ext && !ALLOWED_EXT.has(ext)) {
        throw new Error(`Loai file khong cho phep: .${ext}`);
      }
      return {
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: true,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
      };
    },
    onUploadCompleted: async () => {},
  });
}

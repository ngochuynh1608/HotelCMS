import { getAdminKey } from "./session.js";

function adminHeaders() {
  const token = getAdminKey();
  return token ? { "X-Admin-Key": token } : {};
}

async function uploadViaForm(file) {
  const endpoints = ["/api/upload"];
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    endpoints.push("http://localhost:8787/api/upload");
  }

  let lastErr = null;
  for (const endpoint of endpoints) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: adminHeaders(),
        body: fd,
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (r.status === 502) {
          lastErr = new Error("Upload 502");
          continue;
        }
        throw new Error(j.error || `Upload ${r.status}`);
      }
      if (!j.url) throw new Error("Upload thiếu url");
      return j;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("Upload thất bại");
}

export async function uploadHotelFile(file) {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (!isLocal) {
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(`uploads/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        headers: adminHeaders(),
      });
      if (blob?.url) return { ok: true, url: blob.url };
    } catch {
      /* fall through to FormData + server put() */
    }
  }
  return uploadViaForm(file);
}

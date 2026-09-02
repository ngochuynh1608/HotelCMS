import { json, setCors, getTokenFromHeadersObject, readRawBody } from "../server/lib/http.js";
import { verifyAdminToken } from "../server/lib/auth.js";
import { handleClientUpload, saveUploadedFile } from "../server/lib/upload.js";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const contentType = String(req.headers["content-type"] || "");
  try {
    const raw = await readRawBody(req);

    if (contentType.includes("application/json")) {
      const body = JSON.parse(raw.toString("utf8") || "{}");
      const result = await handleClientUpload(req, body);
      return json(res, 200, result);
    }

    const token = getTokenFromHeadersObject(req.headers);
    if (!verifyAdminToken(token)) {
      return json(res, 401, { error: "Unauthorized" });
    }

    const proto = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || "localhost";
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value == null) continue;
      headers.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }
    const webReq = new Request(`${proto}://${host}${req.url}`, {
      method: "POST",
      headers,
      body: raw,
      duplex: "half",
    });
    const form = await webReq.formData();
    const url = await saveUploadedFile(form.get("file"));
    return json(res, 200, { ok: true, url });
  } catch (err) {
    const message = String(err.message || err);
    const status = message === "Unauthorized" ? 401 : 400;
    return json(res, status, { error: message });
  }
}

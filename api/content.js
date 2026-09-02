import { json, setCors, getTokenFromHeadersObject } from "../server/lib/http.js";
import { getContent, saveContent } from "../server/lib/db.js";
import { verifyAdminToken } from "../server/lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET") {
    try {
      const data = await getContent();
      return json(res, 200, data);
    } catch (err) {
      return json(res, 500, { error: String(err.message || err) });
    }
  }

  if (req.method === "PUT") {
    const token = getTokenFromHeadersObject(req.headers);
    if (!verifyAdminToken(token)) {
      return json(res, 401, { error: "Unauthorized" });
    }
    try {
      await saveContent(req.body);
      return json(res, 200, { ok: true });
    } catch (err) {
      return json(res, 400, { error: String(err.message || err) });
    }
  }

  return json(res, 405, { error: "Method not allowed" });
}

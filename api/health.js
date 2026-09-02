import { json, setCors } from "../server/lib/http.js";
import { hasBlobToken, hasDatabase } from "../server/lib/config.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.statusCode = 204;
    res.end();
    return;
  }
  return json(res, 200, {
    ok: true,
    database: hasDatabase(),
    blob: hasBlobToken(),
  });
}

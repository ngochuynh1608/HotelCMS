import { json, setCors } from "../../server/lib/http.js";
import { loginWithCredentials } from "../../server/lib/auth.js";

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

  try {
    const body = req.body || {};
    const session = await loginWithCredentials(body);
    if (!session) {
      return json(res, 401, { error: "Invalid credentials" });
    }
    return json(res, 200, { ok: true, token: session.token, username: session.username });
  } catch (err) {
    return json(res, 400, { error: String(err.message || err) });
  }
}

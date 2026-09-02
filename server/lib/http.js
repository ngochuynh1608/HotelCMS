const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
};

export function setCors(res) {
  for (const [key, value] of Object.entries(CORS)) {
    res.setHeader(key, value);
  }
}

export function json(res, status, data) {
  setCors(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

export function corsHeaders() {
  return { ...CORS };
}

export function getTokenFromHeadersObject(headers) {
  const auth = String(headers.authorization || headers.Authorization || "");
  const keyHeader = String(headers["x-admin-key"] || headers["X-Admin-Key"] || "");
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return (bearer || keyHeader).trim();
}

export function getTokenFromWebHeaders(headers) {
  const auth = headers.get("authorization") || "";
  const keyHeader = headers.get("x-admin-key") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return (bearer || keyHeader).trim();
}

export function getTokenFromRequest(request) {
  if (request && typeof request.headers?.get === "function") {
    return getTokenFromWebHeaders(request.headers);
  }
  return getTokenFromHeadersObject(request?.headers || {});
}

export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

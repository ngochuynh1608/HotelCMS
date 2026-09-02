import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_SITE_CONTENT } from "./defaultContent.js";
import { ContentContext } from "./context.js";

function isJsonResponse(res) {
  return (res.headers.get("content-type") || "").includes("json");
}

function isPlaceholderContent(data) {
  return !data || data.brandName === "Bliss Hotel";
}

async function fetchJson(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok || !isJsonResponse(r)) return null;
  return r.json();
}

async function fetchSiteContent() {
  let apiData = null;
  let fileData = null;
  try {
    apiData = await fetchJson("/api/content");
  } catch {
    /* try static */
  }
  try {
    fileData = await fetchJson("/site-content.json");
  } catch {
    /* fallback */
  }
  if (apiData && !isPlaceholderContent(apiData)) return apiData;
  if (fileData && !isPlaceholderContent(fileData)) return fileData;
  return apiData || fileData || DEFAULT_SITE_CONTENT;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSiteContent();
      setContent(data);
    } catch (e) {
      setError(e);
      setContent(DEFAULT_SITE_CONTENT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      loading,
      error,
      reload,
    }),
    [content, loading, error, reload]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

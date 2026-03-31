import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_SITE_CONTENT } from "./defaultContent.js";
import { ContentContext } from "./context.js";

async function fetchSiteContent() {
  try {
    const r = await fetch("/api/content", { cache: "no-store" });
    if (r.ok) return await r.json();
  } catch {
    /* try static */
  }
  try {
    const r = await fetch("/site-content.json", { cache: "no-store" });
    if (r.ok) return await r.json();
  } catch {
    /* fallback */
  }
  return DEFAULT_SITE_CONTENT;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
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

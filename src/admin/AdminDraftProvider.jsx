import "../admin.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { DEFAULT_SITE_CONTENT } from "../site-content/defaultContent.js";
import { useSiteContent } from "../site-content/useSiteContent.js";
import { AdminDraftContext } from "./draftContext.js";
import { getAdminKey } from "./session.js";

export function AdminDraftProvider() {
  const { content, loading, reload } = useSiteContent();
  const [draft, setDraft] = useState(null);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && content) {
      setDraft(JSON.parse(JSON.stringify(content)));
    }
  }, [content, loading]);

  const save = useCallback(async () => {
    const key = getAdminKey() || "dev-change-me";
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": key,
        },
        body: JSON.stringify(draft),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      setMsg("Da luu thanh cong.");
      await reload();
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }, [draft, reload]);

  const downloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [draft]);

  const importJson = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        setDraft(data);
        setMsg("Da nhap JSON vao ban nhap. Nhan Luu de ghi len server.");
        setErr(null);
      } catch {
        setErr("File JSON khong hop le.");
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  }, []);

  const resetDefault = useCallback(() => {
    if (!window.confirm("Reset ve mac dinh (chua luu server)?")) return;
    setDraft(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)));
    setMsg("Da reset ban nhap. Nhan Luu de ghi len server.");
  }, []);

  const reloadDraft = useCallback(async () => {
    setMsg(null);
    setErr(null);
    await reload();
  }, [reload]);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      loading,
      save,
      saving,
      msg,
      err,
      setMsg,
      setErr,
      downloadJson,
      importJson,
      resetDefault,
      reloadDraft,
    }),
    [draft, loading, save, saving, msg, err, downloadJson, importJson, resetDefault, reloadDraft]
  );

  if (loading || !draft) {
    return (
      <div className="admin">
        <div className="admin-loading">Dang tai noi dung...</div>
      </div>
    );
  }

  return (
    <AdminDraftContext.Provider value={value}>
      <Outlet />
    </AdminDraftContext.Provider>
  );
}

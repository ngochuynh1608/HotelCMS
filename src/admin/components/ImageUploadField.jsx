import { useState } from "react";
import { Field } from "./Field.jsx";
import { getAdminKey } from "../session.js";

/**
 * @param {{
 *  label: string,
 *  value: string,
 *  onChange: (url: string) => void,
 *  hint?: string,
 *  accept?: string,
 *  showUrl?: boolean,
 *  multiple?: boolean
 * }} props
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  showUrl = true,
  multiple = false,
}) {
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState(null);

  async function uploadToApi(file) {
    const candidates = ["/api/upload"];
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      candidates.push("http://localhost:8787/api/upload");
    }

    let lastErr = null;
    for (const endpoint of candidates) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const r = await fetch(endpoint, {
          method: "POST",
          headers: { "X-Admin-Key": getAdminKey() || "dev-change-me" },
          body: fd,
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) {
          // 502 from Vite proxy: thử endpoint Bun trực tiếp.
          if (r.status === 502) {
            lastErr = new Error("Upload 502");
            continue;
          }
          throw new Error(j.error || `Upload ${r.status}`);
        }
        return j;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("Upload thất bại");
  }

  async function upload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setLocalErr(null);
    try {
      for (const file of files) {
        const j = await uploadToApi(file);
        if (j.url) onChange(j.url);
      }
    } catch (err) {
      const msg = String(err.message || err);
      setLocalErr(msg.includes("502") ? "Upload lỗi 502. Kiểm tra server Bun hoặc chạy lại dev:full." : msg);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const isVideo = value && /\.(mp4|webm|mov)(\?|$)/i.test(value);

  return (
    <Field label={label} hint={hint}>
      <div className={`admin-image-upload${showUrl ? "" : " admin-image-upload--no-url"}`}>
        {showUrl ? (
          <input
            type="url"
            className="admin-image-url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... hoặc tải lên"
          />
        ) : null}
        <label className="admin-btn admin-btn-upload">
          {busy ? "..." : "Tải lên"}
          <input type="file" accept={accept} hidden onChange={upload} disabled={busy} multiple={multiple} />
        </label>
      </div>
      {localErr ? <small className="admin-field-hint admin-field-hint--err">{localErr}</small> : null}
      {value ? (
        <div className="admin-upload-preview">
          {isVideo ? (
            <video src={value} className="admin-thumb-preview" muted playsInline controls />
          ) : (
            <img src={value} alt="" className="admin-thumb-preview" />
          )}
        </div>
      ) : null}
    </Field>
  );
}

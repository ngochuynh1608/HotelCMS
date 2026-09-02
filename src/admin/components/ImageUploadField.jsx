import { useState } from "react";
import { Field } from "./Field.jsx";
import { uploadHotelFile } from "../uploadFile.js";

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

  async function upload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setLocalErr(null);
    try {
      for (const file of files) {
        const j = await uploadHotelFile(file);
        if (j.url) onChange(j.url);
      }
    } catch (err) {
      const msg = String(err.message || err);
      setLocalErr(
        msg.includes("502")
          ? "Upload lỗi 502. Chạy bun server (npm run dev:full) hoặc kiểm tra Vercel Blob / DATABASE_URL."
          : msg
      );
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

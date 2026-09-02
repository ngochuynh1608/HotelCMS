import { useMemo, useState } from "react";
import { Field } from "./Field.jsx";
import { uploadHotelFile } from "../uploadFile.js";

/**
 * @param {{
 *  label: string,
 *  images: Array<{src: string, alt?: string}>,
 *  representative: string,
 *  onChangeImages: (next: Array<{src: string, alt?: string}>) => void,
 *  onChangeRepresentative: (src: string) => void,
 *  hint?: string,
 *  accept?: string
 * }} props
 */
export function MultiImageUploadField({
  label,
  images,
  representative,
  onChangeImages,
  onChangeRepresentative,
  hint,
  accept = "image/*",
}) {
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState(null);

  const list = useMemo(() => (images || []).filter(Boolean), [images]);
  const rep = representative || "";

  async function uploadToApi(file) {
    return uploadHotelFile(file);
  }

  async function uploadFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setBusy(true);
    setLocalErr(null);
    try {
      const uploaded = [];
      for (const file of files) {
        const j = await uploadToApi(file);
        if (!j.url) throw new Error("Upload thiếu url");
        uploaded.push({ src: j.url, alt: "" });
      }

      const nextImages = [...list, ...uploaded];
      onChangeImages(nextImages);

      if (!rep && uploaded[0]?.src) {
        onChangeRepresentative(uploaded[0].src);
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

  function deleteImage(imgIndex) {
    const img = list[imgIndex];
    if (!img) return;
    if (!window.confirm(`Xóa ảnh này?`)) return;

    const nextImages = list.filter((_, i) => i !== imgIndex);
    onChangeImages(nextImages);

    if (rep && img.src === rep) {
      const nextRep = nextImages[0]?.src || "";
      onChangeRepresentative(nextRep);
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="admin-multi-image-upload">
        <label className={`admin-btn admin-btn-upload${busy ? " is-disabled" : ""}`}>
          {busy ? "Đang tải..." : "Tải lên ảnh"}
          <input type="file" multiple accept={accept} hidden onChange={uploadFiles} disabled={busy} />
        </label>

        {localErr ? <small className="admin-field-hint admin-field-hint--err">{localErr}</small> : null}

        {list.length ? (
          <div className="admin-multi-image-grid">
            {list.map((img, idx) => {
              const isRep = !!rep && img.src === rep;
              return (
                <div key={img.src + idx} className={`admin-multi-thumb${isRep ? " is-active" : ""}`}>
                  <img src={img.src} alt={img.alt || ""} className="admin-multi-thumb-img" />

                  <div className="admin-multi-thumb-meta">
                    <button
                      type="button"
                      className={`admin-multi-rep${isRep ? " is-active" : ""}`}
                      onClick={() => onChangeRepresentative(img.src)}
                    >
                      {isRep ? "Ảnh đại diện" : "Chọn đại diện"}
                    </button>

                    <button type="button" className="admin-multi-del" onClick={() => deleteImage(idx)}>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </Field>
  );
}


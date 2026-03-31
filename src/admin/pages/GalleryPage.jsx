import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function GalleryPage() {
  const { draft, setDraft } = useAdminDraft();
  const gallery = draft.gallery || {};

  return (
    <div className="admin-panel">
      <h2>Thư viện ảnh</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input
              type="text"
              value={gallery.sectionTitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  gallery: { ...gallery, sectionTitle: { ...gallery.sectionTitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input
              type="text"
              value={gallery.sectionTitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  gallery: { ...gallery, sectionTitle: { ...gallery.sectionTitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="Mô tả (VI)">
            <textarea
              value={gallery.sectionSubtitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  gallery: { ...gallery, sectionSubtitle: { ...gallery.sectionSubtitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Mô tả (EN)">
            <textarea
              value={gallery.sectionSubtitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  gallery: { ...gallery, sectionSubtitle: { ...gallery.sectionSubtitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        {(gallery.images || []).map((g, i) => (
          <div key={i} className="admin-item row2">
            <ImageUploadField
              label="Ảnh"
              value={g.src || ""}
              accept="image/*"
              showUrl={false}
              onChange={(url) => {
                const images = [...(gallery.images || [])];
                images[i] = { ...images[i], src: url };
                setDraft({ ...draft, gallery: { ...gallery, images } });
              }}
            />
            <Field label="Alt">
              <input
                type="text"
                value={g.alt || ""}
                onChange={(e) => {
                  const images = [...(gallery.images || [])];
                  images[i] = { ...images[i], alt: e.target.value };
                  setDraft({ ...draft, gallery: { ...gallery, images } });
                }}
              />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <button
                type="button"
                className="admin-btn"
                onClick={() => {
                  const images = (gallery.images || []).filter((_, j) => j !== i);
                  setDraft({ ...draft, gallery: { ...gallery, images } });
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setDraft({
              ...draft,
              gallery: { ...gallery, images: [...(gallery.images || []), { src: "", alt: "" }] },
            })
          }
        >
          + Thêm ảnh thư viện
        </button>
      </div>
    </div>
  );
}

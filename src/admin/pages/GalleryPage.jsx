import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";
import { IconToolbarTrash } from "../toolbarIcons.jsx";

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
        <ImageUploadField
          label="Tải nhiều ảnh vào thư viện"
          value=""
          accept="image/*"
          showUrl={false}
          multiple
          hint="Có thể chọn nhiều file cùng lúc, ảnh sẽ được thêm vào danh sách bên dưới."
          onChange={(url) => {
            if (!url) return;
            const images = [...(gallery.images || []), { src: url, alt: "" }];
            setDraft({ ...draft, gallery: { ...gallery, images } });
          }}
        />
        <div className="admin-gallery-grid">
          {(gallery.images || []).map((g, i) => (
            <div key={i} className="admin-gallery-item">
              <div className="admin-gallery-item-inner">
                {g.src ? (
                  <img src={g.src} alt={g.alt || ""} className="admin-gallery-thumb" />
                ) : (
                  <div className="admin-intro-thumb-placeholder" style={{ height: 110 }}>
                    Chưa có ảnh
                  </div>
                )}
                <button
                  type="button"
                  className="admin-gallery-delete"
                  title="Xóa ảnh"
                  aria-label="Xóa ảnh"
                  onClick={() => {
                    const images = (gallery.images || []).filter((_, j) => j !== i);
                    setDraft({ ...draft, gallery: { ...gallery, images } });
                  }}
                >
                  <IconToolbarTrash />
                </button>
              </div>
              <input
                type="text"
                className="admin-gallery-alt"
                placeholder="Alt / mô tả ảnh"
                value={g.alt || ""}
                onChange={(e) => {
                  const images = [...(gallery.images || [])];
                  images[i] = { ...images[i], alt: e.target.value };
                  setDraft({ ...draft, gallery: { ...gallery, images } });
                }}
              />
            </div>
          ))}
        </div>
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

import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function AmenitiesPage() {
  const { draft, setDraft } = useAdminDraft();
  const amenities = draft.amenities || {};

  return (
    <div className="admin-panel">
      <h2>Tiện ích nổi bật</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input
              type="text"
              value={amenities.sectionTitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  amenities: { ...amenities, sectionTitle: { ...amenities.sectionTitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input
              type="text"
              value={amenities.sectionTitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  amenities: { ...amenities, sectionTitle: { ...amenities.sectionTitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="Mô tả (VI)">
            <textarea
              value={amenities.sectionSubtitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  amenities: { ...amenities, sectionSubtitle: { ...amenities.sectionSubtitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Mô tả (EN)">
            <textarea
              value={amenities.sectionSubtitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  amenities: { ...amenities, sectionSubtitle: { ...amenities.sectionSubtitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        {(amenities.items || []).map((a, i) => (
          <div key={i} className="admin-item">
            <h4>Tiện ích {i + 1}</h4>
            <div className="row2">
              <Field label="Tiêu đề (VI)">
                <input
                  type="text"
                  value={typeof a.title === "object" ? a.title?.vi || "" : a.title || ""}
                  onChange={(e) => {
                    const items = [...(amenities.items || [])];
                    const nextTitle =
                      typeof a.title === "object" ? { ...a.title, vi: e.target.value } : { vi: e.target.value, en: "" };
                    items[i] = { ...items[i], title: nextTitle };
                    setDraft({ ...draft, amenities: { ...amenities, items } });
                  }}
                />
              </Field>
              <Field label="Tiêu đề (EN)">
                <input
                  type="text"
                  value={typeof a.title === "object" ? a.title?.en || "" : ""}
                  onChange={(e) => {
                    const items = [...(amenities.items || [])];
                    const base = typeof a.title === "object" ? a.title : { vi: a.title || "", en: "" };
                    items[i] = { ...items[i], title: { ...base, en: e.target.value } };
                    setDraft({ ...draft, amenities: { ...amenities, items } });
                  }}
                />
              </Field>
            </div>
            <div className="row2">
              <Field label="Mô tả (VI)">
                <textarea
                  value={typeof a.desc === "object" ? a.desc?.vi || "" : a.desc || ""}
                  onChange={(e) => {
                    const items = [...(amenities.items || [])];
                    const nextDesc =
                      typeof a.desc === "object" ? { ...a.desc, vi: e.target.value } : { vi: e.target.value, en: "" };
                    items[i] = { ...items[i], desc: nextDesc };
                    setDraft({ ...draft, amenities: { ...amenities, items } });
                  }}
                />
              </Field>
              <Field label="Mô tả (EN)">
                <textarea
                  value={typeof a.desc === "object" ? a.desc?.en || "" : ""}
                  onChange={(e) => {
                    const items = [...(amenities.items || [])];
                    const base = typeof a.desc === "object" ? a.desc : { vi: a.desc || "", en: "" };
                    items[i] = { ...items[i], desc: { ...base, en: e.target.value } };
                    setDraft({ ...draft, amenities: { ...amenities, items } });
                  }}
                />
              </Field>
            </div>
            <div className="row2">
              <ImageUploadField
                label="Ảnh"
                value={a.image || ""}
                accept="image/*"
                showUrl={false}
                onChange={(url) => {
                  const items = [...(amenities.items || [])];
                  items[i] = { ...items[i], image: url };
                  setDraft({ ...draft, amenities: { ...amenities, items } });
                }}
              />
              <Field label="Alt">
                <input
                  type="text"
                  value={a.alt || ""}
                  onChange={(e) => {
                    const items = [...(amenities.items || [])];
                    items[i] = { ...items[i], alt: e.target.value };
                    setDraft({ ...draft, amenities: { ...amenities, items } });
                  }}
                />
              </Field>
            </div>
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                const items = (amenities.items || []).filter((_, j) => j !== i);
                setDraft({ ...draft, amenities: { ...amenities, items } });
              }}
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setDraft({
              ...draft,
              amenities: {
                ...amenities,
                items: [
                  ...(amenities.items || []),
                  { title: { vi: "", en: "" }, desc: { vi: "", en: "" }, image: "", alt: "" },
                ],
              },
            })
          }
        >
          + Thêm tiện ích
        </button>
      </div>
    </div>
  );
}

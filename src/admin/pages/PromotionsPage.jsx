import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function PromotionsPage() {
  const { draft, setDraft } = useAdminDraft();
  const promotions = draft.promotions || {};

  return (
    <div className="admin-panel">
      <h2>Khuyến mãi</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input
              type="text"
              value={promotions.sectionTitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  promotions: { ...promotions, sectionTitle: { ...promotions.sectionTitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input
              type="text"
              value={promotions.sectionTitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  promotions: { ...promotions, sectionTitle: { ...promotions.sectionTitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="Mô tả (VI)">
            <textarea
              value={promotions.sectionSubtitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  promotions: { ...promotions, sectionSubtitle: { ...promotions.sectionSubtitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Mô tả (EN)">
            <textarea
              value={promotions.sectionSubtitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  promotions: { ...promotions, sectionSubtitle: { ...promotions.sectionSubtitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        {(promotions.items || []).map((p, i) => (
          <div key={i} className="admin-item">
            <h4>Ưu đãi {i + 1}</h4>
            <Field label="Tiêu đề">
              <input
                type="text"
                value={p.title || ""}
                onChange={(e) => {
                  const items = [...(promotions.items || [])];
                  items[i] = { ...items[i], title: e.target.value };
                  setDraft({ ...draft, promotions: { ...promotions, items } });
                }}
              />
            </Field>
            <Field label="Mô tả">
              <textarea
                value={p.desc || ""}
                onChange={(e) => {
                  const items = [...(promotions.items || [])];
                  items[i] = { ...items[i], desc: e.target.value };
                  setDraft({ ...draft, promotions: { ...promotions, items } });
                }}
              />
            </Field>
            <div className="row2">
              <ImageUploadField
                label="Ảnh"
                value={p.image || ""}
                accept="image/*"
                showUrl={false}
                onChange={(url) => {
                  const items = [...(promotions.items || [])];
                  items[i] = { ...items[i], image: url };
                  setDraft({ ...draft, promotions: { ...promotions, items } });
                }}
              />
              <Field label="Alt">
                <input
                  type="text"
                  value={p.alt || ""}
                  onChange={(e) => {
                    const items = [...(promotions.items || [])];
                    items[i] = { ...items[i], alt: e.target.value };
                    setDraft({ ...draft, promotions: { ...promotions, items } });
                  }}
                />
              </Field>
            </div>
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                const items = (promotions.items || []).filter((_, j) => j !== i);
                setDraft({ ...draft, promotions: { ...promotions, items } });
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
              promotions: {
                ...promotions,
                items: [...(promotions.items || []), { title: "", desc: "", image: "", alt: "" }],
              },
            })
          }
        >
          + Thêm ưu đãi
        </button>
      </div>
    </div>
  );
}

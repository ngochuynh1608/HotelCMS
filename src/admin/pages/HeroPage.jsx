import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";
import { IconToolbarTrash } from "../toolbarIcons.jsx";

const ACCEPT_HERO_IMAGE = "image/*";
const ACCEPT_HERO_VIDEO = "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";

export default function HeroPage() {
  const { draft, setDraft } = useAdminDraft();
  const h = draft.hero || {};

  return (
    <div className="admin-panel">
      <h2>Hero — slideshow (ảnh/video)</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Thời gian mỗi slide (ms)">
            <input
              type="number"
              min={2000}
              step={100}
              value={h.slideIntervalMs || 6600}
              onChange={(e) => setDraft({ ...draft, hero: { ...h, slideIntervalMs: Number(e.target.value) || 6600 } })}
            />
          </Field>
        </div>
        {["eyebrow", "titleLine1", "titleLine2", "subtitle"].map((key) => {
          const viBase =
            key === "eyebrow"
              ? "Chữ nhỏ"
              : key === "titleLine1"
                ? "Dòng tiêu đề 1"
                : key === "titleLine2"
                  ? "Dòng tiêu đề 2"
                  : "Mô tả";
          return (
            <div key={key} className="row2">
            <Field label={`${viBase} (VI)`}>
              <input
                type="text"
                value={h[key]?.vi || ""}
                onChange={(e) => setDraft({ ...draft, hero: { ...h, [key]: { ...h[key], vi: e.target.value } } })}
              />
            </Field>
            <Field label={`${viBase} (EN)`}>
              <input
                type="text"
                value={h[key]?.en || ""}
                onChange={(e) => setDraft({ ...draft, hero: { ...h, [key]: { ...h[key], en: e.target.value } } })}
              />
            </Field>
            </div>
          );
        })}
        <div className="row2">
          <Field label="CTA chính — href (ví dụ: /#lien-he)">
            <input
              type="text"
              value={h.primaryCta?.href || ""}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...h, primaryCta: { ...h.primaryCta, href: e.target.value } } })
              }
            />
          </Field>
          <Field label="CTA phụ — href">
            <input
              type="text"
              value={h.secondaryCta?.href || ""}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...h, secondaryCta: { ...h.secondaryCta, href: e.target.value } } })
              }
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="CTA chính (VI)">
            <input
              type="text"
              value={h.primaryCta?.vi || ""}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...h, primaryCta: { ...h.primaryCta, vi: e.target.value } } })
              }
            />
          </Field>
          <Field label="CTA chính (EN)">
            <input
              type="text"
              value={h.primaryCta?.en || ""}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...h, primaryCta: { ...h.primaryCta, en: e.target.value } } })
              }
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="CTA phụ (VI)">
            <input
              type="text"
              value={h.secondaryCta?.vi || ""}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...h, secondaryCta: { ...h.secondaryCta, vi: e.target.value } } })
              }
            />
          </Field>
          <Field label="CTA phụ (EN)">
            <input
              type="text"
              value={h.secondaryCta?.en || ""}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...h, secondaryCta: { ...h.secondaryCta, en: e.target.value } } })
              }
            />
          </Field>
        </div>

        <p className="admin-subhead">Danh sách slide</p>
        {(h.slides || []).map((slide, i) => (
          <div key={i} className="admin-item">
            <h4>Slide {i + 1}</h4>
            <div className="admin-item-actions-top">
              <button
                type="button"
                className="admin-btn"
                onClick={() => {
                  if (!window.confirm(`Xóa slide ${i + 1}?`)) return;
                  const slides = (h.slides || []).filter((_, j) => j !== i);
                  setDraft({ ...draft, hero: { ...h, slides } });
                }}
              >
                <span className="admin-btn-icon">
                  <IconToolbarTrash />
                </span>
                Xóa slide
              </button>
            </div>
            <div className="row2">
              <Field label="Loại">
                <select
                  value={slide.type || "image"}
                  onChange={(e) => {
                    const slides = [...(h.slides || [])];
                    slides[i] = { ...slides[i], type: e.target.value };
                    setDraft({ ...draft, hero: { ...h, slides } });
                  }}
                >
                  <option value="image">image</option>
                  <option value="video">video</option>
                </select>
              </Field>
            </div>
            <ImageUploadField
              label="Nguồn (ảnh hoặc video)"
              value={slide.src || ""}
              accept={slide.type === "video" ? ACCEPT_HERO_VIDEO : ACCEPT_HERO_IMAGE}
              showUrl={false}
              onChange={(url) => {
                const slides = [...(h.slides || [])];
                slides[i] = { ...slides[i], src: url };
                setDraft({ ...draft, hero: { ...h, slides } });
              }}
            />
            {slide.type === "video" ? (
              <ImageUploadField
                label="Poster (ảnh tạm cho video)"
                hint="Tùy chọn"
                value={slide.poster || ""}
                accept="image/*"
                showUrl={false}
                onChange={(url) => {
                  const slides = [...(h.slides || [])];
                  slides[i] = { ...slides[i], poster: url };
                  setDraft({ ...draft, hero: { ...h, slides } });
                }}
              />
            ) : null}
            <Field label="Alt">
              <input
                type="text"
                value={slide.alt || ""}
                onChange={(e) => {
                  const slides = [...(h.slides || [])];
                  slides[i] = { ...slides[i], alt: e.target.value };
                  setDraft({ ...draft, hero: { ...h, slides } });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setDraft({
              ...draft,
              hero: { ...h, slides: [...(h.slides || []), { type: "image", src: "", alt: "" }] },
            })
          }
        >
          + Thêm slide
        </button>
      </div>
    </div>
  );
}

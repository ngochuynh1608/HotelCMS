import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { IconToolbarTrash } from "../toolbarIcons.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function IntroPage() {
  const { draft, setDraft } = useAdminDraft();
  const intro = draft.intro || {};
  const aboutPage = draft.aboutPage || {};

  return (
    <div className="admin-panel">
      <h2>Giới thiệu</h2>
      <div className="admin-fields">
        <p className="admin-subhead">Section giới thiệu (trang chủ)</p>
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input
              type="text"
              value={intro.sectionTitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  intro: { ...intro, sectionTitle: { ...intro.sectionTitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input
              type="text"
              value={intro.sectionTitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  intro: { ...intro, sectionTitle: { ...intro.sectionTitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        {(intro.paragraphs || []).map((p, i) => (
          <div key={i} className="row2">
            <Field label={`Đoạn ${i + 1} (VI)`}>
              <textarea
                value={p.vi || ""}
                onChange={(e) => {
                  const paragraphs = [...(intro.paragraphs || [])];
                  paragraphs[i] = { ...paragraphs[i], vi: e.target.value };
                  setDraft({ ...draft, intro: { ...intro, paragraphs } });
                }}
              />
            </Field>
            <Field label={`Đoạn ${i + 1} (EN)`}>
              <textarea
                value={p.en || ""}
                onChange={(e) => {
                  const paragraphs = [...(intro.paragraphs || [])];
                  paragraphs[i] = { ...paragraphs[i], en: e.target.value };
                  setDraft({ ...draft, intro: { ...intro, paragraphs } });
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
              intro: {
                ...intro,
                paragraphs: [...(intro.paragraphs || []), { vi: "", en: "" }],
              },
            })
          }
        >
          + Thêm đoạn giới thiệu (trang chủ)
        </button>

        <p className="admin-subhead">Slider ảnh (Giới thiệu)</p>
        <ImageUploadField
          label="Tải ảnh slider giới thiệu"
          value=""
          accept="image/*"
          showUrl={false}
          hint="Chọn nhiều lần để thêm nhiều ảnh slider."
          onChange={(url) => {
            if (!url) return;
            const sliderImages = [...(intro.sliderImages || []), { src: url, alt: "" }];
            setDraft({ ...draft, intro: { ...intro, sliderImages } });
          }}
        />
        <div className="admin-intro-slider-grid">
          {(intro.sliderImages || []).map((img, i) => (
            <div key={i} className="admin-intro-thumb">
              <button
                type="button"
                className="admin-intro-thumb-remove"
                title="Xóa ảnh khỏi slider"
                aria-label="Xóa ảnh khỏi slider"
                onClick={() => {
                  const sliderImages = (intro.sliderImages || []).filter((_, j) => j !== i);
                  setDraft({ ...draft, intro: { ...intro, sliderImages } });
                }}
              >
                <IconToolbarTrash />
              </button>
              {img.src ? (
                <img src={img.src} alt={img.alt || ""} className="admin-intro-thumb-img" />
              ) : (
                <div className="admin-intro-thumb-placeholder">Chưa có ảnh</div>
              )}
              <div className="admin-intro-thumb-field">
                <input
                  type="text"
                  placeholder="Alt / mô tả ảnh"
                  value={img.alt || ""}
                  onChange={(e) => {
                    const sliderImages = [...(intro.sliderImages || [])];
                    sliderImages[i] = { ...sliderImages[i], alt: e.target.value };
                    setDraft({ ...draft, intro: { ...intro, sliderImages } });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="admin-subhead">Page giới thiệu (/about-us)</p>
        <div className="row2">
          <Field label="Tiêu đề hero">
            <input
              type="text"
              value={aboutPage.heroTitle || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  aboutPage: { ...aboutPage, heroTitle: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Mô tả hero">
            <input
              type="text"
              value={aboutPage.heroSubtitle || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  aboutPage: { ...aboutPage, heroSubtitle: e.target.value },
                })
              }
            />
          </Field>
        </div>
        <ImageUploadField
          label="Ảnh banner page giới thiệu"
          value={aboutPage.heroImage || ""}
          accept="image/*"
          showUrl={false}
          hint="Ảnh nền cho hero /about-us. Nên dùng ảnh ngang rộng."
          onChange={(url) =>
            setDraft({
              ...draft,
              aboutPage: { ...aboutPage, heroImage: url },
            })
          }
        />
        <Field label='Tiêu đề "Cau Chuyen Thuong Hieu" (VI / EN)'>
          <div className="row2">
            <input
              type="text"
              placeholder="VI"
              value={aboutPage.sectionTitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  aboutPage: {
                    ...aboutPage,
                    sectionTitle: { ...aboutPage.sectionTitle, vi: e.target.value },
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="EN"
              value={aboutPage.sectionTitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  aboutPage: {
                    ...aboutPage,
                    sectionTitle: { ...aboutPage.sectionTitle, en: e.target.value },
                  },
                })
              }
            />
          </div>
        </Field>
        {(aboutPage.paragraphs || []).map((p, i) => (
          <div key={i} className="row2">
            <Field label={`Đoạn page ${i + 1} (VI)`}>
              <textarea
                value={p.vi || ""}
                onChange={(e) => {
                  const paragraphs = [...(aboutPage.paragraphs || [])];
                  paragraphs[i] = { ...paragraphs[i], vi: e.target.value };
                  setDraft({ ...draft, aboutPage: { ...aboutPage, paragraphs } });
                }}
              />
            </Field>
            <Field label={`Đoạn page ${i + 1} (EN)`}>
              <textarea
                value={p.en || ""}
                onChange={(e) => {
                  const paragraphs = [...(aboutPage.paragraphs || [])];
                  paragraphs[i] = { ...paragraphs[i], en: e.target.value };
                  setDraft({ ...draft, aboutPage: { ...aboutPage, paragraphs } });
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
              aboutPage: {
                ...aboutPage,
                paragraphs: [...(aboutPage.paragraphs || []), { vi: "", en: "" }],
              },
            })
          }
        >
          + Thêm đoạn (page giới thiệu)
        </button>

        <p className="admin-subhead">Danh sách ảnh page giới thiệu</p>
        <ImageUploadField
          label="Tải ảnh page giới thiệu"
          value=""
          accept="image/*"
          showUrl={false}
          multiple
          hint="Có thể chọn nhiều file cùng lúc hoặc chọn nhiều lần để thêm nhiều ảnh cho phần hình ảnh /about-us."
          onChange={(url) => {
            if (!url) return;
            const galleryImages = [...(aboutPage.galleryImages || []), { src: url, alt: "" }];
            setDraft({
              ...draft,
              aboutPage: { ...aboutPage, galleryImages },
            });
          }}
        />
        <div className="admin-intro-slider-grid">
          {(aboutPage.galleryImages || []).map((img, i) => (
            <div key={i} className="admin-intro-thumb">
              <button
                type="button"
                className="admin-intro-thumb-remove"
                title="Xóa ảnh khỏi page giới thiệu"
                aria-label="Xóa ảnh khỏi page giới thiệu"
                onClick={() => {
                  const galleryImages = (aboutPage.galleryImages || []).filter((_, j) => j !== i);
                  setDraft({
                    ...draft,
                    aboutPage: { ...aboutPage, galleryImages },
                  });
                }}
              >
                <IconToolbarTrash />
              </button>
              {img.src ? (
                <img src={img.src} alt={img.alt || ""} className="admin-intro-thumb-img" />
              ) : (
                <div className="admin-intro-thumb-placeholder">Chưa có ảnh</div>
              )}
              <div className="admin-intro-thumb-field">
                <input
                  type="text"
                  placeholder="Alt / mô tả ảnh"
                  value={img.alt || ""}
                  onChange={(e) => {
                    const galleryImages = [...(aboutPage.galleryImages || [])];
                    galleryImages[i] = { ...galleryImages[i], alt: e.target.value };
                    setDraft({
                      ...draft,
                      aboutPage: { ...aboutPage, galleryImages },
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

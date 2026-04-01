import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function BrandPage() {
  const { draft, setDraft } = useAdminDraft();
  const brandSeo = draft.brandSeo || {};

  return (
    <div className="admin-panel">
      <h2>Thuong hieu &amp; chan trang</h2>
      <div className="admin-fields">
        <Field label="Ten thuong hieu (header)">
          <input
            type="text"
            value={draft.brandName || ""}
            onChange={(e) => setDraft({ ...draft, brandName: e.target.value })}
          />
        </Field>

        <ImageUploadField
          label="Logo thuong hieu (header & chan trang)"
          value={draft.brandLogo || ""}
          onChange={(url) => setDraft({ ...draft, brandLogo: url })}
          hint="Nen dung file PNG/SVG nen trong suot. Kich thuoc goi y ~120x40px."
        />

        <Field label="Chan trang">
          <input
            type="text"
            value={draft.footer || ""}
            onChange={(e) => setDraft({ ...draft, footer: e.target.value })}
          />
        </Field>

        <p className="admin-subhead">SEO & favicon</p>
        <Field label="SEO title (trang web)">
          <input
            type="text"
            value={brandSeo.title || ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                brandSeo: { ...brandSeo, title: e.target.value },
              })
            }
          />
        </Field>
        <Field label="SEO description (meta description)">
          <textarea
            value={brandSeo.description || ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                brandSeo: { ...brandSeo, description: e.target.value },
              })
            }
          />
        </Field>
        <ImageUploadField
          label="Icon / favicon"
          value={brandSeo.icon || ""}
          accept="image/png,image/webp,image/svg+xml,image/x-icon"
          showUrl={false}
          hint="Icon 32x32 / 64x64 PNG, SVG hoac .ico. Co the dung lam favicon."
          onChange={(url) =>
            setDraft({
              ...draft,
              brandSeo: { ...brandSeo, icon: url },
            })
          }
        />

        <Field label="So sao trang (1-5)">
          <input
            type="number"
            min={0}
            max={5}
            step={1}
            value={
              Number.isFinite(Number(brandSeo.sectionStars)) && Number(brandSeo.sectionStars) >= 0
                ? brandSeo.sectionStars
                : 0
            }
            onChange={(e) =>
              setDraft({
                ...draft,
                brandSeo: { ...brandSeo, sectionStars: Number(e.target.value || 0) },
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

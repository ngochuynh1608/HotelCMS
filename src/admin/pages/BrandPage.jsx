import { Field } from "../components/Field.jsx";
import { ImageUploadField } from "../components/ImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function BrandPage() {
  const { draft, setDraft } = useAdminDraft();

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
      </div>
    </div>
  );
}

import { Field } from "../components/Field.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function ContactPage() {
  const { draft, setDraft } = useAdminDraft();
  const contact = draft.contact || {};

  return (
    <div className="admin-panel">
      <h2>Liên hệ</h2>
      <div className="admin-fields">
        {["sectionTitle", "sectionSubtitle", "infoTitle", "socialTitle", "socialDescription"].map((key) => (
          <div key={key} className="row2">
            <Field label={`${key} (VI)`}>
              <input
                type="text"
                value={contact[key]?.vi || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...contact, [key]: { ...contact[key], vi: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label={`${key} (EN)`}>
              <input
                type="text"
                value={contact[key]?.en || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...contact, [key]: { ...contact[key], en: e.target.value } },
                  })
                }
              />
            </Field>
          </div>
        ))}
        <p className="admin-subhead">Dòng liên hệ</p>
        {(contact.lines || []).map((line, i) => (
          <div key={i} className="admin-item row2">
            <Field label="Nhãn (VI)">
              <input
                type="text"
                value={line.label?.vi || ""}
                onChange={(e) => {
                  const lines = [...(contact.lines || [])];
                  lines[i] = { ...lines[i], label: { ...lines[i].label, vi: e.target.value } };
                  setDraft({ ...draft, contact: { ...contact, lines } });
                }}
              />
            </Field>
            <Field label="Nhãn (EN)">
              <input
                type="text"
                value={line.label?.en || ""}
                onChange={(e) => {
                  const lines = [...(contact.lines || [])];
                  lines[i] = { ...lines[i], label: { ...lines[i].label, en: e.target.value } };
                  setDraft({ ...draft, contact: { ...contact, lines } });
                }}
              />
            </Field>
            <Field label="Giá trị">
              <input
                type="text"
                value={line.value || ""}
                onChange={(e) => {
                  const lines = [...(contact.lines || [])];
                  lines[i] = { ...lines[i], value: e.target.value };
                  setDraft({ ...draft, contact: { ...contact, lines } });
                }}
              />
            </Field>
          </div>
        ))}
        <p className="admin-subhead">Mạng xã hội</p>
        {(contact.socialLinks || []).map((s, i) => (
          <div key={s.id || i} className="admin-item">
            <div className="row2">
              <Field label="platform (facebook | instagram)">
                <input
                  type="text"
                  value={s.platform || ""}
                  onChange={(e) => {
                    const socialLinks = [...(contact.socialLinks || [])];
                    socialLinks[i] = { ...socialLinks[i], platform: e.target.value };
                    setDraft({ ...draft, contact: { ...contact, socialLinks } });
                  }}
                />
              </Field>
            <Field label="Nhãn hiển thị">
                <input
                  type="text"
                  value={s.label || ""}
                  onChange={(e) => {
                    const socialLinks = [...(contact.socialLinks || [])];
                    socialLinks[i] = { ...socialLinks[i], label: e.target.value };
                    setDraft({ ...draft, contact: { ...contact, socialLinks } });
                  }}
                />
              </Field>
            </div>
            <Field label="URL">
              <input
                type="url"
                value={s.href || ""}
                onChange={(e) => {
                  const socialLinks = [...(contact.socialLinks || [])];
                  socialLinks[i] = { ...socialLinks[i], href: e.target.value };
                  setDraft({ ...draft, contact: { ...contact, socialLinks } });
                }}
              />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

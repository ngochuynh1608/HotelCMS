import { Field } from "../components/Field.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function MenuPage() {
  const { draft, setDraft } = useAdminDraft();
  const menu = draft.menu || { items: [] };

  return (
    <div className="admin-panel">
      <h2>Menu dieu huong</h2>
      <p style={{ fontSize: "0.85rem", color: "#6a5d47", marginTop: "-0.5rem" }}>
        Chỉnh label, href, loại (route | hash | dropdown). Dropdown có mảng children.
      </p>
      <div className="admin-fields">
        {(menu.items || []).map((item, i) => (
          <div key={item.id || i} className="admin-item">
            <h4>
              Menu {i + 1} — {item.id}
            </h4>
            <div className="row2">
              <Field label="id">
                <input
                  type="text"
                  value={item.id || ""}
                  onChange={(e) => {
                    const items = [...(menu.items || [])];
                    items[i] = { ...items[i], id: e.target.value };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                />
              </Field>
              <Field label="Loai">
                <select
                  value={item.type || "route"}
                  onChange={(e) => {
                    const items = [...(menu.items || [])];
                    items[i] = { ...items[i], type: e.target.value };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                >
                  <option value="route">route</option>
                  <option value="hash">hash</option>
                  <option value="dropdown">dropdown</option>
                </select>
              </Field>
            </div>
            <div className="row2">
              <Field label="href">
                <input
                  type="text"
                  value={item.href || ""}
                  onChange={(e) => {
                    const items = [...(menu.items || [])];
                    items[i] = { ...items[i], href: e.target.value };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                />
              </Field>
              <Field label="navClass (vd: menu-booking)">
                <input
                  type="text"
                  value={item.navClass || ""}
                  onChange={(e) => {
                    const items = [...(menu.items || [])];
                    items[i] = { ...items[i], navClass: e.target.value };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                />
              </Field>
            </div>
            <div className="row2">
              <Field label="Label VI">
                <input
                  type="text"
                  value={item.labelVi || ""}
                  onChange={(e) => {
                    const items = [...(menu.items || [])];
                    items[i] = { ...items[i], labelVi: e.target.value };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                />
              </Field>
              <Field label="Label EN">
                <input
                  type="text"
                  value={item.labelEn || ""}
                  onChange={(e) => {
                    const items = [...(menu.items || [])];
                    items[i] = { ...items[i], labelEn: e.target.value };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                />
              </Field>
            </div>
            {item.type === "dropdown" ? (
              <div>
                <p className="admin-subhead">Submenu</p>
                {(item.children || []).map((c, j) => (
                  <div key={c.id || j} className="row2" style={{ marginTop: "0.5rem" }}>
                    <Field label="id con">
                      <input
                        type="text"
                        value={c.id || ""}
                        onChange={(e) => {
                          const items = [...(menu.items || [])];
                          const ch = [...(items[i].children || [])];
                          ch[j] = { ...ch[j], id: e.target.value };
                          items[i] = { ...items[i], children: ch };
                          setDraft({ ...draft, menu: { ...menu, items } });
                        }}
                      />
                    </Field>
                    <Field label="href">
                      <input
                        type="text"
                        value={c.href || ""}
                        onChange={(e) => {
                          const items = [...(menu.items || [])];
                          const ch = [...(items[i].children || [])];
                          ch[j] = { ...ch[j], href: e.target.value };
                          items[i] = { ...items[i], children: ch };
                          setDraft({ ...draft, menu: { ...menu, items } });
                        }}
                      />
                    </Field>
                    <Field label="VI">
                      <input
                        type="text"
                        value={c.labelVi || ""}
                        onChange={(e) => {
                          const items = [...(menu.items || [])];
                          const ch = [...(items[i].children || [])];
                          ch[j] = { ...ch[j], labelVi: e.target.value };
                          items[i] = { ...items[i], children: ch };
                          setDraft({ ...draft, menu: { ...menu, items } });
                        }}
                      />
                    </Field>
                    <Field label="EN">
                      <input
                        type="text"
                        value={c.labelEn || ""}
                        onChange={(e) => {
                          const items = [...(menu.items || [])];
                          const ch = [...(items[i].children || [])];
                          ch[j] = { ...ch[j], labelEn: e.target.value };
                          items[i] = { ...items[i], children: ch };
                          setDraft({ ...draft, menu: { ...menu, items } });
                        }}
                      />
                    </Field>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => {
                    const items = [...(menu.items || [])];
                    const ch = [
                      ...(items[i].children || []),
                      { id: `c-${Date.now()}`, href: "/room-detail", labelVi: "", labelEn: "" },
                    ];
                    items[i] = { ...items[i], children: ch };
                    setDraft({ ...draft, menu: { ...menu, items } });
                  }}
                >
                  + Thêm mục con
                </button>
              </div>
            ) : null}
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                const items = (menu.items || []).filter((_, j) => j !== i);
                setDraft({ ...draft, menu: { ...menu, items } });
              }}
            >
              Xóa mục menu
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setDraft({
              ...draft,
              menu: {
                ...menu,
                items: [
                  ...(menu.items || []),
                  {
                    id: `nav-${Date.now()}`,
                    type: "route",
                    href: "/",
                    labelVi: "",
                    labelEn: "",
                  },
                ],
              },
            })
          }
        >
          + Thêm mục menu
        </button>
      </div>
    </div>
  );
}

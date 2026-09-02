import { NavLink } from "react-router-dom";
import { SiteCta } from "./SiteCta.jsx";

export function MenuNav({ items, lang, closeMenu }) {
  if (!items?.length) return null;

  return items.map((item) => {
    const label = lang === "vi" ? item.labelVi : item.labelEn;
    const extra = item.navClass || "";
    const href = item.href || "/";

    if (item.type === "dropdown") {
      return (
        <div key={item.id} className="menu-dropdown">
          <SiteCta href={href} className={extra} onClick={closeMenu}>
            {label}
          </SiteCta>
          <div className="submenu">
            {(item.children || []).map((c) => (
              <NavLink
                key={c.id}
                to={{ pathname: c.href, hash: "" }}
                onClick={() => {
                  closeMenu();
                  window.scrollTo(0, 0);
                }}
              >
                {lang === "vi" ? c.labelVi : c.labelEn}
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    return (
      <SiteCta key={item.id} href={href} className={extra} onClick={closeMenu}>
        {label}
      </SiteCta>
    );
  });
}

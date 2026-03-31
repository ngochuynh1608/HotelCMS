import { NavLink } from "react-router-dom";

export function MenuNav({ items, lang, closeMenu }) {
  if (!items?.length) return null;

  return items.map((item) => {
    const label = lang === "vi" ? item.labelVi : item.labelEn;
    const extra = item.navClass || "";

    if (item.type === "dropdown") {
      return (
        <div key={item.id} className="menu-dropdown">
          <NavLink to={item.href} className={extra} onClick={closeMenu}>
            {label}
          </NavLink>
          <div className="submenu">
            {(item.children || []).map((c) => (
              <NavLink key={c.id} to={c.href} onClick={closeMenu}>
                {lang === "vi" ? c.labelVi : c.labelEn}
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    if (item.type === "hash") {
      return (
        <a key={item.id} href={item.href} className={extra} onClick={closeMenu}>
          {label}
        </a>
      );
    }

    return (
      <NavLink key={item.id} to={item.href} className={extra} onClick={closeMenu}>
        {label}
      </NavLink>
    );
  });
}

import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuNav } from "./components/MenuNav.jsx";
import { useSiteContent } from "./site-content/useSiteContent.js";
import { getRoomHref } from "./utils/roomUtils.js";

function App() {
  const { content } = useSiteContent();
  const [lang, setLang] = useState("vi");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setMobileNav(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileNav) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- close drawer when switching to desktop
      setMenuOpen(false);
    }
  }, [mobileNav]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on route change
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const menuItemsRaw = content.menu?.items || [];
  const roomItems = content.rooms?.items || [];
  const menuItems = menuItemsRaw.map((item) => {
    if (item.id !== "rooms") return item;
    return {
      ...item,
      type: "dropdown",
      children: roomItems.map((room, idx) => ({
        id: `room-${idx + 1}`,
        href: getRoomHref(room, idx),
        labelVi: room.name || `Phòng ${idx + 1}`,
        labelEn: room.name || `Room ${idx + 1}`,
      })),
    };
  });

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <NavLink to="/" className="brand" onClick={closeMenu}>
            {content.brandLogo ? (
              <img src={content.brandLogo} alt={content.brandName || "Bliss Hotel"} className="brand-logo" />
            ) : null}
            <span className="brand-text">{content.brandName || "Bliss Hotel"}</span>
          </NavLink>
          <button
            type="button"
            className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? "Dong menu" : "Mo menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-toggle-bar" aria-hidden />
            <span className="nav-toggle-bar" aria-hidden />
            <span className="nav-toggle-bar" aria-hidden />
          </button>
          <div
            className={`nav-backdrop ${menuOpen ? "is-visible" : ""}`}
            aria-hidden="true"
            onClick={closeMenu}
          />
          <nav
            id="primary-nav"
            className={`menu ${menuOpen ? "is-open" : ""}`}
            aria-label="Main Navigation"
            aria-hidden={mobileNav && !menuOpen ? true : undefined}
          >
            <MenuNav items={menuItems} lang={lang} closeMenu={closeMenu} />
            <div className="lang-switch" aria-label="Language switcher">
              <button className={`lang-btn ${lang === "vi" ? "is-active" : ""}`} type="button" onClick={() => setLang("vi")}>
                VI
              </button>
              <button className={`lang-btn ${lang === "en" ? "is-active" : ""}`} type="button" onClick={() => setLang("en")}>
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>
      <Outlet context={{ lang, setLang }} />
      <footer className="site-footer">{content.footer || "Bliss Hotel"}</footer>
    </>
  );
}

export default App;

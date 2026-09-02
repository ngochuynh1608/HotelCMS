import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuNav } from "./components/MenuNav.jsx";
import { SiteCta } from "./components/SiteCta.jsx";
import { useSiteContent } from "./site-content/useSiteContent.js";
import { getRoomHref } from "./utils/roomUtils.js";
import { getContactHref } from "./utils/contactLinks.js";

function readStoredLang() {
  try {
    const v = localStorage.getItem("hotel-lang");
    if (v === "en" || v === "vi") return v;
  } catch {
    /* ignore */
  }
  return "en";
}

function App() {
  const { content, loading } = useSiteContent();
  const [lang, setLang] = useState(readStoredLang);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === "/";

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
    document.documentElement.lang = lang === "en" ? "en" : "vi";
    try {
      localStorage.setItem("hotel-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }
    const onScroll = () => setOverHero(window.scrollY < Math.max(80, window.innerHeight * 0.5));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const id = (location.hash || "").replace(/^#\/?/, "");
    const homeSection = location.pathname === "/" && id;
    let cancelled = false;

    if (!homeSection) {
      window.scrollTo(0, 0);
      const timers = [0, 50, 150, 350].map((ms) =>
        window.setTimeout(() => {
          if (!cancelled) window.scrollTo(0, 0);
        }, ms)
      );
      return () => {
        cancelled = true;
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    const headerOffset = 86;
    let tries = 0;
    const run = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset));
        if (Math.abs(el.getBoundingClientRect().top - headerOffset) > 24 && tries++ < 40) {
          window.setTimeout(run, 50);
        }
        return;
      }
      if (tries++ < 40) window.setTimeout(run, 50);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [location.hash, location.pathname, loading]);

  // SEO: title, description, favicon
  useEffect(() => {
    if (!content) return;
    const seo = content.brandSeo || {};
    const baseTitle = seo.title || content.brandName || "Bliss Hotel";
    document.title = baseTitle;

    const desc = seo.description || "";
    if (desc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", desc);
    }

    if (seo.icon) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "icon");
        document.head.appendChild(link);
      }
      link.setAttribute("href", seo.icon);
    }
  }, [content, location.pathname]);

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
  const menuItemsRaw = content?.menu?.items || [];
  const roomItems = content?.rooms?.items || [];
  const menuItems = menuItemsRaw.map((item) => {
    if (item.id !== "rooms") return item;
    return {
      ...item,
      type: "dropdown",
      href: "/#phong",
      children: roomItems.map((room, idx) => ({
        id: `room-${idx + 1}`,
        href: getRoomHref(room, idx),
        labelVi: room.name || `Phòng ${idx + 1}`,
        labelEn: room.name || `Room ${idx + 1}`,
      })),
    };
  });

  if (loading || !content) {
    return (
      <main className="page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" aria-hidden="true" />
          <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#5c5240" }}>
            {lang === "en" ? "Loading content..." : "Đang tải nội dung..."}
          </p>
        </div>
      </main>
    );
  }

  const contact = content.contact || {};
  const showMobileBook = location.pathname !== "/reservation";

  return (
    <>
      <a className="skip-link" href="#main-content">
        {lang === "en" ? "Skip to content" : "Bỏ qua điều hướng"}
      </a>
      <header className={`site-header${isHome && overHero && !menuOpen ? " is-over-hero" : ""}`}>
        <div className="container nav">
            <NavLink to="/" className="brand" onClick={() => { closeMenu(); window.scrollTo(0, 0); }}>
            {content.brandLogo ? (
              <img src={content.brandLogo} alt={content.brandName || "Bliss Hotel"} className="brand-logo" />
            ) : (
              <span className="brand-text">{content.brandName || "Bliss Hotel"}</span>
            )}
          </NavLink>
          <button
            type="button"
            className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? (lang === "en" ? "Close menu" : "Đóng menu") : lang === "en" ? "Open menu" : "Mở menu"}
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
            aria-label={lang === "en" ? "Main navigation" : "Điều hướng chính"}
            aria-hidden={mobileNav && !menuOpen ? true : undefined}
          >
            <MenuNav items={menuItems} lang={lang} closeMenu={closeMenu} />
            <div className="lang-switch" role="group" aria-label={lang === "en" ? "Language" : "Ngôn ngữ"}>
              <button
                className={`lang-btn ${lang === "vi" ? "is-active" : ""}`}
                type="button"
                aria-pressed={lang === "vi"}
                onClick={() => setLang("vi")}
              >
                VI
              </button>
              <button
                className={`lang-btn ${lang === "en" ? "is-active" : ""}`}
                type="button"
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>
      <div id="main-content">
        <Outlet context={{ lang, setLang }} />
      </div>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-brand">{content.brandName || "Bliss Hotel"}</p>
            <p>{content.footer || ""}</p>
          </div>
          <nav className="footer-nav" aria-label={lang === "en" ? "Footer" : "Chân trang"}>
            <NavLink to={{ pathname: "/", hash: "" }} onClick={() => window.scrollTo(0, 0)}>
              {lang === "en" ? "Home" : "Trang chủ"}
            </NavLink>
            <SiteCta href="/#phong">{lang === "en" ? "Rooms" : "Phòng"}</SiteCta>
            <NavLink to={{ pathname: "/about-us", hash: "" }} onClick={() => window.scrollTo(0, 0)}>
              {lang === "en" ? "About" : "Về chúng tôi"}
            </NavLink>
            <NavLink to={{ pathname: "/reservation", hash: "" }} onClick={() => window.scrollTo(0, 0)}>
              {lang === "en" ? "Reservation" : "Đặt phòng"}
            </NavLink>
            <SiteCta href="/#lien-he">{lang === "en" ? "Contact" : "Liên hệ"}</SiteCta>
          </nav>
          <div className="footer-contact">
            {(contact.lines || []).slice(0, 4).map((line, i) => {
              const label = lang === "vi" ? line.label?.vi || line.label : line.label?.en || line.label;
              const href = getContactHref(line.value);
              return (
                <p key={i}>
                  {href ? (
                    <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                      {line.value}
                    </a>
                  ) : (
                    <>
                      {typeof label === "string" ? `${label} ` : ""}
                      {line.value}
                    </>
                  )}
                </p>
              );
            })}
          </div>
        </div>
        <p className="footer-copy">{content.footer || content.brandName || "Bliss Hotel"}</p>
      </footer>
      {showMobileBook ? (
        <SiteCta className="mobile-book-bar" href="/reservation">
          {lang === "en" ? "Book a stay" : "Đặt phòng"}
        </SiteCta>
      ) : null}
    </>
  );
}

export default App;

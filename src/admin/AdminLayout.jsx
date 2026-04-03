import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAdminSession } from "./session.js";
import { useAdminDraft } from "./useAdminDraft.js";
import { useEffect, useState } from "react";
import {
  IconAmenities,
  IconBrand,
  IconContact,
  IconGallery,
  IconHero,
  IconIntro,
  IconLogout,
  IconMenu,
  IconPromo,
  IconRooms,
} from "./navIcons.jsx";
import {
  IconToolbarDownload,
  IconToolbarHome,
  IconToolbarImport,
  IconToolbarRefresh,
  IconToolbarReset,
  IconToolbarSave,
} from "./toolbarIcons.jsx";

const NAV = [
  { to: "/admin/brand", label: "Thương hiệu & chân trang", Icon: IconBrand },
  { to: "/admin/hero", label: "Hero & slideshow", Icon: IconHero },
  { to: "/admin/intro", label: "Giới thiệu", Icon: IconIntro },
  { to: "/admin/rooms", label: "Danh sách phòng", Icon: IconRooms },
  { to: "/admin/amenities", label: "Tiện ích", Icon: IconAmenities },
  { to: "/admin/gallery", label: "Thư viện ảnh", Icon: IconGallery },
  { to: "/admin/promotions", label: "Khuyến mãi", Icon: IconPromo },
  { to: "/admin/contact", label: "Liên hệ", Icon: IconContact },
  { to: "/admin/booking", label: "Booking setting", Icon: IconContact },
  { to: "/admin/menu", label: "Menu điều hướng", Icon: IconMenu },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { save, saving, msg, err, downloadJson, importJson } = useAdminDraft();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  function logout() {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin admin-app">
      <div
        className={`admin-nav-backdrop${mobileMenuOpen ? " is-visible" : ""}`}
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
      />
      <button
        type="button"
        className={`admin-nav-toggle${mobileMenuOpen ? " is-open" : ""}`}
        aria-expanded={mobileMenuOpen}
        aria-label="Mở/đóng menu admin"
        onClick={() => setMobileMenuOpen((v) => !v)}
      >
        <span className="admin-nav-toggle-bar" aria-hidden />
        <span className="admin-nav-toggle-bar" aria-hidden />
        <span className="admin-nav-toggle-bar" aria-hidden />
      </button>
      <aside className={`admin-sidebar${mobileMenuOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar-brand">CMS</div>
        <button
          type="button"
          className="admin-sidebar-close"
          aria-label="Đóng menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          &#215;
        </button>
        <nav className="admin-nav" aria-label="Admin menu">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link${isActive ? " is-active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="admin-nav-icon" aria-hidden>
                <item.Icon />
              </span>
              <span className="admin-nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={logout}>
          <span className="admin-nav-icon" aria-hidden>
            <IconLogout />
          </span>
          <span className="admin-logout-text">Đăng xuất</span>
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-toolbar">
          <h1 className="admin-toolbar-title">Chỉnh sửa nội dung</h1>
          <div className="admin-toolbar-actions">
            <button type="button" className="admin-btn-primary" disabled={saving} onClick={save}>
              <span className="admin-btn-icon">
                <IconToolbarSave />
              </span>
              {saving ? "Đang lưu..." : "Lưu lên server"}
            </button>
            <button type="button" className="admin-btn" onClick={downloadJson}>
              <span className="admin-btn-icon">
                <IconToolbarDownload />
              </span>
              Xuất JSON
            </button>
            <label className="admin-btn admin-btn-file">
              <span className="admin-btn-icon">
                <IconToolbarImport />
              </span>
              Nhập JSON
              <input type="file" accept="application/json" onChange={importJson} hidden />
            </label>
            <Link to="/" className="admin-btn admin-link">
              <span className="admin-btn-icon">
                <IconToolbarHome />
              </span>
              Về trang chủ
            </Link>
          </div>
        </header>
        {msg ? <div className="admin-msg ok admin-flash">{msg}</div> : null}
        {err ? <div className="admin-msg err admin-flash">{err}</div> : null}
        <div className="admin-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

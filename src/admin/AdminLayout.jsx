import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminSession } from "./session.js";
import { useAdminDraft } from "./useAdminDraft.js";
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
  { to: "/admin/menu", label: "Menu điều hướng", Icon: IconMenu },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { save, saving, msg, err, reloadDraft, downloadJson, importJson, resetDefault } = useAdminDraft();

  function logout() {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">CMS</div>
        <nav className="admin-nav" aria-label="Admin menu">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link${isActive ? " is-active" : ""}`}
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
          <span>Đăng xuất</span>
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
            <button type="button" className="admin-btn" onClick={reloadDraft}>
              <span className="admin-btn-icon">
                <IconToolbarRefresh />
              </span>
              Tải lại từ server
            </button>
            <button type="button" className="admin-btn" onClick={resetDefault}>
              <span className="admin-btn-icon">
                <IconToolbarReset />
              </span>
              Reset bản nháp
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

import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { isAdminLoggedIn, setAdminSession } from "./session.js";
import "../admin.css";
import { useSiteContent } from "../site-content/useSiteContent.js";

export default function AdminLogin() {
  const { content } = useSiteContent();
  const brandName = content?.brandName || "Thương hiệu";

  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "Đăng nhập thất bại");
      }
      setAdminSession(key.trim());
      const to = location.state?.from?.pathname || "/admin";
      navigate(to, { replace: true });
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin admin-login">
      <div className="admin-login-card">
        <h1>{brandName} CMS</h1>
        <p className="admin-login-lead">Đăng nhập để chỉnh sửa nội dung website.</p>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-field-label">Mat khau / Admin key</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Nhap key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </label>
          {err ? <p className="admin-msg err">{err}</p> : null}
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <p className="admin-login-footer">
          <Link to="/">Về trang chủ</Link>
        </p>
      </div>
    </div>
  );
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "./session.js";

export function RequireAdmin() {
  const location = useLocation();
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

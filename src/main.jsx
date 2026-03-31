import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import RoomDetailPage from "./pages/RoomDetailPage.jsx";
import { ContentProvider } from "./site-content/ContentProvider.jsx";
import { AdminDraftProvider } from "./admin/AdminDraftProvider.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import { RequireAdmin } from "./admin/RequireAdmin.jsx";
import BrandPage from "./admin/pages/BrandPage.jsx";
import HeroPage from "./admin/pages/HeroPage.jsx";
import IntroPage from "./admin/pages/IntroPage.jsx";
import RoomsPage from "./admin/pages/RoomsPage.jsx";
import AmenitiesPage from "./admin/pages/AmenitiesPage.jsx";
import GalleryPage from "./admin/pages/GalleryPage.jsx";
import PromotionsPage from "./admin/pages/PromotionsPage.jsx";
import ContactPage from "./admin/pages/ContactPage.jsx";
import MenuPage from "./admin/pages/MenuPage.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<AdminDraftProvider />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="brand" replace />} />
                <Route path="brand" element={<BrandPage />} />
                <Route path="hero" element={<HeroPage />} />
                <Route path="intro" element={<IntroPage />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="amenities" element={<AmenitiesPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="menu" element={<MenuPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="about-us" element={<AboutPage />} />
            <Route path="room-detail" element={<RoomDetailPage />} />
            <Route path="room-detail/:roomId" element={<RoomDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>
);

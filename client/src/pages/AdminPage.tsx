import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminGalleryPage from "./admin/AdminGalleryPage";
import AdminMenuPage from "./admin/AdminMenuPage";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import AdminReservationsPage from "./admin/AdminReservationsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import AdminTestimonialsPage from "./admin/AdminTestimonialsPage";

export default function AdminPage() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

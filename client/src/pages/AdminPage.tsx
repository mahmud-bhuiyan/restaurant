import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminMenuPage from "./admin/AdminMenuPage";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import AdminReservationsPage from "./admin/AdminReservationsPage";

export default function AdminPage() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

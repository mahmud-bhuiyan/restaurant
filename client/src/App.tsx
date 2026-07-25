import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ReservationPage from "./pages/ReservationPage";
import SignupPage from "./pages/SignupPage";
import TestimonialsPage from "./pages/TestimonialsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PlaceholderPage
              title="About Us"
              description="Our full story and team page will be built in Module 8."
            />
          }
        />
        <Route
          path="/gallery"
          element={
            <PlaceholderPage
              title="Gallery"
              description="Photo gallery from the database will be built in Module 8."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <PlaceholderPage
              title="Contact"
              description="Full contact page will be built in Module 8. Book a table at /reservations."
            />
          }
        />
        <Route path="/testimonials" element={<TestimonialsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

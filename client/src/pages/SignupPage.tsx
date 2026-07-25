import type { FormEvent } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthFormLayout from "../components/auth/AuthFormLayout";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";
import FormError from "../components/ui/FormError";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/account" replace />;
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form);
      navigate("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      <AuthFormLayout
        eyebrow="Join Us"
        title="Create Account"
        description="Required for online ordering. Reservations and reviews stay guest-friendly."
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerLinkTo="/login"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Doe"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Input
            label="Phone (optional)"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Delivery Address (optional)"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 Main St"
          />
          <FormError message={error} />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>
      </AuthFormLayout>
    </PublicLayout>
  );
}

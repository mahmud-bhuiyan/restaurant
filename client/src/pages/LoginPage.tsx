import type { FormEvent } from "react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthFormLayout from "../components/auth/AuthFormLayout";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";
import FormError from "../components/ui/FormError";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const loggedIn = await login(email, password);
      navigate(loggedIn.role === "ADMIN" ? "/admin" : from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      <AuthFormLayout
        eyebrow="Welcome Back"
        title="Sign In"
        description="Sign in to place orders and manage your account."
        footerText="Don't have an account?"
        footerLinkText="Create one"
        footerLinkTo="/signup"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <FormError message={error} />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </AuthFormLayout>
    </PublicLayout>
  );
}

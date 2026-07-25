import type { FormEvent } from "react";
import { useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      await updateProfile(form);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-content px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">My Account</p>
            <h1 className="mt-1 font-display text-3xl text-white">
              Hello, {user?.name}
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <h2 className="font-display text-xl text-white">Profile</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                  />
                  <Input
                    label="Email"
                    value={user?.email || ""}
                    disabled
                  />
                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                  <Input
                    label="Delivery Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                  />

                  {message && (
                    <p className="text-sm text-green-400">{message}</p>
                  )}
                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg text-white">Account Type</h2>
                  <Badge variant={user?.role === "ADMIN" ? "gold" : "default"}>
                    {user?.role}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="font-display text-xl text-white">Order History</h2>
              <p className="mt-3 text-sm text-gray-500">
                No orders yet. Browse the menu and place your first order once
                ordering is live in Module 5.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-display text-xl text-white">Reservations</h2>
              <p className="mt-3 text-sm text-gray-500">
                No reservations linked to your account yet. Table booking will
                be available in Module 6.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

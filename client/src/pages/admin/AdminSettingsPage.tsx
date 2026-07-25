import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import { fetchAdminSettings, updateSettings } from "../../lib/settingsApi";
import type { AdminSiteSettings, OpeningHours } from "../../types/settings";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<AdminSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminSettings()
      .then((data) => setForm(data.settings))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, []);

  function updateHours(index: number, field: keyof OpeningHours, value: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const openingHours = [...prev.openingHours];
      openingHours[index] = { ...openingHours[index], [field]: value };
      return { ...prev, openingHours };
    });
  }

  function addHoursRow() {
    setForm((prev) =>
      prev
        ? { ...prev, openingHours: [...prev.openingHours, { days: "", time: "" }] }
        : prev,
    );
  }

  function removeHoursRow(index: number) {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            openingHours: prev.openingHours.filter((_, i) => i !== index),
          }
        : prev,
    );
  }

  function updateSocial(key: string, value: string) {
    setForm((prev) =>
      prev ? { ...prev, socialLinks: { ...prev.socialLinks, [key]: value } } : prev,
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { settings } = await updateSettings(form);
      setForm(settings);
      setMessage("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading settings…</p>;
  if (!form) return <p className="text-red-400">{error || "Failed to load"}</p>;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Settings</p>
      <h1 className="mt-1 font-display text-3xl text-white">Site Settings</h1>
      <p className="mt-2 text-gray-400">
        Content shown on About, Contact, footer, and homepage sections.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">General</h2>
          <Input
            label="Restaurant Name"
            value={form.restaurantName}
            onChange={(e) =>
              setForm((p) => p && { ...p, restaurantName: e.target.value })
            }
          />
          <Input
            label="Tagline"
            value={form.tagline}
            onChange={(e) =>
              setForm((p) => p && { ...p, tagline: e.target.value })
            }
          />
          <Textarea
            label="Short Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => p && { ...p, description: e.target.value })
            }
            rows={3}
          />
          <Input
            label="Hero Image URL"
            value={form.heroImage}
            onChange={(e) =>
              setForm((p) => p && { ...p, heroImage: e.target.value })
            }
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">Contact</h2>
          <Input
            label="Address"
            value={form.address}
            onChange={(e) =>
              setForm((p) => p && { ...p, address: e.target.value })
            }
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm((p) => p && { ...p, phone: e.target.value })
            }
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm((p) => p && { ...p, email: e.target.value })
            }
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-white">Opening Hours</h2>
            <Button type="button" size="sm" variant="outline" onClick={addHoursRow}>
              Add Row
            </Button>
          </div>
          {form.openingHours.map((row, index) => (
            <div key={index} className="flex gap-3">
              <Input
                label={index === 0 ? "Days" : undefined}
                value={row.days}
                onChange={(e) => updateHours(index, "days", e.target.value)}
                className="flex-1"
              />
              <Input
                label={index === 0 ? "Hours" : undefined}
                value={row.time}
                onChange={(e) => updateHours(index, "time", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-6"
                onClick={() => removeHoursRow(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">Social Links</h2>
          {Object.entries(form.socialLinks).map(([key, url]) => (
            <Input
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={url}
              onChange={(e) => updateSocial(key, e.target.value)}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">About Page</h2>
          <Input
            label="About Title"
            value={form.aboutTitle}
            onChange={(e) =>
              setForm((p) => p && { ...p, aboutTitle: e.target.value })
            }
          />
          <Textarea
            label="About Body (paragraphs separated by blank line)"
            value={form.aboutBody}
            onChange={(e) =>
              setForm((p) => p && { ...p, aboutBody: e.target.value })
            }
            rows={6}
          />
          <Input
            label="About Image URL"
            value={form.aboutImage}
            onChange={(e) =>
              setForm((p) => p && { ...p, aboutImage: e.target.value })
            }
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">Reservations</h2>
          <Input
            label="Max Covers Per Slot"
            type="number"
            min={1}
            value={form.maxCoversPerSlot}
            onChange={(e) =>
              setForm((p) =>
                p && { ...p, maxCoversPerSlot: Number(e.target.value) },
              )
            }
          />
        </section>

        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}

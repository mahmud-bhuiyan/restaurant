import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import {
  createGalleryImage,
  deleteGalleryImage,
  fetchGallery,
  reorderGallery,
  updateGalleryImage,
} from "../../lib/galleryApi";
import type { GalleryImage } from "../../types/gallery";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    id?: string;
    imageUrl: string;
    caption: string;
  }>({ open: false, imageUrl: "", caption: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGallery();
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.id) {
        const { image } = await updateGalleryImage(modal.id, {
          imageUrl: modal.imageUrl,
          caption: modal.caption,
        });
        setImages((prev) => prev.map((i) => (i.id === image.id ? image : i)));
      } else {
        const { image } = await createGalleryImage({
          imageUrl: modal.imageUrl,
          caption: modal.caption,
        });
        setImages((prev) => [...prev, image]);
      }
      setModal({ open: false, imageUrl: "", caption: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const reordered = [...images];
    const [item] = reordered.splice(index, 1);
    reordered.splice(target, 0, item);

    setImages(reordered);
    try {
      const { images: updated } = await reorderGallery(
        reordered.map((i) => i.id),
      );
      setImages(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed");
      load();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Gallery</p>
          <h1 className="mt-1 font-display text-3xl text-white">Photo Gallery</h1>
        </div>
        <Button
          onClick={() =>
            setModal({ open: true, imageUrl: "", caption: "" })
          }
        >
          Add Image
        </Button>
      </div>

      {loading && <p className="mt-10 text-gray-500">Loading…</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {!loading && images.length === 0 && (
        <p className="mt-10 text-gray-500">
          No images yet. Run <code className="text-gold">npm run seed:gallery</code> or add one above.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-sm border border-white/5 bg-charcoal"
          >
            <img
              src={img.imageUrl}
              alt={img.caption}
              className="aspect-video w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-white">{img.caption || "Untitled"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                >
                  ↓
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setModal({
                      open: true,
                      id: img.id,
                      imageUrl: img.imageUrl,
                      caption: img.caption,
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(img.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, imageUrl: "", caption: "" })}
        title={modal.id ? "Edit Image" : "Add Image"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Image URL"
            value={modal.imageUrl}
            onChange={(e) =>
              setModal((p) => ({ ...p, imageUrl: e.target.value }))
            }
            required
          />
          <Input
            label="Caption"
            value={modal.caption}
            onChange={(e) =>
              setModal((p) => ({ ...p, caption: e.target.value }))
            }
          />
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : "Save"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

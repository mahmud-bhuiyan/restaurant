import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  fetchMenu,
  updateCategory,
  updateItem,
} from "../../lib/menuApi";
import type { MenuCategory, MenuItem } from "../../types/menu";

type ItemForm = {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string;
};

const emptyItemForm = (categoryId = ""): ItemForm => ({
  categoryId,
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  isAvailable: true,
  isFeatured: false,
  tags: "",
});

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    id?: string;
    name: string;
    sortOrder: string;
  }>({ open: false, name: "", sortOrder: "0" });

  const [itemModal, setItemModal] = useState<{
    open: boolean;
    id?: string;
    form: ItemForm;
  }>({ open: false, form: emptyItemForm() });

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMenu();
      setCategories(data.categories);
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  async function handleCategorySubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (categoryModal.id) {
        await updateCategory(categoryModal.id, {
          name: categoryModal.name,
          sortOrder: Number(categoryModal.sortOrder),
        });
      } else {
        await createCategory({
          name: categoryModal.name,
          sortOrder: Number(categoryModal.sortOrder),
        });
      }
      setCategoryModal({ open: false, name: "", sortOrder: "0" });
      await loadMenu();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleItemSubmit(e: FormEvent) {
    e.preventDefault();
    const { form, id } = itemModal;
    const payload = {
      categoryId: form.categoryId,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (id) {
        await updateItem(id, payload);
      } else {
        await createItem(payload);
      }
      setItemModal({ open: false, form: emptyItemForm() });
      await loadMenu();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      await loadMenu();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem(id);
      await loadMenu();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function toggleItemField(
    item: MenuItem,
    field: "isAvailable" | "isFeatured",
  ) {
    try {
      await updateItem(item.id, { [field]: !item[field] });
      await loadMenu();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  }

  function openEditItem(item: MenuItem) {
    setItemModal({
      open: true,
      id: item.id,
      form: {
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: String(item.price),
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        tags: item.tags.join(", "),
      },
    });
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Menu Management</h1>
      <p className="mt-2 text-gray-400">
        Manage categories and dishes. Image URLs can be pasted until file upload
        is added later.
      </p>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      {loading && <p className="mt-8 text-gray-500">Loading…</p>}

      {!loading && (
        <>
          {/* Categories */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-white">Categories</h2>
              <Button
                size="sm"
                onClick={() =>
                  setCategoryModal({ open: true, name: "", sortOrder: "0" })
                }
              >
                Add Category
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-sm border border-charcoal-light">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-charcoal-light bg-charcoal text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Sort</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-charcoal-light/50"
                    >
                      <td className="px-4 py-3 text-white">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-400">{cat.sortOrder}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCategoryModal({
                                open: true,
                                id: cat.id,
                                name: cat.name,
                                sortOrder: String(cat.sortOrder),
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Items */}
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-white">Menu Items</h2>
              <Button
                size="sm"
                onClick={() =>
                  setItemModal({
                    open: true,
                    form: emptyItemForm(categories[0]?.id || ""),
                  })
                }
                disabled={categories.length === 0}
              >
                Add Item
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-sm border border-charcoal-light bg-charcoal p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-16 w-16 rounded-sm object-cover"
                      />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-white">{item.name}</h3>
                        <Badge variant="muted">{item.categoryName}</Badge>
                        {!item.isAvailable && (
                          <Badge variant="warning">Sold Out</Badge>
                        )}
                        {item.isFeatured && (
                          <Badge variant="gold">Featured</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        ${item.price.toFixed(2)} · {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemField(item, "isAvailable")}
                    >
                      {item.isAvailable ? "Mark Sold Out" : "Mark Available"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemField(item, "isFeatured")}
                    >
                      {item.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditItem(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-gray-500">No menu items yet.</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Category Modal */}
      <Modal
        open={categoryModal.open}
        onClose={() => setCategoryModal({ open: false, name: "", sortOrder: "0" })}
        title={categoryModal.id ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <Input
            label="Name"
            value={categoryModal.name}
            onChange={(e) =>
              setCategoryModal((p) => ({ ...p, name: e.target.value }))
            }
            required
          />
          <Input
            label="Sort Order"
            type="number"
            value={categoryModal.sortOrder}
            onChange={(e) =>
              setCategoryModal((p) => ({ ...p, sortOrder: e.target.value }))
            }
          />
          <Button type="submit" className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>

      {/* Item Modal */}
      <Modal
        open={itemModal.open}
        onClose={() => setItemModal({ open: false, form: emptyItemForm() })}
        title={itemModal.id ? "Edit Item" : "Add Item"}
        className="max-w-lg"
      >
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              value={itemModal.form.categoryId}
              onChange={(e) =>
                setItemModal((p) => ({
                  ...p,
                  form: { ...p.form, categoryId: e.target.value },
                }))
              }
              className="w-full rounded-sm border border-charcoal-light bg-charcoal-dark px-4 py-2.5 text-sm text-white"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Name"
            value={itemModal.form.name}
            onChange={(e) =>
              setItemModal((p) => ({
                ...p,
                form: { ...p.form, name: e.target.value },
              }))
            }
            required
          />
          <Textarea
            label="Description"
            rows={3}
            value={itemModal.form.description}
            onChange={(e) =>
              setItemModal((p) => ({
                ...p,
                form: { ...p.form, description: e.target.value },
              }))
            }
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={itemModal.form.price}
            onChange={(e) =>
              setItemModal((p) => ({
                ...p,
                form: { ...p.form, price: e.target.value },
              }))
            }
            required
          />
          <Input
            label="Image URL"
            value={itemModal.form.imageUrl}
            onChange={(e) =>
              setItemModal((p) => ({
                ...p,
                form: { ...p.form, imageUrl: e.target.value },
              }))
            }
            placeholder="https://..."
          />
          <Input
            label="Tags (comma-separated)"
            value={itemModal.form.tags}
            onChange={(e) =>
              setItemModal((p) => ({
                ...p,
                form: { ...p.form, tags: e.target.value },
              }))
            }
            placeholder="vegetarian, spicy"
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={itemModal.form.isAvailable}
                onChange={(e) =>
                  setItemModal((p) => ({
                    ...p,
                    form: { ...p.form, isAvailable: e.target.checked },
                  }))
                }
                className="accent-gold"
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={itemModal.form.isFeatured}
                onChange={(e) =>
                  setItemModal((p) => ({
                    ...p,
                    form: { ...p.form, isFeatured: e.target.checked },
                  }))
                }
                className="accent-gold"
              />
              Featured
            </label>
          </div>
          <Button type="submit" className="w-full">
            Save Item
          </Button>
        </form>
      </Modal>
    </div>
  );
}

import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { MenuCategory } from "../models/MenuCategory.js";
import { MenuItem } from "../models/MenuItem.js";

const router = Router();

function formatCategory(cat: InstanceType<typeof MenuCategory>) {
  return {
    id: cat._id.toString(),
    name: cat.name,
    sortOrder: cat.sortOrder,
  };
}

function formatItem(
  item: InstanceType<typeof MenuItem>,
  categoryName?: string,
) {
  return {
    id: item._id.toString(),
    categoryId: item.categoryId.toString(),
    categoryName,
    name: item.name,
    description: item.description,
    price: item.price,
    imageUrl: item.imageUrl,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    tags: item.tags,
  };
}

// ─── Public ────────────────────────────────────────────────────────────────

router.get("/", async (_req, res) => {
  try {
    const categories = await MenuCategory.find().sort({ sortOrder: 1, name: 1 });
    const items = await MenuItem.find().sort({ name: 1 });

    const categoryMap = new Map(
      categories.map((c) => [c._id.toString(), c.name]),
    );

    const grouped = categories.map((cat) => ({
      ...formatCategory(cat),
      items: items
        .filter((item) => item.categoryId.toString() === cat._id.toString())
        .map((item) => formatItem(item, cat.name)),
    }));

    res.json({
      categories: grouped,
      items: items.map((item) =>
        formatItem(item, categoryMap.get(item.categoryId.toString())),
      ),
    });
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

router.get("/featured", async (_req, res) => {
  try {
    const items = await MenuItem.find({ isFeatured: true, isAvailable: true })
      .sort({ name: 1 })
      .limit(6);

    const categoryIds = [...new Set(items.map((i) => i.categoryId.toString()))];
    const categories = await MenuCategory.find({ _id: { $in: categoryIds } });
    const categoryMap = new Map(
      categories.map((c) => [c._id.toString(), c.name]),
    );

    res.json({
      items: items.map((item) =>
        formatItem(item, categoryMap.get(item.categoryId.toString())),
      ),
    });
  } catch (err) {
    console.error("Get featured error:", err);
    res.status(500).json({ message: "Failed to fetch featured items" });
  }
});

// ─── Admin: Categories ─────────────────────────────────────────────────────

router.post("/categories", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, sortOrder } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    const category = await MenuCategory.create({
      name: name.trim(),
      sortOrder: sortOrder ?? 0,
    });

    res.status(201).json({ category: formatCategory(category) });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

router.patch(
  "/categories/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const category = await MenuCategory.findById(req.params.id);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      const { name, sortOrder } = req.body;
      if (name?.trim()) category.name = name.trim();
      if (sortOrder !== undefined) category.sortOrder = sortOrder;

      await category.save();
      res.json({ category: formatCategory(category) });
    } catch (err) {
      console.error("Update category error:", err);
      res.status(500).json({ message: "Failed to update category" });
    }
  },
);

router.delete(
  "/categories/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const itemCount = await MenuItem.countDocuments({
        categoryId: req.params.id,
      });
      if (itemCount > 0) {
        res.status(400).json({
          message: "Remove or reassign items before deleting this category",
        });
        return;
      }

      const category = await MenuCategory.findByIdAndDelete(req.params.id);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      res.json({ message: "Category deleted" });
    } catch (err) {
      console.error("Delete category error:", err);
      res.status(500).json({ message: "Failed to delete category" });
    }
  },
);

// ─── Admin: Items ──────────────────────────────────────────────────────────

router.post("/items", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      isFeatured,
      tags,
    } = req.body;

    if (!categoryId || !name?.trim() || price === undefined) {
      res
        .status(400)
        .json({ message: "Category, name, and price are required" });
      return;
    }

    const category = await MenuCategory.findById(categoryId);
    if (!category) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }

    const item = await MenuItem.create({
      categoryId,
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      imageUrl: imageUrl?.trim() || "",
      isAvailable: isAvailable ?? true,
      isFeatured: isFeatured ?? false,
      tags: tags || [],
    });

    res.status(201).json({
      item: formatItem(item, category.name),
    });
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ message: "Failed to create item" });
  }
});

router.patch("/items/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    const {
      categoryId,
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      isFeatured,
      tags,
    } = req.body;

    if (categoryId) {
      const category = await MenuCategory.findById(categoryId);
      if (!category) {
        res.status(400).json({ message: "Invalid category" });
        return;
      }
      item.categoryId = category._id;
    }

    if (name?.trim()) item.name = name.trim();
    if (description !== undefined) item.description = description.trim();
    if (price !== undefined) item.price = Number(price);
    if (imageUrl !== undefined) item.imageUrl = imageUrl.trim();
    if (isAvailable !== undefined) item.isAvailable = isAvailable;
    if (isFeatured !== undefined) item.isFeatured = isFeatured;
    if (tags !== undefined) item.tags = tags;

    await item.save();

    const category = await MenuCategory.findById(item.categoryId);
    res.json({ item: formatItem(item, category?.name) });
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
});

router.delete("/items/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

export default router;

import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { MenuCategory } from "../models/MenuCategory.js";
import { MenuItem } from "../models/MenuItem.js";

const seedData = [
  {
    name: "Starters",
    sortOrder: 1,
    items: [
      {
        name: "Pan-Seared Scallops",
        description: "Cauliflower purée, crispy pancetta, lemon beurre blanc",
        price: 28,
        imageUrl:
          "https://images.unsplash.com/photo-1559847844-d7214261f162?w=600&h=400&fit=crop",
        isFeatured: true,
        tags: ["seafood"],
      },
      {
        name: "Burrata & Heirloom Tomatoes",
        description: "Basil oil, aged balsamic, grilled sourdough",
        price: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1608897013039-7f4a5728341b?w=600&h=400&fit=crop",
        isFeatured: false,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    name: "Mains",
    sortOrder: 2,
    items: [
      {
        name: "Wagyu Beef Tenderloin",
        description: "Truffle mash, roasted bone marrow, red wine jus",
        price: 58,
        imageUrl:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
        isFeatured: true,
        tags: [],
      },
      {
        name: "Herb-Crusted Lamb Rack",
        description: "Ratatouille, rosemary jus, mint gremolata",
        price: 48,
        imageUrl:
          "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
        isFeatured: false,
        tags: [],
      },
      {
        name: "Pan-Roasted Sea Bass",
        description: "Saffron risotto, fennel salad, citrus beurre blanc",
        price: 42,
        imageUrl:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop",
        isAvailable: false,
        isFeatured: false,
        tags: ["seafood"],
      },
    ],
  },
  {
    name: "Desserts",
    sortOrder: 3,
    items: [
      {
        name: "Dark Chocolate Soufflé",
        description: "Valrhona chocolate, vanilla bean ice cream",
        price: 16,
        imageUrl:
          "https://images.unsplash.com/photo-1624353365286-3f8c62da2555?w=600&h=400&fit=crop",
        isFeatured: true,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    name: "Cocktails",
    sortOrder: 4,
    items: [
      {
        name: "Smoked Old Fashioned",
        description: "Bourbon, demerara, angostura, applewood smoke",
        price: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
        isFeatured: false,
        tags: [],
      },
    ],
  },
];

async function seedMenu() {
  const mongoUri = env.mongodbUri;
  if (!mongoUri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await connectDB(mongoUri);

  const existing = await MenuCategory.countDocuments();
  if (existing > 0) {
    console.log("Menu already seeded — skipping");
    process.exit(0);
  }

  for (const cat of seedData) {
    const category = await MenuCategory.create({
      name: cat.name,
      sortOrder: cat.sortOrder,
    });

    for (const item of cat.items) {
      await MenuItem.create({
        categoryId: category._id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: "isAvailable" in item ? item.isAvailable : true,
        isFeatured: item.isFeatured ?? false,
        tags: item.tags ?? [],
      });
    }
  }

  console.log("Menu seeded successfully");
  process.exit(0);
}

seedMenu().catch((err) => {
  console.error(err);
  process.exit(1);
});

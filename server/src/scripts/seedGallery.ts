import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { GalleryImage } from "../models/GalleryImage.js";

const SAMPLE_IMAGES = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=450&fit=crop",
    caption: "Main dining room",
    sortOrder: 0,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop",
    caption: "Chef's signature dish",
    sortOrder: 1,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=450&fit=crop",
    caption: "Wine & cocktails",
    sortOrder: 2,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=450&fit=crop",
    caption: "Private events",
    sortOrder: 3,
  },
];

async function seedGallery() {
  if (!env.mongodbUri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await connectDB(env.mongodbUri);

  const count = await GalleryImage.countDocuments();
  if (count > 0) {
    console.log(`Gallery already has ${count} images — skipping seed`);
    process.exit(0);
  }

  await GalleryImage.insertMany(SAMPLE_IMAGES);
  console.log(`Seeded ${SAMPLE_IMAGES.length} gallery images`);
  process.exit(0);
}

seedGallery().catch((err) => {
  console.error(err);
  process.exit(1);
});

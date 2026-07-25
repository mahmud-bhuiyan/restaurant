import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { UserRole } from "../types/user.js";

async function seedAdmin() {
  if (!env.mongodbUri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await connectDB(env.mongodbUri);

  const existing = await User.findOne({ email: env.adminEmail });
  if (existing) {
    console.log(`Admin already exists: ${env.adminEmail}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);

  await User.create({
    name: env.adminName,
    email: env.adminEmail,
    passwordHash,
    role: UserRole.ADMIN,
  });

  console.log(`Admin user created: ${env.adminEmail}`);
  console.log("Change the password after first login in production.");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});

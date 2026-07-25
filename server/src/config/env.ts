import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminJwtSecret:
    process.env.ADMIN_JWT_SECRET || "dev-secret-change-me-in-local",
  imgbbApiKey: process.env.IMGBB_API_KEY,
  adminEmail: process.env.ADMIN_EMAIL || "admin@gmail.com",
  adminPassword: process.env.ADMIN_PASSWORD || "User@123",
  adminName: process.env.ADMIN_NAME || "Admin",
  isProduction: process.env.NODE_ENV === "production",
};

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import reservationRoutes from "./routes/reservations.js";
import testimonialRoutes from "./routes/testimonials.js";
import galleryRoutes from "./routes/gallery.js";
import settingsRoutes from "./routes/settings.js";
import adminRoutes from "./routes/admin.js";

let dbReady = false;

export function createApp(): Express {
  const app = express();

  app.use(async (_req, _res, next) => {
    if (env.mongodbUri && !dbReady) {
      try {
        await connectDB(env.mongodbUri);
        dbReady = true;
      } catch (err) {
        console.warn("MongoDB connection failed — API will run without DB:", err);
      }
    }
    next();
  });

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (_req, res) => {
    res.type("text").send("Server is running");
  });

  app.get("/api/health", (_req, res) => {
    res.type("text").send("Health check passed");
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/menu", menuRoutes);
  app.use("/api/v1/orders", orderRoutes);
  app.use("/api/v1/reservations", reservationRoutes);
  app.use("/api/v1/testimonials", testimonialRoutes);
  app.use("/api/v1/gallery", galleryRoutes);
  app.use("/api/v1/settings", settingsRoutes);
  app.use("/api/v1/admin", adminRoutes);

  return app;
}

const app = createApp();
export default app;

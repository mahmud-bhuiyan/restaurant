import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      message: "Epicurean Haven API is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/menu", menuRoutes);

  return app;
}

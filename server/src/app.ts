import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import reservationRoutes from "./routes/reservations.js";

export function createApp(): Express {
  const app = express();

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

  return app;
}

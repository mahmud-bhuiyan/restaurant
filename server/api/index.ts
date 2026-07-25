import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { env } from "../src/config/env.js";

let app: ReturnType<typeof createApp> | undefined;
let dbReady = false;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (env.mongodbUri && !dbReady) {
    try {
      await connectDB(env.mongodbUri);
      dbReady = true;
    } catch (err) {
      console.warn("MongoDB connection failed — API will run without DB:", err);
    }
  }

  if (!app) {
    app = createApp();
  }

  app(req, res);
}

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  if (env.mongodbUri) {
    try {
      await connectDB(env.mongodbUri);
    } catch (err) {
      console.warn("MongoDB connection failed — API will run without DB:", err);
    }
  } else {
    console.warn("MONGODB_URI not set — skipping database connection");
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

start();

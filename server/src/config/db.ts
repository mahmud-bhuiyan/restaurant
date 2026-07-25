import { setServers } from "node:dns";
import mongoose from "mongoose";

const PUBLIC_DNS = ["8.8.8.8", "8.8.4.4", "1.1.1.1"];

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB(uri: string): Promise<void> {
  if (cache.conn) {
    return;
  }

  // Windows/ISP DNS often blocks Node SRV lookups for mongodb+srv URIs.
  if (uri.startsWith("mongodb+srv://")) {
    setServers(PUBLIC_DNS);
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then((connection) => {
      console.log("MongoDB connected");
      return connection;
    });
  }

  cache.conn = await cache.promise;
}

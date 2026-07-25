import { setServers } from "node:dns";
import mongoose from "mongoose";

const PUBLIC_DNS = ["8.8.8.8", "8.8.4.4", "1.1.1.1"];

export async function connectDB(uri: string): Promise<void> {
  // Windows/ISP DNS often blocks Node SRV lookups for mongodb+srv URIs.
  if (uri.startsWith("mongodb+srv://")) {
    setServers(PUBLIC_DNS);
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

import mongoose from "mongoose";

import { ENV } from "./env.js";

// bug fix

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
    process.exit(1); // 0 means success, 1 means failure
  }
};

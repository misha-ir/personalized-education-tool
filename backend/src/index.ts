import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes.js"; // Keep `.js` for ESM resolution at runtime

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pet_dev";

const app = express();
app.use(cors());
app.use(express.json());

// Enhanced health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  let dbStatus: "connected" | "disconnected" | "connecting" | "disconnecting";

  switch (mongoose.connection.readyState) {
    case 1:
      dbStatus = "connected";
      break;
    case 2:
      dbStatus = "connecting";
      break;
    case 3:
      dbStatus = "disconnecting";
      break;
    default:
      dbStatus = "disconnected";
  }

  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    serverTime: new Date().toISOString(),
    apiVersion: "1.0.0",
    dbStatus,
    dbName: mongoose.connection.name || null // null if not connected
  });
});

// API routes
app.use("/api", routes);

// Connect to MongoDB, then start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`✅ MongoDB connected to: ${mongoose.connection.name}`);
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    // Still start server for frontend integration even if DB is down
    app.listen(PORT, () => {
      console.log(`🚀 Backend running (no DB) on http://localhost:${PORT}`);
    });
  });

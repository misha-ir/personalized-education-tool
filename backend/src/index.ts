// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import filesRouter from "./routes/files.js";

const PORT = Number(process.env.PORT || 3001);
const MONGO_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pet_dev";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

async function start() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[db] connected:", MONGO_URI);
    } catch (err) {
        console.error("[db] failed to connect:", err);
        process.exit(1);
    }

    const app = express();

    app.use(cors({ origin: CORS_ORIGIN }));
    app.use(express.json());

    // Serve uploaded files if you ever want direct links (optional)
    app.use(
        "/uploads",
        express.static(path.resolve(process.cwd(), UPLOAD_DIR))
    );

    app.use("/api/files", filesRouter);

    // Minimal error handler
    app.use((err: any, _req: any, res: any, _next: any) => {
        console.error("[error]", err);
        res.status(400).json({ error: err?.message || "Request failed" });
    });

    app.listen(PORT, () => {
        console.log(`[server] http://localhost:${PORT}`);
    });
}

start();

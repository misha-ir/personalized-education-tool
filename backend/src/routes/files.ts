// src/routes/files.ts
import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises";
import FileModel from "../models/file.model.js";

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const ABS_UPLOAD_DIR = path.resolve(process.cwd(), UPLOAD_DIR);

// ensure upload dir exists
await fs.mkdir(ABS_UPLOAD_DIR, { recursive: true });

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs are allowed"));
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, ABS_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now().toString(36)}_${safe}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// GET /api/files
router.get("/", async (_req, res, next) => {
  try {
    const docs = await FileModel.find().sort({ createdAt: -1 }).lean();
    res.json(
      docs.map((d: any) => ({
        id: d._id.toString(),
        name: d.originalName,
        size: d.size,
        createdAt: d.createdAt,
        url: `/api/files/${d._id}/content`,
      }))
    );
  } catch (e) { next(e); }
});

// POST /api/files   (form field name "file")
router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const f = req.file!;
    const doc = await FileModel.create({
      originalName: f.originalname,
      storedName: f.filename,
      size: f.size,
      mimeType: f.mimetype,
      path: path.join(ABS_UPLOAD_DIR, f.filename),
    });
    res.status(201).json({
      id: doc._id.toString(),
      name: doc.originalName,
      size: doc.size,
      createdAt: doc.createdAt,
      url: `/api/files/${doc._id}/content`,
    });
  } catch (e) { next(e); }
});

// GET /api/files/:id/content
router.get("/:id/content", async (req, res, next) => {
  try {
    const doc = await FileModel.findById(req.params.id).lean();
    if (!doc) return res.sendStatus(404);
    res.setHeader("Content-Type", doc.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${doc.originalName}"`);
    res.sendFile(doc.path);
  } catch (e) { next(e); }
});

// DELETE /api/files/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const doc = await FileModel.findByIdAndDelete(req.params.id);
    if (!doc) return res.sendStatus(404);
    try { await fs.unlink((doc as any).path); } catch {}
    res.sendStatus(204);
  } catch (e) { next(e); }
});

export default router;

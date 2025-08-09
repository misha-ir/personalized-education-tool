import { Router, Request, Response } from "express";

const router = Router();

router.get("/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from API 👋" });
});

export default router;

import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// --- define your endpoints here ---

router.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

// ----------------------------------

export default router;

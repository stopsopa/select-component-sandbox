import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// --- define your endpoints here ---

router.get("/child.html", (req: Request, res: Response) => {

  

  res.json({ message: "hello world" });
});

// ----------------------------------

export default router;

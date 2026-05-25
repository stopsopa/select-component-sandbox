import { Router } from "express";

import type { Application, Request, Response, NextFunction } from "express";

import { template } from "./template.ts";

const router = Router();

router.get("/web-component.html", (req: Request, res: Response, next: NextFunction) => {
  const tmp = "composite-select/index.html";

  try {
    const content = template(tmp, {
      req,
      res,
      ...req.query,
      ...req.body,      
      _body: "web-component/body.html",
      _head: "web-component/head.html",
    });

    return res.send(content);
  } catch (e: any) {
    console.error(`Error rendering ${tmp}`, e);

    return res.status(500).send(`Template Error: ${e.message}`);
  }
});

// ----------------------------------

export default router;

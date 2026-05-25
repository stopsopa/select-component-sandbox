// used in:
//   https://stopsopa.github.io/pages/node/index.rendered.html#express-template
//
// node --env-file .env server-template.ts
// express extension: https://raw.githubusercontent.com/stopsopa/roderic/86495ef554314d388e7f6ef10ee4de6d12bcbcff/libs/express-extend-res.js?token=GHSAT0AAAAAACVQ4Q66S6J6DLZRVFB5DQLSZXEOC2Q
// pnpm install "@types/express" "@types/lodash" "@types/node" "@types/serve-index"

import path from "path";

import fs from "fs";

import express from "express";
import type { Application, Request, Response, NextFunction } from "express";

// use multer for multipart/form-data https://github.com/expressjs/multer

// https://www.npmjs.com/package/cookie-parser
// import cookieParser from "cookie-parser";

// https://stackoverflow.com/a/23613092
import serveIndex from "serve-index";

import router from "./server/html.ts";

import { template } from "./server/template.ts";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "");

const distDir = path.resolve(root, "dist");
const publicDir = path.resolve(root, "public");

const { HOST: host, PORT: portRaw } = process.env;

if (!host || !portRaw) {
  throw new Error("HOST and PORT environment variables are required");
}

const port = parseInt(portRaw, 10);

const app: Application = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(router);

app.get("/test.html", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = template("test.html", {
      req,
      res,
      ...req.query,
      ...req.body,
    });

    return res.send(content);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      return next();
    }
    console.error(`Error rendering test.html`, e);

    return res.status(500).send(`Template Error: ${e.message}`);
  }
});

app.use(
  express.static(distDir, {
    maxAge: "356d",
    index: false,
  }),
);

app.use(
  "/public",
  express.static(publicDir, {
    maxAge: "356d",
    index: false,
  }),
);

app.use(
  "/public",
  serveIndex(publicDir, {
    icons: true,
    view: "details",
    hidden: false,
  }),
);

app.listen(port, host, () => {
  console.log(`\n 🌎  Server is running ` + `http://${host}:${port}\n`);
});

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

import template from "lodash/template.js";

// use multer for multipart/form-data https://github.com/expressjs/multer

// https://www.npmjs.com/package/cookie-parser
// import cookieParser from "cookie-parser";

// https://stackoverflow.com/a/23613092
import serveIndex from "serve-index";

import router from "./server/html.js";

import render, { setDirectory, enableCache } from "./server/cacheTemplate.ts";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "");

const distDir = path.resolve(root, "dist");
const publicDir = path.resolve(root, "public");
const templatesDir = path.resolve(root, "templates");

await setDirectory(templatesDir);
enableCache(false);

const { HOST: host, PORT: portRaw } = process.env;

if (!host || !portRaw) {
  throw new Error("HOST and PORT environment variables are required");
}

const port = parseInt(portRaw, 10);

const app: Application = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(router);

function produceRender(parentFile: string, permaData?: any) {
  return function (file: string, data?: any) {
    try {
      const filePath = path.resolve(path.dirname(parentFile), file);

      const content = fs.readFileSync(filePath, "utf8");

      return template(content, {
        variable: "d",
        interpolate: /<%=([\s\S]+?)%>/g, // this somehow stops template from processing `${i}` which is what I want
        // to see exactly what is going on put debugger in file node_modules/lodash/template.js
        // in place: https://github.com/lodash/lodash/blob/4.18.1/dist/lodash.js#L14928
        // you will see before setting here interpolate: /<%=([\s\S]+?)%>/g,
        // value of sourceURL will be
        // /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|\$\{([^\\}]*(?:\\.[^\\}]*)*)\}|<%([\s\S]+?)%>|$/g
        // but when set:
        // /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|($^)|<%([\s\S]+?)%>|$/g
      })({
        ...permaData,
        ...data,
        fs,
        path,
        template: {
          file: filePath,
          dir: path.dirname(filePath),
        },
        render: produceRender(filePath, permaData),
      });
    } catch (e) {
      console.error(`_.template() error in produceRender() for ${file}`, e);

      throw new Error(`_.template() error in produceRender() for ${file}`);
    }
  };
}

app.get(/^(.*)$/, async (req: Request, res: Response, next: NextFunction) => {
  let reqPath = req.path;
  if (reqPath.endsWith("/")) {
    reqPath += "index.html";
  }

  if (reqPath.endsWith(".html")) {
    const filePath = path.join(templatesDir, reqPath);

    try {
      const stat = await fs.promises.stat(filePath);

      if (!stat.isFile()) {
        return next();
      }

      /**
       * WARNING: This method is not safe because it forwards get and post without validation to template
       */
      const render = produceRender(filePath, {
        req,
        res,
        ...req.query,
        ...req.body,
      });

      const content = render(filePath);

      return res.send(content);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        return next();
      }
      console.error(`Error rendering ${filePath}:`, e);
      return res.status(500).send(`Template Error: ${e.message}`);
    }
  }

  next();
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

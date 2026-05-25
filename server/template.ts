import path from "node:path";

import cacheTemplate from "./cacheTemplate.ts";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const web = path.resolve(__dirname, '..', "templates");

export const cachePool = cacheTemplate(true);

export const template = cachePool(path.join(web, "_noop_.html"), {});

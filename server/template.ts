import path from "node:path";

import cacheTemplate from "./cacheTemplate.ts";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const cacheEnabled = typeof process.env.DISABLE_CACHE_TEMPLATE === "undefined";

console.log(`template.ts: cache enabled: ${cacheEnabled}`);

export const web = path.resolve(__dirname, "..", "templates");

export const cachePool = cacheTemplate(cacheEnabled);

export const template = cachePool(path.join(web, "_noop_.html"), {});

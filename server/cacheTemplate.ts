import path from "node:path";
import fs from "node:fs";
import libTempate from "lodash/template.js";

/**
 * Types following @types/lodash/common/string.d.ts
 */
export interface TemplateOptions {
  escape?: RegExp;
  evaluate?: RegExp;
  imports?: { [key: string]: any };
  interpolate?: RegExp;
  sourceURL?: string;
  variable?: string;
}

export interface TemplateExecutor {
  (data?: object): string;
  source: string;
}

const options: TemplateOptions = {
  interpolate: /<%=([\s\S]+?)%>/g, // this somehow stops template from processing `${i}` which is what I want
  // to see exactly what is going on put debugger in file node_modules/lodash/template.js
  // in place: https://github.com/lodash/lodash/blob/4.18.1/dist/lodash.js#L14928
  // you will see before setting here interpolate: /<%=([\s\S]+?)%>/g,
  // value of sourceURL will be
  // /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|\$\{([^\\}]*(?:\\.[^\\}]*)*)\}|<%([\s\S]+?)%>|$/g
  // but when set:
  // /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|($^)|<%([\s\S]+?)%>|$/g

  escape: /<%-([\s\S]+?)%>/g,
  evaluate: /<%([\s\S]+?)%>/g,
  variable: "d",
};

const th = (msg: string) => new Error(`cacheTemplate error: ${msg}`);

/**
 * Module-level cache shared across all produceRender instances.
 * Keyed by absolute file path.
 */
const cache = new Map<string, TemplateExecutor>();

export function resetCache() {
  cache.clear();
}

/**
 * Usage in the project
 *
 * import { produceRender } from "./js/cacheTemplate.ts";
 *
 * // parentFile is the absolute path of the "parent" context used to resolve
 * // relative template paths. For the entry point, pass the entry file itself:
 *
 * const render = produceRender(filePath);          // cache on (default)
 * const render = produceRender(filePath, false);   // cache off
 *
 * // In templates, d.render is bound to the current template file so relative
 * // paths are resolved relative to that template:
 * //
 * //   <%= d.render('./partial.html', { ...d }) %>
 * //   <%= d.render(d.child, { ...d }) %>
 *
 * // Initial render from express:
 * //   const content = render(filePath);
 * //   const content = render(filePath, { req, res, ...req.query });
 */

/**
 * NOTE: it is generally recommended to add {variable: "some_name"} to the options object
 * More about it: https://github.com/stopsopa/template-engines-benchmark/blob/main/benchmark/README.md
 */
export function produceRender(parentFile: string, cacheEnabled = true) {
  if (typeof parentFile !== "string" || parentFile.trim().length === 0) {
    throw th("parentFile is required");
  }

  const parentDir = path.dirname(parentFile);

  function render(template: string): TemplateExecutor;
  function render(template: string, data: object): string;
  function render(template: string, data?: object): TemplateExecutor | string {
    const fullPath = path.resolve(parentDir, template);

    let executor: TemplateExecutor;

    if (cacheEnabled && cache.has(fullPath)) {
      executor = cache.get(fullPath)!;
    } else {
      try {
        fs.accessSync(fullPath);
      } catch (err) {
        throw th(`Template file >${fullPath}< does not exist`);
      }

      const content = fs.readFileSync(fullPath, "utf8");

      executor = libTempate(content, options) as TemplateExecutor;

      if (cacheEnabled) {
        cache.set(fullPath, executor);
      }
    }

    if (data === undefined) {
      return executor;
    }

    return executor({
      ...data,
      // Each template gets a render bound to its own path so relative imports
      // inside sub-templates resolve relative to that sub-template's location.
      render: produceRender(fullPath, cacheEnabled),
    });
  }

  return render;
}

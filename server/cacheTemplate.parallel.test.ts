import assert from "node:assert";
import { describe, beforeEach } from "node:test";
import path from "node:path";
import { it, determineMode } from "./utils.ts";

import render, { setDirectory, enableCache } from "./cacheTemplate.ts";

determineMode(import.meta.url);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * node --test server/cacheTemplate.parallel.test.ts
 * SILENT=false /bin/bash ts.sh --test server/cacheTemplate.parallel.test.ts
 */
describe("first", () => {
  let prepare = (cache = false) => {
    setDirectory(path.join(__dirname, "templates"));
    enableCache(cache);
  };

  it("child", () => {
    prepare(false);

    const result = render("child.html", { test: "test" });

    assert.strictEqual(result, "<abc>test</abc>");
  });

  it("parent", () => {
    prepare(false);

    const result = render("parent.html", { test: "test" });

    assert.strictEqual(result, "<h1>parent</h1>\n<abc>test</abc>");
  });

  it("interpolate", () => {
    prepare(false);

    const result = render("child.html", { test: "test<br />" });

    assert.strictEqual(result, "<abc>test<br /></abc>");
  });

  it("escape", () => {
    prepare(false);

    const result = render("escape.html", { test: "test<br />" });

    assert.strictEqual(result, "<abc>test&lt;br /&gt;</abc>");
  });

  it("parent.dynamic", () => {
    prepare(false);

    const result = render("parent.dynamic.html", {
      test: "test <br />",
      child: "escape.html",
    });

    assert.strictEqual(
      result,
      `<h1>parent</h1>
<abc>test &lt;br /&gt;</abc>`,
    );
  });

  // cache on
  it("cache:on child", () => {
    prepare(true);

    const result = render("child.html", { test: "test" });

    assert.strictEqual(result, "<abc>test</abc>");
  });

  it("cache:on parent", () => {
    prepare(true);

    const result = render("parent.html", { test: "test" });

    assert.strictEqual(result, "<h1>parent</h1>\n<abc>test</abc>");
  });

  it("cache:on interpolate", () => {
    prepare(true);

    const result = render("child.html", { test: "test<br />" });

    assert.strictEqual(result, "<abc>test<br /></abc>");
  });

  it("cache:on escape", () => {
    prepare(true);

    const result = render("escape.html", { test: "test<br />" });

    assert.strictEqual(result, "<abc>test&lt;br /&gt;</abc>");
  });

  it("cache:on parent.dynamic", () => {
    prepare(true);

    const result = render("parent.dynamic.html", {
      test: "test <br />",
      child: "escape.html",
    });

    assert.strictEqual(
      result,
      `<h1>parent</h1>
<abc>test &lt;br /&gt;</abc>`,
    );
  });

  // error cases
  it.only("error: no directory set", () => {
    try {
      render("escape.html", {
        test: "test",
      });

      throw new Error("should not get here");
    } catch (e) {
      assert.strictEqual(String(e), "Error: should not get here");
    }
  });
});

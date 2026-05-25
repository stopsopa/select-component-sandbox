import assert from "node:assert";
// import { describe, beforeEach } from "node:test";
import path from "node:path";
import { it, determineMode } from "./utils.ts";

import createCachePool from "./cacheTemplate.ts";

determineMode(import.meta.url);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * node --test server/cacheTemplate.parallel.test.ts
 * SILENT=false /bin/bash ts.sh --test server/cacheTemplate.parallel.test.ts
 * SILENT=false /bin/bash ts.sh --test-only --test server/cacheTemplate.parallel.test.ts
 */

// "_" is a virtual sentinel filename — dirname() resolves to the templates dir
// so relative template names like "child.html" resolve correctly.
const templatesParent = path.join(__dirname, "templates");

let produceRender: ReturnType<typeof createCachePool>;

const getCache = () => produceRender.getCache();

let prepare = (cache = false) => {
  produceRender = createCachePool(cache);

  return produceRender(path.join(templatesParent, "_"));
};

it("child", () => {
  const render = prepare(false);

  const result = render("child.html", { test: "test" });

  assert.strictEqual(result, "<abc>test</abc>");

  {
    const cache = getCache();

    const keys = Array.from(cache.keys()).map((p) =>
      path.relative(templatesParent, p),
    );

    assert.deepStrictEqual(keys, []);
  }
});

it("parent", () => {
  const render = prepare(false);

  const result = render("parent.html", { test: "test" });

  assert.strictEqual(result, "<h1>parent</h1>\n<abc>test</abc>");
});

it("interpolate", () => {
  const render = prepare(false);

  const result = render("child.html", { test: "test<br />" });

  assert.strictEqual(result, "<abc>test<br /></abc>");
});

it("escape", () => {
  const render = prepare(false);

  const result = render("escape.html", { test: "test<br />" });

  assert.strictEqual(result, `<abc class="escape.html">test&lt;br /&gt;</abc>`);
});

it("parent.dynamic", () => {
  const render = prepare(false);

  const result = render("parent.dynamic.html", {
    test: "test <br />",
    child: "escape.html",
  });

  assert.strictEqual(
    result,
    `<h1>parent</h1>
<abc class="escape.html">test &lt;br /&gt;</abc>`,
  );
});

// cache on
it("cache:on child", () => {
  const render = prepare(true);

  const result = render("child.html", { test: "test" });

  assert.strictEqual(result, "<abc>test</abc>");
});

it("cache:on parent", () => {
  const render = prepare(true);

  const result = render("parent.html", { test: "test" });

  assert.strictEqual(result, "<h1>parent</h1>\n<abc>test</abc>");

  {
    const cache = getCache();

    const keys = Array.from(cache.keys()).map((p) =>
      path.relative(templatesParent, p),
    );

    assert.deepStrictEqual(keys, ["parent.html", "child.html"]);
  }
});

it("cache:on interpolate", () => {
  const render = prepare(true);

  const result = render("child.html", { test: "test<br />" });

  assert.strictEqual(result, "<abc>test<br /></abc>");
});

it("cache:on escape", () => {
  const render = prepare(true);

  const result = render("escape.html", { test: "test<br />" });

  assert.strictEqual(result, `<abc class="escape.html">test&lt;br /&gt;</abc>`);
});

it("cache:on parent.dynamic", () => {
  const render = prepare(true);

  const result = render("parent.dynamic.html", {
    test: "test <br />",
    child: "escape.html",
  });

  assert.strictEqual(
    result,
    `<h1>parent</h1>
<abc class="escape.html">test &lt;br /&gt;</abc>`,
  );
});

it("cache:on relative", () => {
  const render = prepare(true);

  const result = render("relative/parent.html", {
    test: "test <br />",
  });

  assert.strictEqual(
    result,
    `<h1>relative parent</h1>
<span class="d.test">test &lt;br /&gt;</span>
<span class="d.inj">test from relative parent</span>
<span data-test="goup"><abc class="escape.html">test &lt;br /&gt;</abc></span>`,
  );

  {
    const cache = getCache();

    const keys = Array.from(cache.keys()).map((p) =>
      path.relative(templatesParent, p),
    );

    assert.deepStrictEqual(keys, [
      "relative/parent.html",
      "relative/child/child.html",
      "escape.html",
    ]);
  }
});

it("cache:on relative + cache", () => {
  const render = prepare(true);

  const template = render("relative/parent.html");

  {
    const result = template({
      test: "test <br />",
    });

    assert.strictEqual(
      result,
      `<h1>relative parent</h1>
<span class="d.test">test &lt;br /&gt;</span>
<span class="d.inj">test from relative parent</span>
<span data-test="goup"><abc class="escape.html">test &lt;br /&gt;</abc></span>`,
    );
  }

  {
    const cache = getCache();

    const keys = Array.from(cache.keys()).map((p) =>
      path.relative(templatesParent, p),
    );

    console.log(`
    
    >${JSON.stringify(keys)}<
    
    `);

    assert.deepStrictEqual(keys, [
      "relative/parent.html",
      "relative/child/child.html",
      "escape.html",
    ]);
  }
});

// error cases
it("error: no parentFile", () => {
  try {
    produceRender("");

    throw new Error("should not get here");
  } catch (e) {
    assert.strictEqual(
      String(e),
      "Error: cacheTemplate error: parentFile is required",
    );
  }
});

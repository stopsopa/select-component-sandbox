import assert from "node:assert";
import { describe, it } from "node:test";

import render from "./cacheTemplate.ts";


/**
 * node --test server/cacheTemplate.test.ts
 */
describe("first", () => {
  it("should return 3", () => {
    assert.deepStrictEqual({ test: "test" }, { test: "test" });
  });
});

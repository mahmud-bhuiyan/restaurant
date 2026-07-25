import { describe, expect, it } from "vitest";
import { cn } from "../../src/lib/cn";

describe("cn utility", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string when all falsy", () => {
    expect(cn(false, null)).toBe("");
  });
});

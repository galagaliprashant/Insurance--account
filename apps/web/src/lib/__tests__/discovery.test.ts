import { describe, expect, it } from "vitest";
import { matchDeceasedProtections } from "@/lib/discovery";

describe("matchDeceasedProtections", () => {
  it("matches a known household member case-insensitively and returns their protection items", () => {
    const items = matchDeceasedProtections("rajesh mehta");
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.personId === "p_parent")).toBe(true);
  });

  it("tolerates surrounding whitespace", () => {
    const items = matchDeceasedProtections("  Rajesh Mehta  ");
    expect(items.length).toBeGreaterThan(0);
  });

  it("returns an empty list for a name not in the demo household", () => {
    expect(matchDeceasedProtections("Someone Unknown")).toEqual([]);
  });
});

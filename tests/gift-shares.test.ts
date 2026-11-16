import { describe, expect, it } from "bun:test";
import { isShareable, portionOptions, remaining, validPortion } from "../src/lib/gift-shares";

describe("gift shares", () => {
  it("only gifts of $100 or more can be split", () => {
    expect(isShareable(96)).toBe(false);
    expect(isShareable(140)).toBe(true);
  });
  it("presets never exceed what is left", () => {
    expect(portionOptions(240, 180)).toEqual([25, 50]);
  });
  it("a portion cannot go past the remaining balance", () => {
    expect(validPortion(70, 240, 180)).toBeNull();
    expect(validPortion(60, 240, 180)).toBe(60);
    expect(remaining(240, 240)).toBe(0);
  });
});

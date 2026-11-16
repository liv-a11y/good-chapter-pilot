import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../src/routes/partners.employers.tsx", import.meta.url), "utf8");

const dollars = (label: string) => {
  const match = page.match(new RegExp(`\\$([\\d,]+) ${label}`));
  return match ? Number(match[1].replace(/,/g, "")) : undefined;
};

test("the sample pilot pool is $10,000", () => {
  expect(dollars("pool")).toBe(10000);
});

test("the sample anchor gift is $200", () => {
  expect(dollars("anchor gift")).toBe(200);
});

test("the stated chapter count matches the pool divided by the anchor gift", () => {
  const pool = dollars("pool")!;
  const anchor = dollars("anchor gift")!;
  const stated = page.match(/covers about (\w+) chapters/)?.[1];
  const words: Record<string, number> = { ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60 };
  expect(stated).toBeDefined();
  expect(words[stated!]).toBe(Math.floor(pool / anchor));
});

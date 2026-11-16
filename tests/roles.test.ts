import { expect, test } from "bun:test";
import { CAN_SEE, canDo, canMove, canSee, drawsFromPool, type Role } from "../src/lib/roles";

const all = Object.keys(CAN_SEE) as Role[];

test("only the person sees the shipping address", () => {
  expect(all.filter((r) => canSee(r, "shipping_address"))).toEqual(["recipient"]);
});

test("partner admins see counts and totals only, never gifts or notes", () => {
  expect(CAN_SEE.partner_admin.sort()).toEqual(["chapter_counts", "give_back_totals", "pool_totals"]);
});

test("the initiator never sees swaps the person made", () => {
  expect(canSee("initiator", "recipient_swaps")).toBe(false);
});

test("only the person approves or quietly closes a chapter", () => {
  expect(all.filter((r) => canDo(r, "approve_gifts"))).toEqual(["recipient"]);
  expect(all.filter((r) => canMove(r, "in_review", "closed_quietly"))).toEqual(["recipient"]);
});

test("the initiator cannot skip the person's review", () => {
  expect(canMove("initiator", "in_review", "circle_open")).toBe(false);
});

test("pool money is drawn only on approval", () => {
  expect(drawsFromPool("circle_open")).toBe(true);
  expect(drawsFromPool("closed_quietly")).toBe(false);
});

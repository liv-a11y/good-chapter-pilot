import { createHash, timingSafeEqual } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const keyInput = z.string().max(512);

function merchantKeyIsValid(candidate: string): boolean {
  const expected = process.env["GC_MERCHANT_KEY"];
  if (!expected || expected.length < 24) return false;
  const suppliedDigest = createHash("sha256").update(candidate).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedDigest, expectedDigest);
}

export const getMerchantOverview = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ key: keyInput }).parse(d))
  .handler(async ({ data }) => {
    if (!process.env["GC_MERCHANT_KEY"] || process.env["GC_MERCHANT_KEY"].length < 24) {
      return { ok: false as const, reason: "not_configured" as const };
    }
    if (!merchantKeyIsValid(data.key))
      return { ok: false as const, reason: "unauthorized" as const };

    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const [{ data: claims, error: claimsError }, { data: conflicts, error: conflictsError }] =
      await Promise.all([
        db
          .from("chapter_claims")
          .select("id, chapter_id, item_id, state, order_id")
          .order("claimed_at", { ascending: false })
          .limit(200),
        db
          .from("payment_conflicts")
          .select("order_id, claim_id, quantity")
          .order("order_id", { ascending: false })
          .limit(50),
      ]);
    if (claimsError || conflictsError) {
      console.error("getMerchantOverview", claimsError ?? conflictsError);
      throw new Error("Merchant records could not be loaded.");
    }

    const chapterIds = [...new Set((claims ?? []).map((claim) => claim.chapter_id))];
    const itemIds = [...new Set((claims ?? []).map((claim) => claim.item_id))];
    const [{ data: chapters, error: chaptersError }, { data: items, error: itemsError }] =
      await Promise.all([
        chapterIds.length
          ? db.from("chapters").select("id, title").in("id", chapterIds)
          : Promise.resolve({ data: [], error: null }),
        itemIds.length
          ? db.from("chapter_items").select("id, name").in("id", itemIds)
          : Promise.resolve({ data: [], error: null }),
      ]);
    if (chaptersError || itemsError) {
      console.error("getMerchantOverview details", chaptersError ?? itemsError);
      throw new Error("Merchant records could not be loaded.");
    }

    return {
      ok: true as const,
      claims: (claims ?? []).map((claim) => ({
        id: claim.id,
        state: claim.state,
        order_id: claim.order_id,
        chapter: chapters?.find((row) => row.id === claim.chapter_id)?.title ?? "Chapter",
        gift: items?.find((row) => row.id === claim.item_id)?.name ?? "Gift",
      })),
      conflicts: conflicts ?? [],
    };
  });

export const releaseMerchantClaim = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        key: keyInput,
        claim_id: z.string().uuid(),
        reason: z.string().trim().min(1).max(500),
        confirmed: z.literal(true),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (!process.env["GC_MERCHANT_KEY"] || process.env["GC_MERCHANT_KEY"].length < 24) {
      return { ok: false as const, reason: "not_configured" as const };
    }
    if (!merchantKeyIsValid(data.key))
      return { ok: false as const, reason: "unauthorized" as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: released, error } = await supabaseAdmin.rpc("release_good_chapter_claim", {
      p_claim_id: data.claim_id,
      p_reason: data.reason,
    });
    if (error) {
      console.error("releaseMerchantClaim", error);
      throw new Error("The claim could not be reconciled.");
    }
    return { ok: released };
  });

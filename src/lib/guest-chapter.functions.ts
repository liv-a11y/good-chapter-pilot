import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Ported from the Base44 guest-fns: a private token is the only key, so this runs server-side only.
const OPEN_STATE = "sent_to_guests";
const VISIBLE = ["approved", "given"];

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getGuestChapter = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token: z.string().trim().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: guest, error: guestError } = await db
      .from("chapter_guests")
      .select("id, chapter_id")
      .eq("guest_token", data.token)
      .eq("is_revoked", false)
      .maybeSingle();
    if (guestError) {
      console.error("getGuestChapter guest lookup", guestError);
      throw new Error("The guest link could not be opened.");
    }
    if (!guest) return null;
    const { data: chapter, error: chapterError } = await db
      .from("chapters")
      .select("*")
      .eq("id", guest.chapter_id)
      .maybeSingle();
    if (chapterError) {
      console.error("getGuestChapter chapter lookup", chapterError);
      throw new Error("The guest link could not be opened.");
    }
    if (!chapter) return null;
    const [{ data: items, error: itemsError }, { data: claims, error: claimsError }] =
      await Promise.all([
        db
          .from("chapter_items")
          .select("*")
          .eq("chapter_id", chapter.id)
          .order("position")
          .limit(8),
        db
          .from("chapter_claims")
          .select("id, item_id, guest_id, display_name, state")
          .eq("chapter_id", chapter.id),
      ]);
    if (itemsError || claimsError) {
      console.error("getGuestChapter chapter contents", itemsError ?? claimsError);
      throw new Error("The guest link could not be opened.");
    }
    const accepted = chapter.person_decision === "accepted";
    return {
      title: chapter.title,
      starter_name: chapter.starter_name,
      chapter_type: chapter.chapter_type,
      state: chapter.state,
      accepted,
      open: chapter.state === OPEN_STATE && accepted,
      items: (items ?? [])
        .filter((i) => VISIBLE.includes(i.status))
        .map((i) => {
          const c = (claims ?? []).find((r) => r.item_id === i.id);
          return {
            id: i.id,
            name: i.name,
            photo_url: i.photo_url ?? "",
            price: i.price,
            source: i.source ?? "",
            source_url: i.source_url ?? "",
            why: i.why ?? "",
            claim: c
              ? {
                  id: c.id,
                  display_name: c.display_name,
                  mine: c.guest_id === guest.id,
                  state: c.state,
                }
              : null,
          };
        }),
    };
  });

export const claimItem = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        token: z.string().trim().min(12).max(64),
        item_id: z.string().uuid(),
        display_name: z.string().trim().max(60),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: claims, error } = await db.rpc("claim_good_chapter_item", {
      p_guest_token: data.token,
      p_item_id: data.item_id,
      p_display_name: data.display_name,
    });
    if (error) {
      console.error("claimItem insert", error);
      throw new Error("The gift could not be reserved.");
    }
    const created = claims?.[0];
    if (!created) return { ok: false as const };
    return {
      ok: true as const,
      id: created.claim_id,
      state: created.claim_state,
      display_name: created.display_name,
    };
  });

export const createGuestCheckout = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ token: z.string().trim().min(12).max(64), item_id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: guest, error: guestError } = await db
      .from("chapter_guests")
      .select("id, chapter_id")
      .eq("guest_token", data.token)
      .eq("is_revoked", false)
      .maybeSingle();
    if (guestError) {
      console.error("createGuestCheckout guest lookup", guestError);
      throw new Error("Checkout could not be opened.");
    }
    if (!guest) return { ok: false as const };

    const { data: chapter, error: chapterError } = await db
      .from("chapters")
      .select("id, state, person_decision")
      .eq("id", guest.chapter_id)
      .maybeSingle();
    if (chapterError) {
      console.error("createGuestCheckout chapter lookup", chapterError);
      throw new Error("Checkout could not be opened.");
    }
    if (!chapter || chapter.state !== OPEN_STATE || chapter.person_decision !== "accepted") {
      return { ok: false as const };
    }

    const { data: item, error: itemError } = await db
      .from("chapter_items")
      .select("id, chapter_id, name, status")
      .eq("id", data.item_id)
      .eq("chapter_id", chapter.id)
      .maybeSingle();
    if (itemError) {
      console.error("createGuestCheckout item lookup", itemError);
      throw new Error("Checkout could not be opened.");
    }
    if (!item || !VISIBLE.includes(item.status)) return { ok: false as const };

    const { data: claim, error: claimError } = await db
      .from("chapter_claims")
      .select("id, state, checkout_url, display_name")
      .eq("item_id", item.id)
      .eq("guest_id", guest.id)
      .maybeSingle();
    if (claimError) {
      console.error("createGuestCheckout claim lookup", claimError);
      throw new Error("Checkout could not be opened.");
    }
    if (!claim) return { ok: false as const };
    if (claim.state === "paid") return { ok: false as const, reason: "paid" as const };
    if (claim.state === "checkout" && claim.checkout_url) {
      return { ok: true as const, checkout_url: claim.checkout_url };
    }
    if (claim.state !== "reserved") return { ok: false as const, reason: "in_progress" as const };

    const { data: creating, error: updateError } = await db
      .from("chapter_claims")
      .update({ state: "creating" })
      .eq("id", claim.id)
      .eq("state", "reserved")
      .select("id")
      .maybeSingle();
    if (updateError) {
      console.error("createGuestCheckout reserve", updateError);
      throw new Error("Checkout could not be opened.");
    }
    if (!creating) {
      const { data: current, error: currentError } = await db
        .from("chapter_claims")
        .select("state, checkout_url")
        .eq("id", claim.id)
        .maybeSingle();
      if (currentError) {
        console.error("createGuestCheckout current claim", currentError);
        throw new Error("Checkout could not be opened.");
      }
      if (current?.state === "checkout" && current.checkout_url) {
        return { ok: true as const, checkout_url: current.checkout_url };
      }
      return {
        ok: false as const,
        reason: current?.state === "paid" ? ("paid" as const) : ("in_progress" as const),
      };
    }

    try {
      const { createClaimCheckout } = await import("./pilot-shopify.server");
      const { checkoutUrl, variant } = await createClaimCheckout(
        item.name,
        claim.id,
        claim.display_name || "Someone who cares",
      );
      const { data: completed, error: completeError } = await db
        .from("chapter_claims")
        .update({ state: "checkout", checkout_url: checkoutUrl, shopify_variant: variant })
        .eq("id", claim.id)
        .eq("state", "creating")
        .select("id")
        .maybeSingle();
      if (completeError || !completed) {
        console.error("createGuestCheckout save checkout", completeError);
        throw new Error(
          "Checkout was created but could not be saved. Contact the chapter organizer before retrying.",
        );
      }
      return { ok: true as const, checkout_url: checkoutUrl };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "GIFT_UNAVAILABLE"
      ) {
        const { error: resetError } = await db
          .from("chapter_claims")
          .update({ state: "reserved" })
          .eq("id", claim.id)
          .eq("state", "creating");
        if (resetError) {
          console.error("createGuestCheckout reset unavailable claim", resetError);
        }
        return { ok: false as const, reason: "unavailable" as const };
      }
      throw error;
    }
  });

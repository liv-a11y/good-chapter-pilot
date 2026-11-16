import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Ported from Base44 server-fns and decision-fns. The private token is the only key.
const ANSWERS_OPEN = ["with_person_items", "with_person_guests"];
const token = z.string().trim().min(12).max(64);

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
const day = (v: string | null) =>
  v
    ? new Date(v).toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

export const getPersonChapter = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: c } = await db
      .from("chapters")
      .select("*")
      .eq("person_token", data.token)
      .maybeSingle();
    if (!c) return null;
    const [
      { data: items, error: itemsError },
      { data: guests, error: guestsError },
      { data: claims, error: claimsError },
    ] = await Promise.all([
      db.from("chapter_items").select("*").eq("chapter_id", c.id).order("position").limit(8),
      db
        .from("chapter_guests")
        .select("id, guest_token, is_revoked, invite_attempted_at")
        .eq("chapter_id", c.id)
        .order("created_at")
        .limit(20),
      db.from("chapter_claims").select("item_id, state").eq("chapter_id", c.id),
    ]);
    if (itemsError || guestsError || claimsError) {
      console.error("getPersonChapter contents", itemsError ?? guestsError ?? claimsError);
      throw new Error("Your chapter could not be opened.");
    }
    const decision = c.person_decision || "pending";
    const awaiting = Boolean(c.accept_token) && decision === "pending";
    return {
      title: c.title as string,
      chapter_type: c.chapter_type as string,
      starter_name: c.starter_name as string,
      story_line: (c.story_line ?? "") as string,
      person_decision: decision as string,
      decided_on: day(c.person_decided_at),
      await_answer: awaiting,
      guest_links:
        decision === "accepted"
          ? (guests ?? []).map((guest, index) => ({
              id: guest.id as string,
              token: guest.is_revoked ? null : (guest.guest_token as string),
              revoked: guest.is_revoked as boolean,
              invited: Boolean(guest.invite_attempted_at),
              label: `Guest ${index + 1}`,
            }))
          : [],
      accept_token: awaiting ? (c.accept_token as string) : "",
      decline_token: awaiting ? ((c.decline_token ?? "") as string) : "",
      answers_open: ANSWERS_OPEN.includes(c.state) && decision === "pending",
      items: (items ?? []).map((i) => ({
        id: i.id as string,
        name: i.name as string,
        photo_url: (i.photo_url ?? "") as string,
        price: i.price as number | null,
        source: (i.source ?? "") as string,
        source_url: (i.source_url ?? "") as string,
        why: (i.why ?? "") as string,
        status: i.status as string,
        claim_status:
          claims?.find((claim) => claim.item_id === i.id)?.state === "paid"
            ? ("purchased" as const)
            : claims?.some((claim) => claim.item_id === i.id)
              ? ("reserved" as const)
              : null,
      })),
    };
  });

export const answerItem = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({ token, itemId: z.string().uuid(), answer: z.enum(["approved", "declined"]) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: c } = await db
      .from("chapters")
      .select("id, state, person_decision, accept_token")
      .eq("person_token", data.token)
      .maybeSingle();
    if (!c || !ANSWERS_OPEN.includes(c.state)) return { ok: false };
    if ((c.person_decision || "pending") !== "pending") return { ok: false };
    const { data: updated } = await db
      .from("chapter_items")
      .update({ status: data.answer })
      .eq("id", data.itemId)
      .eq("chapter_id", c.id)
      .select("status")
      .maybeSingle();
    return updated ? { ok: true, status: updated.status as string } : { ok: false };
  });

export const rotateGuestLink = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        token,
        guestId: z.string().uuid(),
        action: z.enum(["replace", "revoke"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: chapter, error: chapterError } = await db
      .from("chapters")
      .select("id, state, person_decision")
      .eq("person_token", data.token)
      .maybeSingle();
    if (chapterError) {
      console.error("rotateGuestLink chapter lookup", chapterError);
      throw new Error("The guest link could not be changed.");
    }
    if (!chapter || chapter.state !== "sent_to_guests" || chapter.person_decision !== "accepted") {
      return { ok: false as const };
    }

    const nextToken =
      crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const { data: guest, error } = await db
      .from("chapter_guests")
      .update({
        guest_token: nextToken,
        is_revoked: data.action === "revoke",
        invite_attempted_at: null,
      })
      .eq("id", data.guestId)
      .eq("chapter_id", chapter.id)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("rotateGuestLink update", error);
      throw new Error("The guest link could not be changed.");
    }
    if (!guest) return { ok: false as const };
    return {
      ok: true as const,
      token: data.action === "replace" ? nextToken : null,
    };
  });

export const sendGuestInvitations = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        token,
        guests: z
          .array(
            z.object({
              id: z.string().uuid(),
              email: z.string().trim().email().max(254),
            }),
          )
          .min(1)
          .max(20),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (new Set(data.guests.map((guest) => guest.id)).size !== data.guests.length) {
      return { ok: false as const, reason: "duplicate_guest" as const };
    }
    if (
      new Set(data.guests.map((guest) => guest.email.toLowerCase())).size !== data.guests.length
    ) {
      return { ok: false as const, reason: "duplicate_email" as const };
    }

    const db = await admin();
    const { data: chapter, error: chapterError } = await db
      .from("chapters")
      .select("id, title, starter_name, state, person_decision")
      .eq("person_token", data.token)
      .maybeSingle();
    if (chapterError) {
      console.error("sendGuestInvitations chapter lookup", chapterError);
      throw new Error("Invitations could not be sent.");
    }
    if (!chapter || chapter.state !== "sent_to_guests" || chapter.person_decision !== "accepted") {
      return { ok: false as const, reason: "chapter_closed" as const };
    }

    const { isGuestEmailConfigured, sendGuestInvitations: send } =
      await import("./pilot-email.server");
    if (!isGuestEmailConfigured()) return { ok: false as const, reason: "not_configured" as const };

    const guestIds = data.guests.map((guest) => guest.id);
    const { data: reserved, error: reserveError } = await db.rpc("reserve_good_chapter_invites", {
      p_chapter_id: chapter.id,
      p_guest_ids: guestIds,
    });
    if (reserveError) {
      console.error("sendGuestInvitations reserve", reserveError);
      throw new Error("Invitations could not be sent.");
    }
    if (!reserved || reserved.length !== guestIds.length) {
      return { ok: false as const, reason: "already_sent_or_revoked" as const };
    }

    const recipients = new Map(data.guests.map((recipient) => [recipient.id, recipient]));
    const invitationData = reserved.flatMap((guest) => {
      const recipient = recipients.get(guest.id);
      return recipient
        ? [
            {
              email: recipient.email,
              title: chapter.title,
              starter: chapter.starter_name,
              path: `/guest/${guest.guest_token}`,
            },
          ]
        : [];
    });
    if (invitationData.length !== data.guests.length) {
      return { ok: false as const, reason: "invalid_guest" as const };
    }

    const result = await send(invitationData);
    if (result !== "sent") {
      const reservedAt = reserved[0]?.invite_attempted_at;
      if (!reservedAt) throw new Error("The invitation reservation could not be verified.");
      const { error: resetError } = await db
        .from("chapter_guests")
        .update({ invite_attempted_at: null })
        .in("id", guestIds)
        .eq("invite_attempted_at", reservedAt)
        .eq("is_revoked", false);
      if (resetError) {
        console.error("sendGuestInvitations reset", resetError);
        throw new Error(
          "The invitation attempt could not be reset after email delivery was unavailable.",
        );
      }
      return { ok: false as const, reason: result };
    }
    return { ok: true as const, count: invitationData.length };
  });

export const removeApprovedItem = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ token, itemId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: removed, error } = await db.rpc("remove_good_chapter_item", {
      p_person_token: data.token,
      p_item_id: data.itemId,
    });
    if (error) {
      console.error("removeApprovedItem", error);
      throw new Error("The gift could not be removed.");
    }
    return { ok: removed === true };
  });

const byAnswerToken = async (t: string, answer: "accept" | "decline") => {
  const db = await admin();
  const { data } = await db
    .from("chapters")
    .select("*")
    .eq(answer === "accept" ? "accept_token" : "decline_token", t)
    .maybeSingle();
  return { db, c: data };
};

export const getDecision = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token, answer: z.enum(["accept", "decline"]) }).parse(d))
  .handler(async ({ data }) => {
    const { c } = await byAnswerToken(data.token, data.answer);
    if (!c) return null;
    const decision = c.person_decision || "pending";
    return {
      decision: decision as string,
      settled: decision !== "pending",
      decided_on: day(c.person_decided_at),
      person_first: ((c.title || "").split(/\s+/)[0] || "there") as string,
      starter_name: (c.starter_name || "the friend who started it").trim() as string,
      chapter_type: (c.chapter_type || "A chapter") as string,
    };
  });

export const recordDecision = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ token, answer: z.enum(["accept", "decline"]) }).parse(d))
  .handler(async ({ data }) => {
    const { db, c } = await byAnswerToken(data.token, data.answer);
    if (!c) return { ok: false as const };
    const decision = c.person_decision || "pending";
    if (decision !== "pending")
      return {
        ok: true as const,
        decision: decision as string,
        decided_on: day(c.person_decided_at),
      };
    const now = new Date().toISOString();
    const next =
      data.answer === "accept"
        ? { person_decision: "accepted", person_decided_at: now, state: "sent_to_guests" }
        : { person_decision: "declined", person_decided_at: now, state: "declined" };
    // Only a still-pending chapter changes, so two clicks cannot race.
    await db.from("chapters").update(next).eq("id", c.id).eq("person_decision", "pending");
    return { ok: true as const, decision: next.person_decision, decided_on: day(now) };
  });

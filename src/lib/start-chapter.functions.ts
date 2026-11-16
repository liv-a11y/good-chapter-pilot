import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sampleProducts } from "./sample-products";
import { CHAPTER_TYPES, CLUES, PATHS } from "./start-chapter";
import { createLovableAiGatewayRunIdFetch } from "./lovable-ai-run-id.server";

const paths = PATHS.map((p) => p.id) as [string, ...string[]];
const answers = z.object({
  chapterType: z.enum(CHAPTER_TYPES),
  evenings: z.enum(CLUES.evenings.options),
  keeps: z.enum(CLUES.keeps.options),
  taste: z.enum(CLUES.taste.options),
  tone: z.enum(["tender", "playful"]),
  cap: z.number().int().min(0).max(5000),
});

export type ShelfItem = {
  id: string;
  name: string;
  price: number;
  band: string;
  photo: string;
  why: string;
};
const base = (): ShelfItem[] =>
  sampleProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    band: p.band,
    photo: p.photo,
    why: p.reason,
  }));
const clean = (s: string) =>
  s
    .replace(/[\u2013\u2014]/g, ",")
    .trim()
    .slice(0, 140);

/** Rewrites the eight reasons for this person. The shelf itself is fixed, so it never stalls. */
export const suggestShelf = createServerFn({ method: "POST" })
  .validator((d: unknown) => answers.parse(d))
  .handler(async ({ data }): Promise<{ items: ShelfItem[]; error?: string }> => {
    const items = base();
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { items, error: "Showing the standing reasons for now." };
    const { createAnthropic } = await import("@ai-sdk/anthropic");
    const { streamText } = await import("ai");
    const run = createLovableAiGatewayRunIdFetch();
    const provider = createAnthropic({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: run.fetch,
    });
    const prompt = `You write one-line gift reasons for Good Chapter, a private gift list for chapters nobody throws a party for.
Chapter: ${data.chapterType}. Evenings: ${data.evenings}. Uses until it breaks: ${data.keeps}. Taste: ${data.taste}. Tone: ${data.tone}.
Objects (id: name, price): ${items.map((i) => `${i.id}: ${i.name}, $${i.price}`).join("; ")}.
Order all eight ids from best fit to least, and write one reason per object, at most 14 words, a plain sentence ending in a period, warm and specific to the answers. Never invent names, places, or health details. Never use dashes. Never mention AI.
Return ONLY JSON: {"items":[{"id":"","why":""}]}`;
    try {
      const result = streamText({
        model: provider("anthropic/claude-haiku-4-5"),
        prompt,
        maxRetries: 0,
      });
      const text = await result.text;
      const m = text.match(/\{[\s\S]*\}/);
      const parsed = (m ? JSON.parse(m[0]) : {}) as { items?: { id: string; why: string }[] };
      const out: ShelfItem[] = [];
      for (const row of parsed.items ?? []) {
        const hit = items.find((i) => i.id === row.id);
        if (hit && !out.includes(hit))
          out.push({ ...hit, why: row.why ? clean(String(row.why)) : hit.why });
      }
      for (const i of items) if (!out.some((o) => o.id === i.id)) out.push(i);
      return { items: out };
    } catch (err) {
      console.error("suggestShelf failed", err);
      const status = (err as { statusCode?: number })?.statusCode;
      return {
        items,
        error:
          status === 429
            ? "Busy right now. Showing the standing reasons."
            : "Showing the standing reasons for now.",
      };
    }
  });

const tok = () =>
  crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);

export const startChapter = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        path: z.enum(paths),
        chapterType: z.enum(CHAPTER_TYPES),
        starterName: z.string().trim().min(1).max(40),
        guestCount: z.number().int().min(1).max(20),
        anchorId: z.string().max(40).optional(),
        items: z
          .array(z.object({ id: z.string().max(40), why: z.string().max(160) }))
          .min(1)
          .max(8),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const catalog = base();
    // Only known objects go in. The anchor goes first.
    const picked = data.items
      .map((r) => ({ hit: catalog.find((c) => c.id === r.id), why: clean(r.why) }))
      .filter((r) => r.hit);
    picked.sort((a, b) => (a.hit!.id === data.anchorId ? -1 : b.hit!.id === data.anchorId ? 1 : 0));
    const person_token = tok();
    const { data: chapter, error } = await db
      .from("chapters")
      .insert({
        title: "Your chapter",
        chapter_type: data.chapterType,
        starter_name: data.starterName,
        state: "with_person_items",
        person_decision: "pending",
        person_token,
        accept_token: tok(),
        decline_token: tok(),
      })
      .select("id")
      .single();
    if (error || !chapter) {
      console.error("startChapter", error);
      return { ok: false as const };
    }
    const { error: itemsError } = await db.from("chapter_items").insert(
      picked.slice(0, 8).map((r, i) => ({
        chapter_id: chapter.id,
        position: i + 1,
        name: r.hit!.name,
        photo_url: r.hit!.photo,
        price: r.hit!.price,
        source: "",
        source_url: "",
        why: r.why || r.hit!.why,
        status: "approved",
      })),
    );
    if (itemsError) {
      console.error("startChapter items", itemsError);
      await db.from("chapters").delete().eq("id", chapter.id);
      return { ok: false as const };
    }
    const guests = Array.from({ length: data.guestCount }, () => ({
      chapter_id: chapter.id,
      guest_token: tok(),
    }));
    const { error: guestsError } = await db.from("chapter_guests").insert(guests);
    if (guestsError) {
      console.error("startChapter guests", guestsError);
      await db.from("chapters").delete().eq("id", chapter.id);
      return { ok: false as const };
    }
    return { ok: true as const, person_token };
  });

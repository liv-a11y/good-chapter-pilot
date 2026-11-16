import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalogPromptText } from "./catalog";
import { createLovableAiGatewayRunIdFetch } from "./lovable-ai-run-id.server";

const inputSchema = z.object({
  chapter: z.enum([
    "first-home",
    "fresh-start",
    "new-place",
    "career-change",
    "recovery",
    "off-script",
  ]),
  focus: z.enum(["settling-in", "kitchen", "rest", "hosting", "practical"]),
  spice: z.enum(["mild", "medium", "unhinged"]),
});

export type Recommendation = {
  name: string;
  brand: string;
  band: string;
  price: string;
  reason: string;
};
export type RecommendResult = { ideas: Recommendation[]; error?: string };

const tone = {
  mild: "Tender, warm, grounded. Practical, calming items. Reasons are sincere and gentle.",
  medium:
    "Playful and specific. Wry inside-joke energy, still kind. Reasons feel like a friend teasing lovingly.",
  unhinged:
    "Chaotic, absurd, hilarious, bleep-level cheeky (no slurs, no explicit sexual content, no cruelty). Surprising but real, buyable items. Reasons are unhinged one-liners that still land with love.",
};

const chapterLabels = {
  "first-home": "A first home",
  "fresh-start": "A fresh start",
  "new-place": "Moving somewhere new",
  "career-change": "A career change",
  recovery: "A period of recovery",
  "off-script": "An off-script chapter",
};

const focusLabels = {
  "settling-in": "Getting settled",
  kitchen: "A useful kitchen",
  rest: "Rest and comfort",
  hosting: "Having people over",
  practical: "Practical everyday help",
};

export const recommendGifts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }): Promise<RecommendResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ideas: [], error: "AI is not configured yet." };
    const { createAnthropic } = await import("@ai-sdk/anthropic");
    const { streamText } = await import("ai");
    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const provider = createAnthropic({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });
    const prompt = `You are Good Chapter, an anti-registry for life chapters weddings never covered. A friend is starting a private chapter.
 Life chapter: ${chapterLabels[data.chapter]}
 What would help: ${focusLabels[data.focus]}
Tone: ${tone[data.spice]}

Good Chapter's curated catalog (choose ONLY from these items, matching the chapter where possible):
${catalogPromptText()}

 Recommend exactly 8 gifts, two per tier, using these band labels: "$25 to 50", "$60 to 120", "$120 to 250", "$250 to 500". Use the exact brand, item name, and price from the catalog. Products always stay tasteful. Any tone or chaos lives only in the reason. Each reason is one line, under 110 characters, and suited to the chosen chapter and focus. Never invent personal details. No cash, gift cards, or donations.
Return ONLY JSON: {"ideas":[{"name":"","brand":"","band":"","price":"$xx","reason":""}]}`;
    try {
      const result = streamText({
        model: provider("anthropic/claude-haiku-4-5"),
        prompt,
        maxRetries: 0,
      });
      const text = await result.text;
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? (JSON.parse(match[0]) as { ideas?: Recommendation[] }) : {};
      const ideas = (parsed.ideas ?? [])
        .filter((i) => i && i.name && i.reason)
        .slice(0, 8)
        .map((i) => ({
          name: String(i.name),
          brand: String(i.brand ?? ""),
          band: String(i.band ?? ""),
          price: String(i.price ?? ""),
          reason: String(i.reason).slice(0, 160),
        }));
      if (!ideas.length)
        return { ideas: [], error: "No ideas came back. Try adding a detail or two." };
      return { ideas };
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode;
      console.error("recommendGifts failed", err);
      const safeMessage =
        err instanceof Error && err.message
          ? err.message
          : "Couldn’t reach the idea generator. Try again.";
      if (status === 429)
        return { ideas: [], error: "Lots of people are asking at once. Try again in a minute." };
      if (status === 402 || status === 403) return { ideas: [], error: safeMessage };
      if (status && status >= 400 && status < 500) return { ideas: [], error: safeMessage };
      return { ideas: [], error: safeMessage };
    }
  });

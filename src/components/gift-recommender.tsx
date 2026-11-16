import { useServerFn } from "@tanstack/react-start";
import { Check, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { recommendGifts, type Recommendation } from "@/lib/recommend.functions";
import { cn } from "@/lib/utils";

type Spice = "mild" | "medium" | "unhinged";
type Chapter =
  "first-home" | "fresh-start" | "new-place" | "career-change" | "recovery" | "off-script";
type Focus = "settling-in" | "kitchen" | "rest" | "hosting" | "practical";
const spices: { id: Spice; label: string; hint: string }[] = [
  { id: "mild", label: "Mild", hint: "Tender and practical" },
  { id: "medium", label: "Medium", hint: "Inside-joke energy" },
  { id: "unhinged", label: "Unhinged", hint: "Chaotic, with love" },
];
const loadingLines = [
  "Scouting gifts they’d never ask for…",
  "Reading between the lines…",
  "Finding things worth celebrating on purpose…",
];
const chapters: { id: Chapter; label: string }[] = [
  { id: "first-home", label: "First home" },
  { id: "fresh-start", label: "Fresh start" },
  { id: "new-place", label: "New place" },
  { id: "career-change", label: "Career change" },
  { id: "recovery", label: "Recovery" },
  { id: "off-script", label: "Off-script" },
];
const focuses: { id: Focus; label: string }[] = [
  { id: "settling-in", label: "Getting settled" },
  { id: "kitchen", label: "Kitchen" },
  { id: "rest", label: "Rest" },
  { id: "hosting", label: "Hosting" },
  { id: "practical", label: "Practical help" },
];

export function GiftRecommender({
  onUseIdeas,
}: {
  onUseIdeas?: (ideas: Recommendation[]) => void;
}) {
  const run = useServerFn(recommendGifts);
  const [chapter, setChapter] = useState<Chapter>("first-home");
  const [focus, setFocus] = useState<Focus>("settling-in");
  const [spice, setSpice] = useState<Spice>("medium");
  const [ideas, setIdeas] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const t = window.setInterval(() => setLine((l) => (l + 1) % loadingLines.length), 1800);
    return () => window.clearInterval(t);
  }, [loading]);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { chapter, focus, spice } });
      if (res.error) setError(res.error);
      else setIdeas(res.ideas);
    } catch {
      setError("Couldn’t reach the idea generator. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="rounded-sm border-2 border-foreground bg-card p-5 md:p-7"
      aria-label="AI gift ideas"
    >
      <p className="font-medium text-[14px] text-muted-foreground">Idea generator</p>
      <h2 className="mt-2 font-display text-3xl leading-tight">
        Describe the chapter. We’ll pitch eight ideas.
      </h2>
      <fieldset className="mt-5">
        <legend className="font-medium text-[14px]">The chapter</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {chapters.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={chapter === item.id ? "lime" : "outline"}
              onClick={() => setChapter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-5">
        <legend className="font-medium text-[14px]">What would help most?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {focuses.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={focus === item.id ? "lime" : "outline"}
              onClick={() => setFocus(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-5">
        <legend className="font-medium text-[14px]">How spicy?</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {spices.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={spice === s.id}
              onClick={() => setSpice(s.id)}
              className={cn(
                "rounded-sm border-2 border-foreground p-3 text-left transition-colors duration-175",
                spice === s.id
                  ? "bg-foreground text-background"
                  : "bg-background hover:bg-secondary",
              )}
            >
              <span className="block font-display text-xl">{s.label}</span>
              <span className="block text-[15px] opacity-80">{s.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <Button size="lg" className="mt-5 w-full" onClick={generate} disabled={loading}>
        {loading ? (
          <>
            <LoaderCircle className="size-4 animate-spin" /> {loadingLines[line]}
          </>
        ) : ideas.length ? (
          <>
            <RotateCcw className="size-4" /> Re-spin at {spice}
          </>
        ) : (
          <>
            <Sparkles className="size-4" /> Pitch me ideas
          </>
        )}
      </Button>
      {error && (
        <p role="alert" className="mt-4 rounded-sm border-2 border-destructive p-3 text-[15px]">
          {error}
        </p>
      )}
      {ideas.length > 0 && (
        <>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {ideas.map((i, idx) => (
              <li key={idx} className="rounded-sm border-2 border-foreground bg-background p-4">
                <div className="flex items-baseline justify-between gap-2 font-medium text-[14px] text-muted-foreground">
                  <span>{i.brand}</span>
                  <span>{i.price}</span>
                </div>
                <p className="mt-2 font-display text-xl leading-tight">{i.name}</p>
                <p className="mt-2 text-[15px] leading-[1.5]">{i.reason}</p>
                <p className="mt-3 font-medium text-[14px] text-primary">{i.band}</p>
              </li>
            ))}
          </ul>
          {onUseIdeas && (
            <Button size="lg" className="mt-4 w-full" onClick={() => onUseIdeas(ideas)}>
              <Check className="size-4" /> Use these eight
            </Button>
          )}
        </>
      )}
    </section>
  );
}

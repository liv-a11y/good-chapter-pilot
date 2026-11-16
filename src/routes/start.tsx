import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { sampleProducts } from "@/lib/sample-products";
import {
  AMOUNTS,
  BUDGET_PATHS,
  CHAPTER_TYPES,
  CLUES,
  PATHS,
  TONES,
  type ClueKey,
  type PathId,
} from "@/lib/start-chapter";
import { startChapter, suggestShelf, type ShelfItem } from "@/lib/start-chapter.functions";

const TITLE = "Start a chapter | Good Chapter";
const DESC =
  "Answer a few choices. Eight things appear as you go. Nothing is sent until the person says yes.";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StartPage,
});

const STANDING: ShelfItem[] = sampleProducts.map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  band: p.band,
  photo: p.photo,
  why: p.reason,
}));
const MOVES = ["The chapter", "Three clues", "The circle"];

type Form = {
  path: PathId | "";
  chapterType: string;
  evenings: string;
  keeps: string;
  taste: string;
  tone: "tender" | "playful";
  anchorId: string;
  amount: number;
  starterName: string;
  guestCount: number;
};
const EMPTY: Form = {
  path: "",
  chapterType: "",
  evenings: "",
  keeps: "",
  taste: "",
  tone: "tender",
  anchorId: "",
  amount: 0,
  starterName: "",
  guestCount: 4,
};

function StartPage() {
  const suggest = useServerFn(suggestShelf);
  const submit = useServerFn(startChapter);
  const [move, setMove] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [shelf, setShelf] = useState<ShelfItem[]>(STANDING);
  const [tuning, setTuning] = useState(false);
  const [note, setNote] = useState("");
  const [sheet, setSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ person: string } | null>(null);
  const req = useRef(0);
  const set = (p: Partial<Form>) => setF((v) => ({ ...v, ...p }));

  const budget = f.path !== "" && BUDGET_PATHS.includes(f.path);
  const cap = budget ? f.amount : 0;
  const visible = useMemo(() => (cap ? shelf.filter((i) => i.price <= cap) : shelf), [shelf, cap]);
  const cluesReady = Boolean(f.chapterType && f.evenings && f.keeps && f.taste);

  // Tune the reasons once the clues settle. Stale answers are dropped, the standing shelf never empties.
  useEffect(() => {
    if (!cluesReady) return;
    const id = ++req.current;
    const t = setTimeout(async () => {
      setTuning(true);
      try {
        const r = await suggest({
          data: {
            chapterType: f.chapterType,
            evenings: f.evenings,
            keeps: f.keeps,
            taste: f.taste,
            tone: f.tone,
            cap,
          } as never,
        });
        if (id !== req.current) return;
        setShelf(r.items);
        setNote(r.error ?? "");
      } catch {
        if (id === req.current) setNote("Showing the standing reasons for now.");
      } finally {
        if (id === req.current) setTuning(false);
      }
    }, 700);
    return () => clearTimeout(t);
  }, [cluesReady, f.chapterType, f.evenings, f.keeps, f.taste, f.tone, cap, suggest]);

  const canNext = [
    Boolean(f.path && f.chapterType),
    cluesReady && (budget ? f.amount > 0 : Boolean(f.anchorId)),
    f.starterName.trim().length > 0 && f.guestCount > 0,
  ][move];

  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      const r = await submit({
        data: {
          path: f.path,
          chapterType: f.chapterType,
          starterName: f.starterName.trim(),
          guestCount: f.guestCount,
          anchorId: f.anchorId || undefined,
          items: visible.map((i) => ({ id: i.id, why: i.why })),
        } as never,
      });
      if (!r.ok) {
        setError("This did not save. Try once more.");
        return;
      }
      setDone({ person: r.person_token });
    } catch {
      setError("This did not save. Try once more.");
    } finally {
      setSaving(false);
    }
  };

  if (done)
    return (
      <Done
        done={done}
        onRestart={() => {
          setDone(null);
          setF(EMPTY);
          setMove(0);
          setShelf(STANDING);
        }}
      />
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-[22px]">
            Good Chapter
          </Link>
          <Link
            to="/"
            className="text-[14px] font-medium underline underline-offset-4 hover:bg-foreground hover:text-background"
          >
            Leave
          </Link>
        </div>
        <ol className="mx-auto grid max-w-[1100px] grid-cols-3 px-6 pb-4">
          {MOVES.map((m, i) => (
            <li
              key={m}
              className={`border-t-2 pt-2 text-[13px] font-medium ${i <= move ? "border-primary text-foreground" : "border-foreground/25 text-foreground/50"}`}
            >
              {m}
            </li>
          ))}
        </ol>
      </header>

      <main className="mx-auto grid max-w-[1100px] gap-10 px-6 pb-32 pt-10 md:grid-cols-[minmax(0,1fr)_22rem] md:pb-16">
        <section>
          {move === 0 && (
            <>
              <Q label="How it opens" q="Where does this chapter start?">
                <Choices
                  items={PATHS.map((p) => ({ id: p.id, title: p.title, line: p.line }))}
                  value={f.path}
                  onPick={(v) => set({ path: v as PathId, anchorId: "", amount: 0 })}
                />
              </Q>
              <Q
                label="The chapter"
                q="Which chapter is this?"
                hint="Pick the closest one. It shapes the list. It does not label the person."
              >
                <Chips
                  items={[...CHAPTER_TYPES]}
                  value={f.chapterType}
                  onPick={(v) => set({ chapterType: v })}
                />
              </Q>
            </>
          )}
          {move === 1 && (
            <>
              {(Object.keys(CLUES) as ClueKey[]).map((k) => (
                <Q key={k} label="A clue" q={CLUES[k].q}>
                  <Chips
                    items={[...CLUES[k].options]}
                    value={f[k]}
                    onPick={(v) => set({ [k]: v } as Partial<Form>)}
                  />
                </Q>
              ))}
              <Q label="The voice" q="How should the reasons sound?">
                <Chips
                  items={TONES.map((t) => t.label)}
                  value={TONES.find((t) => t.id === f.tone)!.label}
                  onPick={(v) => set({ tone: TONES.find((t) => t.label === v)!.id })}
                />
              </Q>
              {budget ? (
                <Q
                  label="The amount"
                  q="What is the amount per person?"
                  hint="Nothing is charged here. The list is built inside the number."
                >
                  <Chips
                    items={AMOUNTS.map((a) => `$${a}`)}
                    value={f.amount ? `$${f.amount}` : ""}
                    onPick={(v) => set({ amount: Number(v.slice(1)) })}
                  />
                </Q>
              ) : (
                <Q
                  label="The anchor"
                  q="Which one would you give first?"
                  hint="It goes to the top of the list. The other seven sit around it."
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {shelf.map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        aria-pressed={f.anchorId === i.id}
                        onClick={() => set({ anchorId: i.id })}
                        className={`rounded border-2 border-foreground text-left ${f.anchorId === i.id ? "bg-highlight" : "bg-card hover:bg-foreground hover:text-background"}`}
                      >
                        <img
                          src={i.photo}
                          alt={i.name}
                          className="aspect-square w-full border-b-2 border-foreground object-cover"
                          loading="lazy"
                        />
                        <span className="block p-2 text-[13px] font-medium">
                          {i.name} · ${i.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </Q>
              )}
            </>
          )}
          {move === 2 && (
            <>
              <Q
                label="From you"
                q="What name should guests see?"
                hint="Your first name. Guests know who thought of this."
              >
                <input
                  className="w-full rounded border-2 border-foreground bg-card px-4 py-3 text-[19px] outline-none focus:border-primary"
                  value={f.starterName}
                  maxLength={40}
                  onChange={(e) => set({ starterName: e.target.value })}
                  placeholder="Your first name"
                />
              </Q>
              <Q
                label="The circle"
                q="How many people will you invite?"
                hint="You get one private link per guest to send yourself. We never ask for their emails, and nobody sees who else is giving."
              >
                <div className="flex items-center gap-3">
                  <Step
                    onClick={() => set({ guestCount: Math.max(1, f.guestCount - 1) })}
                    label="One fewer"
                  >
                    −
                  </Step>
                  <span className="min-w-12 text-center font-display text-[40px]">
                    {f.guestCount}
                  </span>
                  <Step
                    onClick={() => set({ guestCount: Math.min(20, f.guestCount + 1) })}
                    label="One more"
                  >
                    +
                  </Step>
                </div>
              </Q>
              <p className="max-w-[46ch] text-[17px] leading-[1.5] text-foreground/75">
                The person gets their link first. They decline what does not fit and say yes. Only
                then do the guest links open.
              </p>
            </>
          )}

          {error ? (
            <p role="alert" className="mt-6 text-[16px] text-destructive">
              {error}
            </p>
          ) : null}
          <div className="mt-10 flex items-center gap-3">
            {move > 0 ? (
              <button
                type="button"
                onClick={() => setMove(move - 1)}
                className="rounded border-2 border-foreground px-5 py-3 text-[14px] font-medium hover:bg-foreground hover:text-background"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              disabled={!canNext || saving}
              onClick={() => (move < 2 ? setMove(move + 1) : finish())}
              className="rounded border-2 border-primary bg-primary px-6 py-3 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary disabled:opacity-40"
            >
              {move < 2 ? "Continue" : saving ? "Saving" : "Start the chapter"}
            </button>
          </div>
        </section>

        <aside className="hidden md:block">
          <Shelf items={visible} tuning={tuning} note={note} anchorId={f.anchorId} cap={cap} />
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t-2 border-foreground bg-background md:hidden">
        <button
          type="button"
          onClick={() => setSheet(!sheet)}
          aria-expanded={sheet}
          className="flex w-full items-center justify-between px-6 py-4 text-[14px] font-medium"
        >
          <span>{tuning ? "Tuning the list" : `${visible.length} things on the list`}</span>
          <span>{sheet ? "Hide" : "Look"}</span>
        </button>
        {sheet ? (
          <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">
            <Shelf items={visible} tuning={tuning} note={note} anchorId={f.anchorId} cap={cap} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Q({
  label,
  q,
  hint,
  children,
}: {
  label: string;
  q: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-10">
      <legend className="text-[14px] font-medium text-emphasis">{label}</legend>
      <p className="mt-2 font-display text-[clamp(26px,4vw,36px)] leading-[1.1]">{q}</p>
      {hint ? (
        <p className="mt-2 max-w-[48ch] text-[17px] leading-[1.45] text-foreground/70">{hint}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Chips({
  items,
  value,
  onPick,
}: {
  items: string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <button
          key={i}
          type="button"
          aria-pressed={value === i}
          onClick={() => onPick(i)}
          className={`rounded border-2 border-foreground px-4 py-2 text-[14px] font-medium ${value === i ? "bg-highlight" : "bg-card hover:bg-foreground hover:text-background"}`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

function Choices({
  items,
  value,
  onPick,
}: {
  items: { id: string; title: string; line: string }[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <button
          key={i.id}
          type="button"
          aria-pressed={value === i.id}
          onClick={() => onPick(i.id)}
          className={`block w-full rounded border-2 border-foreground px-5 py-4 text-left ${value === i.id ? "bg-highlight" : "bg-card hover:bg-foreground hover:text-background"}`}
        >
          <span className="block font-display text-[21px] leading-[1.15]">{i.title}</span>
          <span className="mt-1 block text-[16px] opacity-80">{i.line}</span>
        </button>
      ))}
    </div>
  );
}

function Step({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-12 w-12 rounded border-2 border-foreground text-[22px] hover:bg-foreground hover:text-background"
    >
      {children}
    </button>
  );
}

function Shelf({
  items,
  tuning,
  note,
  anchorId,
  cap,
}: {
  items: ShelfItem[];
  tuning: boolean;
  note: string;
  anchorId: string;
  cap: number;
}) {
  const ordered = anchorId
    ? [...items].sort((a, b) => (a.id === anchorId ? -1 : b.id === anchorId ? 1 : 0))
    : items;
  return (
    <div className="rounded border-2 border-foreground bg-card md:sticky md:top-6">
      <div className="flex items-baseline justify-between border-b-2 border-foreground px-4 py-3">
        <p className="text-[14px] font-medium">The list so far</p>
        <p className="text-[13px] font-medium text-foreground/60" aria-live="polite">
          {tuning ? "Tuning" : `${items.length} of 8`}
        </p>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-[16px]">
          Nothing on the shelf fits under ${cap}. Pick a higher amount.
        </p>
      ) : (
        <ul className={`divide-y-2 divide-foreground/15 ${tuning ? "opacity-60" : ""}`}>
          {ordered.map((i) => (
            <li key={i.id} className="flex gap-3 px-4 py-3">
              <img
                src={i.photo}
                alt={i.name}
                className="h-14 w-14 shrink-0 rounded border-2 border-foreground object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-[14px] font-medium">
                  {i.id === anchorId ? <span className="text-emphasis">First · </span> : null}
                  {i.name} <span className="text-foreground/60">${i.price}</span>
                </p>
                <p className="mt-0.5 text-[14px] leading-[1.35] text-foreground/80">{i.why}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {note ? (
        <p className="border-t-2 border-foreground px-4 py-2 text-[13px] text-foreground/60">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function Done({ done, onRestart }: { done: { person: string }; onRestart: () => void }) {
  const [copied, setCopied] = useState("");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      setCopied("");
    }
  };
  const personUrl = `${origin}/chapter/${done.person}`;
  return (
    <main className="mx-auto max-w-[760px] px-6 py-16 text-foreground">
      <p className="text-[14px] font-medium text-emphasis">Started</p>
      <h1 className="mt-3 font-display text-[clamp(40px,7vw,72px)] leading-[0.95]">
        The chapter is waiting on one yes.
      </h1>
      <p className="mt-6 max-w-[46ch] text-[19px] leading-[1.5] text-foreground/85">
        Send the first link to the person yourself. They decline what does not fit and say yes.
        Guest links stay closed until then.
      </p>
      <div className="mt-10 rounded border-2 border-foreground bg-card p-5">
        <p className="text-[14px] font-medium">For the person</p>
        <p className="mt-2 break-all text-[15px]">{personUrl}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copy(personUrl, "p")}
            className="rounded border-2 border-primary bg-primary px-5 py-2 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary"
          >
            {copied === "p" ? "Copied" : "Copy their link"}
          </button>
          <Link
            to="/chapter/$token"
            params={{ token: done.person }}
            className="rounded border-2 border-foreground px-5 py-2 text-[14px] font-medium hover:bg-foreground hover:text-background"
          >
            Preview what they see
          </Link>
        </div>
      </div>
      <p className="mt-6 max-w-[46ch] text-[16px] text-foreground/70">
        Guest links stay private until the person approves the chapter. They can copy, replace,
        revoke, or email each invitation from their own page.
      </p>
      <p className="mt-8 text-[14px] font-medium text-foreground/60">
        Keep these links. They are the only copies.{" "}
        <button
          type="button"
          onClick={onRestart}
          className="underline hover:bg-foreground hover:text-background"
        >
          Start another
        </button>
      </p>
    </main>
  );
}

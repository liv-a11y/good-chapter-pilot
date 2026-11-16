import { useState } from "react";
import { Meter, Ticker, money } from "@/components/site/portal-ui";
import espresso from "@/assets/g-01-espresso-machine.webp.asset.json";
import lamp from "@/assets/g-02-bedside-lamp.webp.asset.json";
import bowl from "@/assets/g-04-floral-bowl.webp.asset.json";
import tissue from "@/assets/g-05-olive-tissue-holder.webp.asset.json";
import incense from "@/assets/g-07-incense-holder.webp.asset.json";
import throwImg from "@/assets/g-08-check-wool-throw.webp.asset.json";
import robe from "@/assets/g-11-striped-robe.webp.asset.json";
import table from "@/assets/g-13-tiled-coffee-table.webp.asset.json";
import spoons from "@/assets/g-14-beaded-spoons.webp.asset.json";
import tins from "@/assets/g-15-striped-salt-tins.webp.asset.json";

type Gift = { id: string; name: string; price: number; img: string; why: string };

// Sample prices for the prototype only.
const GIFTS: Gift[] = [
  {
    id: "throw",
    name: "Check wool throw",
    price: 180,
    img: throwImg.url,
    why: "For the first cold night in a new place.",
  },
  {
    id: "lamp",
    name: "Bedside lamp",
    price: 160,
    img: lamp.url,
    why: "Light for reading, not for the ceiling.",
  },
  { id: "robe", name: "Striped robe", price: 150, img: robe.url, why: "Slow mornings count." },
  {
    id: "bowl",
    name: "Floral bowl",
    price: 140,
    img: bowl.url,
    why: "Fruit on the counter. A home signal.",
  },
  {
    id: "spoons",
    name: "Beaded spoons",
    price: 60,
    img: spoons.url,
    why: "Small, used every day.",
  },
  {
    id: "tins",
    name: "Striped salt tins",
    price: 70,
    img: tins.url,
    why: "The kitchen starts to feel like yours.",
  },
  {
    id: "tissue",
    name: "Olive tissue holder",
    price: 55,
    img: tissue.url,
    why: "A small, kind object.",
  },
  {
    id: "incense",
    name: "Incense holder",
    price: 45,
    img: incense.url,
    why: "For the quiet part of the day.",
  },
  {
    id: "espresso",
    name: "Espresso machine",
    price: 480,
    img: espresso.url,
    why: "Unlocked when teammates add.",
  },
  {
    id: "table",
    name: "Tiled coffee table",
    price: 420,
    img: table.url,
    why: "Unlocked when teammates add.",
  },
];

type Stage = "idle" | "started" | "approved" | "sent" | "closed";
type Role = "admin" | "manager" | "peer" | "employee";
const PEER_ADDS = [40, 25, 60, 35, 50];
const STEPS: { s: Stage; label: string }[] = [
  { s: "idle", label: "Quiet" },
  { s: "started", label: "Started" },
  { s: "approved", label: "Approved" },
  { s: "sent", label: "Sent" },
];

export function CareCockpit({ anchor }: { anchor: number }) {
  const [role, setRole] = useState<Role>("manager");
  const [stage, setStage] = useState<Stage>("idle");
  const [adds, setAdds] = useState<number[]>([]);
  const [pick, setPick] = useState(0);
  const [opened, setOpened] = useState(false);

  const added = adds.reduce((a, b) => a + b, 0);
  const budget = anchor + added;
  const gift = GIFTS[pick]!;
  const fits = gift.price <= budget;
  const stepIdx = STEPS.findIndex((x) => x.s === stage);
  const locked = stage === "approved" || stage === "sent";

  function reset() {
    setStage("idle");
    setAdds([]);
    setPick(0);
    setOpened(false);
  }
  function addPeer() {
    if (adds.length < PEER_ADDS.length) setAdds([...adds, PEER_ADDS[adds.length]!]);
  }
  function swap(dir: 1 | -1) {
    setPick((pick + dir + GIFTS.length) % GIFTS.length);
  }

  const roles: { id: Role; label: string; sees: string }[] = [
    { id: "manager", label: "01 Manager", sees: "Starts it. Sees status only." },
    { id: "peer", label: "02 Teammates", sees: "Add quietly. No amounts shown." },
    { id: "employee", label: "03 Employee", sees: "Chooses on their phone." },
    { id: "admin", label: "04 People Ops", sees: "Counts only. Nothing personal." },
  ];
  const roleIdx = roles.findIndex((r) => r.id === role);
  function go(d: 1 | -1) {
    const n = roles[roleIdx + d];
    if (n) setRole(n.id);
  }

  return (
    <section className="mt-16" aria-labelledby="cockpit-heading">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow text-emphasis">Care cockpit · One chapter, four views</p>
          <h2 id="cockpit-heading" className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
            Everyone sees only their part.
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed">
            Follow it in order. Manager, teammates, the employee, then People Ops. Nobody at work
            sees the object, the note, or the address.
          </p>
        </div>
        <button
          onClick={reset}
          className="w-fit eyebrow underline hover:bg-foreground hover:text-background"
        >
          Start over
        </button>
      </div>

      {stage === "closed" && (
        <p className="mt-6 eyebrow">Closed quietly. Nobody is told why. Nothing drawn.</p>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_23rem]">
        {/* Left: sequential scenes */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">
              Scene {roleIdx + 1} of 04 · {roles[roleIdx]!.sees}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                disabled={roleIdx === 0}
                aria-label="Previous scene"
                className="rounded-[4px] bg-card px-3 py-2 font-medium text-[13px] hover:bg-foreground hover:text-background disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={() => go(1)}
                disabled={roleIdx === roles.length - 1}
                aria-label="Next scene"
                className="rounded-[4px] bg-card px-3 py-2 font-medium text-[13px] hover:bg-foreground hover:text-background disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {roles.map((r, i) => (
              <span
                key={r.id}
                className={`h-1 flex-1 rounded-[2px] ${i <= roleIdx ? "bg-foreground" : "bg-card"}`}
              />
            ))}
          </div>

          <div className="mt-6">
            {role === "manager" && (
              <Pane
                eyebrow="Step 01 · Manager"
                title={
                  stage === "idle"
                    ? "Someone on your team just signed a lease."
                    : "You started it. That is the whole job."
                }
              >
                <p>
                  {stage === "idle"
                    ? "You do not need details. One tap sends a private invite. They decide everything after that."
                    : "You will see when it moves. You will not see what they chose."}
                </p>
                <Facts
                  rows={[
                    ["Status", label(stage)],
                    ["Object", "Private"],
                    ["Address", "Never shown"],
                  ]}
                />
                {stage === "idle" && (
                  <Primary
                    onClick={() => {
                      setStage("started");
                      setRole("peer");
                    }}
                  >
                    Start a chapter, privately
                  </Primary>
                )}
              </Pane>
            )}
            {role === "peer" && (
              <Pane
                eyebrow="Step 02 · Teammates"
                title={
                  stage === "idle"
                    ? "Nothing to see yet."
                    : "Want to add to it? Only if you want to."
                }
              >
                <p>
                  {stage === "idle"
                    ? "A manager has not started anything."
                    : "Your amount stays yours. No leaderboard, no names, no reminders."}
                </p>
                <Facts
                  rows={[
                    ["Teammates who added", String(adds.length)],
                    ["Added together", money(added)],
                    ["Per person amounts", "Hidden"],
                  ]}
                />
                {stage === "started" && (
                  <div className="flex flex-wrap items-center gap-4">
                    <Primary onClick={addPeer} disabled={adds.length >= PEER_ADDS.length}>
                      {adds.length >= PEER_ADDS.length
                        ? "Plenty. Thank you."
                        : `Add ${money(PEER_ADDS[adds.length]!)} quietly`}
                    </Primary>
                    <button
                      onClick={() => setRole("employee")}
                      className="mt-6 eyebrow underline hover:bg-foreground hover:text-background"
                    >
                      Next. Their turn
                    </button>
                  </div>
                )}
              </Pane>
            )}
            {role === "employee" && (
              <Pane
                eyebrow="Step 03 · Employee"
                title={
                  stage === "idle"
                    ? "Their phone is quiet."
                    : stage === "started"
                      ? "Now it is theirs."
                      : "They chose. Work does not know what."
                }
              >
                <p>
                  {stage === "started"
                    ? "On the phone, they swipe through objects, keep one, or close it quietly. No one is told either way."
                    : "Everything here happens on their phone, and only there."}
                </p>
                {(stage === "sent" || stage === "closed") && (
                  <button
                    onClick={() => setRole("admin")}
                    className="mt-6 eyebrow underline hover:bg-foreground hover:text-background"
                  >
                    Next. What People Ops sees
                  </button>
                )}
              </Pane>
            )}
            {role === "admin" && (
              <Pane eyebrow="Step 04 · People Ops" title="Care, accounted for.">
                <p>Counts and spend. Never the person, the reason, or the object.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Stat k="Anchor drawn" v={<Ticker value={locked ? anchor : 0} />} />
                  <Stat k="Teammates added" v={<Ticker value={added} />} hl />
                  <Stat k="Multiplier" v={`${(budget / anchor).toFixed(2)}x`} />
                </div>
                <div className="mt-5">
                  <Meter
                    label="Anchor and teammate share"
                    parts={[
                      { pct: (anchor / Math.max(budget, 1)) * 100, className: "bg-primary" },
                      { pct: (added / Math.max(budget, 1)) * 100, className: "bg-highlight" },
                    ]}
                  />
                  <p className="mt-2 eyebrow">Cobalt, company anchor. Yellow, teammates.</p>
                </div>
              </Pane>
            )}
          </div>
        </div>

        {/* Right: employee phone */}
        <div className="mx-auto w-full max-w-[22rem] lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-center eyebrow">03 · Employee's phone</p>
          <div
            className={`relative rounded-[3.25rem] bg-foreground p-[10px] ${role === "employee" ? "outline outline-2 outline-offset-4 outline-primary" : ""}`}
          >
            {/* side buttons */}
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-foreground"
            />
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-foreground"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-foreground"
            />
            <div className="relative overflow-hidden rounded-[2.6rem] bg-background">
              {/* status bar + dynamic island */}
              <div className="relative flex h-12 items-center justify-between px-7 text-[13px] font-medium">
                <span>9:41</span>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-2.5 h-7 w-24 -translate-x-1/2 rounded-full bg-foreground"
                />
                <span aria-hidden="true" className="flex items-center gap-1">
                  <span className="flex items-end gap-[2px]">
                    {[4, 6, 8, 10].map((h) => (
                      <span
                        key={h}
                        className="w-[3px] rounded-[1px] bg-foreground"
                        style={{ height: h }}
                      />
                    ))}
                  </span>
                  <span className="ml-1 flex h-[11px] w-6 items-center rounded-[3px] border border-foreground p-[1px]">
                    <span className="h-full w-4/5 rounded-[1px] bg-foreground" />
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between px-5 pb-2 font-medium text-[13px]">
                <span>Good Chapter, Co.</span>
                <span>Only you</span>
              </div>
              <div className="h-[36rem] overflow-y-auto px-5 pb-4 pt-2">
                {stage === "idle" && <Quiet>Nothing yet. Nobody has asked them anything.</Quiet>}
                {stage === "closed" && <Quiet>Closed. No reason needed. No one is told.</Quiet>}

                {stage === "started" && (
                  <div>
                    <p className="eyebrow text-emphasis">For you</p>
                    <p className="mt-2 font-display text-2xl leading-tight">
                      Someone at work started a chapter for you.
                    </p>
                    <p className="mt-1 text-sm">
                      The first {money(anchor)} is covered.
                      {added > 0 ? ` Teammates added ${money(added)}.` : ""} Keep what fits.
                    </p>
                    <div className="mt-4 rounded-sm border-2 border-foreground">
                      <img
                        src={gift.img}
                        alt={gift.name}
                        width={600}
                        height={600}
                        className="aspect-square w-full border-b-2 border-foreground object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-lg leading-tight">{gift.name}</p>
                          <p className="font-medium text-sm">{money(gift.price)}</p>
                        </div>
                        <p className="mt-1 text-sm">{gift.why}</p>
                        {!fits && (
                          <p className="mt-2 font-medium text-[13px] text-emphasis">
                            Needs {money(gift.price - budget)} more from teammates
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => swap(-1)}
                        aria-label="Previous object"
                        className="rounded-sm border-2 border-foreground px-3 py-2 font-medium text-[13px] hover:bg-foreground hover:text-background"
                      >
                        Prev
                      </button>
                      <span className="font-medium text-[13px]">
                        {pick + 1} of {GIFTS.length}
                      </span>
                      <button
                        onClick={() => swap(1)}
                        aria-label="Next object"
                        className="rounded-sm border-2 border-foreground px-3 py-2 font-medium text-[13px] hover:bg-foreground hover:text-background"
                      >
                        Swap
                      </button>
                    </div>
                    <button
                      onClick={() => setStage("approved")}
                      disabled={!fits}
                      className="mt-3 w-full rounded-sm border-2 border-foreground bg-primary px-3 py-3 text-primary-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
                    >
                      Keep this one
                    </button>
                    <button
                      onClick={() => setStage("closed")}
                      className="mt-2 w-full py-1 font-medium text-[13px] underline hover:bg-foreground hover:text-background"
                    >
                      Not now. Close quietly
                    </button>
                  </div>
                )}

                {stage === "approved" && (
                  <div>
                    <p className="eyebrow text-emphasis">Yours</p>
                    <p className="mt-2 font-display text-2xl leading-tight">{gift.name}.</p>
                    <img
                      src={gift.img}
                      alt={gift.name}
                      width={600}
                      height={600}
                      className="mt-3 aspect-square w-full rounded-sm border-2 border-foreground object-cover"
                    />
                    <p className="mt-3 text-sm">Your address stays with you. Work never sees it.</p>
                    <button
                      onClick={() => setStage("sent")}
                      className="mt-4 w-full rounded-sm border-2 border-foreground bg-primary px-3 py-3 text-primary-foreground hover:bg-foreground hover:text-background"
                    >
                      Ship it to me
                    </button>
                  </div>
                )}

                {stage === "sent" && (
                  <div>
                    <p className="eyebrow text-emphasis">On its way</p>
                    {!opened ? (
                      <button
                        onClick={() => setOpened(true)}
                        className="mt-3 flex aspect-square w-full flex-col items-center justify-center rounded-sm border-2 border-foreground bg-highlight hover:bg-foreground hover:text-background"
                      >
                        <span className="font-display text-2xl">A parcel for you.</span>
                        <span className="mt-2 font-medium text-[13px]">Tap to open</span>
                      </button>
                    ) : (
                      <div>
                        <img
                          src={gift.img}
                          alt={gift.name}
                          width={600}
                          height={600}
                          className="mt-3 aspect-square w-full rounded-sm border-2 border-foreground object-cover"
                        />
                        <p className="mt-3 font-display text-xl leading-snug">
                          For your everyday. No thank-you required.
                        </p>
                        <p className="mt-2 text-sm">
                          Want to say something anyway? One quiet note goes to everyone at once.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div
                aria-hidden="true"
                className="flex h-7 items-center justify-center border-t border-foreground/10"
              >
                <span className="h-[5px] w-32 rounded-full bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function label(s: Stage) {
  return {
    idle: "Not started",
    started: "Waiting on them",
    approved: "Approved",
    sent: "Sent",
    closed: "Closed quietly",
  }[s];
}

function Pane({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[4px] bg-card p-6 sm:p-10">
      <p className="eyebrow text-emphasis">{eyebrow}</p>
      <h3 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">{title}</h3>
      <div className="mt-3 leading-relaxed">{children}</div>
    </div>
  );
}

function Facts({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-6 space-y-1 rounded-[4px] bg-background p-4">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-1">
          <dt className="eyebrow">{k}</dt>
          <dd className="font-medium text-sm tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Stat({ k, v, hl }: { k: string; v: React.ReactNode; hl?: boolean }) {
  return (
    <div className={`rounded-[4px] p-5 ${hl ? "bg-highlight" : "bg-background"}`}>
      <p className="font-medium text-[13px]">{k}</p>
      <p className="mt-2 font-medium text-2xl">{v}</p>
    </div>
  );
}

function Primary({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-6 rounded-sm border-2 border-foreground bg-primary px-5 py-3 text-primary-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Quiet({ children }: { children: React.ReactNode }) {
  return <p className="mt-24 text-center font-display text-xl leading-snug">{children}</p>;
}

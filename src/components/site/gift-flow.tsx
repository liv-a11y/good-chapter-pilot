import { useState } from "react";

import { Meter, Ticker, money } from "@/components/site/portal-ui";

const ANCHOR_DEFAULT = 200;
const OBJECT = { name: "Cobalt toolbox", price: 260 };
const ADDS = [25, 40, 20, 35, 30];

type Stage = 0 | 1 | 2 | 3;
const STAGES = ["Started", "Approved", "Funded", "Delivered"];

export function GiftFlow({ anchor = ANCHOR_DEFAULT }: { anchor?: number }) {
  const [stage, setStage] = useState<Stage>(0);
  const [adds, setAdds] = useState<number[]>([]);
  const fromGivers = adds.reduce((a, b) => a + b, 0);
  const funded = anchor + fromGivers;
  const goal = Math.max(OBJECT.price, anchor);
  const covered = stage >= 2 ? Math.min(funded, goal) : 0;
  const extra = Math.max(0, funded - goal);

  function reset() {
    setStage(0);
    setAdds([]);
  }

  return (
    <div>
      <ol className="grid grid-cols-4 border-2 border-foreground">
        {STAGES.map((s, i) => (
          <li
            key={s}
            className={`border-foreground px-2 py-2 font-medium text-[13px] ${i > 0 ? "border-l-2" : ""} ${i <= stage ? "bg-foreground text-background" : ""}`}
          >
            {String(i + 1).padStart(2, "0")} {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_16rem]">
        <div>
          {stage === 0 && (
            <Step
              eyebrow="Ch 006 · Engineering · First place"
              title="A teammate started this chapter."
            >
              <p>
                The person gets a private link. Only they see the gifts. They swap anything, then
                approve.
              </p>
              <Line k="Picked object" v={`${OBJECT.name} · ${money(OBJECT.price)}`} />
              <Action onClick={() => setStage(1)}>Person approves in private</Action>
            </Step>
          )}
          {stage === 1 && (
            <Step eyebrow="Approved" title="Approved. Now the pool covers the anchor.">
              <p>
                The company pays the first {money(anchor)}. Nobody is told who approved or what they
                chose.
              </p>
              <Action onClick={() => setStage(2)}>Draw {money(anchor)} from the pool</Action>
            </Step>
          )}
          {stage === 2 && (
            <Step eyebrow="Funded · stays open" title="Funded. Teammates can keep adding.">
              <p>
                Invited teammates add what they want, quietly. No totals per person, no reminders,
                no leaderboard.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  disabled={adds.length >= ADDS.length}
                  onClick={() => setAdds([...adds, ADDS[adds.length]!])}
                  className="rounded-sm border-2 border-foreground px-4 py-2 font-medium text-[14px] hover:bg-foreground hover:text-background disabled:opacity-50"
                >
                  + Simulate a teammate adding
                </button>
                <Action onClick={() => setStage(3)} inline>
                  Send the gift
                </Action>
              </div>
            </Step>
          )}
          {stage === 3 && (
            <Step eyebrow="Delivered" title="It arrived. Two quiet notes went out.">
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Note to="To the person">
                  Your team wanted this chapter to start well. The {OBJECT.name.toLowerCase()} is on
                  its way. Nothing to do, nobody to thank.
                </Note>
                <Note
                  to={`To ${adds.length || "the"} teammate${adds.length === 1 ? "" : "s"} who added`}
                >
                  Your part landed. They got it. Nobody sees who gave what.
                </Note>
              </div>
              {extra > 0 && (
                <p className="mt-4 text-sm">
                  {money(extra)} over the object rolls into the next chapter on this team.
                </p>
              )}
              <button
                onClick={reset}
                className="mt-6 font-medium text-[14px] underline hover:bg-foreground hover:text-background"
              >
                Run it again
              </button>
            </Step>
          )}
        </div>

        <aside className="rounded-sm border-2 border-foreground p-4 font-medium text-[14px]">
          <p>Funding</p>
          <dl className="mt-3 space-y-2">
            <Line
              k="Pool anchor"
              v={stage >= 1 ? <Ticker value={stage >= 2 ? anchor : 0} /> : money(0)}
            />
            <Line
              k="Givers"
              v={
                <>
                  <Ticker value={fromGivers} /> · {adds.length}
                </>
              }
            />
            <Line k="Total" v={<Ticker value={stage >= 2 ? funded : 0} />} />
            <Line k="Multiplier" v={stage >= 2 ? `${(funded / anchor).toFixed(2)}x` : "0.00x"} />
          </dl>
          <div className="mt-4">
            <Meter
              label={`${Math.round((covered / goal) * 100)}% of object covered`}
              parts={[
                {
                  pct: stage >= 2 ? (Math.min(anchor, goal) / goal) * 100 : 0,
                  className: "bg-primary",
                },
                {
                  pct: stage >= 2 ? (Math.max(0, covered - anchor) / goal) * 100 : 0,
                  className: "bg-highlight",
                },
              ]}
            />
            <p className="mt-2 normal-case tracking-normal">
              Cobalt is the pool. Yellow is teammates.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Step({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-medium text-[13px] text-emphasis">{eyebrow}</p>
      <h3 className="mt-2 font-display text-2xl">{title}</h3>
      <div className="mt-3 leading-relaxed">{children}</div>
    </div>
  );
}
function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="mt-2 flex justify-between gap-4 border-b-2 border-foreground pb-1">
      <dt>{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
function Note({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border-2 border-foreground bg-background p-4">
      <p className="font-medium text-[13px]">{to}</p>
      <p className="mt-2 font-display text-lg leading-snug">{children}</p>
    </div>
  );
}
function Action({
  onClick,
  children,
  inline,
}: {
  onClick: () => void;
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${inline ? "" : "mt-6"} rounded-sm border-2 border-foreground bg-primary px-4 py-2 font-medium text-[14px] text-primary-foreground hover:bg-foreground hover:text-background`}
    >
      {children}
    </button>
  );
}

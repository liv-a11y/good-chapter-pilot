import { useState } from "react";
import { money } from "@/components/site/portal-ui";

type Stage = "draft" | "invited" | "approved" | "teammates" | "sent" | "closed";

const GIFTS = [
  { id: "oven", name: "Cream enameled Dutch oven", price: 200 },
  { id: "toolbox", name: "Cobalt steel toolbox", price: 180 },
  { id: "coffee", name: "Green drip coffee maker", price: 160 },
];

const SCENARIOS = [
  { id: "first", label: "First place", note: "A teammate knows she signed a lease." },
  { id: "move", label: "Relocation", note: "A manager knows he is moving for the role." },
  { id: "family", label: "Caring for family", note: "A teammate knows things are heavy at home." },
];

const ORDER: Stage[] = ["draft", "invited", "approved", "teammates", "sent"];
const LABEL: Record<Stage, string> = {
  draft: "Draft",
  invited: "Invite sent",
  approved: "Approved",
  teammates: "Teammates added",
  sent: "Gift sent",
  closed: "Quietly closed",
};

export function SplitDesk({ anchor }: { anchor: number }) {
  const [scenario, setScenario] = useState(SCENARIOS[0]!.id);
  const [stage, setStage] = useState<Stage>("draft");
  const [pick, setPick] = useState(GIFTS[0]!.id);
  const [extra, setExtra] = useState(0);
  const sc = SCENARIOS.find((s) => s.id === scenario)!;
  const gift = GIFTS.find((g) => g.id === pick)!;
  const idx = ORDER.indexOf(stage);

  function reset(id: string) {
    setScenario(id);
    setStage("draft");
    setPick(GIFTS[0]!.id);
    setExtra(0);
  }

  // What the company side is allowed to see
  const deskGift =
    stage === "draft" || stage === "invited"
      ? "Waiting on the employee"
      : stage === "closed"
        ? "None"
        : "Chosen privately";
  const deskSpend = idx >= 2 && stage !== "closed" ? anchor : 0;

  return (
    <section className="mt-12" aria-labelledby="split-heading">
      <p className="eyebrow text-emphasis">Split view</p>
      <h2 id="split-heading" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
        Your desk on the left. Their phone on the right.
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed">
        Click through a chapter. Watch what each side sees. The company never sees the gift, the
        note, or the address.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Scenario">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => reset(s.id)}
            aria-pressed={scenario === s.id}
            className={`rounded-sm border-2 border-foreground px-3 py-2 font-medium text-[14px] hover:bg-foreground hover:text-background ${scenario === s.id ? "bg-highlight" : ""}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Desk */}
        <div className="rounded-sm border-2 border-foreground">
          <div className="flex items-center justify-between border-b-2 border-foreground bg-foreground px-4 py-2 text-background">
            <span className="font-medium text-[13px]">Company desk</span>
            <span className="font-medium text-[13px]">Counts only</span>
          </div>
          <div className="p-5">
            <p className="leading-relaxed">{sc.note}</p>
            <ol className="mt-5 grid grid-cols-5 gap-1" aria-label="Chapter progress">
              {ORDER.map((s, i) => (
                <li
                  key={s}
                  className={`border-2 border-foreground px-1 py-2 text-center font-medium text-[13px] ${stage !== "closed" && i <= idx ? "bg-highlight" : ""}`}
                >
                  {LABEL[s]}
                </li>
              ))}
            </ol>
            <dl className="mt-6 space-y-2">
              <DRow k="Status" v={LABEL[stage]} />
              <DRow k="Anchor drawn" v={money(deskSpend)} />
              <DRow k="Gift" v={deskGift} />
              <DRow
                k="Teammates who joined"
                v={stage === "teammates" || stage === "sent" ? String(extra > 0 ? 3 : 0) : "0"}
              />
              <DRow k="Address" v="Never shown" />
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {stage === "draft" && (
                <DeskBtn onClick={() => setStage("invited")}>Send private invite</DeskBtn>
              )}
              {stage === "approved" && (
                <DeskBtn
                  onClick={() => {
                    setExtra(120);
                    setStage("teammates");
                  }}
                >
                  Simulate teammates adding
                </DeskBtn>
              )}
              {(stage === "approved" || stage === "teammates") && (
                <DeskBtn onClick={() => setStage("sent")}>Mark gift sent</DeskBtn>
              )}
              {(stage === "sent" || stage === "closed") && (
                <DeskBtn onClick={() => reset(scenario)}>Start over</DeskBtn>
              )}
              {stage === "invited" && (
                <p className="font-medium text-[13px]">
                  Waiting. Nothing moves until they approve.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="mx-auto w-full max-w-[22rem] rounded-[4px] border-2 border-foreground bg-background p-2">
          <div className="rounded-sm border-2 border-foreground">
            <div className="flex justify-between border-b-2 border-foreground px-3 py-1 font-medium text-[13px]">
              <span>Good Chapter</span>
              <span>Private</span>
            </div>
            <div className="min-h-[26rem] p-4">
              {stage === "draft" && <Empty>Nothing yet. They have not been asked anything.</Empty>}
              {stage === "invited" && (
                <div>
                  <p className="eyebrow text-emphasis">For you</p>
                  <p className="mt-2 font-display text-2xl leading-tight">
                    Someone at work started a chapter for you.
                  </p>
                  <p className="mt-2 text-sm">The first gift is covered. Keep what fits.</p>
                  <ul className="mt-4 space-y-2">
                    {GIFTS.map((g) => (
                      <li key={g.id}>
                        <button
                          onClick={() => setPick(g.id)}
                          aria-pressed={pick === g.id}
                          className={`flex w-full justify-between rounded-sm border-2 border-foreground px-3 py-2 text-left text-sm hover:bg-foreground hover:text-background ${pick === g.id ? "bg-highlight" : ""}`}
                        >
                          <span>{g.name}</span>
                          <span className="font-medium">{money(g.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setStage("approved")}
                    className="mt-4 w-full rounded-sm border-2 border-foreground bg-primary px-3 py-3 text-primary-foreground hover:bg-foreground hover:text-background"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStage("closed")}
                    className="mt-2 w-full font-medium text-[13px] underline hover:bg-foreground hover:text-background"
                  >
                    Not now, close quietly
                  </button>
                </div>
              )}
              {(stage === "approved" || stage === "teammates") && (
                <div>
                  <p className="eyebrow text-emphasis">Approved</p>
                  <p className="mt-2 font-display text-2xl leading-tight">{gift.name}.</p>
                  <p className="mt-2 text-sm">
                    Your address stays with you. Your company does not see it.
                  </p>
                  <div className="mt-4 rounded-sm border-2 border-foreground p-3 font-medium text-[13px]">
                    Shipping to the address you entered
                  </div>
                  {stage === "teammates" && (
                    <p className="mt-4 rounded-sm border-2 border-foreground bg-highlight p-3 text-sm">
                      A few teammates added {money(extra)} toward a second piece. No names, no
                      amounts per person.
                    </p>
                  )}
                </div>
              )}
              {stage === "sent" && (
                <div>
                  <p className="eyebrow text-emphasis">On its way</p>
                  <p className="mt-2 font-display text-2xl leading-tight">
                    Your {gift.name.toLowerCase()} ships this week.
                  </p>
                  <p className="mt-4 text-sm">
                    Want to say thank you? One quiet note goes to everyone at once. Optional.
                  </p>
                </div>
              )}
              {stage === "closed" && (
                <Empty>Closed. Nobody is told why. Nothing is drawn from the pool.</Empty>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b-2 border-foreground pb-2">
      <dt className="eyebrow">{k}</dt>
      <dd className="font-medium text-sm tabular-nums">{v}</dd>
    </div>
  );
}

function DeskBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border-2 border-foreground bg-primary px-4 py-2 text-primary-foreground hover:bg-foreground hover:text-background"
    >
      {children}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="mt-16 text-center font-display text-xl leading-snug">{children}</p>;
}

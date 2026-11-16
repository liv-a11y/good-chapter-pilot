import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { SiteShell } from "@/components/site/site-shell";
import { Kpi, Meter, Ticker, money } from "@/components/site/portal-ui";

const title = "Partner dashboard prototype. Good Chapter, Co.";
const description =
  "A sample partner dashboard by team: pool, used, and what teammate giving added on top. Counts only.";

export const Route = createFileRoute("/partners/employers_/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const ANCHOR = 200;
const GIVE_PCT = 5;

// Sample per team. "added" is teammate giving on top of the anchor gifts.
const TEAMS = [
  { team: "Engineering", pool: 3000, chapters: 7, added: 910, sent: 5 },
  { team: "Operations", pool: 2000, chapters: 5, added: 540, sent: 4 },
  { team: "Support", pool: 2000, chapters: 4, added: 620, sent: 3 },
  { team: "Sales", pool: 1500, chapters: 3, added: 180, sent: 2 },
  { team: "Finance", pool: 1500, chapters: 3, added: 260, sent: 3 },
];

function DashboardPage() {
  const [sel, setSel] = useState<string | null>(null);
  const rows = TEAMS.map((t) => ({ ...t, used: t.chapters * ANCHOR }));
  const view = sel ? rows.filter((r) => r.team === sel) : rows;
  const pool = view.reduce((a, r) => a + r.pool, 0);
  const used = view.reduce((a, r) => a + r.used, 0);
  const added = view.reduce((a, r) => a + r.added, 0);
  const chapters = view.reduce((a, r) => a + r.chapters, 0);
  const mult = used ? (used + added) / used : 0;
  const giveBack = Math.round((used * GIVE_PCT) / 100);

  return (
    <SiteShell>
      <section className="site-container py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-6">
          <div>
            <p className="font-medium text-[13px] text-emphasis">
              Prototype · Sample data · Week 07 of 13
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Pools by team.</h1>
          </div>
          <p className="max-w-sm text-sm">
            Every dollar the company puts in, and every dollar teammates add on top. Counts only. No
            names.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by team">
          {[null, ...TEAMS.map((t) => t.team)].map((t) => (
            <button
              key={t ?? "all"}
              role="tab"
              aria-selected={sel === t}
              onClick={() => setSel(t)}
              className={`rounded-sm border-2 border-foreground px-3 py-1.5 font-medium text-[13px] hover:bg-foreground hover:text-background ${sel === t ? "bg-foreground text-background" : ""}`}
            >
              {t ?? "All teams"}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Kpi k="Pool">
            <Ticker value={pool} />
          </Kpi>
          <Kpi k="Used" sub={`${Math.round((used / pool) * 100)}% · ${chapters} chapters`}>
            <Ticker value={used} />
          </Kpi>
          <Kpi k="Remaining">
            <Ticker value={pool - used} />
          </Kpi>
          <Kpi k="Compounded" sub="Added by teammates" tone="highlight">
            <Ticker value={added} />
          </Kpi>
          <Kpi k="Multiplier" sub="Each pool dollar became" tone="ink">
            <Ticker value={mult} format={(n) => `${n.toFixed(2)}x`} />
          </Kpi>
        </div>

        <div className="mt-8 overflow-x-auto rounded-sm border-2 border-foreground">
          <table className="w-full min-w-[44rem] text-left">
            <thead className="bg-foreground text-background">
              <tr className="font-medium text-[13px]">
                {["Team", "Pool", "Used", "Compounded", "Mult", "Ch", "Sent", "Spend"].map((h) => (
                  <th key={h} className="px-3 py-2 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-medium text-sm tabular-nums">
              {rows.map((r) => (
                <tr
                  key={r.team}
                  onClick={() => setSel(sel === r.team ? null : r.team)}
                  className={`cursor-pointer border-t-2 border-foreground hover:bg-foreground hover:text-background ${sel === r.team ? "bg-highlight" : ""}`}
                >
                  <td className="px-3 py-3 font-sans">{r.team}</td>
                  <td className="px-3 py-3">{money(r.pool)}</td>
                  <td className="px-3 py-3">{money(r.used)}</td>
                  <td className="px-3 py-3">+{money(r.added)}</td>
                  <td className="px-3 py-3">{((r.used + r.added) / r.used).toFixed(2)}x</td>
                  <td className="px-3 py-3">{r.chapters < 3 ? "<3" : r.chapters}</td>
                  <td className="px-3 py-3">{r.sent}</td>
                  <td className="w-40 px-3 py-3">
                    <Meter
                      label={`${r.team}: ${Math.round((r.used / r.pool) * 100)}% used, plus teammate giving`}
                      parts={[
                        { pct: (r.used / (r.pool + r.added)) * 100, className: "bg-primary" },
                        { pct: (r.added / (r.pool + r.added)) * 100, className: "bg-highlight" },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-medium text-[13px]">
          Cobalt is pool used. Yellow is teammate giving. Teams under 3 chapters show as &lt;3.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Kpi k="Give back" sub={`${GIVE_PCT}% of anchors · sample rate`}>
            <Ticker value={giveBack} />
          </Kpi>
          <Kpi k="Declines flagged">0</Kpi>
          <Kpi k="Data on people">None</Kpi>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/partners/employers/portal"
            className="font-medium text-[14px] underline hover:bg-foreground hover:text-background"
          >
            Open the portal
          </Link>
          <Link
            to="/partners/employers"
            className="font-medium text-[14px] underline hover:bg-foreground hover:text-background"
          >
            Back to employers
          </Link>
        </div>
        <p className="mt-8 font-medium text-[13px]">
          Prototype with sample data. Nothing here is saved, charged, or sent.
        </p>
      </section>
    </SiteShell>
  );
}

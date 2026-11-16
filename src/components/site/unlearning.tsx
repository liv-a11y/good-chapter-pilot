import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const barriers = [
  {
    n: "01",
    title: "The single tax",
    body: "For a hundred years, care came with a ring or a baby. Buy a home alone or start over, and you furnish that life in private.",
  },
  {
    n: "02",
    title: "The vulnerability tax",
    body: "People will eat off one plate before they ask for help. A friend starts it, so nobody has to ask.",
    to: "/journal/vulnerability-tax" as const,
  },
  {
    n: "03",
    title: "The \u201clet me know\u201d trap",
    body: "Good intentions die in a text thread. A chapter gives friends one useful thing to do in five minutes.",
  },
];

export function Unlearning({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  const [open, setOpen] = useState<string | null>("01");
  return (
    <section className="site-section" aria-labelledby="unlearning">
      <div className="site-container grid gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
        {/* Folio cover */}
        <div
          className="mx-auto w-full max-w-[22rem] rounded-[4px] bg-card p-6 sm:p-8"
          aria-hidden="true"
        >
          <div className="flex aspect-[3/4] flex-col justify-between rounded-[4px] bg-primary p-6 text-primary-foreground">
            <p className="font-medium text-[13px]">Good Chapter, Co. · Vol. 01</p>
            <div>
              <p className="font-display text-[clamp(30px,6vw,40px)] leading-[1.02]">
                The rules we are unlearning.
              </p>
              <span className="mt-5 block h-3 w-16 bg-highlight" />
            </div>
            <p className="font-medium text-[13px]">Three essays</p>
          </div>
        </div>

        <div>
          <p className="eyebrow text-emphasis">Essays · Cultural barriers</p>
          <H
            id="unlearning"
            className={`${headingLevel === "h1" ? "site-h1" : "site-h2"} mt-5 max-w-[16ch]`}
          >
            The rules we are unlearning.
          </H>
          <p className="mt-6 max-w-[40rem] text-[18px] leading-[1.6] text-muted-foreground">
            Why it takes an engagement ring to get a toaster, why nobody asks for a skillet, and how
            we start celebrating the rest of life on purpose.
          </p>

          <ol className="mt-12 space-y-3" aria-label="Contents">
            {barriers.map((b) => {
              const isOpen = open === b.n;
              return (
                <li key={b.n} className={`rounded-[4px] ${isOpen ? "bg-card" : ""}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : b.n)}
                    aria-expanded={isOpen}
                    className="flex w-full items-baseline gap-5 rounded-[4px] px-5 py-4 text-left hover:bg-foreground hover:text-background"
                  >
                    <span className="eyebrow text-emphasis">{b.n}</span>
                    <span className="font-display text-[24px] leading-[1.1]">{b.title}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 pl-[3.6rem]">
                      <p className="text-[18px] leading-[1.65]">{b.body}</p>
                      {b.to && (
                        <Link
                          to={b.to}
                          className="mt-4 inline-flex items-center gap-2 font-medium text-primary hover:bg-foreground hover:text-background"
                        >
                          Read the essay <ArrowRight className="size-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getDecision, recordDecision } from "@/lib/person-chapter.functions";

export const Route = createFileRoute("/decide/$token/$answer")({
  loader: async ({ params }) => {
    if (params.answer !== "accept" && params.answer !== "decline") throw notFound();
    const d = await getDecision({ data: { token: params.token, answer: params.answer } });
    if (!d) throw notFound();
    return d;
  },
  head: () => ({
    meta: [
      { title: "Your answer | Good Chapter, Co." },
      { name: "description", content: "One answer, before anyone else sees the chapter." },
      { property: "og:title", content: "Your answer | Good Chapter, Co." },
      { property: "og:description", content: "One answer, before anyone else sees the chapter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">This letter is no longer good.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">
        Ask the friend who started it for a fresh one.
      </p>
    </main>
  ),
  component: DecidePage,
});

function DecidePage() {
  const d = Route.useLoaderData();
  const { token, answer } = Route.useParams();
  const record = useServerFn(recordDecision);
  const [result, setResult] = useState<{ decision: string; decided_on: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const settled = result ?? (d.settled ? { decision: d.decision, decided_on: d.decided_on } : null);
  const yes = answer === "accept";

  const decide = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await record({ data: { token, answer: yes ? "accept" : "decline" } });
      if (!r.ok) {
        setError("This link is no longer good. Ask for a fresh letter.");
        return;
      }
      setResult({ decision: r.decision, decided_on: r.decided_on });
    } catch {
      setError("That did not save. Open the link again and try once more.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-14">
      <p className="text-[14px] font-medium text-accent">{d.chapter_type}</p>
      {settled ? (
        <>
          <h1 className="mt-4 font-display text-[clamp(40px,8vw,76px)] leading-[0.95]">
            {settled.decision === "accepted" ? "Thank you." : "Sent back."}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[20px] leading-[1.45] text-foreground/85">
            {settled.decision === "accepted"
              ? `${d.person_first}, your chapter is accepted. ${d.starter_name} can now open it to the people you named. Nothing is charged to you.`
              : `Nothing went to the guests. ${d.starter_name} has your answer and can change the list before asking again.`}
          </p>
          {settled.decided_on ? (
            <p className="mt-6 text-[14px] font-medium text-foreground/55">
              Answered {settled.decided_on}
            </p>
          ) : null}
          <p className="mt-10 text-[14px] font-medium text-foreground/45">
            You can close this page.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-4 font-display text-[clamp(40px,8vw,76px)] leading-[0.95]">
            {yes ? "Say yes, or send it back." : "Send it back."}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[20px] leading-[1.45] text-foreground/85">
            {yes
              ? `${d.starter_name} started this chapter for you. Saying yes opens it to the people you named. Saying no sends it back before anyone sees a thing.`
              : `Nothing goes to the guests. ${d.starter_name} will see that you sent it back and can change the list. No reason is needed.`}
          </p>
          <button
            type="button"
            onClick={decide}
            disabled={busy}
            className="mt-8 flex w-full items-center justify-between gap-6 rounded border-2 border-primary bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary disabled:opacity-60 sm:w-auto"
          >
            <span>{busy ? "Saving" : yes ? "Yes, accept it" : "Send it back"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}
      {error ? (
        <p role="alert" className="mt-5 max-w-[46ch] text-[18px] text-destructive">
          {error}
        </p>
      ) : null}
    </main>
  );
}

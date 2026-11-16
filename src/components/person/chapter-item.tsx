import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { answerItem, removeApprovedItem } from "@/lib/person-chapter.functions";

export type PersonItem = {
  id: string;
  name: string;
  photo_url: string;
  price: number | null;
  source: string;
  source_url: string;
  why: string;
  status: string;
  claim_status: "reserved" | "purchased" | null;
};

const WORDS: Record<string, string> = {
  approved: "Approved. It stays.",
  declined: "Declined. It comes off the list.",
};

/** One of the eight, on the person's own link, with their approve or decline. */
export function ChapterItem({
  token,
  item,
  index,
  open,
  awaiting,
  accepted,
}: {
  token: string;
  item: PersonItem;
  index: number;
  open: boolean;
  awaiting: boolean;
  accepted: boolean;
}) {
  const answer = useServerFn(answerItem);
  const remove = useServerFn(removeApprovedItem);
  const [status, setStatus] = useState(
    item.status === "approved" || item.status === "declined" ? item.status : "",
  );
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [removed, setRemoved] = useState(item.status === "declined");

  const decide = async (value: "approved" | "declined") => {
    setBusy(value);
    setError("");
    try {
      const r = await answer({ data: { token, itemId: item.id, answer: value } });
      if (!r?.ok) {
        setError("That did not save. Open your link again and try once more.");
        return;
      }
      setStatus(r.status ?? value);
    } catch {
      setError("That did not save. Open your link again and try once more.");
    } finally {
      setBusy("");
    }
  };
  const removeGift = async () => {
    setBusy("remove");
    setError("");
    try {
      const result = await remove({ data: { token, itemId: item.id } });
      if (!result.ok) {
        setError("This gift is reserved or could not be removed.");
        return;
      }
      setRemoved(true);
    } catch {
      setError("This gift could not be removed. Refresh your page and try again.");
    } finally {
      setBusy("");
    }
  };
  const btn = (on: boolean) =>
    `flex-1 rounded border-2 border-foreground px-3 py-2 text-[14px] font-medium disabled:opacity-60 ${on ? "bg-highlight text-foreground" : "bg-card hover:bg-foreground hover:text-background"}`;

  return (
    <article className="flex flex-col overflow-hidden rounded border-2 border-foreground bg-card">
      {item.photo_url ? (
        <img
          src={item.photo_url}
          alt={item.name}
          loading="lazy"
          className="h-48 w-full border-b-2 border-foreground object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[13px] font-medium text-foreground/50">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-2 font-display text-[26px] leading-[1.05]">{item.name}</h2>
        <p className="mt-2 text-[18px] leading-[1.4] text-foreground/85">{item.why}</p>
        <div className="mt-3 flex items-baseline justify-between gap-3 text-[14px]">
          <span className="truncate text-foreground/55">
            {item.source ? `Available from the ${item.source}` : ""}
          </span>
          <span className="shrink-0 font-medium">{item.price != null ? `$${item.price}` : ""}</span>
        </div>
        <div className="mt-auto pt-4">
          {item.claim_status === "purchased" || item.status === "given" ? (
            <p className="text-[13px] font-medium text-foreground/50">Purchased.</p>
          ) : item.claim_status === "reserved" ? (
            <p className="text-[13px] font-medium text-foreground/50">Reserved.</p>
          ) : removed ? (
            <p className="text-[13px] font-medium text-foreground/50">Removed from the list.</p>
          ) : open ? (
            <>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={btn(status === "approved")}
                  aria-pressed={status === "approved"}
                  disabled={!!busy}
                  onClick={() => decide("approved")}
                >
                  {busy === "approved" ? "Saving" : "Approve"}
                </button>
                <button
                  type="button"
                  className={btn(status === "declined")}
                  aria-pressed={status === "declined"}
                  disabled={!!busy}
                  onClick={() => decide("declined")}
                >
                  {busy === "declined" ? "Saving" : "Decline"}
                </button>
              </div>
              {error ? (
                <p role="alert" className="mt-2 text-[15px] text-destructive">
                  {error}
                </p>
              ) : status ? (
                <p className="mt-2 text-[13px] font-medium text-foreground/55">{WORDS[status]}</p>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-[13px] font-medium text-foreground/50">
                {status ? WORDS[status] : "Answers are closed."}
              </p>
              {accepted && item.status === "approved" ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => void removeGift()}
                  className="mt-3 rounded border border-foreground/50 px-3 py-2 text-[13px] font-medium hover:bg-foreground hover:text-background disabled:opacity-50"
                >
                  {busy === "remove" ? "Removing" : "Remove gift"}
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

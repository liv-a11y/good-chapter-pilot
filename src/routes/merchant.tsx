import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getMerchantOverview, releaseMerchantClaim } from "@/lib/pilot-merchant.functions";

export const Route = createFileRoute("/merchant")({
  head: () => ({
    meta: [
      { title: "Merchant reconciliation | Good Chapter" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MerchantPage,
});

function MerchantPage() {
  const load = useServerFn(getMerchantOverview);
  const release = useServerFn(releaseMerchantClaim);
  const [key, setKey] = useState("");
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof load>> | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = async () => {
    setBusy("load");
    setError("");
    setNotice("");
    try {
      const result = await load({ data: { key } });
      setOverview(result);
      if (!result.ok)
        setError(
          result.reason === "not_configured"
            ? "Merchant access is not configured on the server."
            : "The merchant key is incorrect.",
        );
    } catch {
      setError("Merchant records could not be loaded. Try again.");
    } finally {
      setBusy("");
    }
  };

  const reopen = async (claimId: string) => {
    setBusy(claimId);
    setError("");
    setNotice("");
    try {
      const result = await release({
        data: {
          key,
          claim_id: claimId,
          reason: reasons[claimId] ?? "",
          confirmed: confirmed[claimId] === true,
        },
      });
      if (!result.ok) {
        setError(
          result.reason === "not_configured"
            ? "Merchant access is not configured on the server."
            : "The claim could not be reopened.",
        );
        return;
      }
      setNotice("Gift reopened. The prior claim remains in the reconciliation history.");
      setReasons((current) => ({ ...current, [claimId]: "" }));
      setConfirmed((current) => ({ ...current, [claimId]: false }));
      await refresh();
    } catch {
      setError("The claim could not be reconciled. Verify the Shopify checkout and try again.");
    } finally {
      setBusy("");
    }
  };

  return (
    <main className="mx-auto max-w-[900px] px-6 py-12">
      <p className="text-[14px] font-medium text-emphasis">Good Chapter operations</p>
      <h1 className="mt-3 font-display text-[clamp(36px,7vw,64px)] leading-none">
        Gift reconciliation.
      </h1>
      <p className="mt-5 max-w-[60ch] text-[18px] leading-relaxed text-foreground/75">
        Check the Shopify checkout or order before reopening a gift. A live checkout may still be
        paid after its chapter closes.
      </p>

      <form
        className="mt-8 flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void refresh();
        }}
      >
        <label className="min-w-[240px] flex-1 text-[14px] font-medium">
          Merchant access key
          <input
            type="password"
            autoComplete="off"
            required
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="mt-2 w-full rounded border-2 border-foreground bg-background px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={busy !== ""}
          className="rounded border-2 border-primary bg-primary px-5 py-2.5 text-[14px] font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy === "load" ? "Loading" : "View claims"}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-4 text-[15px] text-destructive">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="mt-4 text-[15px] text-primary">
          {notice}
        </p>
      ) : null}

      {overview?.ok ? (
        <>
          <section className="mt-10">
            <h2 className="font-display text-2xl">Active claims</h2>
            {overview.claims.length ? (
              <ul className="mt-4 space-y-4">
                {overview.claims.map((claim) => (
                  <li key={claim.id} className="rounded border-2 border-foreground bg-card p-5">
                    <p className="font-medium">
                      {claim.chapter} · {claim.gift}
                    </p>
                    <p className="mt-1 text-[14px] text-foreground/65">
                      {claim.state}
                      {claim.order_id ? ` · Order ${claim.order_id}` : ""} · Claim{" "}
                      <code>{claim.id}</code>
                    </p>
                    <label className="mt-4 block text-[14px] font-medium">
                      Reconciliation note
                      <textarea
                        maxLength={500}
                        required
                        value={reasons[claim.id] ?? ""}
                        onChange={(event) =>
                          setReasons((current) => ({ ...current, [claim.id]: event.target.value }))
                        }
                        className="mt-2 w-full rounded border-2 border-foreground bg-background px-3 py-2"
                      />
                    </label>
                    <label className="mt-3 flex items-start gap-2 text-[14px]">
                      <input
                        type="checkbox"
                        checked={confirmed[claim.id] ?? false}
                        onChange={(event) =>
                          setConfirmed((current) => ({
                            ...current,
                            [claim.id]: event.target.checked,
                          }))
                        }
                      />
                      <span>I verified in Shopify that this checkout or order is resolved.</span>
                    </label>
                    <button
                      type="button"
                      disabled={busy !== "" || !reasons[claim.id]?.trim() || !confirmed[claim.id]}
                      onClick={() => void reopen(claim.id)}
                      className="mt-4 rounded border-2 border-foreground px-4 py-2 text-[14px] font-medium hover:bg-foreground hover:text-background disabled:opacity-50"
                    >
                      {busy === claim.id ? "Reconciling" : "Reopen gift"}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[16px] text-foreground/65">No active claims.</p>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl">Payment exceptions</h2>
            {overview.conflicts.length ? (
              <ul className="mt-4 space-y-2">
                {overview.conflicts.map((conflict) => (
                  <li
                    key={`${conflict.order_id}:${conflict.claim_id}`}
                    className="rounded border border-foreground/25 px-4 py-3 text-[14px]"
                  >
                    Order {conflict.order_id} · Claim {conflict.claim_id} · Quantity{" "}
                    {conflict.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[16px] text-foreground/65">No payment exceptions recorded.</p>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}

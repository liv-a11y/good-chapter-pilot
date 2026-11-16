import { useState } from "react";

/** The one decision a guest makes: which name sits next to what they give. */
export function ClaimForm({
  saving,
  error,
  onClaim,
  onCancel,
}: {
  saving: boolean;
  error: string;
  onClaim: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  return (
    <div className="mt-4 border-t border-foreground/25 pt-4">
      <label className="block text-[13px] font-medium text-foreground/60" htmlFor="claim-name">
        Who it is from
      </label>
      {anonymous ? (
        <p className="mt-2 rounded border-2 border-foreground px-3 py-2 text-foreground/70">
          Someone who cares
        </p>
      ) : (
        <input
          id="claim-name"
          className="mt-2 w-full rounded border-2 border-foreground bg-background px-3 py-2"
          value={name}
          maxLength={60}
          placeholder="The Jones Family"
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <button
        type="button"
        className="mt-3 text-[13px] font-medium underline underline-offset-4"
        onClick={() => setAnonymous((v) => !v)}
      >
        {anonymous ? "Use a family name instead" : "Give it without my name"}
      </button>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={saving}
          onClick={() => onClaim(anonymous ? "" : name.trim())}
          className="flex flex-1 items-center justify-between rounded border-2 border-primary bg-primary px-4 py-2.5 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary disabled:opacity-60"
        >
          <span>{saving ? "Saving" : "Take it"}</span>
          <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          className="px-2 py-2 text-[13px] font-medium text-foreground/60"
          onClick={onCancel}
        >
          Never mind
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[15px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

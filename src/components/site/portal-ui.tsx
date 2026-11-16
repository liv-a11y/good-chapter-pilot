import { useEffect, useRef, useState } from "react";

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Counts up to the value whenever it changes. Numbers only, no fades. */
export function Ticker({
  value,
  format = money,
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 500);
      setShown(start + (value - start) * p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="tabular-nums">{format(shown)}</span>;
}

export function Meter({
  parts,
  label,
}: {
  parts: { pct: number; className: string }[];
  label: string;
}) {
  return (
    <div
      className="flex h-3 overflow-hidden rounded-sm border-2 border-foreground"
      role="img"
      aria-label={label}
    >
      {parts.map((p, i) => (
        <div
          key={i}
          className={p.className}
          style={{ width: `${Math.max(0, Math.min(100, p.pct))}%` }}
        />
      ))}
    </div>
  );
}

export function Kpi({
  k,
  children,
  sub,
  tone,
}: {
  k: string;
  children: React.ReactNode;
  sub?: string;
  tone?: "highlight" | "ink";
}) {
  const toneCls =
    tone === "highlight" ? "bg-highlight" : tone === "ink" ? "bg-foreground text-background" : "";
  return (
    <div className={`rounded-sm border-2 border-foreground p-4 ${toneCls}`}>
      <p className="font-medium text-[13px]">{k}</p>
      <p className="mt-2 font-medium text-3xl">{children}</p>
      {sub && <p className="mt-1 font-medium text-[13px] opacity-80">{sub}</p>}
    </div>
  );
}

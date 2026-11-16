import { ArrowRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/waitlist.functions";

const chapters = [
  "First home",
  "Fresh start",
  "New city",
  "Career pivot",
  "Recovery",
  "Off-script",
];
const inquiryTypes = [
  "Consumer",
  "Founding partner: Employer",
  "Founding partner: Real estate",
  "Founding partner: Brand",
  "Investor",
  "General inquiry",
];
const schema = z.object({
  email: z.string().trim().email("That email doesn’t look quite right.").max(254),
  chapter: z.string().max(80).optional(),
  comments: z.string().trim().max(1000, "Keep it under 1,000 characters.").optional(),
});
const partnerConfirm =
  "Got it. We'll write to set up a real conversation. Nothing is agreed until we both sign something.";
const segments: Record<string, { helper: string; disclosure?: string; confirm: string }> = {
  Consumer: {
    helper: "Optional. Leave out other people's names and anything about health.",
    confirm:
      "Got it. We're building quietly. No newsletters or noise. We'll write when the doors open.",
  },
  "Founding partner: Employer": {
    helper:
      "Tell us about your organization and the benefit or program you have in mind. Please don't include employee names or personal details.",
    disclosure:
      "Requesting an invitation is not a commitment from either side, and it does not mean Good Chapter endorses your organization or you endorse ours.",
    confirm: partnerConfirm,
  },
  "Founding partner: Real estate": {
    helper:
      "Tell us about your brokerage or practice and the clients you serve. Please don't include client names or details.",
    disclosure:
      "Requesting an invitation does not create a referral arrangement, and no compensation is offered or promised for referrals. Any future arrangement will be in writing and will follow applicable real estate laws.",
    confirm: partnerConfirm,
  },
  "Founding partner: Brand": {
    helper:
      "Tell us about your brand and the kind of gifts or experiences you offer. Please don't include personal details about customers.",
    disclosure:
      "Requesting an invitation does not create a partnership, commission arrangement, or right to appear on Good Chapter. Any future affiliate or partner terms will be in writing, and sponsored or commissioned items will be clearly disclosed to guests.",
    confirm: partnerConfirm,
  },
  Investor: {
    helper: "Tell us a little about you and what interests you about Good Chapter.",
    disclosure:
      "Choosing Investor means you would like to hear from us. This is not an offer to sell securities or a solicitation of an offer to buy them. Any offering would be made only by separate documents to eligible investors.",
    confirm:
      "Thank you. If there is a fit, we'll reach out directly. Nothing on this site is an offer of securities.",
  },
  "General inquiry": {
    helper: "Ask or share anything. Leave out other people's names and anything about health.",
    confirm: "Got it. We read every note. We'll reply if you asked.",
  },
};
type Status = "idle" | "loading" | "done" | "error";

export function WaitlistForm({
  pilot = false,
  defaultInquiry,
}: {
  pilot?: boolean;
  defaultInquiry?: string;
}) {
  const [email, setEmail] = useState("");
  const [chapter, setChapter] = useState<string | undefined>(defaultInquiry);
  const [partner, setPartner] = useState({
    contactName: "",
    organization: "",
    roleTitle: "",
    teamSize: "",
  });
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pilot && !chapter) {
      setError("Choose how you would like to join us.");
      setStatus("error");
      return;
    }
    const parsed = schema.safeParse({ email, chapter, comments: comments || undefined });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const isPartner =
        !!parsed.data.chapter?.startsWith("Founding partner") || parsed.data.chapter === "Investor";
      const extra = isPartner
        ? Object.fromEntries(
            Object.entries(partner).map(([k, v]) => [k, v.trim().slice(0, 160) || undefined]),
          )
        : {};
      await joinWaitlist({
        data: {
          email: parsed.data.email,
          chapter: parsed.data.chapter,
          comments: parsed.data.comments || undefined,
          ...extra,
        },
      });
    } catch {
      setError("Something went sideways. Try again in a moment.");
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  const segment = segments[pilot && chapter ? chapter : "Consumer"] ?? segments["Consumer"]!;
  if (status === "done" && pilot) {
    return (
      <div className="w-full border-2 border-foreground bg-card" role="status">
        <div className="border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
          <span className="eyebrow flex items-center gap-2">
            <Check className="size-4" /> Received
          </span>
        </div>
        <div className="p-6">
          <p className="font-display text-[26px] leading-[1.15] sm:text-[32px]">
            {segment.confirm}
          </p>
        </div>
      </div>
    );
  }
  if (status === "done") {
    return (
      <div className="w-full border-2 border-foreground bg-card" role="status">
        <div className="border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
          <span className="eyebrow flex items-center gap-2">
            <Check className="size-4" /> You’re on the list
          </span>
        </div>
        <div className="p-6">
          <p className="font-display text-[30px] leading-[1.08] sm:text-[38px]">
            Got it. We’ll write when the doors open.
          </p>
          <p className="mt-4 text-[17px] leading-[1.5] text-muted-foreground">
            No newsletters or noise.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full border-2 border-foreground bg-card">
      <div className="border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
        <span className="eyebrow">{pilot ? "Request an invitation" : "Get on the list"}</span>
      </div>
      <div className="p-5 sm:p-6">
        {pilot ? (
          <div>
            <label htmlFor="waitlist-interest" className="eyebrow block text-emphasis">
              I'm here as
            </label>
            <select
              id="waitlist-interest"
              required
              value={chapter ?? ""}
              disabled={status === "loading"}
              onChange={(event) => {
                setChapter(event.target.value || undefined);
                setStatus("idle");
              }}
              className="mt-3 h-14 w-full rounded-[4px] border-2 border-foreground bg-background px-4 font-sans text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-describedby={status === "error" ? "waitlist-email-error" : undefined}
            >
              <option value="" disabled>
                Choose your way in
              </option>
              {inquiryTypes.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <fieldset>
            <legend className="eyebrow text-muted-foreground">Which chapter? Optional.</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {chapters.map((choice) => {
                const active = chapter === choice;
                return (
                  <Button
                    key={choice}
                    type="button"
                    variant={active ? "ink" : "outline"}
                    size="sm"
                    aria-pressed={active}
                    onClick={() => setChapter(active ? undefined : choice)}
                    className={active ? "bg-highlight text-highlight-foreground" : undefined}
                  >
                    {choice}
                  </Button>
                );
              })}
            </div>
          </fieldset>
        )}
        {pilot && (chapter?.startsWith("Founding partner") || chapter === "Investor") && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {(
              [
                ["contactName", "Your name", "name"],
                ["organization", "Organization", "organization"],
                ["roleTitle", "Your role", "organization-title"],
                [
                  "teamSize",
                  chapter === "Founding partner: Employer" ? "Number of employees" : "Team size",
                  "off",
                ],
              ] as const
            ).map(([key, text, ac]) => (
              <div key={key}>
                <label htmlFor={`partner-${key}`} className="eyebrow block text-muted-foreground">
                  {text}. Optional.
                </label>
                <input
                  id={`partner-${key}`}
                  autoComplete={ac}
                  maxLength={160}
                  value={partner[key]}
                  disabled={status === "loading"}
                  onChange={(e) => setPartner((p) => ({ ...p, [key]: e.target.value }))}
                  className="mt-3 h-14 w-full rounded-[4px] border-2 border-foreground bg-background px-4 font-sans text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            ))}
          </div>
        )}
        {pilot && (
          <div className="mt-6">
            <label htmlFor="waitlist-comments" className="eyebrow block text-muted-foreground">
              Comments. Optional.
            </label>
            <textarea
              id="waitlist-comments"
              rows={4}
              maxLength={1000}
              value={comments}
              disabled={status === "loading"}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Tell us what brought you here."
              className="mt-3 w-full rounded-[4px] border-2 border-foreground bg-background px-4 py-3 font-sans text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <p className="mt-2 text-[14px] text-muted-foreground">{segment.helper}</p>
            {segment.disclosure && (
              <p className="mt-3 border-l-2 border-foreground pl-3 text-[14px] leading-[1.5]">
                {segment.disclosure}
              </p>
            )}
          </div>
        )}
        <label htmlFor="waitlist-email" className="eyebrow mt-6 block text-muted-foreground">
          Your email
        </label>
        <div className={`mt-3 flex flex-col gap-3 ${pilot ? "" : "sm:flex-row"}`}>
          <input
            id="waitlist-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            disabled={status === "loading"}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@example.com"
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "waitlist-email-error" : undefined}
            className={`h-14 min-w-0 shrink-0 ${pilot ? "w-full" : "sm:flex-1"} rounded-sm border-2 border-foreground bg-background px-4 text-[18px] outline-none focus-visible:ring-2 focus-visible:ring-primary`}
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="h-14 px-7 text-[17px]"
          >
            {status === "loading" ? (
              "Sending…"
            ) : (
              <>
                {pilot ? "Request an invite" : "Get on the list"} <ArrowRight className="size-5" />
              </>
            )}
          </Button>
        </div>
        {pilot && (
          <p className="mt-4 text-[13px] leading-[1.5] text-muted-foreground">
            By requesting an invitation, you agree to receive emails from Good Chapter, Co. about
            the pilot and you accept our{" "}
            <Link to="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            . You can unsubscribe any time.
          </p>
        )}
        {status === "error" && (
          <p id="waitlist-email-error" className="mt-3 text-[15px] text-emphasis">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPersonChapter } from "@/lib/person-chapter.functions";
import { ChapterItem } from "@/components/person/chapter-item";
import { rotateGuestLink, sendGuestInvitations } from "@/lib/person-chapter.functions";

export const Route = createFileRoute("/chapter/$token")({
  loader: async ({ params }) => {
    const chapter = await getPersonChapter({ data: { token: params.token } });
    if (!chapter) throw notFound();
    return chapter;
  },
  head: () => ({
    meta: [
      { title: "Your chapter | Good Chapter, Co." },
      {
        name: "description",
        content: "Eight things chosen for you, each with the reason written next to it.",
      },
      { property: "og:title", content: "Your chapter | Good Chapter, Co." },
      {
        property: "og:description",
        content: "Eight things chosen for you, each with the reason written next to it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  pendingComponent: () => (
    <main className="mx-auto max-w-[900px] px-6 py-24 text-[19px] text-foreground/70">
      Opening your chapter.
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">This link does not open a chapter.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">
        Ask the friend who started it for a fresh one.
      </p>
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">Your chapter did not open.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">Refresh the page and try once more.</p>
    </main>
  ),
  component: PersonChapter,
});

function PersonChapter() {
  const c = Route.useLoaderData();
  const { token } = Route.useParams();
  const router = useRouter();
  const rotate = useServerFn(rotateGuestLink);
  const sendInvites = useServerFn(sendGuestInvitations);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [inviteStatus, setInviteStatus] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [guestBusy, setGuestBusy] = useState("");
  const [guestError, setGuestError] = useState("");
  const [replacement, setReplacement] = useState<{ guestId: string; href: string } | null>(null);

  const send = async () => {
    const guests = c.guest_links
      .map((guest) => ({ id: guest.id, email: (emails[guest.id] ?? "").trim() }))
      .filter((guest) => guest.email);
    if (!guests.length) {
      setInviteStatus("Enter at least one guest email address.");
      return;
    }
    setInviteBusy(true);
    setInviteStatus("");
    try {
      const result = await sendInvites({ data: { token, guests } });
      if (result.ok) {
        setInviteStatus(
          `${result.count} invitation${result.count === 1 ? "" : "s"} submitted for delivery.`,
        );
        setEmails({});
      } else if (result.reason === "not_configured") {
        setInviteStatus("Email invitations are not configured. You can still copy links below.");
      } else if (result.reason === "rejected") {
        setInviteStatus("The email provider rejected the send. Check the addresses and try again.");
      } else if (result.reason === "duplicate_email") {
        setInviteStatus("Use a different email address for each guest.");
      } else if (result.reason === "already_sent_or_revoked") {
        setInviteStatus(
          "One or more links changed or already had an email attempt. Refresh and check the guest list.",
        );
      } else {
        setInviteStatus("The chapter or guest list changed. Refresh and try again.");
      }
    } catch {
      setInviteStatus(
        "Delivery could not be confirmed. Check with your guests before trying again.",
      );
    } finally {
      setInviteBusy(false);
    }
  };

  const changeGuestLink = async (guestId: string, action: "replace" | "revoke") => {
    setGuestBusy(guestId);
    setGuestError("");
    setReplacement(null);
    try {
      const result = await rotate({ data: { token, guestId, action } });
      if (!result.ok) {
        setGuestError("That link could not be changed. Refresh the page and try again.");
        return;
      }
      if (action === "replace" && result.token) {
        setReplacement({ guestId, href: `${window.location.origin}/guest/${result.token}` });
      }
      await router.invalidate();
    } catch {
      setGuestError("That link could not be changed. Refresh the page and try again.");
    } finally {
      setGuestBusy("");
    }
  };

  const copy = async (href: string) => {
    try {
      await navigator.clipboard.writeText(href);
      setInviteStatus("Private link copied.");
    } catch {
      setInviteStatus("Copy was unavailable. Select and copy the link text.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-[900px] px-6 pb-24 pt-12">
      <p className="text-[14px] font-medium text-accent">{c.chapter_type}</p>
      <h1 className="mt-4 font-display text-[clamp(40px,8vw,84px)] leading-[0.95]">
        This is yours.
      </h1>
      <p className="mt-6 max-w-[46ch] text-[20px] leading-[1.45] text-foreground/85">
        Eight things, chosen one at a time, each with the reason it was chosen for you. Nothing
        reaches your guests until you answer.
      </p>
      {c.await_answer ? (
        <div className="mt-8 max-w-[560px] rounded border-2 border-foreground bg-card p-6">
          <p className="text-[14px] font-medium text-foreground/55">Your answer first</p>
          <p className="mt-2 text-[20px] leading-[1.4]">
            Decline anything that does not fit. Say yes, and the rest opens to the people you named.
            Send it back and nothing goes out at all.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              to="/decide/$token/$answer"
              params={{ token: c.accept_token, answer: "accept" }}
              className="flex items-center justify-between gap-6 rounded border-2 border-primary bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary"
            >
              <span>Accept it</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/decide/$token/$answer"
              params={{ token: c.decline_token, answer: "decline" }}
              className="rounded border-2 border-foreground px-5 py-3 text-center text-[14px] font-medium hover:bg-foreground hover:text-background"
            >
              Send it back
            </Link>
          </div>
        </div>
      ) : null}
      {c.person_decision === "accepted" ? (
        <p className="mt-8 text-[14px] font-medium text-foreground/60">
          You said yes{c.decided_on ? ` on ${c.decided_on}` : ""}. The list is open to the people
          you named.
        </p>
      ) : null}
      {c.person_decision === "declined" ? (
        <p className="mt-8 max-w-[44ch] border-l-2 border-foreground pl-4 text-[20px] leading-[1.4]">
          You sent this back{c.decided_on ? ` on ${c.decided_on}` : ""}. Nothing went to the guests.
        </p>
      ) : null}
      {c.story_line ? (
        <p className="mt-8 max-w-[44ch] border-l-2 border-accent pl-4 font-display text-[26px] leading-[1.15]">
          {c.story_line}
        </p>
      ) : null}
      {c.items.length === 0 ? (
        <p className="mt-12 text-[19px] text-foreground/70">
          Your eight are still being chosen. Come back to this link soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {c.items.map((item, i) => (
            <ChapterItem
              key={item.id}
              token={token}
              item={item}
              index={i}
              open={c.answers_open}
              awaiting={c.await_answer}
              accepted={c.person_decision === "accepted"}
            />
          ))}
        </div>
      )}
      {c.person_decision === "accepted" ? (
        <section className="mt-12 border-t-2 border-foreground pt-8">
          <h2 className="font-display text-[32px]">Share your chapter.</h2>
          <p className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-foreground/75">
            These are individual private links. Email addresses are used only to send invitations
            and are not saved.
          </p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            {c.guest_links
              .filter((guest) => !guest.revoked && !guest.invited)
              .map((guest) => (
                <label key={guest.id} className="block text-[14px] font-medium">
                  {guest.label}’s email
                  <input
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    value={emails[guest.id] ?? ""}
                    onChange={(event) =>
                      setEmails((current) => ({ ...current, [guest.id]: event.target.value }))
                    }
                    className="mt-2 w-full rounded border-2 border-foreground bg-background px-3 py-2"
                  />
                </label>
              ))}
            {c.guest_links.some((guest) => !guest.revoked && !guest.invited) ? (
              <button
                type="submit"
                disabled={inviteBusy}
                className="rounded border-2 border-primary bg-primary px-5 py-2.5 text-[14px] font-medium text-primary-foreground disabled:opacity-60"
              >
                {inviteBusy ? "Sending" : "Send invitations"}
              </button>
            ) : (
              <p className="text-[14px] text-foreground/60">
                No active guests are waiting for an email invitation.
              </p>
            )}
          </form>
          {inviteStatus ? (
            <p role="status" className="mt-3 text-[14px] text-foreground/70">
              {inviteStatus}
            </p>
          ) : null}
          <h3 className="mt-8 font-display text-[24px]">Share links manually</h3>
          <ul className="mt-3 space-y-4">
            {c.guest_links.map((guest) => {
              const href = guest.token
                ? `${typeof window === "undefined" ? "" : window.location.origin}/guest/${guest.token}`
                : "";
              return (
                <li key={guest.id} className="rounded border-2 border-foreground/25 p-4">
                  <p className="text-[14px] font-medium">{guest.label}</p>
                  {guest.invited ? (
                    <p className="mt-1 text-[13px] text-foreground/60">
                      Email invitation submitted.
                    </p>
                  ) : null}
                  {guest.revoked ? (
                    <p className="mt-2 text-[13px] text-foreground/60">Access revoked.</p>
                  ) : replacement?.guestId === guest.id ? (
                    <p className="mt-2 break-all text-[13px]">{replacement.href}</p>
                  ) : (
                    <p className="mt-2 break-all text-[13px]">{href}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!guest.revoked ? (
                      <button
                        type="button"
                        onClick={() =>
                          void copy(replacement?.guestId === guest.id ? replacement.href : href)
                        }
                        className="rounded border-2 border-primary px-3 py-1.5 text-[13px] font-medium"
                      >
                        Copy link
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={guestBusy !== ""}
                      onClick={() => void changeGuestLink(guest.id, "replace")}
                      className="rounded border-2 border-foreground px-3 py-1.5 text-[13px] font-medium disabled:opacity-50"
                    >
                      {guestBusy === guest.id
                        ? "Updating"
                        : guest.revoked
                          ? "Issue new link"
                          : "Replace link"}
                    </button>
                    {!guest.revoked ? (
                      <button
                        type="button"
                        disabled={guestBusy !== ""}
                        onClick={() => void changeGuestLink(guest.id, "revoke")}
                        className="rounded border-2 border-foreground px-3 py-1.5 text-[13px] font-medium disabled:opacity-50"
                      >
                        Revoke access
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
          {guestError ? (
            <p role="alert" className="mt-3 text-[14px] text-destructive">
              {guestError}
            </p>
          ) : null}
        </section>
      ) : null}
      <p className="mt-12 text-[14px] font-medium text-foreground/50">
        Keep this link to yourself. It is the only copy.
      </p>
    </main>
  );
}

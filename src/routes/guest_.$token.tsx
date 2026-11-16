import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getGuestChapter, claimItem, createGuestCheckout } from "@/lib/guest-chapter.functions";
import { GuestItem } from "@/components/guest/guest-item";

export const Route = createFileRoute("/guest_/$token")({
  loader: async ({ params }) => {
    const chapter = await getGuestChapter({ data: { token: params.token } });
    if (!chapter) throw notFound();
    return chapter;
  },
  head: () => ({
    meta: [
      { title: "A chapter | Good Chapter, Co." },
      {
        name: "description",
        content:
          "Eight things they read through and said yes to. Take the one you would most like to give.",
      },
      { property: "og:title", content: "A chapter | Good Chapter, Co." },
      { property: "og:description", content: "Eight things they read through and said yes to." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">This link does not open a chapter.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">
        Ask the friend who sent it for a fresh one.
      </p>
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">That did not load.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">Open your link again in a moment.</p>
    </main>
  ),
  component: GuestChapter,
});

function GuestChapter() {
  const chapter = Route.useLoaderData();
  const { token } = Route.useParams();
  const claim = useServerFn(claimItem);
  const checkout = useServerFn(createGuestCheckout);
  const first = chapter.title.split(/\s+/)[0] || "their";
  const onClaim = (item_id: string, display_name: string) =>
    claim({ data: { token, item_id, display_name } });
  const onCheckout = (item_id: string) => checkout({ data: { token, item_id } });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-4 px-6 py-5">
          <span className="font-display text-[22px]">Good Chapter, Co.</span>
          <span className="text-[14px] font-medium opacity-80">
            Started by {chapter.starter_name}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-[900px] px-6 pb-24 pt-12">
        <p className="text-[14px] font-medium text-destructive">{chapter.chapter_type}</p>
        <h1 className="mt-4 font-display text-[clamp(40px,8vw,84px)] leading-none">
          {first}’s chapter.
        </h1>
        {chapter.open ? (
          <p className="mt-6 max-w-[46ch] text-[20px] leading-[1.45] text-foreground/85">
            Eight things {first} read through and said yes to. Take the one you would most like to
            give. Nothing here was picked from a catalogue, and nothing is a request for money.
          </p>
        ) : (
          <p className="mt-6 max-w-[44ch] border-l-2 border-foreground pl-4 text-[20px] leading-[1.45]">
            {chapter.state === "closed"
              ? "This chapter is closed. Nothing more is needed from you."
              : chapter.accepted
                ? "This chapter has not gone out yet. Your link will work once it does."
                : "The person has not said yes to this chapter yet, so nothing is open. Your link will work once they do."}
          </p>
        )}
        {chapter.items.length ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {chapter.items.map((item, i) => (
              <GuestItem
                key={item.id}
                item={item}
                index={i}
                open={chapter.open}
                onClaim={onClaim}
                onCheckout={onCheckout}
              />
            ))}
          </div>
        ) : (
          <p className="mt-12 border-t border-foreground/25 pt-6 text-[20px] text-foreground/80">
            There is nothing to give from this chapter yet.
          </p>
        )}
        <p className="mt-12 text-[14px] font-medium text-foreground/55">
          A friend started this. {first} approved every item here. Nobody asked.
        </p>
      </main>
    </div>
  );
}

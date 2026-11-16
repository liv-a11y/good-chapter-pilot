import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import emptyRoom from "@/assets/07-moving-out.png.asset.json";

const title = "Real estate agents. Good Chapter";
const description =
  "Nobody wants another branded cutting board. Anchor a first real object for your buyer, and let their friends fill the rest of the house.";

export const Route = createFileRoute("/partners/real-estate")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RealEstatePage,
});

const steps = [
  [
    "01",
    "You anchor it.",
    "At closing, you start a chapter for your buyer and fund the first real object.",
  ],
  ["02", "They make it theirs.", "Your buyer privately keeps what fits and swaps what does not."],
  [
    "03",
    "Their people show up.",
    "Your buyer shares the invitation with whoever they choose. Friends fill the rest of the house.",
  ],
];

function RealEstatePage() {
  return (
    <SiteShell>
      <section className="site-container grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="eyebrow text-emphasis">Real estate agents</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Nobody wants another branded cutting board.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Your buyer just spent their savings on a down payment. They are sitting in an empty
            house with boxes and no lamps. A pen with your number on it is not the moment.
          </p>
          <p className="mt-6 max-w-xl font-display text-2xl leading-snug">
            You anchor the first real object. Their friends fill the rest of the house.
          </p>
        </div>
        <img
          src={emptyRoom.url}
          alt="Two rooms side by side. One is furnished with a sofa, lamp, and plant. The other is empty with bare walls and an open door, and a person walks in carrying a yellow bag."
          width={1536}
          height={1024}
          className="aspect-[3/2] w-full rounded-[4px] border-2 border-foreground object-cover"
        />
      </section>
      <section className="border-y-2 border-foreground">
        <div className="site-container py-14">
          <p className="eyebrow text-emphasis">How it works</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            Closing day is a big chapter. The gift should live in the room, not a junk drawer.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map(([n, t, c]) => (
              <div key={n} className="border-t-2 border-foreground pt-5">
                <span className="font-display text-4xl text-primary">{n}</span>
                <h3 className="mt-5 font-display text-2xl">{t}</h3>
                <p className="mt-3 text-[17px] leading-[1.5] text-muted-foreground">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="site-container py-14">
        <p className="max-w-xl text-lg leading-relaxed">
          You get remembered for taste, not a logo. Your buyer gets a home that feels like theirs.
        </p>
        <Link
          to="/first-place"
          className="mr-3 mt-6 inline-flex rounded-[4px] border-2 border-foreground px-5 py-3 font-medium text-[14px] hover:bg-foreground hover:text-background"
        >
          See a sample chapter
        </Link>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-[4px] border-2 border-primary bg-primary px-5 py-3 font-medium text-[14px] text-primary-foreground hover:bg-foreground hover:text-background"
        >
          Request an invite
        </Link>
      </section>
    </SiteShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ToasterLine } from "@/components/site/illustration";
import { WaitlistForm } from "@/components/site/waitlist-form";
import throwPhoto from "@/assets/g-08-check-wool-throw.webp.asset.json";
import toasterPhoto from "@/assets/checked-toaster.png.asset.json";
import espressoPhoto from "@/assets/g-01-espresso-machine.webp.asset.json";
import mugPhoto from "@/assets/speckled-mug.png.asset.json";

const title = "Good Chapter, Co. Homepage study";
const description =
  "A homepage layout study for Good Chapter, Co. Quiet index, real objects, private approval.";

export const Route = createFileRoute("/mockup")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Mockup,
});

function Marker({
  n,
  label,
  right,
  dark,
}: {
  n: number;
  label: string;
  right?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[3rem_1fr_auto] items-baseline border-b pb-3 text-[13px] font-medium ${dark ? "border-background/25" : "border-foreground/15"}`}
    >
      <span>({n})</span>
      <span>{label}</span>
      <span className="opacity-60">{right ?? "Good Chapter, Co."}</span>
    </div>
  );
}

const chapters = [
  ["First place", "Keys, a bare kitchen, one chair."],
  ["Fresh start", "A new lease on the same old life."],
  ["New city", "Nobody to call for a drill."],
  ["Coming home", "Back after a long hard stretch."],
  ["Career leap", "The job that changes the week."],
];

const objects = [
  {
    photo: toasterPhoto.url,
    name: "Checked toaster",
    tier: "Anchor piece",
    note: "Painted steel. Two wide slots.",
    from: "Independent maker",
    alt: "A two slot toaster painted in red and cream checks.",
  },
  {
    photo: throwPhoto.url,
    name: "Checked wool throw",
    tier: "Comfort",
    note: "Brushed wool, for the first cold night.",
    from: "Retailer option",
    alt: "A checked wool throw folded over a chair.",
  },
  {
    photo: espressoPhoto.url,
    name: "Espresso machine",
    tier: "Shared gift",
    note: "A few friends go in together.",
    from: "Retailer option",
    alt: "A marble finish espresso machine on a kitchen counter.",
  },
];

const steps = [
  ["A friend starts it.", "They notice the chapter nobody threw a party for."],
  ["The person approves it.", "In private. Keep what fits, swap what does not."],
  ["Their people show up.", "One real object each. Nobody doubles up."],
];

function ApprovalSlip() {
  const rows = [
    ["Checked toaster", "Keep"],
    ["Checked wool throw", "Keep"],
    ["Scented candle", "Swap"],
  ];
  return (
    <div className="rounded-[4px] bg-secondary p-6 md:p-8">
      <div className="flex items-baseline justify-between text-[13px] font-medium">
        <span>Maya's chapter</span>
        <span className="opacity-60">Only Maya sees this</span>
      </div>
      <p className="mt-6 font-display text-[26px] leading-[1.15]">
        Keep what fits. Swap what does not.
      </p>
      <ul className="mt-6">
        {rows.map(([item, state]) => (
          <li
            key={item}
            className="flex items-center justify-between border-t border-foreground/15 py-3 text-[15px]"
          >
            <span>{item}</span>
            <span
              className={`rounded-[4px] px-2 py-0.5 text-[13px] font-medium ${state === "Keep" ? "bg-highlight text-foreground" : "border border-foreground/30"}`}
            >
              {state}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 inline-flex rounded-[4px] bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground">
        Approve my chapter
      </div>
    </div>
  );
}

function Mockup() {
  return (
    <SiteShell pilot>
      <section className="site-container pt-12 md:pt-20">
        <Marker n={1} label="The origin" right="1924 to now" />
        <div className="mt-12 grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="text-[14px] font-medium text-emphasis">1924. Rewritten for today.</p>
            <ToasterLine
              as="h1"
              className="mt-5 text-[40px] leading-[1.06] sm:text-[60px] lg:text-[76px]"
            />
            <p className="mt-8 max-w-[34rem] text-[19px] leading-[1.6] text-muted-foreground sm:text-[21px]">
              In 1924, department stores invented the wedding registry. A century later, it is still
              the only milestone that comes with a ritual.{" "}
              <span className="text-foreground">
                Good Chapter is for every chapter weddings missed.
              </span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#invite"
                className="inline-flex rounded-[4px] bg-primary px-6 py-4 text-[14px] font-medium text-primary-foreground hover:bg-foreground hover:text-background"
              >
                Request an invitation
              </a>
              <Link
                to="/first-place"
                className="text-[14px] font-medium underline underline-offset-[6px] hover:text-emphasis"
              >
                See Maya's chapter
              </Link>
            </div>
          </div>
          <figure>
            <img
              src={mugPhoto.url}
              alt="A speckled ceramic mug with iced matcha resting on a stack of books."
              className="aspect-[4/5] w-full rounded-[4px] object-cover"
            />
            <figcaption className="mt-3 flex justify-between text-[13px] font-medium">
              <span>Speckled mug</span>
              <span className="opacity-60">Independent maker</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="site-container py-24 md:py-32">
        <Marker n={2} label="The ritual" right="Three steps" />
        <div className="mt-10 grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <ol>
            {steps.map(([t, c], i) => (
              <li
                key={t}
                className="grid grid-cols-[3rem_1fr] border-b border-foreground/15 py-7 first:pt-0"
              >
                <span className="text-[13px] font-medium opacity-60">0{i + 1}</span>
                <div>
                  <p className="font-display text-[28px] leading-[1.15]">{t}</p>
                  <p className="mt-2 text-[16px] leading-[1.6] text-muted-foreground">{c}</p>
                </div>
              </li>
            ))}
          </ol>
          <ApprovalSlip />
        </div>
      </section>

      <section className="site-container pb-24 md:pb-32">
        <Marker n={3} label="The objects" right={`Sample (${objects.length})`} />
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {objects.map((o) => (
            <figure key={o.name}>
              <div className="rounded-[4px] bg-secondary p-4">
                <img
                  src={o.photo}
                  alt={o.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-[2px] object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-[22px]">{o.name}</span>
                  <span className="text-[13px] font-medium text-emphasis">{o.tier}</span>
                </div>
                <p className="mt-1 text-[15px] text-muted-foreground">{o.note}</p>
                <p className="mt-3 border-t border-foreground/15 pt-3 text-[13px] font-medium opacity-60">
                  Available from: {o.from}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-2 border-b border-foreground/15 pb-3 text-[13px] font-medium">
            <span>Chapters</span>
            <span className="opacity-60">({chapters.length})</span>
          </div>
          {chapters.map(([c, n]) => (
            <div
              key={c}
              className="grid grid-cols-2 border-b border-foreground/10 py-4 text-[15px]"
            >
              <span className="font-display text-[19px]">{c}</span>
              <span className="text-muted-foreground">{n}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="invite" className="bg-foreground text-background">
        <div className="site-container py-24 md:py-32">
          <Marker n={4} label="The pact" dark />
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-16">
            <div>
              <p className="font-display text-[32px] leading-[1.15] sm:text-[44px]">
                No public list. No totals. Nobody sees who gave what. The person never has to ask.
              </p>
              <p className="mt-8 max-w-[30rem] text-[16px] leading-[1.6] opacity-75">
                Gifts come directly from independent makers, trusted retailers, and friends of Good
                Chapter. No platform fees. Never marked up above retail.
              </p>
            </div>
            <div className="text-foreground">
              <WaitlistForm pilot />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

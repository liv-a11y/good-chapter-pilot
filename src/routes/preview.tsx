import { Unlearning } from "@/components/site/unlearning";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import toasterCouple from "@/assets/06-toaster-and-couple.png.asset.json";
import familyDoor from "@/assets/03-family-through-door.png.asset.json";
import { Illustration, ToasterIllustration, ToasterLine } from "@/components/site/illustration";

import { sampleProducts } from "@/lib/sample-products";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Good Chapter .  Full site preview" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "The registry served one old life script. Good Chapter helps friends show up for first homes, fresh starts, recovery, and everything else.",
      },
      {
        property: "og:title",
        content: "Good Chapter .  The anti-registry for everything else she does",
      },
      {
        property: "og:description",
        content:
          "The registry served one old life script. Good Chapter helps friends show up for first homes, fresh starts, recovery, and everything else.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const steps = [
  {
    n: "01",
    title: "A friend starts.",
    copy: "One friend starts the chapter so the honoree never has to ask.",
  },
  {
    n: "02",
    title: "The person decides.",
    copy: "Maya keeps, cuts, or adds items in complete privacy. The friend never sees edits.",
  },
  {
    n: "03",
    title: "Guests give.",
    copy: "Friends and family claim ideas to coordinate. No awkward group chats, no checkout, no invoice.",
  },
];

const gifts = sampleProducts;

const assurances = [
  "You approve every item and every guest.",
  "Your friend never sees your edits.",
  "No cash, ever.",
];

const chapters = [
  ["First Place", "Buying a home on your own, with people ready to help make it yours."],
  ["Moving In", "A new set of keys, a new neighborhood, and a home still taking shape."],
  ["Starting Over", "Rebuilding a space and a rhythm after life changes direction."],
  ["Fresh Start", "For the reset that deserves more than a quiet thumbs-up."],
  ["Coming Out", "Living as yourself, with your people showing up to mark it."],
  ["Adoption & Foster", "Welcoming someone home with care chosen for the life ahead."],
  ["Coming Home", "A thoughtful landing after hospital, treatment, service, or time away."],
  ["New City", "A soft arrival when familiar people are suddenly far away."],
  ["Career Change", "The brave leap into new work, study, or an independent path."],
  ["A Big, Lonely Change", "For the lifestyle change that is enormous and mostly invisible."],
  ["Recovery", "Practical comfort while healing takes the time it takes."],
  ["Off-Script", "For the life moment that never came with a registry, but matters anyway."],
];

function HomePage() {
  return (
    <SiteShell>
      <section className="site-section">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-7">
            <p className="eyebrow text-emphasis">A registry for the rest of it</p>
            <h1 className="site-h1 max-w-[13ch]">
              A friend starts it. The person approves it.{" "}
              <span className="bg-emphasis px-2 text-emphasis-foreground">Nobody asks.</span>
            </h1>
            <p className="site-body max-w-[38rem] text-muted-foreground">
              Friend-started. Person-approved. For first homes, fresh starts, messy new beginnings,
              recovery, new cities: every chapter weddings never covered.
            </p>
            <div className="mt-1 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/start">
                  Start one for a friend <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#how">How it works</a>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[460px]">
            <ToasterIllustration eager className="mb-5" />
            <div className="rounded-[4px] border-2 border-foreground bg-foreground px-5 py-5 text-background">
              <span className="eyebrow text-background/70">Chapter 01</span>
              <p className="mt-2 font-display text-[26px] leading-[1.1]">A place of your own.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y-2 border-foreground" aria-hidden="true">
        <div className="flex items-center justify-between gap-6 overflow-hidden px-5 py-4 font-medium text-[14px] text-muted-foreground md:px-8">
          <span>The first home</span>
          <span>The fresh start</span>
          <span className="hidden sm:inline">The new city</span>
          <span className="hidden md:inline">The big, lonely change</span>
          <span className="hidden sm:inline">The recovery</span>
          <span className="hidden lg:inline">The coming out</span>
          <span className="hidden md:inline">The pivot</span>
          <span>The best of your life</span>
        </div>
      </div>

      <section className="border-y-2 border-foreground" aria-labelledby="registry-story">
        <div className="site-container site-section">
          <div className="grid gap-12 lg:grid-cols-[minmax(300px,.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div>
              <div className="grid grid-cols-2 overflow-hidden rounded-sm border-2 border-foreground bg-card">
                <div className="col-span-2 flex items-end justify-between gap-5 border-b-2 border-foreground bg-highlight p-5">
                  <span className="font-display text-[52px] leading-none sm:text-[64px]">1924</span>
                  <span className="eyebrow text-right text-muted-foreground">
                    One accepted
                    <br />
                    life script
                  </span>
                </div>
                <img
                  src={sampleProducts[3].photo}
                  alt="Cast iron skillet"
                  className="aspect-square h-full w-full border-r-2 border-foreground object-cover"
                />
                <div className="flex flex-col justify-between p-5">
                  <span className="eyebrow text-emphasis">The bridal list</span>
                  <p className="mt-10 font-display text-[24px] leading-[1.12]">
                    China.
                    <br />
                    Silver.
                    <br />
                    Crystal.
                  </p>
                </div>
                <div className="col-span-2 border-t-2 border-foreground bg-primary p-5 text-primary-foreground">
                  <div className="flex items-end justify-between gap-5">
                    <span className="font-display text-[52px] leading-none sm:text-[64px]">
                      Now
                    </span>
                    <span className="eyebrow text-right text-primary-foreground/80">
                      Every life
                      <br />
                      worth marking
                    </span>
                  </div>
                </div>
                <img
                  src={sampleProducts[6].photo}
                  alt="Cobalt toolbox"
                  className="aspect-square h-full w-full border-r-2 border-foreground object-cover"
                />
                <img
                  src={sampleProducts[4].photo}
                  alt="Citron kettle"
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
              <p className="mt-5 text-[15px] leading-[1.5] text-muted-foreground">
                From one prescribed household to every way a life can change.
              </p>
            </div>
            <div>
              <p className="eyebrow text-emphasis">Why we exist</p>
              <ToasterLine as="h2" id="registry-story" className="site-h2 mt-5 max-w-[16ch]" />
              <p className="mt-8 max-w-[36rem] font-display text-[clamp(22px,2.8vw,30px)] leading-[1.25]">
                The registry was built for a woman leaving her father’s house for her husband’s.{" "}
                <span className="text-emphasis">We built one for everything else she does.</span>
                <sup>
                  <a
                    href="#source-2"
                    className="ml-1 align-super font-medium text-[14px] text-primary underline decoration-1 underline-offset-2"
                    aria-label="See source 2"
                  >
                    2
                  </a>
                </sup>
              </p>
              <p className="mt-7 max-w-[42rem] text-[17px] leading-[1.5] text-muted-foreground">
                In 1924, Marshall Field’s popularized the modern bridal registry: a list of china,
                silver, and crystal for a couple beginning one particular kind of life.
                <sup>
                  <a
                    href="#source-1"
                    className="ml-1 font-medium text-[14px] text-primary underline decoration-1 underline-offset-2"
                    aria-label="See source 1"
                  >
                    1
                  </a>
                </sup>
              </p>
              <div className="mt-10 grid gap-6 text-[17px] leading-[1.5] text-muted-foreground sm:grid-cols-2 sm:gap-10">
                <p>
                  It made care legible at marriage: here is the household, here is what it needs,
                  here is how everyone can help without guessing.
                </p>
                <p>
                  But women kept building lives outside that script: buying homes alone, starting
                  over, healing, moving cities. The care stayed. The ritual did not.
                </p>
              </div>
              <p className="mt-10 border-t-2 border-foreground pt-6 font-display text-[28px] leading-[1.18] sm:text-[34px]">
                Good Chapter is not a better wedding registry. It is the ritual for everything the
                registry left out.
              </p>
              <aside
                className="mt-10 border-t-2 border-foreground pt-5"
                aria-label="Sources for the registry story"
              >
                <p className="eyebrow text-muted-foreground">Sources & context</p>
                <ol className="mt-5 space-y-4 text-[15px] leading-[1.5] text-muted-foreground">
                  <li id="source-1" className="grid grid-cols-[1.5rem_1fr] gap-2">
                    <span className="font-medium text-foreground">1</span>
                    <span>
                      Marshall Field’s bridal-services archive, Chicago History Museum; see also
                      WTTW’s history of Marshall Field’s.{" "}
                      <a
                        href="https://images.chicagohistory.org/asset/23427/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline decoration-1 underline-offset-2"
                      >
                        Museum archive ↗
                      </a>
                      {" · "}
                      <a
                        href="https://www.wttw.com/chicago-stories/marshall-fields/how-marshall-fields-transformed-shopping-from-errand-to-experience"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline decoration-1 underline-offset-2"
                      >
                        WTTW history ↗
                      </a>
                    </span>
                  </li>
                  <li id="source-2" className="grid grid-cols-[1.5rem_1fr] gap-2">
                    <span className="font-medium text-foreground">2</span>
                    <span>
                      This is Good Chapter’s interpretation of the old social script, not a
                      quotation from Marshall Field’s.
                    </span>
                  </li>
                </ol>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <Unlearning />

      <section>
        <div className="site-container site-section grid items-center gap-14 lg:grid-cols-[minmax(320px,.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <div className="rounded-sm border-2 border-foreground bg-card p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="eyebrow text-muted-foreground">Messages</span>
              <span className="text-[15px] font-medium">Maya</span>
            </div>
            <div className="mt-7 flex flex-col gap-5 text-[16px] leading-[1.45]">
              <div className="max-w-[88%] self-start rounded-sm border-2 border-foreground bg-background px-4 py-3">
                Congrats on the house!! LMK if I can do anything
              </div>
              <div className="max-w-[82%] self-end rounded-sm bg-primary px-4 py-3 text-primary-foreground">
                Sure, thank you so much
                <span className="mt-1 block text-right font-medium text-[14px] text-primary-foreground/75">
                  Read
                </span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="h-px flex-1 bg-border" />
                <span className="font-medium text-[14px] text-muted-foreground">3 weeks later</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="rounded-sm border-2 border-dashed border-foreground p-5 text-center text-muted-foreground">
                <span className="block font-display text-3xl text-foreground">···</span>
                The intent is there. Without a simple action, nothing happens.
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow text-emphasis">The awkward gap</p>
            <h2 className="site-h2 mt-5 max-w-[16ch]">
              The offer is always real. The answer never comes.
            </h2>
            <p className="site-body mt-7 max-w-[42rem] text-muted-foreground">
              Maya Ellison, 34, bought a house alone. The old script has no shower for her, no list,
              no obvious way for people to mark what she did. Every friend offered help and meant
              it. She needed a lamp. Saying so would turn affection into an invoice. The person who
              needs help is the one who has to name it, and naming it is the cost nobody pays.
            </p>
            <p className="mt-8 border-l-2 border-emphasis pl-5 font-display text-[26px] leading-[1.25]">
              The problem is not wanting help. It is asking for it.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 bg-foreground text-background">
        <div className="site-container site-section">
          <p className="eyebrow text-background/70">How it works</p>
          <h2 className="site-h2 mt-5 max-w-[18ch]">No awkward asking. Just people showing up.</h2>
          <Illustration
            className="mt-12"
            src={familyDoor.url}
            alt="Two adults and a small child walk hand in hand through a large open door into a room with a lamp, a sofa, and plants."
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((step) => (
              <div key={step.n} className="border-t-2 border-background pt-5">
                <span className="font-display text-5xl text-secondary">{step.n}</span>
                <h3 className="mt-7 font-display text-[28px] leading-[1.1]">{step.title}</h3>
                <p className="mt-4 text-[17px] leading-[1.5] text-background/85">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow text-emphasis">A chapter, made personal</p>
              <h2 className="site-h2 mt-5">Maya’s First Place.</h2>
            </div>
            <p className="font-medium text-[14px] text-muted-foreground">
              Maya, 34 · First Place Chapter
            </p>
          </div>
          <div className="mt-12 grid overflow-hidden rounded-sm border-2 border-foreground sm:grid-cols-2 lg:grid-cols-4">
            {gifts.map((gift, index) => (
              <article
                key={gift.name}
                className={`lift-card flex min-w-0 flex-col bg-card ${index > 0 ? "border-t-2 border-foreground sm:border-t-0" : ""} ${index % 2 === 1 ? "sm:border-l-2 sm:border-foreground" : ""} ${index >= 2 ? "sm:border-t-2 sm:border-foreground" : ""} ${index % 4 !== 0 ? "lg:border-l-2 lg:border-foreground" : "lg:border-l-0"} ${index >= 4 ? "lg:border-t-2 lg:border-foreground" : "lg:border-t-0"}`}
              >
                <img
                  src={gift.photo}
                  alt={gift.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full border-b-2 border-foreground object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <span className="eyebrow text-emphasis">{gift.band}</span>
                  <h3 className="mt-3 font-display text-2xl leading-[1.1]">{gift.name}</h3>
                  <p className="mt-3 text-[15px] leading-[1.5] text-muted-foreground">
                    {gift.reason}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="border-x-2 border-b-2 border-foreground bg-highlight px-6 py-5 text-center font-display text-xl leading-[1.3]">
            The person receiving the gifts is never the person doing the asking.
          </div>
        </div>
      </section>

      <section className="border-y-2 border-foreground bg-card">
        <div className="site-container site-section grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow text-emphasis">Private by design</p>
            <h2 className="site-h2 mt-5 max-w-[13ch]">Someone started one for you?</h2>
          </div>
          <div className="grid gap-0 rounded-sm border-2 border-foreground bg-background sm:grid-cols-3">
            {assurances.map((assurance, index) => (
              <div
                key={assurance}
                className={`p-6 ${index > 0 ? "border-t-2 border-foreground sm:border-l-2 sm:border-t-0" : ""}`}
              >
                <Check className="size-6 text-primary" aria-hidden="true" />
                <p className="mt-5 font-display text-2xl leading-[1.2]">{assurance}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="chapters" className="site-section scroll-mt-20">
        <div className="site-container">
          <p className="eyebrow text-emphasis">Chapters</p>
          <h2 className="site-h2 mt-5 max-w-[18ch]">The moments still worth marking.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map(([name, description], index) => (
              <article key={name} className="lift-card min-h-48 border-2 border-foreground p-7">
                <span className="eyebrow text-primary">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-7 font-display text-3xl leading-[1.1]">{name}</h3>
                <p className="mt-4 text-[15px] leading-[1.5] text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emphasis text-emphasis-foreground">
        <div className="site-container flex flex-wrap items-center justify-between gap-8 py-16 md:py-20">
          <h2 className="site-h2 max-w-[16ch]">Start one for someone you love.</h2>
          <Button asChild variant="ink" size="lg">
            <Link to="/start">
              Start one for a friend <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

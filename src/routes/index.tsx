import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { Button } from "@/components/ui/button";
import mfInterior from "@/assets/marshall-field-interior.jpg.asset.json";
import mfStreet from "@/assets/marshall-field-1906.jpg.asset.json";

const title = "You shouldn't need a wedding to get a toaster";
const description =
  "The old script is getting a rewrite. Good Chapter Co. is opening its first circle. Request an invitation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:description", content: description },
    ],
  }),
  component: FrontDoor,
});

const steps = [
  {
    n: "No. 01",
    title: "A friend starts it.",
    copy: "They notice the chapter. The first apartment, the fresh start, the move nobody threw a party for.",
  },
  {
    n: "No. 02",
    title: "The person approves it.",
    copy: "In private. Keep what fits, swap what does not. Nothing goes out until they say so.",
  },
  {
    n: "No. 03",
    title: "Their people show up.",
    copy: "Each guest picks one real object. Nobody doubles up. Nobody sees who gave what.",
  },
];

const objects = [
  {
    drawing: "/brand/toaster-burgundy.png",
    w: 716,
    h: 445,
    name: "Checked toaster",
    note: "Yes, the toaster. No wedding required.",
    alt: "Drawing of a toaster with two slices of toast.",
  },
  {
    drawing: "/brand/blanket-burgundy.png",
    w: 726,
    h: 504,
    name: "Checked wool throw",
    note: "For the chair that is still the only chair.",
    alt: "Drawing of a folded blanket.",
  },
];

const display = "font-display font-normal tracking-[-0.01em]";

function FrontDoor() {
  return (
    <SiteShell pilot>
      <section className="border-b-[1.5px] border-foreground">
        <div className="site-container grid items-end gap-10 py-14 md:grid-cols-[minmax(0,1fr)_auto] md:gap-14 md:py-24">
          <div>
            <p className="eyebrow">Since 1924, nobody asks.</p>
            <h1
              className={`${display} mt-7 max-w-5xl text-[42px] lowercase leading-[1.1] sm:text-[60px] lg:text-[84px]`}
            >
              You shouldn’t have to get married to get a{" "}
              <span
                aria-hidden="true"
                className="mx-[0.03em] inline-block rounded-[2px] bg-primary px-[0.14em] pb-[0.09em] pt-[0.02em] leading-none text-primary-foreground"
              >
                f$%#ng
              </span>
              <span className="sr-only">fucking</span> toaster.
            </h1>
            <p className="mt-7 max-w-[34rem] text-[19px] leading-[1.45] sm:text-[21px]">
              When a friend steps into a big chapter, start it for them. They privately keep what
              fits. Their people fill the house.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#invite"
                data-slot="button"
                className="inline-flex min-h-[52px] items-center rounded-[4px] bg-primary px-6 py-3.5 text-[16px] text-primary-foreground hover:bg-foreground hover:text-background"
              >
                Request an invitation
              </a>
              <Link
                to="/first-place"
                className="inline-flex min-h-11 items-center text-[18px] underline underline-offset-[6px] hover:text-primary"
              >
                See Maya’s chapter
              </Link>
            </div>
          </div>
          <img
            src="/brand/door-burgundy.png"
            alt=""
            aria-hidden="true"
            width={786}
            height={732}
            fetchPriority="high"
            className="hidden h-auto w-[220px] md:block lg:w-[300px]"
          />
        </div>
      </section>

      <section className="site-container py-14 md:py-24" aria-label="Sample objects">
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <figure className="flex flex-col bg-card p-5 sm:p-6">
            <div className="flex min-h-[240px] flex-1 items-center justify-center p-6 sm:min-h-[320px]">
              <img
                src="/brand/mugs-burgundy.png"
                alt="Drawing of two mugs."
                width={726}
                height={360}
                className="h-auto max-h-[280px] w-auto max-w-[70%]"
              />
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-t-[1.5px] border-foreground pt-4">
              <span className="font-display text-[28px] leading-[1.1]">Maya’s first place</span>
              <span className="eyebrow">Started by a friend. Approved by Maya.</span>
            </figcaption>
          </figure>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            {objects.map((o) => (
              <figure
                key={o.name}
                className="flex flex-col gap-4 border-[1.5px] border-foreground p-5"
              >
                <div className="flex min-h-[150px] flex-1 items-center justify-center bg-card p-4">
                  <img
                    src={o.drawing}
                    alt={o.alt}
                    loading="lazy"
                    width={o.w}
                    height={o.h}
                    className="h-auto max-h-[130px] w-auto max-w-[70%]"
                  />
                </div>
                <figcaption>
                  <p className="font-display text-[23px] leading-[1.15]">{o.name}</p>
                  <p className="mt-1 text-[17px] leading-[1.4]">{o.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-[1.5px] border-foreground">
        <div className="site-container py-16 md:py-28">
          <p className="eyebrow">How a chapter works</p>
          <h2
            className={`${display} mt-5 max-w-3xl text-[34px] lowercase leading-[1.04] sm:text-[52px]`}
          >
            No list to write. No asking for yourself.
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="border-t-[1.5px] border-foreground pt-5">
                <span className="font-mono text-[13px] uppercase tracking-[0.1em]">{s.n}</span>
                <h3 className="mt-3 font-display text-[28px] font-normal leading-[1.1]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[18px] leading-[1.45]">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-container py-16 md:py-28">
        <div className="grid items-end gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div className="flex min-h-[300px] items-center justify-center bg-foreground p-10 md:min-h-[420px]">
            <img
              src="/brand/gift-paper.png"
              alt="Drawing of a wrapped gift."
              loading="lazy"
              width={642}
              height={456}
              className="h-auto w-[62%]"
            />
          </div>
          <div>
            <p className="eyebrow">Where gifts come from</p>
            <p className={`${display} mt-5 text-[28px] leading-[1.12] sm:text-[38px]`}>
              Gifts come directly from independent makers, trusted retailers, and friends of Good
              Chapter.
            </p>
            <p className="mt-5 text-[19px] leading-[1.45]">
              No platform fees. Never marked up above retail.
            </p>
            <Link
              to="/read"
              className="mt-6 inline-flex min-h-11 items-center text-[18px] underline underline-offset-[6px] hover:text-primary"
            >
              Read our why
            </Link>
          </div>
        </div>
      </section>

      <section id="invite" className="scroll-mt-24 border-y-[1.5px] border-foreground">
        <div className="site-container grid gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <p className="eyebrow">Private pilot</p>
            <h2 className={`${display} mt-5 text-[34px] lowercase leading-[1.04] sm:text-[52px]`}>
              The first circle opens quietly.
            </h2>
            <p className="mt-5 max-w-[30rem] text-[19px] leading-[1.45]">
              Friends, agents, employers, and the curious. Tell us who you are and we will write
              when the doors open.
            </p>
            <img
              src="/brand/tag-clay.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={965}
              height={1188}
              className="mt-8 h-auto w-24 -rotate-[9deg]"
            />
          </div>
          <WaitlistForm pilot />
        </div>
      </section>

      <section className="site-container py-16 md:py-28" aria-labelledby="registry-story">
        <div className="grid gap-12 lg:grid-cols-[minmax(300px,.72fr)_minmax(0,1.28fr)] lg:gap-20">
          <div>
            <div className="grid grid-cols-2 border-[1.5px] border-foreground">
              <div className="col-span-2 flex items-end justify-between gap-5 border-b-[1.5px] border-foreground p-5">
                <span className="font-display text-[52px] leading-[0.9] sm:text-[64px]">1924</span>
                <span className="eyebrow text-right">
                  One accepted
                  <br />
                  life script
                </span>
              </div>
              <img
                src={mfInterior.url}
                alt="Archival photograph of the Marshall Field’s store interior, about 1910, with tall columns and shoppers on the main floor."
                loading="lazy"
                width={300}
                height={446}
                className="aspect-square h-full w-full border-r-[1.5px] border-foreground object-cover grayscale"
              />
              <div className="flex flex-col justify-between gap-8 p-5">
                <span className="eyebrow">The bridal list</span>
                <p className="font-display text-[26px] leading-[1.1]">
                  China.
                  <br />
                  Silver.
                  <br />
                  Crystal.
                </p>
              </div>
              <img
                src={mfStreet.url}
                alt="Archival 1906 postcard of crowds on the street outside the Marshall Field’s store."
                loading="lazy"
                width={1920}
                height={1254}
                className="col-span-2 aspect-[3/2] h-full w-full border-t-[1.5px] border-foreground object-cover"
              />
              <div className="col-span-2 flex items-end justify-between gap-5 bg-primary p-5 text-primary-foreground">
                <span className="font-display text-[52px] lowercase leading-[0.9] sm:text-[64px]">
                  Now
                </span>
                <span className="eyebrow text-right">
                  Every life
                  <br />
                  worth marking
                </span>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-[1.4]">
              Archival images: Marshall Field’s, about 1906 to 1910. Public domain, via Wikimedia
              Commons.
            </p>
          </div>
          <div>
            <p className="eyebrow">Why we exist</p>
            <h2
              id="registry-story"
              className={`${display} mt-5 text-[36px] leading-[1.04] sm:text-[52px] lg:text-[62px]`}
            >
              The registry was built for a woman leaving her father’s house for her husband’s.{" "}
              <span className="text-emphasis">We built one for everything else she does.</span>
            </h2>
            <p className="mt-8 max-w-[40rem] text-[19px] leading-[1.45]">
              In 1924, a department store made care easy to give at marriage. China, silver,
              crystal, and a list so nobody guessed.
            </p>
            <p className="mt-5 max-w-[40rem] text-[19px] leading-[1.45]">
              Women kept building lives outside that script. Buying homes alone. Starting over.
              Moving somewhere new. The care stayed. The ritual did not.
            </p>
            <div className="mt-10 border-t-[1.5px] border-foreground pt-7">
              <p className="font-display text-[26px] leading-[1.1] sm:text-[32px]">
                To learn more about our why.
              </p>
              <Button asChild size="lg" className="mt-6 h-[52px] px-6 text-[16px]">
                <Link to="/read">Read our why</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

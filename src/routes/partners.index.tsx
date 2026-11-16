import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/lib/sample-products";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/partners/")({
  head: () => ({
    meta: [
      { title: "Partners .  Good Chapter" },
      {
        name: "description",
        content:
          "Employers, agents and brands start a Good Chapter on someone's behalf. The person approves it privately. Nobody has to ask.",
      },
      { property: "og:title", content: "Partners .  Good Chapter" },
      {
        property: "og:description",
        content:
          "Employers, agents and brands start a Good Chapter on someone's behalf. The person approves it privately. Nobody has to ask.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

const steps = [
  {
    n: "01",
    title: "You start it",
    copy: "From your portal, your closing checklist or your storefront. One link, no setup on their side.",
  },
  {
    n: "02",
    title: "They approve it",
    copy: "The person keeps, cuts or adds items in private. You never see their edits.",
  },
  {
    n: "03",
    title: "Their people show up",
    copy: "Friends, family and coworkers give from a curated list. Your name is on the invite, if you want it there.",
  },
];

const pathways = [
  {
    to: "/partners/employers",
    label: "Employers & benefits brokers",
    headline: "The milestone benefit for everything after the wedding.",
    bullets: [
      "Puts your existing engagement budget to work",
      "A teammate starts it, HR never sees the list",
      "No integration needed to start",
    ],
    footer: "For employers",
    photo: sampleProducts[4].photo,
    alt: "Citron kettle",
  },
  {
    to: "/partners/real-estate",
    label: "Real estate agents & lenders",
    headline: "A closing gift that keeps showing up.",
    bullets: [
      "Start a First Place chapter at closing",
      "Friends and family furnish the new home",
      "Your name on every gift that arrives",
    ],
    footer: "For agents",
    photo: sampleProducts[6].photo,
    alt: "Cobalt toolbox",
  },
  {
    to: "/partners/brands",
    label: "Brands & collaborations",
    headline: "Be the thing someone actually wanted.",
    bullets: [
      "A named slot in chapters that fit you",
      "Co-branded editions for a single life moment",
    ],
    footer: "For brands",
    photo: sampleProducts[3].photo,
    alt: "Cast iron skillet",
  },
];

const rules = [
  {
    n: "01",
    title: "Consent first",
    copy: "Nothing goes out until the person approves it, twice.",
  },
  {
    n: "02",
    title: "You never see edits",
    copy: "What they keep or cut stays between them and the list.",
  },
  { n: "03", title: "No cash asks", copy: "Gifts only. The moment it's money, it's an ask." },
  { n: "04", title: "No data sold", copy: "Guest names and emails are never shared or resold." },
];

// Per-cell borders for a 1 / 2 / 4 column rules grid with 2px ink dividers.
const ruleBorders = [
  "border-t-0 sm:border-t-0 lg:border-t-0 border-l-0",
  "border-t-2 sm:border-t-0 lg:border-t-0 sm:border-l-2 border-l-0",
  "border-t-2 sm:border-t-2 lg:border-t-0 sm:border-l-0 lg:border-l-2",
  "border-t-2 sm:border-t-0 lg:border-t-0 sm:border-l-2",
];

function PartnersPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="site-section">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-7">
            <p className="sticker">Partners</p>
            <h1 className="site-h1 max-w-[12ch]">You're already in the room when life changes.</h1>
            <p className="site-body max-w-[34rem] text-muted-foreground">
              Good Chapter lets the people around a milestone start a chapter on someone's behalf:
              an employer, an agent at closing, a brand they love. The person approves it privately.
              Nobody has to ask.
            </p>
            <div className="mt-1 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href="mailto:liv@goodchaptercollective.com?subject=Good%20Chapter%20partnership">
                  Book a call
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#partners">Find your page</a>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
            <img
              src={sampleProducts[0].photo}
              alt=""
              className="absolute left-0 top-0 h-[78%] w-[78%] rounded-sm border-2 border-foreground object-cover"
            />
            <img
              src={sampleProducts[1].photo}
              alt=""
              className="absolute bottom-0 right-0 h-[48%] w-[48%] rotate-2 rounded-sm border-2 border-foreground object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ink band .  3 steps */}
      <section className="bg-foreground text-background">
        <div className="site-container site-section">
          <p className="eyebrow text-background/70">How it works</p>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((step) => (
              <div key={step.n} className="border-t-2 border-background pt-5">
                <span className="font-display text-5xl text-secondary">{step.n}</span>
                <h3 className="mt-7 font-display text-[28px] leading-[1.1]">{step.title}</h3>
                <p className="mt-4 max-w-[30rem] text-[17px] leading-[1.5] text-background/85">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section id="partners" className="site-section scroll-mt-20">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="site-h2 max-w-[18ch]">Three ways to partner.</h2>
            <p className="max-w-[24rem] text-lg leading-[1.5] text-muted-foreground">
              Same mechanic, different moment. Pick the one that sounds like you.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pathways.map((pathway) => (
              <Link
                key={pathway.to}
                to={pathway.to}
                className="lift-card group flex flex-col overflow-hidden border-2 border-foreground bg-card"
              >
                <img
                  src={pathway.photo}
                  alt={pathway.alt}
                  className="block aspect-[4/3] w-full border-b-2 border-foreground object-cover"
                />
                <div className="flex flex-1 flex-col gap-4 p-7">
                  <span className="eyebrow text-emphasis">{pathway.label}</span>
                  <h3 className="font-display text-[30px] leading-[1.1]">{pathway.headline}</h3>
                  <ul className="flex flex-col gap-2.5">
                    {pathway.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 pl-0.5 text-base leading-[1.45]">
                        <span
                          className="mt-2 size-2 shrink-0 rounded-full bg-emphasis"
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex items-center justify-between border-t border-border pt-4 eyebrow text-primary transition-colors duration-175 group-hover:text-foreground">
                    {pathway.footer}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Non-negotiables */}
      <section className="site-section pt-0">
        <div className="site-container">
          <h2 className="site-h2 max-w-[22ch]">What stays true for every partner.</h2>
          <div className="mt-12 grid overflow-hidden rounded-sm border-2 border-foreground bg-card sm:grid-cols-2 lg:grid-cols-4">
            {rules.map((rule, index) => (
              <div
                key={rule.n}
                className={`flex flex-col gap-3 border-foreground p-7 ${ruleBorders[index]}`}
              >
                <span className="eyebrow text-primary">{rule.n}</span>
                <h3 className="font-display text-2xl leading-[1.1]">{rule.title}</h3>
                <p className="text-base leading-[1.5] text-muted-foreground">{rule.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clay closing CTA */}
      <section className="bg-emphasis text-emphasis-foreground">
        <div className="site-container flex flex-wrap items-center justify-between gap-10 py-16 md:py-20">
          <h2 className="site-h2 max-w-[20ch]">
            Founding partners, starting now. Fully concierge-managed.
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <Button
              asChild
              size="lg"
              className="border-2 border-background bg-background text-foreground hover:-rotate-1 hover:bg-background"
            >
              <a href="mailto:liv@goodchaptercollective.com?subject=Good%20Chapter%20pilot">
                Book a call
              </a>
            </Button>
            <a
              href="mailto:liv@goodchaptercollective.com"
              className="text-sm font-medium underline underline-offset-4 transition-colors duration-175 hover:text-background/80"
            >
              liv@goodchaptercollective.com
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

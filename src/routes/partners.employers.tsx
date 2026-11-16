import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import toolbox from "@/assets/p-cobalt-toolbox-600.webp.asset.json";
import pan from "@/assets/p-cast-iron-pan-600.webp.asset.json";
import kettle from "@/assets/p-bright-citron-kettle-600.webp.asset.json";
import blanket from "@/assets/p-knit-blanket-600.webp.asset.json";
import kitchen from "@/assets/scene-kitchen-moving-day.png.asset.json";
import desk from "@/assets/scene-desk-nook.png.asset.json";

const title = "For employers. Good Chapter, Co.";
const description =
  "A private way for teams to show up for the life chapters that never make the HR calendar.";

export const Route = createFileRoute("/partners/employers")({
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
  component: EmployersPage,
});

const steps = [
  {
    n: "01",
    h: "A teammate starts a draft.",
    p: "A coworker picks a few curated gifts that fit. A draft, not an announcement.",
  },
  {
    n: "02",
    h: "The employee approves it.",
    p: "Two clicks. Keep what fits, swap what does not. Nothing moves until they say yes.",
  },
  {
    n: "03",
    h: "The company covers the anchor.",
    p: "Your pool funds the first gift. Teammates may add one, never required.",
  },
  {
    n: "04",
    h: "It arrives.",
    p: "To an address the employee enters. Never in employer reporting.",
  },
];

const measures = [
  { h: "Support gap", p: "\u201CMy team notices what matters to me,\u201D in your own survey." },
  { h: "Support multiplier", p: "How often teammates add after the company gift." },
  { h: "Reach", p: "People who added after the gift was claimed." },
  { h: "Recipient pulse", p: "One question after delivery: did it feel thoughtful?" },
];

const privacy = [
  "Counts and spend only. Never a name, a reason, or a message.",
  "Groups under five roll up, so no one can be identified.",
  "The address is used only for delivery. Never in employer reporting.",
  "Taking part is optional. Not taking part is silent.",
  "Not an EAP or a clinical service. It sits beside leave and never replaces it.",
];

const faq = [
  { q: "Does my company see why?", a: "No. Counts and spend only." },
  { q: "Is this cash or a stipend?", a: "No. A useful object the employee chooses to keep." },
  {
    q: "Who authorizes the money?",
    a: "HR sets a pool in advance. Nothing is drawn from the pool until the employee approves.",
  },
  {
    q: "How does the survey connect?",
    a: "Add four questions to your next survey. We read the results together.",
  },
  { q: "What about tax?", a: "We are confirming treatment with counsel. No guidance until then." },
];

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={600}
      height={600}
      className="w-full rounded-sm border-2 border-foreground object-cover"
    />
  );
}

function EmployersPage() {
  return (
    <SiteShell>
      <section className="site-container grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="eyebrow text-emphasis">For people and HR leaders</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Company swag isn't care. And life happens outside of maternity leave.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Your engagement budget, turned into useful gifts for the moments that never make the HR
            calendar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#start"
              className="inline-block rounded-sm border-2 border-foreground bg-primary px-5 py-3 text-primary-foreground hover:bg-foreground hover:text-background"
            >
              Start with your team
            </a>
            <Link
              to="/partners/employers/dashboard"
              className="underline underline-offset-4 hover:bg-foreground hover:text-background"
            >
              See what HR sees
            </Link>
          </div>
          <p className="eyebrow mt-4">
            Counts and spend only. Nobody sees why. No integration to start.
          </p>
        </div>
        <img
          src={kitchen.url}
          alt="A kitchen on moving day with a citron kettle, dishes in a moving box, and keys on the counter."
          width={1200}
          height={800}
          className="aspect-[3/2] w-full rounded-sm border-2 border-foreground object-cover"
        />
      </section>

      <section className="border-y-2 border-foreground">
        <div className="site-container max-w-3xl py-14">
          <p className="eyebrow text-emphasis">The gap</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Leave covers the loss. Who covers the first apartment?
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Employers do right by the hard moments. Almost nothing exists for the good ones. A first
            place. A new role. A parent moving in. HR rarely hears about them.
          </p>
          <p className="mt-8 w-fit max-w-full rounded-[4px] border-2 border-foreground bg-highlight px-5 py-4 font-display text-2xl leading-snug text-highlight-foreground sm:text-3xl">
            Sometimes a teammate knows. Sometimes a manager knows. Good Chapter turns &ldquo;we
            should do something&rdquo; into something real.
          </p>
        </div>
      </section>

      <section className="site-container py-14">
        <p className="eyebrow text-emphasis">How it works</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Four steps. Nobody asks.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-sm border-2 border-foreground p-5">
              <p className="eyebrow">{s.n}</p>
              <h3 className="mt-3 font-display text-xl">{s.h}</h3>
              <p className="mt-3 leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Photo src={toolbox.url} alt="A cobalt toolbox." />
          <Photo src={pan.url} alt="A cast iron pan." />
          <Photo src={kettle.url} alt="A citron kettle." />
          <Photo src={blanket.url} alt="A knit blanket." />
        </div>
        <p className="eyebrow mt-4">
          Sample gifts. From independent makers, trusted retailers, and friends of Good Chapter. No
          platform fees. Never marked up above retail.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Good Chapter directs a share of its margin to a cause your company selects.
        </p>
      </section>

      <section className="border-y-2 border-foreground">
        <div className="site-container py-14">
          <p className="eyebrow text-emphasis">What you measure</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Four numbers. No names.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {measures.map((m) => (
              <div key={m.h} className="rounded-sm border-2 border-foreground p-5">
                <h3 className="eyebrow">{m.h}</h3>
                <p className="mt-3 leading-relaxed">{m.p}</p>
              </div>
            ))}
          </div>
          <p className="eyebrow mt-6">
            No team has run this yet. We will report these in your own numbers at day 90.
          </p>
        </div>
      </section>

      <section className="site-container grid gap-10 py-14 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="eyebrow text-emphasis">The budget</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            A modest pool. A clearer signal.
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            A $10,000 pool with a $200 anchor gift covers about fifty chapters over 90 days. You set
            the numbers. The gift is the cost.
          </p>
          <Link
            to="/partners/employers/portal"
            className="mt-6 inline-block rounded-sm border-2 border-foreground px-5 py-3 hover:bg-foreground hover:text-background"
          >
            Walk the portal prototype
          </Link>
          <img
            src={desk.url}
            alt="A desk nook with blue drawers, a notebook, a checkered mug, and a plant."
            loading="lazy"
            width={1200}
            height={800}
            className="mt-8 aspect-[3/2] w-full rounded-sm border-2 border-foreground object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-emphasis">Privacy</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Private by design, so HR can say yes.
          </h2>
          <ul className="mt-6 grid gap-3">
            {privacy.map((p) => (
              <li key={p} className="rounded-sm border-2 border-foreground p-4 leading-relaxed">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y-2 border-foreground">
        <div className="site-container max-w-3xl py-14">
          <p className="eyebrow text-emphasis">HR questions</p>
          <dl className="mt-6 grid gap-6">
            {faq.map((f) => (
              <div key={f.q} className="border-t-2 border-foreground pt-4">
                <dt className="font-display text-xl">{f.q}</dt>
                <dd className="mt-2 text-lg leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="start" className="site-container max-w-2xl py-14">
        <p className="eyebrow text-emphasis">Founding employers</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">
          Start small. Learn something real.
        </h2>
        <p className="mt-4 mb-8 text-lg">
          Add four questions to your next survey. Start with one team. Review four numbers at day
          90. Liv reads every note.
        </p>
        <WaitlistForm pilot defaultInquiry="Founding partner: Employer" />
      </section>
    </SiteShell>
  );
}

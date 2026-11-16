import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CookingPot,
  Flame,
  Image,
  LockKeyhole,
  Sparkles,
  Wine,
} from "lucide-react";

type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  band: string;
  reason: string;
  kind: "candle" | "aperitif" | "frame" | "cookware";
};

const products: Product[] = [
  {
    id: "otherland-candle",
    brand: "Otherland",
    name: "Core candle",
    price: 38,
    band: "Easy yes",
    reason: "For making a brand-new room smell like yours.",
    kind: "candle",
  },
  {
    id: "ghia-duo",
    brand: "Ghia",
    name: "First Sip set",
    price: 48,
    band: "Easy yes",
    reason: "For the first toast in a place you chose on your own terms.",
    kind: "aperitif",
  },
  {
    id: "framebridge-tabletop",
    brand: "Framebridge",
    name: "Tabletop frame",
    price: 78,
    band: "Considered",
    reason: "For the photo you keep taking with you, finally on a wall.",
    kind: "frame",
  },
  {
    id: "caraway-mini",
    brand: "Caraway",
    name: "Mini cookware duo",
    price: 99,
    band: "Considered",
    reason: "A thoughtful start for the kitchen that is finally yours.",
    kind: "cookware",
  },
  {
    id: "caraway-saute",
    brand: "Caraway",
    name: "Sauté pan",
    price: 135,
    band: "Practical",
    reason: "The workhorse that looks good left on the burner.",
    kind: "cookware",
  },
  {
    id: "framebridge-pair",
    brand: "Framebridge",
    name: "Custom frame pair",
    price: 145,
    band: "Practical",
    reason: "For the blank wall that deserves to feel lived in.",
    kind: "frame",
  },
  {
    id: "framebridge-gallery",
    brand: "Framebridge",
    name: "Gallery wall set",
    price: 320,
    band: "Group candidate",
    reason: "Your people, framed and hung, without a tape measure.",
    kind: "frame",
  },
  {
    id: "caraway-set",
    brand: "Caraway",
    name: "Cookware set",
    price: 395,
    band: "Group candidate",
    reason: "A whole kitchen from everyone who watched you get the keys.",
    kind: "cookware",
  },
];

const bands = [
  { name: "Easy yes", range: "$25–50" },
  { name: "Considered", range: "$60–120" },
  { name: "Practical", range: "$40–150" },
  { name: "Group candidate", range: "$200–400" },
] as const;

const stages = [
  "Choose a chapter",
  "Curate eight",
  "Invite the circle",
  "Maya’s private review",
  "A guest gives",
];
const button =
  "inline-flex items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:border-foreground hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-45";
const quietButton =
  "inline-flex items-center justify-center gap-2 rounded-sm border-2 border-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background";

const brandIcon = {
  candle: Flame,
  aperitif: Wine,
  frame: Image,
  cookware: CookingPot,
};

type GuestCardProps = {
  product: Product;
  index: number;
  claimed: boolean;
  onClaim: () => void;
};

export function FirstPlaceJourney({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const [selectedChapter, setSelectedChapter] = useState(true);
  const [kept, setKept] = useState(products.map((product) => product.id));
  const [starter, setStarter] = useState("Jordan");
  const [guests, setGuests] = useState(["Leah", "Priya", "Sam", "Noah"]);
  const [circleNote, setCircleNote] = useState(
    "The people who have been in Maya’s corner since the beginning.",
  );
  const [approved, setApproved] = useState(initialStep === 4);
  const [deliveryReady, setDeliveryReady] = useState(false);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [delivery, setDelivery] = useState({
    name: "Maya Ellison",
    street: "48 Willow Street",
    city: "Brooklyn",
    state: "NY",
    zip: "11231",
  });

  const activeProducts = products.filter((product) => kept.includes(product.id));
  const selectStage = (next: number) => {
    if (next !== 4 || approved) setStep(next);
  };
  const toggleProduct = (id: string) => {
    setKept((current) =>
      current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id],
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-foreground">
        <div className="site-container flex items-center justify-between gap-4 py-5">
          <a href="/" className="font-display text-xl">
            Good Chapter, Co.
          </a>
          <span className="rounded-full border border-foreground/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Investor preview
          </span>
        </div>
      </header>

      <nav
        aria-label="Sample journey"
        className="sticky top-0 z-20 border-b-2 border-foreground bg-background/95 backdrop-blur"
      >
        <ol className="site-container flex gap-1 overflow-x-auto py-3">
          {stages.map((label, index) => (
            <li key={label} className="shrink-0">
              <button
                type="button"
                onClick={() => selectStage(index)}
                disabled={index === 4 && !approved}
                aria-current={index === step ? "step" : undefined}
                className={`rounded-sm px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${index === step ? "bg-primary text-primary-foreground" : "hover:bg-foreground hover:text-background"}`}
              >
                <span className="mr-1.5 opacity-65">0{index + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section className="site-container max-w-6xl py-9 sm:py-14">
        {step === 0 && (
          <Scene eyebrow="01 · The friend starts it" title="A first place, made hers.">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
              <div>
                <p className="max-w-[44ch] text-base leading-7 text-muted-foreground">
                  Maya Ellison is 34. She just bought a house on her own. Her friend Jordan starts
                  the chapter, so Maya never has to turn congratulations into a shopping list.
                </p>
                <div className="mt-8 rounded-sm border-2 border-foreground bg-card p-5 sm:p-7">
                  <p className="eyebrow text-emphasis">Choose a chapter</p>
                  <button
                    type="button"
                    aria-pressed={selectedChapter}
                    onClick={() => setSelectedChapter(true)}
                    className="mt-4 flex w-full items-center justify-between gap-4 border-2 border-foreground bg-highlight p-5 text-left"
                  >
                    <span>
                      <span className="block font-display text-3xl">First Place</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        A home bought or signed for on her own.
                      </span>
                    </span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-4" />
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="mt-3 w-full rounded-sm border border-dashed border-foreground/30 p-4 text-left text-sm text-muted-foreground"
                  >
                    Other chapters <span className="float-right">Coming soon</span>
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!selectedChapter}
                  onClick={() => setStep(1)}
                  className={`${button} mt-6`}
                >
                  Start Maya’s chapter <ArrowRight className="size-4" />
                </button>
              </div>
              <div className="relative overflow-hidden rounded-sm border-2 border-foreground bg-[#e7e1d3] p-8 sm:p-12">
                <span className="eyebrow text-foreground/60">A new set of keys</span>
                <div className="mt-10 flex min-h-56 items-end">
                  <div className="relative w-full border-b-2 border-foreground pb-5">
                    <div className="absolute bottom-5 left-[10%] h-36 w-28 border-2 border-foreground bg-[#f7f4ed] sm:left-[18%] sm:w-36">
                      <div className="absolute inset-x-4 top-4 h-20 border-2 border-foreground bg-[#d3dfd2]" />
                      <div className="absolute bottom-0 left-1/2 h-16 w-8 -translate-x-1/2 border-x-2 border-t-2 border-foreground bg-[#b47754]" />
                    </div>
                    <div className="ml-auto mr-[8%] grid size-24 place-items-center rounded-full bg-[#f4d988] text-foreground sm:size-28">
                      <Sparkles className="size-10" strokeWidth={1.2} />
                    </div>
                  </div>
                </div>
                <p className="mt-5 font-display text-2xl">Not a registry. A way to show up.</p>
              </div>
            </div>
          </Scene>
        )}

        {step === 1 && (
          <Scene eyebrow="02 · Jordan curates" title="Eight things Maya will actually use.">
            <div className="flex flex-col justify-between gap-4 border-b border-foreground/20 pb-5 sm:flex-row sm:items-end">
              <p className="max-w-[48ch] text-base leading-7 text-muted-foreground">
                Four price bands make room for an easy yes, a practical need, or a gift from the
                group. Every item has one personal reason.
              </p>
              <span className="shrink-0 rounded-full bg-highlight px-4 py-2 text-sm font-medium">
                {kept.length} of 8 selected
              </span>
            </div>
            <div className="mt-6 grid gap-10">
              {bands.map((band) => (
                <fieldset key={band.name}>
                  <legend className="flex w-full items-baseline justify-between border-b-2 border-foreground pb-2">
                    <span className="font-display text-2xl">{band.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">{band.range}</span>
                  </legend>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {products
                      .filter((product) => product.band === band.name)
                      .map((product) => (
                        <ProductTile
                          key={product.id}
                          product={product}
                          selected={kept.includes(product.id)}
                          onClick={() => toggleProduct(product.id)}
                        />
                      ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled={kept.length !== 8}
                onClick={() => setStep(2)}
                className={button}
              >
                Add Maya’s circle <ArrowRight className="size-4" />
              </button>
              {kept.length !== 8 ? (
                <p role="status" className="text-sm text-emphasis">
                  Choose all eight to continue.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Sample prices are illustrative.</p>
              )}
            </div>
          </Scene>
        )}

        {step === 2 && (
          <Scene eyebrow="03 · The circle" title="The people who’ll make it feel like home.">
            <div className="grid gap-10 lg:grid-cols-[1fr_.85fr]">
              <div>
                <label htmlFor="starter-name" className="eyebrow text-emphasis">
                  From the friend who started it
                </label>
                <input
                  id="starter-name"
                  value={starter}
                  maxLength={40}
                  onChange={(event) => setStarter(event.target.value)}
                  className="mt-3 w-full border-2 border-foreground bg-card px-4 py-3 text-lg outline-none focus:bg-highlight"
                />
                <p className="mt-8 eyebrow text-emphasis">Invite Maya’s small circle</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {guests.map((name, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-3 border border-foreground/25 bg-card p-3"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight font-display text-lg">
                        {name.trim().slice(0, 1) || "?"}
                      </span>
                      <span className="sr-only">Guest {index + 1} name</span>
                      <input
                        value={name}
                        maxLength={40}
                        onChange={(event) =>
                          setGuests((current) =>
                            current.map((guest, guestIndex) =>
                              guestIndex === index ? event.target.value : guest,
                            ),
                          )
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                        aria-label={`Guest ${index + 1} name`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGuests((current) =>
                            current.filter((_, guestIndex) => guestIndex !== index),
                          )
                        }
                        aria-label={`Remove guest ${name || index + 1}`}
                        className="px-2 text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </label>
                  ))}
                </div>
                {guests.length < 8 ? (
                  <button
                    type="button"
                    onClick={() => setGuests((current) => [...current, ""])}
                    className={`${quietButton} mt-3`}
                  >
                    + Add someone
                  </button>
                ) : null}
                {guests.length === 0 ? (
                  <p role="status" className="mt-3 text-sm text-emphasis">
                    Add at least one guest to continue.
                  </p>
                ) : null}
              </div>
              <aside className="h-fit border-l-2 border-primary bg-highlight/50 p-6 sm:p-8">
                <label htmlFor="circle-note" className="eyebrow text-emphasis">
                  A note for the circle
                </label>
                <textarea
                  id="circle-note"
                  rows={4}
                  maxLength={180}
                  value={circleNote}
                  onChange={(event) => setCircleNote(event.target.value)}
                  className="mt-4 w-full resize-y border-2 border-foreground bg-background p-3 text-base leading-6 outline-none focus:bg-card"
                />
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Jordan sends each guest a private invitation after Maya approves. Maya’s address
                  and private edits are never shown to the circle.
                </p>
                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {guests.length} private {guests.length === 1 ? "invitation" : "invitations"}
                </p>
              </aside>
            </div>
            <button
              type="button"
              disabled={!starter.trim() || guests.length === 0}
              onClick={() => setStep(3)}
              className={`${button} mt-8`}
            >
              Send to Maya, privately <ArrowRight className="size-4" />
            </button>
          </Scene>
        )}

        {step === 3 && (
          <Scene
            eyebrow="04 · Maya’s private review"
            title={
              approved ? "Approved. Her edits stay hers." : "Keep what fits. Cut what doesn’t."
            }
          >
            <div className="mb-7 flex items-start gap-3 border-l-2 border-primary bg-highlight/60 p-4 sm:p-5">
              <LockKeyhole className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm leading-6">
                <strong>This is private.</strong> Jordan never sees what Maya keeps or cuts. Only
                her approved list is shared with the guests.
              </p>
            </div>
            {!approved ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      aria-pressed={kept.includes(product.id)}
                      onClick={() => toggleProduct(product.id)}
                      className={`overflow-hidden border-2 text-left transition-colors ${kept.includes(product.id) ? "border-foreground bg-card" : "border-foreground/20 bg-background opacity-55"}`}
                    >
                      <ProductArt product={product} compact />
                      <span className="block p-3">
                        <span className="block text-xs font-medium text-muted-foreground">
                          {product.brand}
                        </span>
                        <span className="mt-1 block text-sm font-medium">{product.name}</span>
                        <span className="mt-2 block text-xs">
                          {kept.includes(product.id) ? "Keeping" : "Cut privately"} · $
                          {product.price}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                {!deliveryReady ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setDeliveryReady(true);
                    }}
                    className="mt-10 grid gap-4 border-t-2 border-foreground pt-7 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-2">
                      <p className="font-display text-2xl">Where should the good things land?</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Only Good Chapter and the fulfilling brand receive this address.
                      </p>
                    </div>
                    <DeliveryField
                      label="Full name"
                      value={delivery.name}
                      onChange={(name) => setDelivery({ ...delivery, name })}
                    />
                    <DeliveryField
                      label="Street address"
                      value={delivery.street}
                      onChange={(street) => setDelivery({ ...delivery, street })}
                    />
                    <DeliveryField
                      label="City"
                      value={delivery.city}
                      onChange={(city) => setDelivery({ ...delivery, city })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <DeliveryField
                        label="State"
                        value={delivery.state}
                        onChange={(state) => setDelivery({ ...delivery, state })}
                      />
                      <DeliveryField
                        label="ZIP"
                        value={delivery.zip}
                        onChange={(zip) => setDelivery({ ...delivery, zip })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !delivery.name.trim() ||
                        !delivery.street.trim() ||
                        !delivery.city.trim() ||
                        !delivery.zip.trim() ||
                        activeProducts.length === 0
                      }
                      className={`${button} sm:col-span-2 sm:justify-self-start`}
                    >
                      Click 1 · Review delivery details <ArrowRight className="size-4" />
                    </button>
                  </form>
                ) : (
                  <div className="mt-10 border-t-2 border-foreground pt-7">
                    <p className="eyebrow text-emphasis">Click 1 of 2 · Details checked</p>
                    <p className="mt-3 max-w-[48ch] text-sm leading-6 text-muted-foreground">
                      Your private delivery details are ready. {activeProducts.length} gifts are on
                      your list. Jordan and the guests will not see your address or the items you
                      cut.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setApproved(true);
                        setStep(4);
                      }}
                      className={`${button} mt-5`}
                    >
                      Click 2 · Approve this chapter <Check className="size-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-8 border-t-2 border-foreground pt-6">
                <p className="text-base leading-7 text-muted-foreground">
                  Maya’s approved list is ready for Jordan’s circle. Her delivery information and
                  private decisions stay private.
                </p>
                <button type="button" onClick={() => setStep(4)} className={`${button} mt-5`}>
                  See the guest page <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </Scene>
        )}

        {step === 4 && approved && (
          <GuestStep
            items={activeProducts}
            guests={guests.filter((name) => name.trim())}
            starter={starter}
            circleNote={circleNote}
            claimed={claimed}
            onClaim={(id) =>
              setClaimed((current) => (current.includes(id) ? current : [...current, id]))
            }
            onRestart={() => {
              setStep(0);
              setApproved(false);
              setDeliveryReady(false);
              setKept(products.map((product) => product.id));
              setClaimed([]);
            }}
          />
        )}
      </section>

      <footer className="border-t-2 border-foreground bg-card">
        <div className="site-container flex flex-col gap-2 py-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Good Chapter · First Place sample journey</p>
          <p>
            Illustrative products and prices. This presentation preview does not send invitations or
            place orders.
          </p>
        </div>
      </footer>
    </main>
  );
}

function GuestStep({
  items,
  guests,
  starter,
  circleNote,
  claimed,
  onClaim,
  onRestart,
}: {
  items: Product[];
  guests: string[];
  starter: string;
  circleNote: string;
  claimed: string[];
  onClaim: (id: string) => void;
  onRestart: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-emphasis">
        <Sparkles className="size-4" />
        05 · A guest gives · about 5 minutes
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <div className="border-b-2 border-foreground pb-6">
            <p className="eyebrow">A private invitation from {starter || "Jordan"}</p>
            <h1 className="mt-3 max-w-[16ch] font-display text-4xl leading-[1.02] sm:text-6xl">
              Maya has a first place.
            </h1>
            <p className="mt-4 max-w-[48ch] text-base leading-7 text-muted-foreground">
              Here are a few things that would make it hers. Choose the one you would most like to
              give; we’ll make sure nobody doubles up.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {items.map((product, index) => (
              <GuestGivingCard
                key={product.id}
                product={product}
                index={index}
                claimed={claimed.includes(product.id)}
                onClaim={() => onClaim(product.id)}
              />
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="size-3.5" />
            Maya approved every item. Her address and private edits are never shown here.
          </p>
        </div>
        <aside className="border-2 border-foreground bg-highlight/60 p-5 lg:sticky lg:top-24">
          <p className="eyebrow text-emphasis">A note from {starter || "Jordan"}</p>
          <p className="mt-3 font-display text-2xl leading-tight">“{circleNote}”</p>
          <p className="mt-7 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            The small circle
          </p>
          <ul className="mt-3 space-y-2">
            {guests.map((guest, index) => (
              <li key={`${guest}-${index}`} className="flex items-center gap-2 text-sm">
                <span className="grid size-7 place-items-center rounded-full bg-background text-xs font-medium">
                  {guest.trim().slice(0, 1).toUpperCase()}
                </span>
                {guest}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-foreground/20 pt-4 text-xs leading-5 text-muted-foreground">
            No public page. No activity feed. Just a few people showing up for Maya.
          </p>
        </aside>
      </div>
      <button type="button" onClick={onRestart} className={`${quietButton} mt-8`}>
        <ArrowLeft className="size-4" />
        Start the sample again
      </button>
    </div>
  );
}

function GuestGivingCard({ product, index, claimed, onClaim }: GuestCardProps) {
  const [opening, setOpening] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <article className="flex flex-col overflow-hidden border-2 border-foreground bg-card">
      <ProductArt product={product} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-muted-foreground">
          {String(index + 1).padStart(2, "0")} · {product.brand}
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight">{product.name}</h2>
        <p className="mt-2 text-sm leading-6">{product.reason}</p>
        <div className="mt-4 flex items-center justify-between border-t border-foreground/15 pt-3 text-sm">
          <span className="text-muted-foreground">One thoughtful gift</span>
          <span className="font-medium">${product.price}</span>
        </div>
        <div className="mt-auto pt-4">
          {claimed ? (
            <p className="border-t border-foreground/15 pt-4 text-sm font-medium text-primary">
              Held for Maya. Thank you for showing up.
            </p>
          ) : saved ? (
            <div className="border-t border-foreground/15 pt-4">
              <p className="text-sm font-medium text-primary">You’re on it, {name || "friend"}.</p>
              {note ? <p className="mt-1 text-sm text-muted-foreground">“{note}”</p> : null}
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Sample preview only · No order was placed.
              </p>
            </div>
          ) : opening ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
                onClaim();
              }}
              className="border-t border-foreground/15 pt-4"
            >
              <label className="block text-xs font-medium" htmlFor={`gift-name-${product.id}`}>
                Who it is from
              </label>
              <input
                id={`gift-name-${product.id}`}
                required
                maxLength={60}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full border-2 border-foreground bg-background px-3 py-2 text-sm outline-none focus:bg-highlight"
              />
              <label className="mt-3 block text-xs font-medium" htmlFor={`gift-note-${product.id}`}>
                A line for Maya{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id={`gift-note-${product.id}`}
                rows={2}
                maxLength={180}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="For your first morning in."
                className="mt-2 w-full border-2 border-foreground bg-background px-3 py-2 text-sm outline-none focus:bg-highlight"
              />
              <button type="submit" className={`${button} mt-3 w-full`}>
                Hold this gift <ArrowRight className="size-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setOpening(true)}
              className={`${quietButton} w-full`}
            >
              I’d like to give this <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductTile({
  product,
  selected,
  onClick,
}: {
  product: Product;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-w-0 items-center gap-4 border-2 p-3 text-left transition-colors ${selected ? "border-foreground bg-card" : "border-foreground/25 bg-background opacity-60"}`}
    >
      <ProductArt product={product} compact />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-muted-foreground">{product.brand}</span>
        <span className="mt-1 block font-display text-xl leading-tight">{product.name}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{product.reason}</span>
        <span className="mt-2 block text-sm font-medium">${product.price}</span>
      </span>
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-foreground/40"}`}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
    </button>
  );
}

function ProductArt({ product, compact = false }: { product: Product; compact?: boolean }) {
  const Icon = brandIcon[product.kind];
  const color =
    product.kind === "candle"
      ? "bg-[#f0dfd6]"
      : product.kind === "aperitif"
        ? "bg-[#f1e8c9]"
        : product.kind === "frame"
          ? "bg-[#dce5dc]"
          : "bg-[#e2e0ed]";
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden ${compact ? `size-20 ${color}` : `aspect-[4/3] w-full ${color}`}`}
      aria-label={`${product.brand} ${product.name} illustration`}
    >
      {!compact ? (
        <span className="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          {product.brand}
        </span>
      ) : null}
      <div
        className={`grid place-items-center rounded-full border border-foreground/15 bg-background/60 ${compact ? "size-12" : "size-24 sm:size-28"}`}
      >
        <Icon className={compact ? "size-6" : "size-12"} strokeWidth={1.1} aria-hidden="true" />
      </div>
      {!compact ? (
        <span className="absolute bottom-4 right-4 font-display text-sm text-foreground/60">
          {product.name}
        </span>
      ) : null}
    </div>
  );
}

function DeliveryField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-medium">
      {label}
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-2 border-foreground bg-card px-3 py-2.5 text-sm outline-none focus:bg-highlight"
      />
    </label>
  );
}

function Scene({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow text-emphasis">{eyebrow}</p>
      <h1 className="mt-3 max-w-[19ch] font-display text-4xl leading-[1.02] sm:text-6xl">
        {title}
      </h1>
      <div className="mt-7">{children}</div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  EyeOff,
  LoaderCircle,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  Heart,
  LockKeyhole,
  Mail,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import kettleA from "@/assets/p-bright-citron-kettle-600.webp.asset.json";
import panA from "@/assets/p-cast-iron-pan-600.webp.asset.json";
import cleaningA from "@/assets/p-cleaning-help-600.webp.asset.json";
import mugA from "@/assets/p-cobalt-mug-600.webp.asset.json";
import lampA from "@/assets/p-cobalt-table-lamp-600.webp.asset.json";
import toolboxA from "@/assets/p-cobalt-toolbox-600.webp.asset.json";
import towelsA from "@/assets/p-cream-bath-towels-600.webp.asset.json";
import coffeeA from "@/assets/p-forest-coffee-maker-600.webp.asset.json";
import plantA from "@/assets/p-houseplant-600.webp.asset.json";
import blanketA from "@/assets/p-knit-blanket-600.webp.asset.json";
import mealA from "@/assets/p-meal-help.png.asset.json";
import movingA from "@/assets/p-moving-help-600.webp.asset.json";
import suitcaseA from "@/assets/p-terracotta-suitcase.webp.asset.json";
import candleA from "@/assets/p-terracotta-candle-600.webp.asset.json";

const candle = candleA.url;
const allPhotos = [
  kettleA,
  panA,
  cleaningA,
  mugA,
  lampA,
  toolboxA,
  towelsA,
  coffeeA,
  plantA,
  blanketA,
  mealA,
  movingA,
  suitcaseA,
  candleA,
].map((a) => a.url);
import { GiftRecommender } from "@/components/gift-recommender";
import type { Recommendation } from "@/lib/recommend.functions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "friend" | "maya" | "guest";
type FriendStep = "chapter" | "spark" | "edit" | "circle" | "sent";
type MayaStep = "review" | "delivery" | "approved";
type GuestStep = "landing" | "browse" | "claim" | "offlist" | "confirmed" | "gifted";
type GiftStatus = "Available" | "Claimed" | "Gifted";
type BrowseState = "ready" | "loading" | "empty" | "error";
type Band = "Easy yes" | "Considered" | "Practical" | "Group candidate";

type Item = {
  id: number;
  brand: string;
  name: string;
  price: number;
  band: Band;
  reason: string;
  image: string;
};

const items: Item[] = [
  {
    id: 1,
    brand: "CERAMICS",
    name: "Checkered candle",
    price: 34,
    band: "Easy yes",
    reason: "For making the first night smell like hers.",
    image: candleA.url,
  },
  {
    id: 2,
    brand: "STONEWARE",
    name: "Cobalt check mug",
    price: 38,
    band: "Easy yes",
    reason: "The heavy mug that quietly becomes the only one.",
    image: mugA.url,
  },
  {
    id: 3,
    brand: "PLANTS",
    name: "Pothos in a tile pot",
    price: 45,
    band: "Easy yes",
    reason: "Something alive in the empty room.",
    image: plantA.url,
  },
  {
    id: 4,
    brand: "KITCHEN",
    name: "Cast iron skillet",
    price: 65,
    band: "Considered",
    reason: "One pan that outlives every apartment after this one.",
    image: panA.url,
  },
  {
    id: 5,
    brand: "KITCHEN",
    name: "Citron kettle",
    price: 75,
    band: "Considered",
    reason: "Because boiling water should feel like a small win.",
    image: kettleA.url,
  },
  {
    id: 6,
    brand: "BATH",
    name: "Striped towel set",
    price: 96,
    band: "Considered",
    reason: "To retire the frayed towels from the last place.",
    image: towelsA.url,
  },
  {
    id: 7,
    brand: "TOOLS",
    name: "Cobalt toolbox",
    price: 140,
    band: "Practical",
    reason: "Nobody puts a toolbox on a bridal list. She needs one most.",
    image: toolboxA.url,
  },
  {
    id: 8,
    brand: "LIGHTING",
    name: "Cobalt dome lamp",
    price: 240,
    band: "Group candidate",
    reason: "Good light for the first night in, from everyone who loves her.",
    image: lampA.url,
  },
];

const bandLabels: Record<Band, string> = {
  "Easy yes": "$25 to $50",
  Considered: "$60 to $120",
  Practical: "$40 to $150",
  "Group candidate": "$200 to $400",
};

export function GoodChapterDemo({ initialView }: { initialView: View }) {
  const [view, setView] = useState<View>(initialView);
  const [friendStep, setFriendStep] = useState<FriendStep>("chapter");
  const [mayaStep, setMayaStep] = useState<MayaStep>("review");
  const [guestStep, setGuestStep] = useState<GuestStep>("landing");
  const [claimedIds, setClaimedIds] = useState(() => new Set([2, 5]));
  const [giftedIds] = useState(() => new Set([3]));
  const [kept, setKept] = useState(() => new Set(items.map((item) => item.id)));
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [guests, setGuests] = useState(["Leah Park", "Nina Shah", "Sam Rivera", "Jordan Lee"]);
  const [chapterItems, setChapterItems] = useState(items);

  const approvedItems = useMemo(
    () => chapterItems.filter((item) => kept.has(item.id)),
    [chapterItems, kept],
  );

  function useAiEdit(ideas: Recommendation[]) {
    const images = allPhotos;
    const nextItems: Item[] = ideas.map((idea, index) => ({
      id: index + 101,
      brand: idea.brand.toUpperCase(),
      name: idea.name,
      price: Number(idea.price.replace(/[^0-9.]/g, "")) || 0,
      band:
        index < 2
          ? "Easy yes"
          : index < 4
            ? "Considered"
            : index < 6
              ? "Practical"
              : "Group candidate",
      reason: idea.reason,
      image: images[index % images.length] ?? candle,
    }));
    setChapterItems(nextItems);
    setKept(new Set(nextItems.map((item) => item.id)));
    setFriendStep("edit");
  }

  function reset(next: View) {
    setView(next);
    setFriendStep("chapter");
    setMayaStep("review");
    setGuestStep("landing");
    setSelectedGift(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
        <div className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link to="/" className="font-display text-xl" aria-label="Good Chapter home">
            Good Chapter<span className="text-coral">.</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Product demo views">
            <DemoLink to="/new" active={view === "friend"} onClick={() => reset("friend")}>
              Friend
            </DemoLink>
            <DemoLink to="/approve" active={view === "maya"} onClick={() => reset("maya")}>
              Maya
            </DemoLink>
            <DemoLink to="/guest" active={view === "guest"} onClick={() => reset("guest")}>
              Guest
            </DemoLink>
          </nav>
          <span className="hidden font-medium text-[14px] text-muted-foreground sm:block">
            Sample UX
          </span>
        </div>
      </header>

      {view === "friend" && (
        <FriendFlow
          step={friendStep}
          setStep={setFriendStep}
          guests={guests}
          setGuests={setGuests}
          items={chapterItems}
          onUseAiEdit={useAiEdit}
        />
      )}
      {view === "maya" && (
        <MayaFlow
          step={mayaStep}
          setStep={setMayaStep}
          kept={kept}
          setKept={setKept}
          items={chapterItems}
        />
      )}
      {view === "guest" && (
        <GuestFlow
          step={guestStep}
          setStep={setGuestStep}
          selectedGift={selectedGift}
          setSelectedGift={setSelectedGift}
          items={approvedItems}
          claimedIds={claimedIds}
          setClaimedIds={setClaimedIds}
          giftedIds={giftedIds}
        />
      )}
    </main>
  );
}

function DemoLink({
  to,
  active,
  children,
  onClick,
}: {
  to: "/new" | "/approve" | "/guest";
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "rounded-sm px-3 py-2 text-sm font-semibold transition-colors duration-175",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function FriendFlow({
  step,
  setStep,
  guests,
  setGuests,
  items: chapterItems,
  onUseAiEdit,
}: {
  step: FriendStep;
  setStep: (step: FriendStep) => void;
  guests: string[];
  setGuests: (guests: string[]) => void;
  items: Item[];
  onUseAiEdit: (ideas: Recommendation[]) => void;
}) {
  if (step === "chapter") return <ChapterStep onContinue={() => setStep("spark")} />;
  if (step === "spark")
    return (
      <SparkStep
        onBack={() => setStep("chapter")}
        onContinue={() => setStep("edit")}
        onUseAiEdit={onUseAiEdit}
      />
    );
  if (step === "edit")
    return (
      <EditStep
        onBack={() => setStep("spark")}
        onContinue={() => setStep("circle")}
        items={chapterItems}
      />
    );
  if (step === "circle")
    return (
      <CircleStep
        guests={guests}
        setGuests={setGuests}
        onBack={() => setStep("edit")}
        onContinue={() => setStep("sent")}
      />
    );
  return <SentStep onGuest={() => setStep("chapter")} />;
}

function ChapterStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-16">
      <StepHeader
        number="01"
        eyebrow="Start a chapter"
        title={
          <>
            What is Maya
            <br />
            <em>stepping into?</em>
          </>
        }
        copy="You start it. Maya approves it privately. Then it comes from you. Never her."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <button
          onClick={onContinue}
          className="group relative min-h-64 overflow-hidden rounded-sm border-2 border-foreground bg-secondary p-6 text-left  transition-transform hover:-translate-y-1 md:col-span-2"
        >
          <div className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-foreground text-background">
            <Check className="size-5" />
          </div>
          <span className="text-[13px] font-medium">Home · Selected</span>
          <h2 className="mt-16 font-display text-5xl md:text-7xl">First Place</h2>
          <p className="mt-4 max-w-lg text-base">
            The first home that is entirely hers. No wedding, no shower, no reason not to celebrate
            it.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm font-bold">
            Choose this chapter{" "}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          {["Moving in", "Starting over"].map((chapter) => (
            <button
              key={chapter}
              className="rounded-sm border border-border bg-card p-5 text-left transition hover:border-foreground"
            >
              <span className="text-[13px] font-medium text-muted-foreground">Home</span>
              <h3 className="mt-8 font-display text-2xl">{chapter}</h3>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={onContinue}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

const sparkPrompts = [
  {
    q: "What's Maya's most unhinged-but-correct opinion?",
    a: "Candles are a food group. Also, overhead lighting is a crime.",
  },
  {
    q: "What does she do the second she gets home?",
    a: "Shoes off, record on, something bubbly in a real glass.",
  },
  {
    q: "What's the dish she'd make to impress someone?",
    a: "A very serious shakshuka. She owns zero good pans.",
  },
  {
    q: "What's on the wall she keeps talking about?",
    a: "Nothing yet. She has a folder of photos from her trip to Lisbon.",
  },
  {
    q: "If her new place had a theme song, what would it be?",
    a: "Something by Fleetwood Mac, loud, with the windows open.",
  },
];

const tailoredReasons: Record<number, string> = {
  1: "Because overhead lighting is a crime, and you know she agrees.",
  2: "For the shoes-off, something-bubbly ritual, now in a real glass.",
  3: "For the one Lisbon photo that finally leaves the folder.",
  4: "Candles are a food group. This is a balanced diet.",
  5: "For Fleetwood Mac, windows open, friends on the floor.",
  6: "For the blank wall. Lisbon, part two and three.",
  7: "For the very serious shakshuka. It deserves a good pan.",
  8: "The pans she's never owned, from everyone who's eaten her shakshuka.",
};

function SparkStep({
  onBack,
  onContinue,
  onUseAiEdit,
}: {
  onBack: () => void;
  onContinue: () => void;
  onUseAiEdit: (ideas: Recommendation[]) => void;
}) {
  const [answers, setAnswers] = useState(() => sparkPrompts.map((p) => p.a));
  const [tailoring, setTailoring] = useState(false);
  const tailor = () => {
    setTailoring(true);
    window.setTimeout(onContinue, 1400);
  };
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
      <FlowTop onBack={onBack} label="First Place · About Maya" />
      <div className="mt-10 grid gap-10 md:grid-cols-[.85fr_1.15fr]">
        <div>
          <p className="eyebrow">The fun part</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">
            Tell us something <em>only you’d know.</em>
          </h1>
          <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
            Silly counts. Specific is better. We use your answers to tailor the eight ideas and the
            reasons behind them. Maya never sees this.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-secondary px-4 py-3 text-sm font-semibold">
            <EyeOff className="size-4" /> Just between you and Good Chapter.
          </div>
        </div>
        <div className="border-t-2 border-foreground pt-5">
          <div className="space-y-6">
            {sparkPrompts.map((p, i) => (
              <label key={p.q} className="block">
                <span className="font-medium text-[13px] text-muted-foreground">
                  Question {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block font-display text-2xl leading-tight">{p.q}</span>
                <textarea
                  value={answers[i]}
                  onChange={(e) =>
                    setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))
                  }
                  rows={2}
                  className="mt-2 w-full resize-none border-2 border-input bg-background p-3 text-sm outline-none focus:border-foreground"
                />
              </label>
            ))}
          </div>
          <Button size="lg" className="mt-8 w-full" onClick={tailor} disabled={tailoring}>
            {tailoring ? (
              <>
                <LoaderCircle className="size-4 animate-spin" /> Reading between the lines…
              </>
            ) : (
              <>
                Tailor the edit for Maya <ArrowRight className="size-4" />
              </>
            )}
          </Button>
          <button
            onClick={onContinue}
            className="mt-3 w-full text-center text-sm font-semibold underline underline-offset-4"
          >
            Skip for now
          </button>
        </div>
      </div>
      <div className="mt-14">
        <GiftRecommender onUseIdeas={onUseAiEdit} />
      </div>
    </div>
  );
}

function EditStep({
  onBack,
  onContinue,
  items: chapterItems,
}: {
  onBack: () => void;
  onContinue: () => void;
  items: Item[];
}) {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-14">
      <FlowTop onBack={onBack} label="First Place · 2 of 3" />
      <div className="mt-9 flex flex-col justify-between gap-5 border-b border-foreground pb-8 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Eight things · Four price bands</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">The edit for Maya.</h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Tailored from what you told us. Candles, shakshuka, Lisbon, Fleetwood Mac. Each one has a
          reason, so nobody has to guess why it belongs.
        </p>
      </div>
      <BandSummary />
      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {chapterItems.map((item) => (
          <ProductCard
            key={item.id}
            item={{ ...item, reason: tailoredReasons[item.id] ?? item.reason }}
            mode="edit"
          />
        ))}
      </div>
      <div className="sticky bottom-4 mt-12 flex items-center justify-between rounded-sm border border-foreground bg-foreground p-3 pl-5 text-background ">
        <div>
          <p className="text-sm font-bold">8 of 8 selected</p>
          <p className="hidden text-xs text-background/65 sm:block">
            The mix is balanced across all four price bands.
          </p>
        </div>
        <Button variant="default" size="lg" onClick={onContinue}>
          Add her people <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function BandSummary() {
  const summaries = [
    ["3", "Easy yes", "$25 to $50"],
    ["3", "Considered", "$60 to $120"],
    ["1", "Practical", "$40 to $150"],
    ["1", "Group", "$200 to $400"],
  ];
  return (
    <div className="mt-5 grid grid-cols-2 border border-border md:grid-cols-4">
      {summaries.map(([count, label, range]) => (
        <div
          key={label}
          className="flex items-center gap-3 border-b border-r border-border p-4 last:border-r-0 md:border-b-0"
        >
          <span className="font-display text-3xl">{count}</span>
          <div>
            <p className="text-[13px] font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{range}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CircleStep({
  guests,
  setGuests,
  onBack,
  onContinue,
}: {
  guests: string[];
  setGuests: (guests: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [name, setName] = useState("");
  const addGuest = () => {
    if (name.trim()) {
      setGuests([...guests, name.trim()]);
      setName("");
    }
  };
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
      <FlowTop onBack={onBack} label="First Place · 3 of 3" />
      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="eyebrow">Guest circle</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            Who should
            <br />
            <em>hear from you?</em>
          </h1>
          <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
            Start with the people who already said “let me know.” Maya can add names privately
            before anything goes out.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-secondary px-4 py-3 text-sm font-semibold">
            <EyeOff className="size-4" /> Names and emails stay private.
          </div>
        </div>
        <div className="border-t-2 border-foreground pt-5">
          <label htmlFor="guest-name" className="text-[13px] font-medium">
            Add a person
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="guest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addGuest();
              }}
              placeholder="Name"
              className="h-12 min-w-0 flex-1 border border-input bg-background px-4 outline-none focus:border-foreground"
            />
            <Button size="icon" onClick={addGuest} aria-label="Add guest">
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {guests.map((guest, index) => (
              <div key={`${guest}-${index}`} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                    {guest
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{guest}</p>
                    <p className="text-xs text-muted-foreground">Email added</p>
                  </div>
                </div>
                <button
                  onClick={() => setGuests(guests.filter((_, i) => i !== index))}
                  aria-label={`Remove ${guest}`}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{guests.length}</strong> people in Maya’s circle
            </p>
            <Button size="lg" onClick={onContinue}>
              Send to Maya <Mail className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SentStep({ onGuest }: { onGuest: () => void }) {
  return (
    <CenteredSuccess
      icon={<Mail className="size-8" />}
      eyebrow="Sent privately"
      title="Maya has the first say."
      copy="She’ll keep or cut anything, add delivery details, and approve. You’ll never see what changed."
      action="Back to start"
      onAction={onGuest}
    />
  );
}

function MayaFlow({
  step,
  setStep,
  kept,
  setKept,
  items: chapterItems,
}: {
  step: MayaStep;
  setStep: (step: MayaStep) => void;
  kept: Set<number>;
  setKept: (value: Set<number>) => void;
  items: Item[];
}) {
  if (step === "approved")
    return (
      <CenteredSuccess
        icon={<Check className="size-8" />}
        eyebrow="Approved"
        title="That’s it. Leah takes it from here."
        copy="Your address stays private. Leah will send the chapter, and you won’t need to ask anyone for a thing."
        action="Review again"
        onAction={() => setStep("review")}
      />
    );
  if (step === "delivery")
    return (
      <DeliveryStep
        onBack={() => setStep("review")}
        onApprove={() => setStep("approved")}
        count={kept.size}
      />
    );
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-14">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Private for Maya</p>
        <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <LockKeyhole className="size-4" /> Leah won’t see your edits
        </span>
      </div>
      <div className="mt-9 grid gap-8 border-b border-foreground pb-9 md:grid-cols-[1fr_400px] md:items-end">
        <h1 className="font-display text-5xl md:text-7xl">
          Leah picked these
          <br />
          <em>with you in mind.</em>
        </h1>
        <div>
          <p className="leading-7 text-muted-foreground">
            Keep what feels right. Cut anything that doesn’t. No explanation, no awkwardness, no one
            notified.
          </p>
          <div className="mt-4 h-1 bg-secondary">
            <div
              className="h-full bg-secondary"
              style={{ width: `${(kept.size / items.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] font-medium">
            {kept.size} of {items.length} kept
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {chapterItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            mode="review"
            active={kept.has(item.id)}
            onToggle={() => {
              const next = new Set(kept);
              if (next.has(item.id)) next.delete(item.id);
              else next.add(item.id);
              setKept(next);
            }}
          />
        ))}
      </div>
      <div className="sticky bottom-4 mt-12 flex items-center justify-between rounded-sm border border-foreground bg-foreground p-3 pl-5 text-background ">
        <p className="text-sm font-bold">Looks right? One step left.</p>
        <Button
          variant="default"
          size="lg"
          onClick={() => setStep("delivery")}
          disabled={kept.size === 0}
        >
          Delivery details <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function DeliveryStep({
  onBack,
  onApprove,
  count,
}: {
  onBack: () => void;
  onApprove: () => void;
  count: number;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-10 md:py-14">
      <FlowTop onBack={onBack} label="Private approval · 2 of 2" />
      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="eyebrow">Delivery</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">
            Where should
            <br />
            <em>the good things land?</em>
          </h1>
          <div className="mt-8 flex gap-3 border-t border-border pt-5">
            <LockKeyhole className="mt-1 size-4 shrink-0" />
            <p className="text-sm leading-6 text-muted-foreground">
              Only Good Chapter and the fulfilling brand receive your address. Guests and Leah never
              see it.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onApprove();
          }}
          className="grid gap-4 border-t-2 border-foreground pt-5"
        >
          <Field label="Full name" value="Maya Ellison" />
          <Field label="Street address" value="48 Willow Street" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value="Brooklyn" />
            <Field label="ZIP" value="11231" />
          </div>
          <div className="mt-4 border border-border bg-secondary p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{count} things approved</span>
              <CheckCircle2 className="size-5 text-success" />
            </div>
          </div>
          <Button type="submit" variant="default" size="lg" className="mt-2 w-full">
            Approve this chapter <Check className="size-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            That’s click two. Nothing is sent from you.
          </p>
        </form>
      </div>
    </div>
  );
}

function GuestFlow({
  step,
  setStep,
  selectedGift,
  setSelectedGift,
  items: visibleItems,
  claimedIds,
  setClaimedIds,
  giftedIds,
}: {
  step: GuestStep;
  setStep: (step: GuestStep) => void;
  selectedGift: number | null;
  setSelectedGift: (id: number | null) => void;
  items: Item[];
  claimedIds: Set<number>;
  setClaimedIds: (ids: Set<number>) => void;
  giftedIds: Set<number>;
}) {
  const [browseState, setBrowseState] = useState<BrowseState>("ready");
  const [filter, setFilter] = useState("All ideas");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);
  const gift = visibleItems.find((item) => item.id === selectedGift);
  const statuses = (id: number): GiftStatus =>
    giftedIds.has(id) ? "Gifted" : claimedIds.has(id) ? "Claimed" : "Available";
  const claimGift = () => {
    if (!gift) return;
    setClaimedIds(new Set([...claimedIds, gift.id]));
    setStep("confirmed");
  };

  if (step === "landing")
    return (
      <GuestLanding
        claimed={claimedIds.size + giftedIds.size}
        onBrowse={() => setStep("browse")}
        onOffList={() => setStep("offlist")}
      />
    );
  if (step === "claim" && gift)
    return <ClaimStep gift={gift} onBack={() => setStep("browse")} onClaim={claimGift} />;
  if (step === "offlist")
    return <OffListStep onBack={() => setStep("landing")} onSubmit={() => setStep("confirmed")} />;
  if (step === "confirmed")
    return (
      <ClaimConfirmed
        gift={gift}
        onBrowse={() => {
          setSelectedGift(null);
          setStep("browse");
        }}
        onGifted={() => setStep("gifted")}
      />
    );
  if (step === "gifted") return <GiftedState onBrowse={() => setStep("browse")} />;

  const filtered = visibleItems.filter((item) => {
    if (filter === "Under $50") return item.price < 50;
    if (filter === "Kitchen") return [2, 5, 7, 8].includes(item.id);
    if (filter === "Getting settled") return [1, 3, 4, 6].includes(item.id);
    return true;
  });

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6 md:px-10 md:py-12">
      <GuestTop onBack={() => setStep("landing")} label="Sam’s First Place" />
      <div className="mt-8 border-b-2 border-foreground pb-7 md:flex md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Approved by Sam · Shared by Jules</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[.95] md:text-7xl">
            A few useful things
            <br className="hidden sm:block" /> for the new place.
          </h1>
        </div>
        <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground md:mt-0">
          Claiming simply keeps the group from doubling up. Purchase wherever you like.
        </p>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Gift filters">
        {["All ideas", "Under $50", "Kitchen", "Getting settled"].map((name) => (
          <Button
            key={name}
            variant={filter === name ? "ink" : "outline"}
            size="sm"
            onClick={() => {
              setFilter(name);
              setBrowseState("ready");
            }}
          >
            {name}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-y border-border py-3 text-xs font-medium">
        <span>
          {visibleItems.length} ideas · {claimedIds.size + giftedIds.size} already claimed
        </span>
        <button
          className="text-muted-foreground underline underline-offset-4"
          onClick={() =>
            setBrowseState(
              browseState === "ready"
                ? "loading"
                : browseState === "loading"
                  ? "empty"
                  : browseState === "empty"
                    ? "error"
                    : "ready",
            )
          }
        >
          Preview states
        </button>
      </div>
      {browseState === "loading" && (
        <GuestSystemState
          icon={<LoaderCircle className="size-6 animate-spin" />}
          title="Gathering Sam’s list"
          copy="One quiet moment while the latest claims are checked."
        />
      )}
      {browseState === "empty" && (
        <GuestSystemState
          title="Nothing matches that filter"
          copy="Try all ideas, or bring something only you would think of."
          action="Show all ideas"
          onAction={() => {
            setFilter("All ideas");
            setBrowseState("ready");
          }}
        />
      )}
      {browseState === "error" && (
        <GuestSystemState
          icon={<CircleAlert className="size-6" />}
          title="The list didn’t load"
          copy="No claim was changed. Try again when you’re ready."
          action="Try again"
          onAction={() => setBrowseState("ready")}
        />
      )}
      {browseState === "ready" && filtered.length > 0 && (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ClaimCard
              key={item.id}
              item={item}
              status={statuses(item.id)}
              onClaim={() => {
                setSelectedGift(item.id);
                setStep("claim");
              }}
            />
          ))}
        </div>
      )}
      <div className="mt-12 border-t-2 border-foreground py-7 text-center">
        <p className="font-display text-2xl">Have another idea?</p>
        <button
          onClick={() => setStep("offlist")}
          className="mt-2 text-sm font-semibold underline underline-offset-4"
        >
          Bring something off-list
        </button>
      </div>
    </div>
  );
}

function GuestLanding({
  claimed,
  onBrowse,
  onOffList,
}: {
  claimed: number;
  onBrowse: () => void;
  onOffList: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-7 sm:px-6 md:px-10 md:py-14">
      <div className="flex items-center justify-between border-b-2 border-foreground pb-4">
        <span className="font-medium text-[13px]">Private Chapter · First Place</span>
        <span className="flex items-center gap-2 font-medium text-[13px]">
          <LockKeyhole className="size-3" /> Small circle
        </span>
      </div>
      <section className="grid gap-10 py-10 md:grid-cols-[1.35fr_.65fr] md:py-16">
        <div>
          <p className="eyebrow">From Jules · Approved by Sam</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[.92] sm:text-7xl md:text-8xl">
            Sam has a new front door. <em>Let’s help make it feel like home.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 md:text-lg">
            Jules put together a small, private Good Chapter for Sam’s first home. Sam approved
            every part of it. Choose something useful, bring something personal, or simply send your
            love.
          </p>
        </div>
        <aside className="self-end border-t-2 border-foreground pt-5">
          <p className="font-medium text-[13px]">A note from Jules</p>
          <blockquote className="mt-4 font-display text-3xl leading-tight">
            “Sam made this happen on her own. I’d love for the first few weeks to feel held by all
            of us.”
          </blockquote>
          <p className="mt-5 text-sm font-semibold">
            Shared with a small circle of people who care about Sam.
          </p>
        </aside>
      </section>
      <section className="border-2 border-foreground md:grid md:grid-cols-[.7fr_1.3fr]">
        <div className="bg-emphasis p-5 text-emphasis-foreground md:p-7">
          <p className="font-medium text-[13px]">Chapter status</p>
          <p className="mt-3 font-display text-3xl">8 ideas · {claimed} already claimed</p>
        </div>
        <div className="p-5 md:p-7">
          <p className="text-sm leading-6">
            Claiming an idea helps the group avoid duplicates. You can purchase it anywhere you
            like. Good Chapter coordinates the choice. Not the money, not the order.
          </p>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button size="lg" onClick={onBrowse}>
              See what Sam needs <ArrowRight className="size-4" />
            </Button>
            <button
              onClick={onOffList}
              className="text-sm font-semibold underline underline-offset-4"
            >
              I’d rather bring something off-list
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ClaimCard({
  item,
  status,
  onClaim,
}: {
  item: Item;
  status: GiftStatus;
  onClaim: () => void;
}) {
  const unavailable = status !== "Available";
  return (
    <article className={cn("border-2 border-foreground bg-card", unavailable && "bg-secondary")}>
      <div className="relative">
        <img
          src={item.image}
          alt=""
          width={816}
          height={816}
          className={cn("aspect-[4/3] w-full object-cover", unavailable && "grayscale opacity-60")}
        />
        <span
          className={cn(
            "absolute left-3 top-3 border border-foreground px-2 py-1 font-medium text-[13px]",
            status === "Available"
              ? "bg-background"
              : status === "Gifted"
                ? "bg-emphasis text-emphasis-foreground"
                : "bg-foreground text-background",
          )}
        >
          {status}
        </span>
      </div>
      <div className="border-t-2 border-foreground p-4">
        <h2 className="font-display text-3xl leading-none">{item.name}</h2>
        <p className="mt-3 min-h-10 text-sm leading-5">{item.reason}</p>
        <p className="mt-4 font-medium text-[13px] text-muted-foreground">
          Usually around {bandLabels[item.band]}
        </p>
        {unavailable ? (
          <div className="mt-4 flex h-11 items-center gap-2 border-t border-border pt-3 text-sm font-semibold">
            <Check className="size-4" />{" "}
            {status === "Claimed" ? "Someone has this covered" : "Already given"}
          </div>
        ) : (
          <Button className="mt-4 w-full" onClick={onClaim}>
            Claim this <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </article>
  );
}

function ClaimStep({
  gift,
  onBack,
  onClaim,
}: {
  gift: Item;
  onBack: () => void;
  onClaim: () => void;
}) {
  const [method, setMethod] = useState("housewarming");
  const methods: Array<[string, string]> = [
    ["housewarming", "I’ll bring it to the housewarming"],
    ["ship", "I’ll ship it directly"],
    ["starter", "I’m coordinating with Jules"],
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 md:px-10 md:py-12">
      <GuestTop onBack={onBack} label="Private gift claim" />
      <div className="mt-8 grid gap-8 md:grid-cols-[.72fr_1.28fr]">
        <div>
          <img
            src={gift.image}
            alt=""
            className="aspect-[4/3] w-full border-2 border-foreground object-cover"
          />
          <p className="mt-4 font-medium text-[13px]">Usually around {bandLabels[gift.band]}</p>
          <h1 className="mt-2 font-display text-4xl">{gift.name}</h1>
          <p className="mt-3 text-sm leading-6">{gift.reason}</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onClaim();
          }}
          className="border-t-2 border-foreground pt-6"
        >
          <p className="eyebrow">You’ve got it.</p>
          <h2 className="mt-3 font-display text-5xl">Make the claim.</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Claiming lets everyone else know Sam is covered. Buy it wherever works for you, then
            bring it by or send it when you’re ready.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <InputField label="Your name" placeholder="Your name" required />
            <InputField label="Email or phone" placeholder="For claim coordination" required />
          </div>
          <label className="mt-4 block font-medium text-[13px]">
            Any delivery details or questions?
            <textarea className="mt-2 h-24 w-full resize-none border-2 border-input bg-background p-3 font-sans text-sm normal-case outline-none focus:border-foreground" />
          </label>
          <fieldset className="mt-5">
            <legend className="font-medium text-[13px]">How will it get there?</legend>
            <div className="mt-2 divide-y divide-border border-y border-border">
              {methods.map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-3 py-3 text-sm">
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={method === value}
                    onChange={() => setMethod(value)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <GuestSpark />
          <Button type="submit" size="lg" className="mt-6 w-full">
            Claim {gift.name}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            This is not a purchase through Good Chapter. We’ll only use your details to coordinate
            this gift.
          </p>
        </form>
      </div>
    </div>
  );
}

const guestPrompts = [
  "One thing about Sam only you’d know?",
  "Your favorite Sam story, in one line?",
  "What should Sam do first in the new place?",
  "The most Sam thing Sam has ever said?",
];

function GuestSpark() {
  const [i, setI] = useState(0);
  return (
    <div className="mt-5 border-2 border-foreground p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-[13px]">Optional · For your note to Sam</p>
          <p className="mt-1 font-display text-xl leading-tight">{guestPrompts[i]}</p>
        </div>
        <button
          type="button"
          onClick={() => setI((i + 1) % guestPrompts.length)}
          className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Try another question"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
      <textarea
        rows={2}
        placeholder="Silly is welcome."
        className="mt-3 w-full resize-none border-2 border-input bg-background p-3 text-sm outline-none focus:border-foreground"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Tucked in with your gift. Sam never has to reply.
      </p>
    </div>
  );
}

function OffListStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 md:px-10 md:py-12">
      <GuestTop onBack={onBack} label="Your own idea" />
      <div className="mt-10 grid gap-10 md:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Equally welcome</p>
          <h1 className="mt-4 font-display text-6xl leading-[.95]">
            Bringing your own idea? <em>Perfect.</em>
          </h1>
          <p className="mt-6 leading-7 text-muted-foreground">
            Useful gifts are only one way to show up. You might bring a meal, a plant, moving-day
            help, a favorite local spot, or something only you would think of.
          </p>
          <div className="mt-8 bg-emphasis p-5 text-emphasis-foreground">
            <p className="font-medium text-[13px]">No amount needed</p>
            <p className="mt-2 font-display text-2xl">
              The group will simply see “Off-list gift” as claimed.
            </p>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="border-t-2 border-foreground pt-6"
        >
          <InputField
            label="What are you thinking of bringing?"
            placeholder="A meal for moving night"
            required
          />
          <div className="mt-4">
            <InputField label="Your name" placeholder="Your name" required />
          </div>
          <label className="mt-4 block font-medium text-[13px]">
            Optional note for Jules
            <textarea className="mt-2 h-28 w-full resize-none border-2 border-input bg-background p-3 font-sans text-sm normal-case outline-none focus:border-foreground" />
          </label>
          <GuestSpark />
          <Button type="submit" size="lg" className="mt-6 w-full">
            Let the group know
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Only Jules uses these details to coordinate. Sam won’t be asked to respond.
          </p>
        </form>
      </div>
    </div>
  );
}

function ClaimConfirmed({
  gift,
  onBrowse,
  onGifted,
}: {
  gift: Item | undefined;
  onBrowse: () => void;
  onGifted: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="w-full border-t-2 border-foreground pt-7">
        <PackageCheck className="size-10" />
        <p className="eyebrow mt-7">Claim recorded</p>
        <h1 className="mt-3 font-display text-6xl">You’ve got it.</h1>
        <p className="mt-5 max-w-xl text-base leading-7">
          {gift ? `${gift.name} is now marked Claimed. ` : "Your off-list gift is now noted. "}
          There’s no purchase here and nothing else you need to report.
        </p>
        <div className="mt-8 border-y border-border py-5">
          <button className="flex items-center gap-3 text-sm font-semibold">
            <MapPin className="size-4" /> Want the delivery address?
          </button>
          <button className="mt-4 flex items-center gap-3 text-sm font-semibold">
            <MessageCircle className="size-4" /> Message Jules
          </button>
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button size="lg" onClick={onBrowse}>
            Back to Sam’s Chapter
          </Button>
          {gift && (
            <button
              onClick={onGifted}
              className="text-sm font-semibold underline underline-offset-4"
            >
              Preview gifted state
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GiftedState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="w-full border-t-2 border-foreground pt-7">
        <Heart className="size-10" />
        <p className="eyebrow mt-7">A good thing, given</p>
        <h1 className="mt-3 font-display text-6xl leading-[.95]">
          Thank you for helping make this new place feel more like Sam’s.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-7">
          Good Chapter is here to make showing up easier. Never to make anyone ask.
        </p>
        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button size="lg">
            Send Sam a note <MessageCircle className="size-4" />
          </Button>
          <button onClick={onBrowse} className="text-sm font-semibold underline underline-offset-4">
            Return to the Chapter
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestSystemState({
  icon,
  title,
  copy,
  action,
  onAction,
}: {
  icon?: React.ReactNode;
  title: string;
  copy: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="my-12 border-2 border-foreground p-8 text-center">
      <div className="mx-auto flex size-10 items-center justify-center">{icon}</div>
      <h2 className="mt-3 font-display text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{copy}</p>
      {action && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {action} <RotateCcw className="size-4" />
        </Button>
      )}
    </div>
  );
}

function GuestTop({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="size-4" /> Back
      </Button>
      <span className="font-medium text-[13px]">{label}</span>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  required = false,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block font-medium text-[13px]">
      {label}
      <input
        required={required}
        placeholder={placeholder}
        className="mt-2 h-12 w-full border-2 border-input bg-background px-3 font-sans text-sm normal-case outline-none focus:border-foreground"
      />
    </label>
  );
}

function ProductCard({
  item,
  mode,
  active = true,
  onToggle,
}: {
  item: Item;
  mode: "edit" | "review";
  active?: boolean;
  onToggle?: () => void;
}) {
  return (
    <article className={cn("group", !active && "opacity-45")}>
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 bg-background px-2 py-1 text-[13px] font-medium">
          {item.band} · {bandLabels[item.band]}
        </span>
        {mode === "review" && (
          <button
            onClick={onToggle}
            className={cn(
              "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground",
            )}
            aria-label={active ? `Cut ${item.name}` : `Keep ${item.name}`}
          >
            {active ? <Check className="size-4" /> : <Plus className="size-4" />}
          </button>
        )}
      </div>
      <div className="border-t border-foreground pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">{item.brand}</p>
            <h3 className="mt-1 font-display text-2xl">{item.name}</h3>
          </div>
          <span className="font-display text-2xl">${item.price}</span>
        </div>
        <p className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground">{item.reason}</p>
        {mode === "edit" && (
          <button className="mt-4 flex items-center gap-2 text-[13px] font-medium">
            <CheckCircle2 className="size-4 text-success" /> Selected
          </button>
        )}
        {mode === "review" && (
          <button
            onClick={onToggle}
            className="mt-4 flex items-center gap-2 text-[13px] font-medium"
          >
            {active ? (
              <>
                <X className="size-4" /> Cut privately
              </>
            ) : (
              <>
                <Plus className="size-4" /> Put it back
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

function StepHeader({
  number,
  eyebrow,
  title,
  copy,
}: {
  number: string;
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
}) {
  return (
    <div className="grid gap-7 border-b border-foreground pb-10 md:grid-cols-[100px_1fr_360px] md:items-end">
      <span className="font-display text-5xl text-muted-foreground">{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">{title}</h1>
      </div>
      <p className="max-w-sm leading-7 text-muted-foreground">{copy}</p>
    </div>
  );
}

function FlowTop({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium">
        <ArrowLeft className="size-4" /> Back
      </button>
      <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-[13px] font-medium">
      {label}
      <input
        defaultValue={value}
        className="mt-2 h-12 w-full border border-input bg-background px-4 text-sm font-normal normal-case outline-none focus:border-foreground"
      />
    </label>
  );
}

function CenteredSuccess({
  icon,
  eyebrow,
  title,
  copy,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  copy: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-16">
      <div className="max-w-2xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
          {icon}
        </div>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-muted-foreground">{copy}</p>
        <Button variant="outline" size="lg" className="mt-10" onClick={onAction}>
          {action} <Sparkles className="size-4" />
        </Button>
      </div>
    </div>
  );
}

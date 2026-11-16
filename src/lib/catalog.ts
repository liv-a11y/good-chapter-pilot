// Curated Good Chapter catalog. Pure data (no images) so it is safe to import on the server.

export type SegmentId = "first-place" | "fresh-start" | "the-pivot" | "the-pause";
export type TierId = "easy-yes" | "considered" | "foundation" | "group";

export const segments: { id: SegmentId; name: string; blurb: string }[] = [
  {
    id: "first-place",
    name: "First Place",
    blurb: "A first home or first apartment, bought or signed alone.",
  },
  { id: "fresh-start", name: "Fresh Start", blurb: "A divorce, breakup, or clean-slate move." },
  {
    id: "the-pivot",
    name: "The Pivot",
    blurb: "Quitting, founding, freelancing, or a brave career turn.",
  },
  {
    id: "the-pause",
    name: "The Pause",
    blurb: "A sabbatical, big birthday, recovery, or long-earned reset.",
  },
];

export const tiers: { id: TierId; name: string; range: string }[] = [
  { id: "easy-yes", name: "Easy yes", range: "$25 to $50" },
  { id: "considered", name: "Considered", range: "$60 to $120" },
  { id: "foundation", name: "Practical foundation", range: "$120 to $250" },
  { id: "group", name: "Group splurge", range: "$250 to $500" },
];

export type ImageKey =
  "candle" | "aperitif" | "frame" | "cookware" | "pottery" | "lamp" | "throw" | "bench";

export type CatalogItem = {
  id: string;
  brand: string;
  name: string;
  price: number;
  tier: TierId;
  segments: SegmentId[];
  reason: string;
  image: ImageKey;
};

const all: SegmentId[] = ["first-place", "fresh-start", "the-pivot", "the-pause"];

export const catalog: CatalogItem[] = [
  // Easy yes
  {
    id: "ghia-duo",
    brand: "Ghia",
    name: "First Sip Duo",
    price: 48,
    tier: "easy-yes",
    segments: all,
    reason: "For a proper toast without the Tuesday hangover.",
    image: "aperitif",
  },
  {
    id: "otherland-candle",
    brand: "Otherland",
    name: "Core scented candle",
    price: 36,
    tier: "easy-yes",
    segments: ["first-place", "fresh-start", "the-pause"],
    reason: "For making a strange room smell like yours.",
    image: "candle",
  },
  {
    id: "brightland-capsule",
    brand: "Brightland",
    name: "Olive oil capsule",
    price: 42,
    tier: "easy-yes",
    segments: ["first-place", "fresh-start"],
    reason: "Because good oil turns takeout into dinner.",
    image: "aperitif",
  },
  {
    id: "fishwife-pack",
    brand: "Fishwife",
    name: "Tinned fish 3-pack",
    price: 39,
    tier: "easy-yes",
    segments: ["first-place", "the-pivot"],
    reason: "Emergency dinner for the week before the boxes are unpacked.",
    image: "cookware",
  },
  {
    id: "eastfork-mug",
    brand: "East Fork",
    name: "The Mug",
    price: 42,
    tier: "easy-yes",
    segments: all,
    reason: "The one heavy mug that quietly becomes the only one.",
    image: "pottery",
  },
  {
    id: "poketo-planner",
    brand: "Poketo",
    name: "Undated planner",
    price: 32,
    tier: "easy-yes",
    segments: ["the-pivot", "fresh-start"],
    reason: "For plotting the next year strictly on your own terms.",
    image: "frame",
  },
  {
    id: "hay-candlesticks",
    brand: "HAY",
    name: "Glass candlestick pair",
    price: 35,
    tier: "easy-yes",
    segments: ["first-place", "the-pause"],
    reason: "To make an ordinary Tuesday feel like a dinner party.",
    image: "candle",
  },
  {
    id: "framebridge-tabletop",
    brand: "Framebridge",
    name: "Tabletop frame",
    price: 49,
    tier: "easy-yes",
    segments: all,
    reason: "For the photo that proves you actually did this.",
    image: "frame",
  },

  // Considered
  {
    id: "framebridge-custom",
    brand: "Framebridge",
    name: "Custom frame, medium",
    price: 99,
    tier: "considered",
    segments: ["first-place", "the-pivot"],
    reason: "For the print that's been leaning on the floor since March.",
    image: "frame",
  },
  {
    id: "fellow-kettle",
    brand: "Fellow",
    name: "Stagg EKG kettle",
    price: 110,
    tier: "considered",
    segments: ["first-place", "the-pivot", "the-pause"],
    reason: "Because boiling water shouldn't look like office hardware.",
    image: "cookware",
  },
  {
    id: "dusen-towels",
    brand: "Dusen Dusen",
    name: "Bath towel set",
    price: 96,
    tier: "considered",
    segments: ["fresh-start", "first-place"],
    reason: "To retire the frayed towels from your last life.",
    image: "throw",
  },
  {
    id: "material-knife",
    brand: "Material Kitchen",
    name: 'The 8" knife',
    price: 85,
    tier: "considered",
    segments: ["first-place", "fresh-start"],
    reason: "One sharp knife beats a drawer of dull ones.",
    image: "cookware",
  },
  {
    id: "hasami-teapot",
    brand: "Hasami Porcelain",
    name: "Teapot",
    price: 90,
    tier: "considered",
    segments: ["the-pause", "fresh-start"],
    reason: "For quiet 7am rituals before anyone needs anything.",
    image: "pottery",
  },
  {
    id: "otherland-trio",
    brand: "Otherland",
    name: "Three candle set",
    price: 89,
    tier: "considered",
    segments: ["first-place", "fresh-start"],
    reason: "A different mood for every room, including the one you cry in.",
    image: "candle",
  },
  {
    id: "greatjones-hotdish",
    brand: "Great Jones",
    name: "Hot Dish casserole",
    price: 95,
    tier: "considered",
    segments: ["first-place", "the-pause"],
    reason: "For the day you finally feel like feeding eight people.",
    image: "cookware",
  },
  {
    id: "eastfork-bowls",
    brand: "East Fork",
    name: "Pasta bowl set of 4",
    price: 112,
    tier: "considered",
    segments: ["first-place", "fresh-start"],
    reason: "Dishes that match, chosen by nobody but you.",
    image: "pottery",
  },

  // Practical foundation
  {
    id: "caraway-saute",
    brand: "Caraway",
    name: "Sauté pan & lid",
    price: 145,
    tier: "foundation",
    segments: ["first-place", "fresh-start"],
    reason: "The workhorse that looks good left on the burner.",
    image: "cookware",
  },
  {
    id: "piglet-sheets",
    brand: "Piglet in Bed",
    name: "Linen sheet set",
    price: 185,
    tier: "foundation",
    segments: ["fresh-start", "first-place", "the-pause"],
    reason: "A whole bed that belongs to exactly one person.",
    image: "throw",
  },
  {
    id: "framebridge-pair",
    brand: "Framebridge",
    name: "Gallery wall pair",
    price: 160,
    tier: "foundation",
    segments: ["first-place", "the-pivot"],
    reason: "For the blank wall you've stared at for two months.",
    image: "frame",
  },
  {
    id: "tekla-robe",
    brand: "Tekla",
    name: "Organic cotton robe",
    price: 175,
    tier: "foundation",
    segments: ["the-pause", "fresh-start"],
    reason: "The official uniform of a Sunday with no obligations.",
    image: "throw",
  },
  {
    id: "schoolhouse-lamp",
    brand: "Schoolhouse",
    name: "Desk lamp",
    price: 229,
    tier: "foundation",
    segments: ["the-pivot", "first-place"],
    reason: "Good light for the business plan at 11pm.",
    image: "lamp",
  },
  {
    id: "hay-throw",
    brand: "HAY",
    name: "Wool throw",
    price: 150,
    tier: "foundation",
    segments: ["the-pause", "fresh-start"],
    reason: "For the couch era, which is valid.",
    image: "throw",
  },

  // Group splurge
  {
    id: "caraway-set",
    brand: "Caraway",
    name: "Cookware set",
    price: 395,
    tier: "group",
    segments: ["first-place", "fresh-start"],
    reason: "A whole kitchen from everyone in the group thread.",
    image: "cookware",
  },
  {
    id: "framebridge-wall",
    brand: "Framebridge",
    name: "Six-frame gallery wall",
    price: 375,
    tier: "group",
    segments: ["first-place", "the-pivot"],
    reason: "Your people, framed and hung without a tape measure.",
    image: "frame",
  },
  {
    id: "eastfork-dinnerware",
    brand: "East Fork",
    name: "12-piece dinnerware",
    price: 420,
    tier: "group",
    segments: ["first-place", "fresh-start"],
    reason: "Stoneware that outlasts every bad decision before it.",
    image: "pottery",
  },
  {
    id: "piglet-bundle",
    brand: "Piglet in Bed",
    name: "Full linen bedding bundle",
    price: 340,
    tier: "group",
    segments: ["fresh-start", "the-pause"],
    reason: "The bed you'd never buy yourself, from people who would.",
    image: "throw",
  },
  {
    id: "ghia-bar",
    brand: "Ghia",
    name: "Hosting bar bundle",
    price: 260,
    tier: "group",
    segments: ["the-pivot", "the-pause"],
    reason: "Stocked for the launch party, the farewell, or both.",
    image: "aperitif",
  },
  {
    id: "maker-bench",
    brand: "Independent maker",
    name: "Entry bench",
    price: 480,
    tier: "group",
    segments: ["first-place", "the-pivot"],
    reason: "Somewhere to drop the keys you earned.",
    image: "bench",
  },
];

/** Compact text version for grounding the AI recommender. */
export function catalogPromptText() {
  return tiers
    .map((t) => {
      const lines = catalog
        .filter((i) => i.tier === t.id)
        .map((i) => `- ${i.brand} · ${i.name} · $${i.price} · fits: ${i.segments.join(", ")}`);
      return `${t.name} (${t.range}):\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

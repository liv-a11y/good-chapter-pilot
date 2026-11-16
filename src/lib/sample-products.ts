import candle from "@/assets/p-terracotta-candle-600.webp.asset.json";
import mug from "@/assets/p-cobalt-mug-600.webp.asset.json";
import plant from "@/assets/p-houseplant-600.webp.asset.json";
import pan from "@/assets/p-cast-iron-pan-600.webp.asset.json";
import kettle from "@/assets/p-bright-citron-kettle-600.webp.asset.json";
import towels from "@/assets/p-cream-bath-towels-600.webp.asset.json";
import toolbox from "@/assets/p-cobalt-toolbox-600.webp.asset.json";
import lamp from "@/assets/p-cobalt-table-lamp-600.webp.asset.json";

// Public sample imagery stays paired with literal object names, not retailer products.
export const sampleProducts = [
  {
    id: "candle",
    brand: "Ceramics",
    name: "Terracotta candle",
    price: 34,
    tier: "easy-yes",
    band: "Under $50",
    reason: "For the first quiet night when the boxes are still everywhere.",
    photo: candle.url,
  },
  {
    id: "mug",
    brand: "Stoneware",
    name: "Cobalt mug",
    price: 38,
    tier: "easy-yes",
    band: "Under $50",
    reason: "The heavy mug that quietly becomes the only one.",
    photo: mug.url,
  },
  {
    id: "plant",
    brand: "Plants",
    name: "Potted houseplant",
    price: 45,
    tier: "easy-yes",
    band: "Under $50",
    reason: "Something alive in the empty room.",
    photo: plant.url,
  },
  {
    id: "pan",
    brand: "Kitchen",
    name: "Cast iron skillet",
    price: 65,
    tier: "considered",
    band: "$50 to $100",
    reason: "One pan that outlives every apartment after this one.",
    photo: pan.url,
  },
  {
    id: "kettle",
    brand: "Kitchen",
    name: "Citron kettle",
    price: 75,
    tier: "considered",
    band: "$50 to $100",
    reason: "Because boiling water should feel like a small win.",
    photo: kettle.url,
  },
  {
    id: "towels",
    brand: "Bath",
    name: "Bath towel set",
    price: 96,
    tier: "considered",
    band: "$50 to $100",
    reason: "To retire the frayed towels from the last place.",
    photo: towels.url,
  },
  {
    id: "toolbox",
    brand: "Tools",
    name: "Cobalt toolbox",
    price: 140,
    tier: "foundation",
    band: "$100 to $250",
    reason: "For the shelf, the loose handle, and the next small fix.",
    photo: toolbox.url,
  },
  {
    id: "lamp",
    brand: "Lighting",
    name: "Cobalt table lamp",
    price: 240,
    tier: "foundation",
    band: "$100 to $250",
    reason: "Good light for the first night in.",
    photo: lamp.url,
  },
] as const;

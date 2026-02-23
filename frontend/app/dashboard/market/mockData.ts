import { MarketItem } from "./types";

export const SEED_ITEMS: MarketItem[] = [
  {
    id: "1",
    name: "Vintage Polaroid Camera",
    description:
      "Classic instant film camera in mint condition. Great for aesthetic shots.",
    price: 1499,
    colorSeed: 0,
    createdAt: 1713800000000,
    sellerName: "Ananya Mehta",
    condition: "Like New",
    location: "Pune, MH",
  },
  {
    id: "2",
    name: "Lavender Candle Set",
    description:
      "Hand-poured soy wax candles with real lavender. Burns 40+ hrs each.",
    price: 599,
    colorSeed: 1,
    createdAt: 1713800001000,
    sellerName: "Riya Kapoor",
    condition: "New",
    location: "Bengaluru, KA",
  },
  {
    id: "3",
    name: "Pastel Mechanical Keyboard",
    description:
      "75% layout, hot-swappable, clicky switches. Purple & pink keycaps.",
    price: 3299,
    colorSeed: 7,
    createdAt: 1713800002000,
    sellerName: "Dev Sharma",
    condition: "Good",
    location: "Delhi, DL",
  },
];

export const LS_KEY = "marketplace_items_v1";

export function loadItems(): MarketItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as MarketItem[];
  } catch {}
  return SEED_ITEMS;
}

export function saveItems(items: MarketItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

let _idCounter = 100;
export const genId = () => String(++_idCounter);
export const genSeed = () => Math.floor(Math.random() * 8);

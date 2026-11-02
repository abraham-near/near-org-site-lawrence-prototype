// Go deeper content (spec/pages/home.md §4, D9). CMS-ready shape; until the CMS exists this is the seed list.
// Titles are real (the draft site and the copy board). Each item has its own art-directed image (D16, Higgsfield,
// assets/generated/2026-11-02_home-imagery). Dates and links aren't known yet, so they're omitted until the CMS
// supplies them; the order below stands in for "newest first". Press items arrive with the CMS.

export type DeeperType = "story" | "read" | "watch" | "press";
export type DeeperFilter = "all" | DeeperType;

export type DeeperItem = {
  id: string;
  type: DeeperType;
  title: string;
  source?: string;
  date?: string; // ISO, shown once the CMS supplies it
  url?: string; // linked once the CMS supplies it
  image?: string; // shown when the item is featured
  note?: string; // disclosures
};

export const FILTERS: { key: DeeperFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "story", label: "Stories" },
  { key: "read", label: "Read" },
  { key: "watch", label: "Watch" },
];

export const TYPE_LABEL: Record<DeeperType, string> = {
  story: "Customer story",
  read: "Read",
  watch: "Watch",
  press: "In the news",
};
// Strip tiles are narrow; a short label keeps every tile's meta on one line, so the titles share a top line.
export const TILE_LABEL: Record<DeeperType, string> = { ...TYPE_LABEL, story: "Story" };

const img = (id: string) => `/images/home/deeper/home-deeper-${id}-v1.webp`;

export const ITEMS: DeeperItem[] = [
  { id: "agent-economy", type: "read", title: "The Agent Economy: Who Owns the Rails AI Runs On", source: "NEAR blog", image: img("agent-economy") },
  { id: "abound", type: "story", title: "Abound is bringing agentic payments to cross-border finance with NEAR AI", source: "Abound", image: img("abound"), note: "NEAR Foundation is an investor in Abound." },
  { id: "nearvana", type: "watch", title: "NEARvana", source: "Illia Polosukhin, Inside NEAR", image: img("nearvana") },
  { id: "ledger", type: "story", title: "Ledger Wallet integrates NEAR Intents to power seamless cross-chain swaps", source: "Ledger", image: img("ledger") },
  { id: "private-money-rail", type: "watch", title: "Private Money Rail", source: "Alex Shevchenko, Inside NEAR", image: img("private-money-rail") },
  { id: "venice", type: "story", title: "Venice is now verifiably private with NEAR AI", source: "Venice", image: img("venice") }, // its link was reported 404 (PRODUCT.md)
  { id: "who-owns-the-rails", type: "watch", title: "Who Owns the Rails AI Runs On", source: "George Zeng, Inside NEAR", image: img("who-owns-the-rails") },
  { id: "brave", type: "story", title: "A new frontier for Brave AI privacy with NEAR AI", source: "Brave", image: img("brave") },
  { id: "quantum-readiness", type: "watch", title: "Quantum Readiness", source: "Illia Polosukhin, Inside NEAR", image: img("quantum-readiness") },
  { id: "zodl", type: "story", title: "Privacy-first Zcash wallet Zodl uses NEAR Intents to give users cross-chain access", source: "Zodl", image: img("zodl") },
  { id: "sovereign-economy", type: "watch", title: "The Sovereign Economy", source: "David Norris, Inside NEAR", image: img("sovereign-economy") },
  { id: "bermuda", type: "story", title: "Government of Bermuda and NEAR AI partner to deploy AI-powered public services", source: "Government of Bermuda", image: img("bermuda") },
];

export const FEATURED = 2;
export const MORE = 10;

export function select(filter: DeeperFilter) {
  const list = ITEMS.filter((it) => filter === "all" || it.type === filter);
  return { featured: list.slice(0, FEATURED), more: list.slice(FEATURED, FEATURED + MORE) };
}

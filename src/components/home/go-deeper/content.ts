// Go deeper content (spec/pages/home.md §4, D9). CMS-ready shape; until the CMS exists this is the seed list.
// Titles are real (the draft site and the copy board). Each item has its own art-directed image (D16, Higgsfield,
// assets/generated/2026-11-02_home-imagery). Every item is a link (D20): its own page where the URL is on record
// (the 2026 draft's content), otherwise the blog listing until the CMS supplies it (TASKS). Dates are omitted until
// real; the order below stands in for "newest first". Press items arrive with the CMS.

export type DeeperType = "story" | "read" | "watch" | "press";
export type DeeperFilter = "all" | DeeperType;

export type DeeperItem = {
  id: string;
  type: DeeperType;
  title: string;
  source?: string;
  date?: string; // ISO, shown once the CMS supplies it
  url?: string; // its own page, where on record; without one the item links to the blog listing
  image?: string; // shown when the item is featured
  note?: string; // disclosures
};

// Customer-story logos (D37): each company's own file, exactly as published (assets/brand/partners/README.md has the
// sources and terms), set small on the featured item's meta line in place of the name. `h` is the optical height in px,
// so the different marks sit evenly beside the label. Government of Bermuda stays in text: its terms need written
// permission to use the Government logo.
export type Logo = { src: string; w: number; h: number; height: number };
export const LOGOS: Record<string, Logo> = {
  abound: { src: "/brand/partners/abound.svg", w: 102, h: 22, height: 14 },
  ledger: { src: "/brand/partners/ledger.svg", w: 2000.58, h: 669.35, height: 18 },
  venice: { src: "/brand/partners/venice.svg", w: 467, h: 212, height: 20 },
  brave: { src: "/brand/partners/brave.png", w: 320, h: 99, height: 18 },
  zodl: { src: "/brand/partners/zodl.png", w: 320, h: 88, height: 11 },
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

// Round 2 (D23): photographed in real light, each subject drawn from its story; v2 throughout, Bermuda v3
const VERSION: Record<string, number> = { bermuda: 3 };
const img = (id: string) => `/images/home/deeper/home-deeper-${id}-v${VERSION[id] ?? 2}.webp`;

export const ITEMS: DeeperItem[] = [
  { id: "agent-economy", type: "read", title: "The Agent Economy: Who Owns the Rails AI Runs On", source: "NEAR blog", image: img("agent-economy") },
  { id: "abound", type: "story", title: "Abound is bringing agentic payments to cross-border finance with NEAR AI", source: "Abound", url: "https://near.ai/blog/near-ai-and-the-times-of-india-groups-abound-are-bringing-agentic-payments-to-cross-border-finance", image: img("abound") },
  { id: "nearvana", type: "watch", title: "NEARvana", source: "Illia Polosukhin, Inside NEAR", image: img("nearvana") },
  { id: "ledger", type: "story", title: "Ledger Wallet integrates NEAR Intents to power seamless cross-chain swaps", source: "Ledger", url: "https://www.near.org/blog/cross-chain-swaps-near-intents-ledger-wallet", image: img("ledger") },
  { id: "private-money-rail", type: "watch", title: "Private Money Rail", source: "Alex Shevchenko, Inside NEAR", image: img("private-money-rail") },
  { id: "venice", type: "story", title: "Venice is now verifiably private with NEAR AI", source: "Venice", image: img("venice") }, // its link was reported 404 (PRODUCT.md)
  { id: "who-owns-the-rails", type: "watch", title: "Who Owns the Rails AI Runs On", source: "George Zeng, Inside NEAR", image: img("who-owns-the-rails") },
  { id: "brave", type: "story", title: "A new frontier for Brave AI privacy with NEAR AI", source: "Brave", url: "https://brave.com/blog/browser-ai-tee/", image: img("brave") },
  { id: "quantum-readiness", type: "watch", title: "Quantum Readiness", source: "Illia Polosukhin, Inside NEAR", image: img("quantum-readiness") },
  { id: "zodl", type: "story", title: "Privacy-first Zcash wallet Zodl uses NEAR Intents to give users cross-chain access", source: "Zodl", image: img("zodl") },
  { id: "sovereign-economy", type: "watch", title: "The Sovereign Economy", source: "David Norris, Inside NEAR", image: img("sovereign-economy") },
  { id: "bermuda", type: "story", title: "Government of Bermuda and NEAR AI partner to deploy AI-powered public services", source: "Government of Bermuda", url: "https://near.ai/blog/government-of-bermuda-and-near-ai-partner-to-deploy-ai-powered-public-services", image: img("bermuda") },
];

export const FEATURED = 3; // three featured items (D33; was two)
export const MORE = 10;

// Three featured and a strip of ten (D33). The /lab directions still lay out from this; the homepage now uses `lead`.
export function select(filter: DeeperFilter) {
  const list = ITEMS.filter((it) => filter === "all" || it.type === filter);
  return { featured: list.slice(0, FEATURED), more: list.slice(FEATURED, FEATURED + MORE) };
}

// The homepage section (after the r16/v3 prototype): the newest item in the filter leads with its photo, and every
// other item follows as a row in the list beside it.
export function lead(filter: DeeperFilter) {
  const list = ITEMS.filter((it) => filter === "all" || it.type === filter);
  return { first: list[0], rest: list.slice(1) };
}

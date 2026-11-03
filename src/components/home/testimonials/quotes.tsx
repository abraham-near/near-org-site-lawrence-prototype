import type { ReactNode } from "react";

// The four voices (spec/pages/home.md §6): the approved v4 board wording, attributions from the draft site. Shared by
// the live section and the lab variants (D31), so every option shows the same words. Never add or reword a quote here
// without a source (TASKS: links and permissions are still open).

// `mark` is the phrase option C highlights (D31): emphasis only, never different words; it must appear in `plain`.
export type Quote = { id: string; text: ReactNode; plain: string; mark: string; name: string; role?: string };

export const FEATURED: Quote = {
  id: "federa",
  text: "Their AI work is the only AI x Crypto thing I’m looking forward to.",
  plain: "Their AI work is the only AI x Crypto thing I’m looking forward to.",
  mark: "the only AI x Crypto thing",
  name: "Austin Federa",
  role: "Co-founder of DoubleZero",
};

export const MORE: Quote[] = [
  { id: "horsley", text: "I wouldn’t bet against NEAR.", plain: "I wouldn’t bet against NEAR.", mark: "bet against NEAR", name: "Hunter Horsley", role: "CEO of Bitwise" },
  { id: "mumtaz", text: "NEAR still feels like the most underrated team in crypto…", plain: "NEAR still feels like the most underrated team in crypto…", mark: "the most underrated team", name: "Mert Mumtaz", role: "Co-founder of Helius" },
  {
    id: "swihart",
    text: <>&hellip;unlocking global access to encrypted wealth. Game changing at <span style={{ whiteSpace: "nowrap" }}>a multi-generational</span> scale.</>,
    plain: "…unlocking global access to encrypted wealth. Game changing at a\u00a0multi-generational scale.", // nbsp: keeps "a multi-generational" together
    mark: "Game changing",
    name: "Josh Swihart",
  },
];

export const ALL: Quote[] = [FEATURED, ...MORE];

// Plain text with hyphenated words kept whole, so "multi-generational" never breaks at its hyphen
export function KeepHyphens({ s }: { s: string }) {
  return <>{s.split(/(\S*-\S*)/).map((part, i) => (i % 2 ? <span key={i} style={{ whiteSpace: "nowrap" }}>{part}</span> : part))}</>;
}

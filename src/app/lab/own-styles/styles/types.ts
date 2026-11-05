import type { ComponentType } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";

// One illustration style for the four "Own your …" stations on the rail (D53). `Art` draws one station's object at
// the stations' size: it fills a 320-wide box (the art slot), reads at 240 × 180 design units like OwnArt, and shows its
// end state (these are statics for review; `motion` says how it would move).
export type StyleDef = {
  key: string;
  name: string;
  refs: string; // the Figma favourites it draws on
  summary: string;
  motion: string;
  Art: ComponentType<{ which: OwnKey }>;
};

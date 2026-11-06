import type { HeroOptions } from "../ChapterOne";

// One hero version (D90): the homepage picks one at random on each load. Each version is the hero's photo (its video's
// first frame, also the still on phones and with reduced motion), its scroll-scrubbed camera move, and a layer of
// vector graphics tracked to that footage. `key` names it in ?hero=<key> and the lab switcher.
export type HeroVariant = HeroOptions & { key: HeroKey; name: string };
export type HeroKey = "original" | "clouds" | "unfurl" | "dune" | "gate";

import { hero as original } from "./original";
import { hero as clouds } from "./clouds";
import { hero as unfurl } from "./unfurl";
import { hero as dune } from "./dune";
import { hero as gate } from "./gate";
import type { HeroKey, HeroVariant } from "./types";

// Every hero version (D90). The homepage shows one at random on each load; ?hero=<key> forces one (review links).
export const HEROES: Record<HeroKey, HeroVariant> = { original, clouds, unfurl, dune, gate };
export const HERO_KEYS = Object.keys(HEROES) as HeroKey[];
export type { HeroKey, HeroVariant };

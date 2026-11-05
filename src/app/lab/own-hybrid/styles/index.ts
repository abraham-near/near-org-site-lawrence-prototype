import type { StyleDef } from "../../own-styles/styles/types";
import { style as lamella } from "./lamella";
import { style as lamellaFlat } from "./lamella-flat";
import { style as sapphire } from "./sapphire";
import { style as orbit } from "./orbit";
import { style as materialise } from "./materialise";

// The hybrid styles (D54), narrowed to Lawrence's keepers in D55: Lamella (plus a front-on variant), Orbit and
// Materialise kept, Sapphire a maybe. Machined and Field were dropped; their folders stay for the record, unlisted.
export const HYBRID: StyleDef[] = [lamella, lamellaFlat, orbit, materialise, sapphire];

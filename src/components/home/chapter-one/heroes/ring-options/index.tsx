import type { HeroOptions } from "../../ChapterOne";
import type { Track } from "../gate/draw";
import { GateLayer } from "../gate/GateLayer";
import cliff from "./tracks/cliff.json";
import alpine from "./tracks/alpine.json";
import saltflat from "./tracks/saltflat.json";
import birch from "./tracks/birch.json";
import blacksand from "./tracks/blacksand.json";
import mesa from "./tracks/mesa.json";
import moor from "./tracks/moor.json";
import lake from "./tracks/lake.json";

// The ring options (lab, /lab/hero-ring): eight new landscapes for the gate's chrome ring, frosted disc and green sphere,
// each a still (Figma Weave, GPT Image 2.5, an edit of the gate's own still, so the ring matches) with the gate's layer
// fitted to it: the ring's outer edge, the sphere and the ground either side, found with OpenCV on the still
// (assets/generated/2026-11-06_hero-ring-options: fit_ring.py, fit_ground.py, LOG.md) and written as a single-frame
// track in the gate's format, drawn by the gate's own layer (gate/GateLayer + draw.ts) with its idle life. Stills only:
// the camera move comes later, for the ones Lawrence picks. Not on /home (heroes/index.ts is unchanged).
export type RingKey = "cliff" | "alpine" | "saltflat" | "birch" | "blacksand" | "mesa" | "moor" | "lake";
export type RingOption = { key: RingKey; name: string; note: string; poster: string };

const TRACKS: Record<RingKey, Track> = {
  cliff: cliff as Track, alpine: alpine as Track, saltflat: saltflat as Track, birch: birch as Track,
  blacksand: blacksand as Track, mesa: mesa as Track, moor: moor as Track, lake: lake as Track,
};

export const RING_OPTIONS: RingOption[] = [
  { key: "cliff", name: "Sea cliff", note: "A grassy headland high above a calm, misty ocean; the trace follows the cliff-top grass." },
  { key: "alpine", name: "Alpine meadow", note: "A meadow at dawn with small wildflowers; snow peaks fade into haze behind the ring." },
  { key: "saltflat", name: "Salt flat", note: "Still water over a salt flat at blue hour, the ring mirrored in it; the trace is the horizon." },
  { key: "birch", name: "Birch clearing", note: "Moss and ferns in a misty birch wood; pale trunks recede into the fog." },
  { key: "blacksand", name: "Black sand", note: "Black volcanic sand and pale moss under fog; a grey coastline on the left." },
  { key: "mesa", name: "Mesa ledge", note: "A sandstone ledge over a hazy canyon; the trace follows the ledge's edge." },
  { key: "moor", name: "Heather moor", note: "Heather and pale grass under low cloud; rolling hills disappear into it." },
  { key: "lake", name: "Lake shore", note: "A gravel shore with reeds at a still lake in mist; the trace follows the waterline." },
].map((o) => ({ ...o, key: o.key as RingKey, poster: `/images/lab/hero-ring/hero-ring-${o.key}-v1.webp` }));

// One option as the hero: its still, its fitted layer, and the gate's framing (the same crop on desktop, the ring kept
// clear of the nav, the thread off the photo)
export function ringHero(key: RingKey): HeroOptions {
  const o = RING_OPTIONS.find((x) => x.key === key)!;
  return {
    poster: o.poster,
    layer: <GateLayer track={TRACKS[key]} />,
    focal: { x: 0.8, y: 0.42, clear: true, dx: 0.85, dy: 0.5 },
    thread: false,
  };
}

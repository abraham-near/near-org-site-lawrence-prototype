import type { CinematicOption } from "./CinematicHero";
import { SummitLayer } from "./layers/Summit";
import { FernLayer } from "./layers/Fern";
import { DuneLayer } from "./layers/Dune";
import { GateLayer } from "./layers/Gate";

// The four cinematic hero options (lab). Photos: Higgsfield gpt_image_2_5 stills, logged in
// assets/generated/2026-11-05_hero-cinematic/LOG.md. Three organic, one not (D).
const IMG = "/images/lab/hero-cinematic/lab-hero-cinematic";
const SIZE = { w: 2688, h: 1520, fx: 0.5, fy: 0.5 };

export const CINEMATIC: CinematicOption[] = [
  {
    key: "a",
    name: "Above the clouds",
    note: "One snow-dusted summit rising out of a sea of cloud, from altitude, with forested ridges stepping down into it. The skyline and ridges are traced and ticked, the summit sighted with a green node, an altimeter arc and a laddered axis, one orbit lies level round the peak, and the near forest's tree tops are marked with crosses and rings.",
    src: `${IMG}-a-a3.webp`, ...SIZE, mfx: 0.72, mfy: 0.5, mz: 1,
    layer: <SummitLayer />,
  },
  {
    key: "b",
    name: "Unfurl",
    note: "A fern crozier with dew, in macro, against a pale misty forest. A hairline spiral runs down the coiled stem and on out into it (its last inner turn in green), with golden-ratio construction circles, a ticked scale, a dial and axes through the eye; the dew drops are ringed and joined.",
    src: `${IMG}-b-b3.webp`, ...SIZE, mfx: 0.8, mfy: 0.5, mz: 1,
    layer: <FernLayer />,
  },
  {
    key: "c",
    name: "Dune",
    note: "A long dune crest between light and shadow in thin haze at first light. The crest, the far crests and a few wind ripples are traced and ticked; a contour scale at the edge takes dashed leaders from the peak and the two bends, the lower bend carries a protractor and tangent, and the peak is sighted with the green node.",
    src: `${IMG}-c-c7.webp`, ...SIZE, mfx: 1, mfy: 0.5, mz: 1,
    layer: <DuneLayer />,
  },
  {
    key: "d",
    name: "The gate",
    note: "The non-organic option: a monumental chrome ring and glass disc standing on a hillside in fog, a green glass sphere at its heart (the stations' materials, at landscape scale). Gimbal orbits turn round the sphere, a dial and brackets sight it, a ticked scale crowns the ring and the grass edge is traced.",
    src: `${IMG}-d-d3.webp`, ...SIZE, mfx: 0.95, mfy: 0.5, mz: 1,
    layer: <GateLayer />,
  },
];

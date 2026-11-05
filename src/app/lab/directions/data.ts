// The design directions (D52): the original homepage (with the take j hero, D51) and three new directions, each the
// same page flow in its own treatment. The contact sheet (/lab/directions) shows them section by section, and lets
// Lawrence pick, per section, which version to keep. Each direction's page gives every section an id (below); the
// original's sections are reached through their headings' ids.

export type VersionKey = "o" | "a" | "b" | "c";

export const VERSIONS: { key: VersionKey; name: string; route: string; summary: string }[] = [
  {
    key: "o",
    name: "Original",
    route: "/lab/dir-o",
    summary:
      "Today’s homepage with the new hero: take j, the gentle pull-back, with the tracked A4 layer over its dust (D51). Everything else as built so far.",
  },
  {
    key: "a",
    name: "A Survey",
    route: "/lab/dir-a",
    summary:
      "A technical atlas: hairlines, ticked scales, crosshair nodes, leader lines and registration marks, with micrographics (a frame tape under the hero, numerals that roll, scales true to each figure, leaders that draw on). Green is kept for what is yours.",
  },
  {
    key: "b",
    name: "B Prism",
    route: "/lab/dir-b",
    summary:
      "Vector graphics with a rendered material: frosted glass and prismatic refraction resolving to NEAR green. A fluted glass monolith bends the hero's footage; glass prisms, slabs and panes carry the story, the Stack and the sections below, with a few generated glass photographs.",
  },
  {
    key: "c",
    name: "C Field",
    route: "/lab/dir-c",
    summary:
      "Swiss editorial on a visible grid, with shapes built from the N's construction: planes cut on its diagonal, hatching, anchor squares. Two full-bleed green fields (proof, close) and one forest section (origin). Shapes and type travel along the diagonal as you scroll.",
  },
];

// The sections, in page order. `original`: the anchor on the original page; the directions use `key` as their id.
export const SECTIONS: { key: string; name: string; original: string; notes: Partial<Record<VersionKey, string>> }[] = [
  { key: "hero", name: "Hero", original: "", notes: { o: "The scrubbed pull-back with the tracked lines, dust and rising particles.", a: "Over the A4 + dust hero: a frame tape sliding under a green caret with a frame readout, registration marks; at the end the picture closes into a framed plate.", b: "A fluted glass monolith stands in the land and gently bends the footage (true refraction in Chrome); the green thread draws down through the glass to a crosshair.", c: "A Swiss poster: a surface plane cut on the N diagonal with a hatched band; the plane slides away, the camera moves, a second plane sweeps in." } },
  { key: "story", name: "Story and horizontal rail", original: "story-title", notes: { o: "C1 Horizon: the story told along a horizontal rail with stations.", a: "The anthem on ruled baselines, wiping on word by word; the rail as a traverse line with chainage ticks and six stations, four with new technical figures.", b: "The anthem on a frosted slab over glass lamellae; on the rail, AI and blockchain beams enter a glass prism and one green beam leaves it; a frosted drawing of agents over one shared ledger clears as the answer arrives.", c: "The anthem as a staircase on the N diagonal; the layer diagram goes empty, hatched, then green; four panels slide past a hatched stem." } },
  { key: "stack", name: "The NEAR Stack", original: "stack-title", notes: { o: "The 3-column stack on the dark band, flat green faces per layer.", a: "An engineering plate on forest: sage-gradient rings, the selected layer in a green gradient, leader lines to each layer\u2019s name and figure, a graticule.", b: "The one dark section: glass slabs with gradients across each layer and green-fringed edges on a hairline floor; the selected layer lifts.", c: "On light: unread layers as pale hatched construction drawings, the selected one a green-to-forest duotone with ink edges, dashed axes, anchor squares." } },
  { key: "proof", name: "Proof", original: "proof-title", notes: { o: "A small strip of sourced figures.", a: "The five figures with rolling numerals, each over a small scale true to it (35 ticks, a 0\u20132 s scale, 70 shards, years since 2020).", b: "One frosted bar of figures over a photograph of refracted light.", c: "A full-bleed green field with a diagonal frieze and a Swiss table of the five figures." } },
  { key: "deeper", name: "Go deeper", original: "deeper-title", notes: { o: "Three featured stories and a filtered strip.", a: "A filter row, three image plates with registration corners, then an index list with type glyphs and logos.", b: "A glass filter control and a frosted caption plate on the lead story.", c: "An editorial index: filter tabs, hairline rows with the logos, a picture frame that swaps on hover." } },
  { key: "origin", name: "Origin", original: "origin-title", notes: { o: "Where NEAR comes from.", a: "A drawn attention figure and a ruler from 2017 (AI lab) to 2020 (mainnet).", b: "A drawn attention diagram: 16 tokens converging on one green point and a beam, bent by a strip of reeded glass.", c: "The one forest section: 28 tokens converging on one point, with 2017 set large." } },
  { key: "voices", name: "Testimonials", original: "voices-title", notes: { o: "What the world is saying about NEAR.", a: "The featured quote large, three more hung from crosshair nodes on leaders that draw on.", b: "One glass plate holds the featured quote; the three short quotes sit in a flat hairline column beside it.", c: "The featured quote at h1 size with a hatched stem; three more in columns." } },
  { key: "paths", name: "Get into NEAR", original: "paths-title", notes: { o: "Three paths in.", a: "A route line through three waypoints; hovering a path draws its route in green.", b: "Each picture behind fluted glass that slides aside on hover or focus.", c: "Three column links, each with a construction glyph that fills green on hover." } },
  { key: "close", name: "Close", original: "close-title", notes: { o: "NEAR belongs to you, with the newsletter pill.", a: "Contour lines kept off the copy, a green you-are-here node with a bearing ring, the newsletter pill.", b: "A frosted pane with the newsletter pill over glass lamellae.", c: "A second green field: NEAR belongs to you, with a surface field and an ink button." } },
];

export const sectionHref = (v: VersionKey, s: (typeof SECTIONS)[number]) => {
  const route = VERSIONS.find((x) => x.key === v)!.route;
  const anchor = v === "o" ? s.original : s.key;
  return anchor ? `${route}#${anchor}` : route;
};

// Section thumbnails, captured from each page at 1440 wide (scripts in the scratchpad; see D52)
export const thumb = (v: VersionKey, s: string) => `/lab/directions/${v}-${s}.webp`;

import type { HeroOptions } from "@/components/home/chapter-one/ChapterOne";
import type { LayerData, LayerLook } from "@/components/home/chapter-one/layer/HeroLayer";

// The hero options (D40): three strengths of green in the trees (a colour grade of the same render, so the shot is
// unchanged) and four layers over the camera move. Every layer route uses Green 1.
export const GRADES: Record<1 | 2 | 3, Required<Pick<HeroOptions, "poster" | "video">> & { name: string; note: string }> = {
  1: { name: "Green 1, subtle", note: "Shadows lean to pine green; the mist and sky stay neutral.", poster: "/lab/hero/lab-hero-crane-green1.webp", video: "/lab/hero/lab-hero-crane-green1.mp4" },
  2: { name: "Green 2, medium", note: "A step further: the forest reads green at a glance.", poster: "/lab/hero/lab-hero-crane-green2.webp", video: "/lab/hero/lab-hero-crane-green2.mp4" },
  3: { name: "Green 3, fuller", note: "Clearly green, with a little more saturation in the trees.", poster: "/lab/hero/lab-hero-crane-green3.webp", video: "/lab/hero/lab-hero-crane-green3.mp4" },
};

export const LAYERS: { key: string; look: LayerLook; name: string; theme: string; note: string }[] = [
  { key: "a", look: "survey", name: "A Survey", theme: "Data", note: "Fine crosshair marks sit on the ridges and ride the camera move. A dashed network joins each to its nearest neighbours, and grows as you scroll; the one green mark is yours." },
  { key: "b", look: "readings", name: "B Readings", theme: "Data", note: "Contour lines read live from the footage: the haze makes brightness a measure of distance, so each level traces a ridge. The land is read from the top down as you scroll; one level is green." },
  { key: "c", look: "route", name: "C Route", theme: "Money", note: "An intent finds its route: a green packet hops ridge to ridge and settles on the green thread’s head as it drops in. The route then steps back." },
  { key: "d", look: "notes", name: "D Notes", theme: "Money, data and AI", note: "Three verified facts pinned to the ridges, one at a time as you scroll: volume settled through NEAR Intents, the confidential share, and private AI." },
];

// Survey developed (D41): on the original footage (no grade) until the effect is settled, after Plexus and GMUNK's
// TRON: Legacy graphics
export const SURVEY: { key: string; look: LayerLook; name: string; note: string }[] = [
  { key: "a1", look: "plexus", name: "A1 Plexus", note: "About 130 tracked points ride the land at any moment. Each joins its three nearest neighbours within reach, and the lines fade with distance, as Plexus does. The reach opens out as you scroll. Lines are deep green over pale mist, NEAR green over the mid-tones and white over dark forest. Key nodes are crosshairs; the one with the beacon is yours. Since D43 it is never still: dots fade in and out and connections form and part on their own, while the scroll still carries the tracking." },
  { key: "a2", look: "traces", name: "A2 Traces", note: "A quieter plexus, plus lines that trace the ridge silhouettes, after the TRON globe’s line-work that follows the land. They draw on from the left and carry small ticks. (They first had a short light running along each; that was removed for good in D45.)" },
  { key: "a3", look: "rings", name: "A3 Rings", note: "The plexus, plus ticked rings around your green node that turn with the scroll (after TRON’s rings of decoded data), and fine corner brackets on the other key nodes." },
  { key: "a4", look: "plexusTraces", name: "A4 Plexus + Traces", note: "A1’s plexus, a step lighter, with A2’s ridge traces drawn on top, a step heavier, on more ridges: every distinct ridge the tracking finds, including the fainter far ones, each with its ticks. The traces lead; the plexus is the field around them. It moves continuously from the first frame (D43–D45): some lines draw on from one end and retract into the other, others fade up and off; dots appear and disappear; traces now and then wipe off and redraw, or fade off and back. No light ever runs along a line. Dots in the air above the ridges drift and draw lines to the land, and long depth links between near and far points stretch and turn as you scroll. Greens over pale ground, white over dark." },
  { key: "a4s", look: "plexusTraces", name: "A4s Settles", note: "A4 with its ambient motion limited: it plays for the first 5 seconds after load (traces drawing on, dots and connections changing), then holds, and moves again for 3 seconds whenever you scroll, move the pointer or touch. Nothing moves on its own for more than 5 seconds, which meets WCAG 2.2.2 without a pause control." },
];

// The D47 master render: the first 5.4 s of take g (of seven), with A4 re-tracked to it; ungraded and with Green 1.
// Measured by tracking, it carries about 25% more depth over the scroll than today's render (D47)
export const MASTER = {
  plain: { poster: "/lab/hero/lab-hero-master-g.webp", video: "/lab/hero/lab-hero-master-g.mp4" },
  green1: { poster: "/lab/hero/lab-hero-master-g-green1.webp", video: "/lab/hero/lab-hero-master-g-green1.mp4" },
};

// D48: the camera pulls back as it lowers (from a closer start), trees from behind the camera enter, graded Green 1
// with 10% more contrast. i: the strong version; j: the gentle one
export const ZMOVE = {
  i: { poster: "/lab/hero/lab-hero-z-i.webp", video: "/lab/hero/lab-hero-z-i.mp4" },
  j: { poster: "/lab/hero/lab-hero-z-j.webp", video: "/lab/hero/lab-hero-z-j.mp4" },
};

// D49: three options for the graphics on take j (Lawrence's pick). 1 follows his notes on A4; 2 and 3 are drastically
// different, after his references (point-cloud renders; GMUNK's TRON boardroom graphics), on the same tracking
export const J_OPTIONS: { key: string; look: LayerLook; data: LayerData; name: string; note: string }[] = [
  { key: "j1", look: "plexusBright", data: "zj1", name: "1 Brighter A4", note: "A4 from your notes, refined (D50): stronger than A4 but a step calmer than the first pass, short lines at full strength and long ones fading; greens nearer NEAR green. The layer now follows a golden-ratio composition: it fades into the white towards the left, so the headline has open space beside it, builds to full by the 62% line, and is strongest around the right-hand upper phi point, where your node sits and the ridges lead as they climb. Where the composition is light the field also thins, so the lower left carries some detail without getting busy. It keeps clear of the headline itself." },
  { key: "j4", look: "plexusDust", data: "zj2", name: "1 + Dust", note: "The refined Brighter A4 over a layer of option 2’s dust: glittering particle rims along every tracked ridge, a quiet field of particles on the slopes and motes in the sky, shaped by the same golden-ratio composition (fading into the white on the left, strongest at the right-hand phi point). The ribbons are left out: A4’s traces already follow the ridges. Since D51 the dust is at full strength, and now and then a particle lifts off the land and rises into the air with a line back to where it left, fading as it lengthens until both are gone (about 4–8 at a time; sometimes three rise together as a triangle). The bottom left now carries a band of detail too. Since D63 the near trees at the end are tracked by a second pass run in reverse, so their dots and lines stay on the trees." },
  { key: "j2", look: "dust", data: "zj", name: "2 Dust", note: "The land drawn as light, after the point-cloud wolf, car and globe: every tracked ridge silhouette becomes a rim of light built from thousands of tiny particles, thinning into the land below it, over a quieter field of about 550 tracked particles on the slopes, larger where the land is near. Each twinkles on its own clock, some come and go, and now and then one glints. Motes drift in the sky with the scene, and fine ribbons follow four ridges, drawing on and off. No plexus lines." },
  { key: "j3", look: "signal", data: "zj", name: "3 Signal", note: "Data rising from the land, after the TRON boardroom's globe, rings and falling data: thin bars (deep green over the mist, white over the forest, never on the thread) rise from tracked points with a dot at each tip, their heights breathing as if read live (one in four a column of dots), taller where the land is near. Ringed data turns around your green node, laid flat on the land. Two at a time, a NEAR green arc lifts from your node and lands on another, opening a ring where it lands." },
];

export const HERO_SWITCH = [
  { href: "/lab/hero", key: "all", name: "All" },
  { href: "/home", key: "today", name: "Today" },
  ...J_OPTIONS.map((o) => ({ href: `/lab/hero-${o.key}`, key: o.key, name: o.name })),
  { href: "/lab/hero-z-i", key: "z-i", name: "Pull-back, strong" },
  { href: "/lab/hero-z-j", key: "z-j", name: "Pull-back, gentle" },
  { href: "/lab/hero-master", key: "master", name: "Master" },
  { href: "/lab/hero-master-g1", key: "master-g1", name: "Master, Green 1" },
  { href: "/lab/hero-a", key: "a", name: "A Survey" },
  ...SURVEY.map((l) => ({ href: `/lab/hero-${l.key}`, key: l.key, name: l.name })),
];

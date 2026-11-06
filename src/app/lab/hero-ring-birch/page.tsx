import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/ring-options/motion/birch";

export const metadata: Metadata = { title: "Hero ring option: birch clearing", robots: { index: false, follow: false } };

// A ring option's review route (/lab/hero-ring): the full homepage with the birch clearing in motion, like the gate: its
// scroll-scrubbed camera move and the gate's layer tracked to it (heroes/ring-options/motion/birch).
export default function HeroRingBirch() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

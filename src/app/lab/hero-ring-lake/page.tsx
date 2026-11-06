import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/ring-options/motion/lake";

export const metadata: Metadata = { title: "Hero ring option: lake shore", robots: { index: false, follow: false } };

// A ring option's review route (/lab/hero-ring): the full homepage with the lake shore hero in motion (its scroll-scrubbed
// camera move and the gate's layer tracked to it; the still with the layer on phones and with reduced motion).
export default function HeroRingLake() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

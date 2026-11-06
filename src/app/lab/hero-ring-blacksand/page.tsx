import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/ring-options/motion/blacksand";

export const metadata: Metadata = { title: "Hero ring option: black sand", robots: { index: false, follow: false } };

// A ring option's review route (/lab/hero-ring), now in motion: the full homepage with the black sand hero (its
// scroll-scrubbed camera move and the gate's layer tracked to it).
export default function HeroRingBlacksand() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

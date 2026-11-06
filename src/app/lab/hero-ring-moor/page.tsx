import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { ringHero } from "@/components/home/chapter-one/heroes/ring-options";

export const metadata: Metadata = { title: "Hero ring option: heather moor", robots: { index: false, follow: false } };

// A ring option's review route (/lab/hero-ring): the full homepage with the heather moor still and the gate's layer fitted to it.
export default function HeroRingMoor() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={ringHero("moor")} />;
}

import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/ring-options/motion/mesa";

export const metadata: Metadata = { title: "Hero ring option: mesa ledge", robots: { index: false, follow: false } };

// A ring option's review route (/lab/hero-ring): the full homepage with the mesa ledge in motion (its scroll-scrubbed
// camera move and the gate's layer tracked to it).
export default function HeroRingMesa() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

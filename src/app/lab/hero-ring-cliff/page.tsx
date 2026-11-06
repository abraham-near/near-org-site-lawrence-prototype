import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/ring-options/motion/cliff";

export const metadata: Metadata = { title: "Hero ring option: sea cliff", robots: { index: false, follow: false } };

// A ring option's review route (/lab/hero-ring): the full homepage with the sea cliff in motion (its scroll-scrubbed
// camera move and the gate's layer tracked to it). The still with its fitted layer stays on the contact sheet.
export default function HeroRingCliff() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

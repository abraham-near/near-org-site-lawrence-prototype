import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/original";

export const metadata: Metadata = { title: "Hero: ridges, the original (live)", robots: { index: false, follow: false } };

// D94 review route: the full homepage with the original hero only (take j's pull-back and its tracked plexus and dust),
// like the four other /lab/hero-live-<key> pages.
export default function HeroLiveOriginal() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

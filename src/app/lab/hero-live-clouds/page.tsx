import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/clouds";

export const metadata: Metadata = { title: "Hero: above the clouds", robots: { index: false, follow: false } };

// D90 review route: the homepage with the "Above the clouds" hero (its camera move and tracked layer) in place of the
// original; the rest as /home.
export default function HeroLiveClouds() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

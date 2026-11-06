import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/dune";

export const metadata: Metadata = { title: "Hero: Dune", robots: { index: false, follow: false } };

// D90 review route: the homepage with the Dune hero (its camera move and tracked layer) in place of the original.
export default function HeroLiveDune() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

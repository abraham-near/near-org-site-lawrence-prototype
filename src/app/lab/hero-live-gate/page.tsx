import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/gate";

export const metadata: Metadata = { title: "Hero: the gate (live)", robots: { index: false, follow: false } };

// D90 review route: the full homepage with the gate hero (its scroll-scrubbed camera move and tracked layer).
export default function HeroLiveGate() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

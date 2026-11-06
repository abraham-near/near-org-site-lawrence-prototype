import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { hero } from "@/components/home/chapter-one/heroes/unfurl";

export const metadata: Metadata = { title: "Hero: Unfurl", robots: { index: false, follow: false } };

// D90 review route: the homepage with the Unfurl hero (the fern crozier's camera move down the stem, scrubbed by the
// scroll, with its tracked layer), and /home's story and rail.
export default function HeroLiveUnfurl() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={hero} />;
}

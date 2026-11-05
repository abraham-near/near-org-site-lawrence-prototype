import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH } from "../hero/options";

export const metadata: Metadata = { title: "Hero A1: Plexus", robots: { index: false, follow: false } };

// D41 review route: the homepage with the "plexus" layer over the original hero footage. All options: /lab/hero.
export default function HeroLayerA1() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ layer: <HeroLayer look="plexus" /> }}>
      <LabSwitch current="a1" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { GRADES, HERO_SWITCH } from "../hero/options";

export const metadata: Metadata = { title: "Hero B: Readings", robots: { index: false, follow: false } };

// D40 review route: the homepage with the "readings" layer over the hero (Green 1). All options: /lab/hero.
export default function HeroLayerB() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...GRADES[1], layer: <HeroLayer look="readings" /> }}>
      <LabSwitch current="b" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

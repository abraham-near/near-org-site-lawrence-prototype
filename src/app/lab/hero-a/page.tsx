import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { GRADES, HERO_SWITCH } from "../hero/options";

export const metadata: Metadata = { title: "Hero A: Survey", robots: { index: false, follow: false } };

// D40 review route: the homepage with the "survey" layer over the hero (Green 1). All options: /lab/hero.
export default function HeroLayerA() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...GRADES[1], layer: <HeroLayer look="survey" /> }}>
      <LabSwitch current="a" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH, ZMOVE } from "../hero/options";

export const metadata: Metadata = { title: "Hero: pull-back strong", robots: { index: false, follow: false } };

// D48 review route: the homepage on pull-back take i (graded Green 1, +10% contrast) with A4 tracked to it.
export default function HeroZI() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...ZMOVE.i, layer: <HeroLayer look="plexusTraces" data="zi" /> }}>
      <LabSwitch current="z-i" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH, MASTER } from "../hero/options";

export const metadata: Metadata = { title: "Hero: Master render", robots: { index: false, follow: false } };

// D47 review route: the homepage on the new master render (take g, first 5.4 s) with A4 tracked to it. All options: /lab/hero.
export default function HeroMaster() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...MASTER.plain, layer: <HeroLayer look="plexusTraces" data="master" /> }}>
      <LabSwitch current="master" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH } from "../hero/options";

export const metadata: Metadata = { title: "Hero A4: Plexus + Traces", robots: { index: false, follow: false } };

// D42 review route: A1's plexus with the ridge traces on top, over the original hero footage. All options: /lab/hero.
export default function HeroLayerA4() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ layer: <HeroLayer look="plexusTraces" /> }}>
      <LabSwitch current="a4" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

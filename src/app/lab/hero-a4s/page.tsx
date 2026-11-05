import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH } from "../hero/options";

export const metadata: Metadata = { title: "Hero A4s: Plexus + Traces, settling", robots: { index: false, follow: false } };

// D43 review route: A4 whose ambient motion settles after 5 s and returns with the reader's input (WCAG 2.2.2).
export default function HeroLayerA4s() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ layer: <HeroLayer look="plexusTraces" settle /> }}>
      <LabSwitch current="a4s" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

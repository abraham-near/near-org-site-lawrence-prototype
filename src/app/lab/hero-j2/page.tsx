import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH, J_OPTIONS, ZMOVE } from "../hero/options";

export const metadata: Metadata = { title: "Hero j: 2 dust", robots: { index: false, follow: false } };

const O = J_OPTIONS.find((o) => o.key === "j2")!;

// D49 review route: the homepage on pull-back take j with graphics option 2 Dust.
export default function HeroJ2() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...ZMOVE.j, layer: <HeroLayer look={O.look} data={O.data} /> }}>
      <LabSwitch current="j2" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}

import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { HERO_SWITCH, J_OPTIONS, ZMOVE } from "../hero/options";

export const metadata: Metadata = { title: "Hero j: 3 signal", robots: { index: false, follow: false } };

const O = J_OPTIONS.find((o) => o.key === "j3")!;

// D49 review route: the homepage on pull-back take j with graphics option 3 Signal.
export default function HeroJ3() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...ZMOVE.j, layer: <HeroLayer look={O.look} data={O.data} /> }}>
      <LabSwitch current="j3" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}
